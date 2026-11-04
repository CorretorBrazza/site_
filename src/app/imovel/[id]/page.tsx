import { Metadata } from 'next';
import { getImoveis } from '@/app/actions/imovel-server-actions';
import { notFound } from 'next/navigation';
import ImageCarousel from '@/components/ImageCarousel';
import ShareButton from '@/components/ShareButton';
import {
  BedDouble,
  ShowerHead,
  Car,
  Maximize,
  MapPin,
  ShieldCheck,
  MessageCircle,
  Ruler,
  Home as HomeIcon,
} from 'lucide-react';
import Link from 'next/link';
import TrackedWhatsAppLink from '@/components/TrackedWhatsAppLink';
import { safeJsonLd } from '@/lib/jsonld';
import { Container, Section } from '@/components/ui/container';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Price } from '@/components/ui/price';
import { ButtonLink } from '@/components/ui/button';

export const dynamicParams = true;
export const revalidate = 60;

export async function generateStaticParams() {
  const { imoveis } = await getImoveis();
  if (!imoveis || imoveis.length === 0) {
    return [];
  }
  // Pré-renderiza pela REFERÊNCIA, que é a URL canônica anunciada no sitemap e
  // nos links internos. O `ad_id` continua aceito em runtime (`dynamicParams`),
  // mas não é a URL que se publica — gerar as duas criava conteúdo duplicado.
  return imoveis.map((imovel) => ({
    id: imovel.referencia || imovel.id,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const { imoveis } = await getImoveis();
  const searchKey = id.toLowerCase().trim();
  const imovel = imoveis.find((i) =>
    i.id?.toLowerCase() === searchKey ||
    i.referencia?.toLowerCase() === searchKey
  );

  if (!imovel) {
    return {
      title: 'Imóvel não encontrado | Imóveis Taboão',
    };
  }

  const tituloSeo = `${imovel.titulo} — Taboão da Serra e região | REF: ${imovel.referencia}`;
  const descricaoSeo = imovel.descricao
    ? `${imovel.descricao.substring(0, 155)}...`
    : `Confira este imóvel (${imovel.tipo}) para ${imovel.transacao} em Taboão da Serra e imediações.`;

  const rawFoto = imovel.fotos && imovel.fotos.length > 0 ? imovel.fotos[0] : 'https://images.unsplash.com/photo-1560518883-ce09059eeffa';
  const fotoCapa = rawFoto.startsWith('http') ? rawFoto : `https://imoveistaboao.com.br${rawFoto}`;
  const urlPagina = `https://imoveistaboao.com.br/imovel/${encodeURIComponent(imovel.referencia || imovel.id)}`;

  return {
    title: tituloSeo,
    description: descricaoSeo,
    alternates: {
      canonical: urlPagina,
    },
    openGraph: {
      title: tituloSeo,
      description: descricaoSeo,
      url: urlPagina,
      siteName: 'Imóveis Taboão',
      locale: 'pt_BR',
      images: [
        {
          url: fotoCapa,
          width: 1200,
          height: 630,
          alt: imovel.titulo,
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: tituloSeo,
      description: descricaoSeo,
      images: [fotoCapa],
    },
  };
}

export default async function ImovelDetalhes({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { imoveis } = await getImoveis();
  const searchKey = id.toLowerCase().trim();
  const imovel = imoveis.find((i) =>
    i.id?.toLowerCase() === searchKey ||
    i.referencia?.toLowerCase() === searchKey
  );

  if (!imovel) {
    notFound();
  }

  const rawTransacao = String(imovel.transacao || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const isLocacao = rawTransacao.includes('loca') || rawTransacao.includes('alug');
  const preco = isLocacao
    ? (imovel.precoLocacao || imovel.precoVenda)
    : (imovel.precoVenda || imovel.precoLocacao);
  const urlPagina = `https://imoveistaboao.com.br/imovel/${encodeURIComponent(imovel.referencia || imovel.id)}/`;
  const rawFoto = imovel.fotos && imovel.fotos.length > 0
    ? imovel.fotos[0]
    : 'https://images.unsplash.com/photo-1560518883-ce09059eeffa';
  const fotoCapa = rawFoto.startsWith('http') ? rawFoto : `https://imoveistaboao.com.br${rawFoto}`;

  const rawPhone = imovel.corretor?.telefone || process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || process.env.NEXT_PUBLIC_DEFAULT_WHATSAPP || '';
  const cleanPhone = rawPhone.replace(/\D/g, '');
  const phoneWithCountry = cleanPhone.length >= 10
    ? (cleanPhone.startsWith('55') ? cleanPhone : `55${cleanPhone}`)
    : '';

  const whatsappMessage = encodeURIComponent(
    `Olá! Tenho interesse no imóvel REF: ${imovel.referencia} (${imovel.titulo}) anunciado no site Imóveis Taboão da Serra e imediações. Gostaria de agendar uma visita ou receber mais informações!`
  );
  const whatsappUrl = phoneWithCountry
    ? `https://wa.me/${phoneWithCountry}?text=${whatsappMessage}`
    : `/contato?ref=${encodeURIComponent(imovel.referencia)}`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    'name': imovel.titulo,
    'description': imovel.descricao,
    'url': urlPagina,
    'image': fotoCapa,
    'datePosted': imovel.createdAt,
    'address': {
      '@type': 'PostalAddress',
      'addressLocality': imovel.endereco?.bairro || 'Taboão da Serra',
      'addressRegion': 'SP',
      'addressCountry': 'BR'
    },
    ...(preco ? {
      'offers': {
        '@type': 'Offer',
        'price': preco,
        'priceCurrency': 'BRL',
        'availability': 'https://schema.org/InStock'
      }
    } : {})
  };

  const especificacoes = [
    { icone: BedDouble, rotulo: 'Quartos', valor: imovel.caracteristicas?.quartos },
    { icone: ShowerHead, rotulo: 'Suítes', valor: imovel.caracteristicas?.suites },
    { icone: ShowerHead, rotulo: 'Banheiros', valor: imovel.caracteristicas?.banheiros },
    { icone: Car, rotulo: 'Vagas', valor: imovel.caracteristicas?.vagas },
    { icone: Maximize, rotulo: 'Área útil', valor: imovel.caracteristicas?.areaUtil, sufixo: 'm²' },
    { icone: Ruler, rotulo: 'Área total', valor: imovel.caracteristicas?.areaTotal, sufixo: 'm²' },
  ].filter((item) => item.valor !== null && item.valor !== undefined);

  const bairro = imovel.endereco?.bairro || imovel.bairro || 'Taboão da Serra';
  const taxaCondominio = imovel.valorCondominio ?? null;
  const iptu = imovel.iptuMensal ?? null;

  return (
    <div className="flex flex-col pb-24 lg:pb-0">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }}
      />

      {/* Cabeçalho */}
      <Section tone="navy" spacing="compact">
        <Container>
          <nav aria-label="Você está aqui" className="mb-5 flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-white/50">
            <Link href="/" className="inline-flex items-center gap-1.5 hover:text-white">
              <HomeIcon className="h-3.5 w-3.5" aria-hidden="true" />
              Início
            </Link>
            <span aria-hidden="true">/</span>
            <Link href={isLocacao ? '/locacao' : '/venda'} className="hover:text-white">
              {isLocacao ? 'Alugar' : 'Comprar'}
            </Link>
            <span aria-hidden="true">/</span>
            <span className="truncate text-white/70">{imovel.referencia}</span>
          </nav>

          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div className="min-w-0 space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <Badge tone="gold" className="border border-gold-500/30 bg-gold-500/10">
                  {imovel.transacao}
                </Badge>
                <span className="font-mono text-[11px] font-bold tracking-wider text-white/50">
                  REF {imovel.referencia}
                </span>
              </div>

              <h1 className="text-2xl font-bold leading-tight text-white sm:text-3xl lg:text-4xl">
                {imovel.titulo}
              </h1>

              <p className="flex items-center gap-1.5 text-sm text-white/70">
                <MapPin className="h-4 w-4 shrink-0 text-gold-400" aria-hidden="true" />
                {bairro}, Taboão da Serra e imediações — SP
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-3">
              <ShareButton />
            </div>
          </div>
        </Container>
      </Section>

      <Section tone="paper" spacing="compact">
        <Container>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            {/* Galeria + conteúdo */}
            <div className="space-y-6 lg:col-span-8">
              <Card className="overflow-hidden p-2 sm:p-3">
                <ImageCarousel images={imovel.fotos} alt={imovel.titulo} />
              </Card>

              {imovel.descricao && (
                <Card className="p-6 sm:p-8">
                  <h2 className="text-xl font-bold text-ink">Sobre o imóvel</h2>
                  <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-ink/80">
                    {imovel.descricao}
                  </p>
                </Card>
              )}

              {especificacoes.length > 0 && (
                <Card className="p-6 sm:p-8">
                  <h2 className="text-xl font-bold text-ink">Especificações</h2>
                  <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {especificacoes.map(({ icone: Icone, rotulo, valor, sufixo }) => (
                      <div key={rotulo} className="rounded-xl border border-line bg-paper p-4 text-center">
                        <Icone className="mx-auto h-5 w-5 text-gold-600" aria-hidden="true" />
                        <p className="mt-2 text-lg font-extrabold text-ink">
                          {valor}{sufixo ? <span className="text-sm font-bold text-muted"> {sufixo}</span> : null}
                        </p>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-muted">{rotulo}</p>
                      </div>
                    ))}
                  </div>
                </Card>
              )}
            </div>

            {/* Card de contato */}
            <aside className="lg:col-span-4">
              <Card className="p-6 lg:sticky lg:top-24">
                <div className="border-b border-line pb-5">
                  <p className="text-[10px] font-extrabold uppercase tracking-wider text-muted">
                    {isLocacao ? 'Aluguel' : 'Valor de venda'}
                  </p>
                  <Price
                    valor={preco}
                    sufixo={isLocacao ? 'mes' : null}
                    className="mt-1 block text-3xl font-extrabold text-ink"
                  />

                  {(taxaCondominio || iptu) && (
                    <dl className="mt-3 space-y-1 text-xs text-muted">
                      {taxaCondominio ? (
                        <div className="flex items-center justify-between gap-2">
                          <dt>Condomínio</dt>
                          <dd className="font-bold text-ink/80"><Price valor={taxaCondominio} centavos className="font-bold" /></dd>
                        </div>
                      ) : null}
                      {iptu ? (
                        <div className="flex items-center justify-between gap-2">
                          <dt>IPTU</dt>
                          <dd className="font-bold text-ink/80"><Price valor={iptu} centavos className="font-bold" /></dd>
                        </div>
                      ) : null}
                    </dl>
                  )}
                </div>

                <div className="mt-5 space-y-3">
                  <TrackedWhatsAppLink
                    href={whatsappUrl}
                    source="property_detail"
                    className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-whatsapp text-sm font-extrabold text-white shadow-sm transition hover:brightness-95"
                  >
                    <MessageCircle className="h-5 w-5" aria-hidden="true" />
                    Chamar no WhatsApp
                  </TrackedWhatsAppLink>

                  <ButtonLink href="/contato" variant="outline" size="md" className="w-full">
                    Tirar dúvidas por e-mail
                  </ButtonLink>
                </div>

                <div className="mt-5 rounded-xl bg-paper p-4 text-xs leading-relaxed text-muted">
                  <p className="flex items-center gap-1.5 font-bold text-ink">
                    <ShieldCheck className="h-4 w-4 text-gold-600" aria-hidden="true" />
                    Anúncio com procedência
                  </p>
                  <p className="mt-1.5">
                    {imovel.corretor?.nome && imovel.corretor.nome !== 'Corretor'
                      ? `Corretor responsável: ${imovel.corretor.nome}.`
                      : 'Atendimento direto com o corretor responsável.'}
                    {' '}Combine a visita e confira a documentação antes de fechar negócio.
                  </p>
                </div>
              </Card>
            </aside>
          </div>
        </Container>
      </Section>

      {/* Barra fixa no mobile: preço + CTA sempre à mão */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface/95 px-4 py-3 backdrop-blur-md lg:hidden">
        <div className="mx-auto flex max-w-[1240px] items-center justify-between gap-3">
          <div className="min-w-0 leading-none">
            <p className="text-[10px] font-extrabold uppercase tracking-wider text-muted">
              {isLocacao ? 'Aluguel' : 'Venda'}
            </p>
            <Price
              valor={preco}
              sufixo={isLocacao ? 'mes' : null}
              className="mt-1 block truncate text-lg font-extrabold text-ink"
            />
          </div>

          <TrackedWhatsAppLink
            href={whatsappUrl}
            source="property_detail_mobile"
            className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-whatsapp px-5 text-sm font-extrabold text-white shadow-sm"
          >
            <MessageCircle className="h-4 w-4" aria-hidden="true" />
            WhatsApp
          </TrackedWhatsAppLink>
        </div>
      </div>
    </div>
  );
}
