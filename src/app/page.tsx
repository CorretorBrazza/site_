import Link from 'next/link';
import {
  Search,
  MapPin,
  ArrowRight,
  Home as HomeIcon,
  Key,
  Sparkles,
  ShieldCheck,
  Clock,
  CloudUpload,
  MessageCircle,
} from 'lucide-react';
import { getImoveis } from '@/app/actions/imovel-server-actions';
import HomeLiveSection from '@/components/HomeLiveSection';
import { safeJsonLd } from '@/lib/jsonld';
import { Container, Section, SectionTitle } from '@/components/ui/container';
import { ButtonLink } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input, Select } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

const NUMERO_WHATSAPP = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '5511989161897').replace(/\D/g, '');

const PROVAS = [
  { icone: ShieldCheck, titulo: 'Atendimento local', texto: 'Taboão da Serra e imediações' },
  { icone: Clock, titulo: '90 dias no ar', texto: 'Cada crédito publica por 90 dias' },
  { icone: Sparkles, titulo: 'IA + revisão', texto: 'Nada é publicado sem você conferir' },
  { icone: CloudUpload, titulo: 'Fotos em backup', texto: 'Acervo em alta resolução na nuvem' },
] as const;

export default async function Home() {
  const { imoveis: allImoveis, fallback: catalogoFallback } = await getImoveis();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateAgent',
    'name': 'Imóveis Taboão da Serra e imediações',
    'image': 'https://imoveistaboao.com.br/favicon.ico',
    '@id': 'https://imoveistaboao.com.br',
    'url': 'https://imoveistaboao.com.br',
    'telephone': '+5511932785602',
    'address': {
      '@type': 'PostalAddress',
      'streetAddress': 'Taboão da Serra e imediações',
      'addressLocality': 'Taboão da Serra',
      'addressRegion': 'SP',
      'postalCode': '06750-000',
      'addressCountry': 'BR'
    },
    'geo': {
      '@type': 'GeoCoordinates',
      'latitude': -23.6247,
      'longitude': -46.7885
    }
  };

  return (
    <div className="flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }}
      />

      {/* ---------------- HERO ---------------- */}
      <Section tone="navy" spacing="compact" className="relative overflow-hidden pt-12 sm:pt-16">
        {/* Halo dourado discreto */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-40 right-1/4 h-80 w-80 rounded-full bg-gold-500/10 blur-3xl"
        />

        <Container className="relative z-10">
          <div className="mx-auto max-w-3xl text-center">
            <Badge tone="gold" className="mb-5 border border-gold-500/30 bg-gold-500/10">
              <MapPin className="h-3 w-3" aria-hidden="true" />
              Taboão da Serra e imediações
            </Badge>

            <h1 className="text-3xl font-bold leading-[1.1] tracking-tight text-white sm:text-5xl">
              Seu próximo imóvel em{' '}
              <span className="text-gold-400">Taboão da Serra</span>{' '}
              começa aqui
            </h1>

            <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-white/70 sm:text-base">
              Casas, apartamentos e sobrados com procedência: dados conferidos,
              fotos em alta e contato direto com o corretor responsável.
            </p>
          </div>

          {/* Busca */}
          <Card className="mx-auto mt-8 max-w-4xl p-4 sm:p-6">
            <form action="/venda" method="GET" className="space-y-4">
              <div className="flex w-full gap-1 rounded-xl bg-paper p-1 sm:w-fit">
                <span className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-brand-900 px-5 py-2 text-xs font-extrabold uppercase tracking-wider text-white sm:flex-none">
                  <HomeIcon className="h-4 w-4" aria-hidden="true" />
                  Comprar
                </span>
                <Link
                  href="/locacao"
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg px-5 py-2 text-xs font-extrabold uppercase tracking-wider text-muted hover:text-brand-900 sm:flex-none"
                >
                  <Key className="h-4 w-4" aria-hidden="true" />
                  Alugar
                </Link>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <div>
                  <label htmlFor="busca-bairro" className="mb-1.5 block text-[11px] font-extrabold uppercase tracking-wider text-muted">
                    Localização
                  </label>
                  <Input
                    id="busca-bairro"
                    type="text"
                    name="bairro"
                    placeholder="Bairro ou região"
                    defaultValue=""
                  />
                </div>

                <div>
                  <label htmlFor="busca-tipo" className="mb-1.5 block text-[11px] font-extrabold uppercase tracking-wider text-muted">
                    Tipo
                  </label>
                  <Select id="busca-tipo" name="tipo" defaultValue="">
                    <option value="">Todos os tipos</option>
                    <option value="Apartamento">Apartamento</option>
                    <option value="Sobrado">Sobrado / Casa</option>
                    <option value="Terreno">Terreno</option>
                    <option value="Comercial">Comercial</option>
                  </Select>
                </div>

                <div>
                  <label htmlFor="busca-preco" className="mb-1.5 block text-[11px] font-extrabold uppercase tracking-wider text-muted">
                    Preço máximo
                  </label>
                  <Select id="busca-preco" name="precoMax" defaultValue="">
                    <option value="">Sem limite</option>
                    <option value="300000">Até R$ 300 mil</option>
                    <option value="500000">Até R$ 500 mil</option>
                    <option value="800000">Até R$ 800 mil</option>
                    <option value="1200000">Até R$ 1,2 milhão</option>
                  </Select>
                </div>

                <div>
                  <label htmlFor="busca-quartos" className="mb-1.5 block text-[11px] font-extrabold uppercase tracking-wider text-muted">
                    Dormitórios
                  </label>
                  <Select id="busca-quartos" name="quartos" defaultValue="">
                    <option value="">Qualquer</option>
                    <option value="1">1+ quartos</option>
                    <option value="2">2+ quartos</option>
                    <option value="3">3+ quartos</option>
                  </Select>
                </div>
              </div>

              <button
                type="submit"
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gold-500 text-sm font-extrabold uppercase tracking-wider text-brand-950 transition-colors hover:bg-gold-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2"
              >
                <Search className="h-5 w-5" aria-hidden="true" />
                Buscar imóveis
              </button>
            </form>
          </Card>

          {/* Provas rápidas */}
          <ul className="mx-auto mt-8 grid max-w-4xl grid-cols-2 gap-3 sm:grid-cols-4">
            {PROVAS.map(({ icone: Icone, titulo, texto }) => (
              <li key={titulo} className="flex items-start gap-2.5 rounded-xl border border-white/10 bg-white/5 p-3">
                <Icone className="mt-0.5 h-4 w-4 shrink-0 text-gold-400" aria-hidden="true" />
                <div className="min-w-0">
                  <p className="truncate text-[11px] font-extrabold uppercase tracking-wider text-white">{titulo}</p>
                  <p className="text-[11px] leading-snug text-white/60">{texto}</p>
                </div>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {catalogoFallback && (
        <div className="border-b border-gold-500/30 bg-gold-500/10 px-4 py-2.5 text-center text-xs font-semibold text-gold-700 sm:text-sm">
          Estamos com instabilidade no catálogo — os imóveis abaixo podem estar desatualizados. Tente novamente em instantes.
        </div>
      )}

      {/* ---------------- VITRINE ---------------- */}
      <Section tone="paper">
        <Container>
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <SectionTitle
              sobre="Seleção do portal"
              titulo="Novos anúncios na região"
              descricao="Imóveis publicados e revisados por corretores de Taboão da Serra e imediações."
            />
            <Link
              href="/venda"
              className="inline-flex items-center gap-1.5 self-start text-sm font-extrabold text-brand-900 hover:text-gold-700 sm:self-auto"
            >
              Ver todos
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>

          <HomeLiveSection initialImoveis={allImoveis} />
        </Container>
      </Section>

      {/* ---------------- PARA O CORRETOR ---------------- */}
      <Section tone="navy">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <Badge tone="gold" className="mb-4 border border-gold-500/30 bg-gold-500/10">
              <Sparkles className="h-3 w-3" aria-hidden="true" />
              Para corretores
            </Badge>
            <h2 className="text-2xl font-bold leading-tight text-white sm:text-4xl">
              Publique em minutos. <span className="text-gold-400">Pague por anúncio.</span>
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-white/70 sm:text-base">
              Envie fotos e um texto solto pelo WhatsApp. A IA monta o anúncio,
              você revisa e aprova. <strong className="font-semibold text-white">R$ 12,90 por imóvel</strong>,
              90 dias no ar — sem assinatura.
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {[
              {
                icone: MessageCircle,
                titulo: '1. Envie pelo WhatsApp',
                texto: 'Até 20 fotos e a descrição que você já tem no celular.',
              },
              {
                icone: Sparkles,
                titulo: '2. A IA escreve',
                texto: 'Título, descrição, ficha e textos para redes e portais.',
              },
              {
                icone: ShieldCheck,
                titulo: '3. Você aprova',
                texto: 'Nada vai ao ar antes da sua revisão. Só então o crédito é usado.',
              },
            ].map(({ icone: Icone, titulo, texto }) => (
              <Card key={titulo} className="border-white/10 bg-white/5 p-5 shadow-none">
                <Icone className="h-6 w-6 text-gold-400" aria-hidden="true" />
                <h3 className="mt-3 text-sm font-extrabold text-white">{titulo}</h3>
                <p className="mt-1 text-sm leading-relaxed text-white/60">{texto}</p>
              </Card>
            ))}
          </div>

          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <ButtonLink href="/planos" variant="primary" size="lg" className="w-full sm:w-auto">
              Publicar meu imóvel
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </ButtonLink>
            <ButtonLink
              href={`https://wa.me/${NUMERO_WHATSAPP}?text=${encodeURIComponent('Olá! Quero publicar um imóvel no portal.')}`}
              variant="whatsapp"
              size="lg"
              externo
              className="w-full sm:w-auto"
            >
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
              Falar no WhatsApp
            </ButtonLink>
          </div>

          <p className="mt-4 text-center text-xs text-white/50">
            Ou <Link href="/demo" className="font-bold text-gold-400 underline underline-offset-2 hover:text-gold-300">teste a demonstração</Link> antes de criar a conta.
          </p>
        </Container>
      </Section>
    </div>
  );
}
