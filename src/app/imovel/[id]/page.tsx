import { Metadata } from 'next';
import { getImoveis } from '@/app/actions/imovel-server-actions';
import { notFound } from 'next/navigation';
import ImageCarousel from '@/components/ImageCarousel';
import ShareButton from '@/components/ShareButton';
import { BedDouble, ShowerHead, Car, Maximize, MapPin, Mail, ShieldCheck, Phone, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import TrackedWhatsAppLink from '@/components/TrackedWhatsAppLink';

export const dynamicParams = true;
export const revalidate = 60;

export async function generateStaticParams() {
  const imoveis = await getImoveis();
  if (!imoveis || imoveis.length === 0) {
    return [{ id: 'demo' }];
  }
  return imoveis.map((imovel) => ({
    id: imovel.id,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const imoveis = await getImoveis();
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
  const urlPagina = `https://imoveistaboao.com.br/imovel/${imovel.id}`;

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
  const imoveis = await getImoveis();
  const searchKey = id.toLowerCase().trim();
  const imovel = imoveis.find((i) =>
    i.id?.toLowerCase() === searchKey ||
    i.referencia?.toLowerCase() === searchKey
  );

  if (!imovel) {
    notFound();
  }

  const preco = imovel.transacao === 'Locação' ? imovel.precoLocacao : imovel.precoVenda;
  const urlPagina = `https://imoveistaboao.com.br/imovel/${imovel.id}/`;
  const rawFoto = imovel.fotos && imovel.fotos.length > 0
    ? imovel.fotos[0]
    : 'https://images.unsplash.com/photo-1560518883-ce09059eeffa';
  const fotoCapa = rawFoto.startsWith('http') ? rawFoto : `https://imoveistaboao.com.br${rawFoto}`;
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const rawPhone = imovel.corretor?.telefone || process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '';
  const cleanPhone = rawPhone.replace(/\D/g, '');
  const phoneWithCountry = cleanPhone.length >= 10
    ? (cleanPhone.startsWith('55') ? cleanPhone : `55${cleanPhone}`)
    : (process.env.NEXT_PUBLIC_DEFAULT_WHATSAPP || '5511932785602');

  const whatsappMessage = encodeURIComponent(
    `Olá! Tenho interesse no imóvel REF: ${imovel.referencia} (${imovel.titulo}) anunciado no site Imóveis Taboão da Serra e imediações. Gostaria de agendar uma visita ou receber mais informações!`
  );
  const whatsappUrl = `https://wa.me/${phoneWithCountry}?text=${whatsappMessage}`;

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

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-8 px-4">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Cabeçalho do Imóvel */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-wider">
              <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-xl border border-blue-200">
                {imovel.transacao}
              </span>
              <span className="text-slate-400">•</span>
              <span className="text-slate-600 font-mono font-bold">REF: {imovel.referencia}</span>
            </div>
            
            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              {imovel.titulo}
            </h1>
            
            <div className="flex items-center gap-1.5 text-slate-500 text-xs sm:text-sm font-medium">
              <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
              <span>{imovel.endereco?.bairro || 'Taboão da Serra'}, Taboão da Serra e imediações - SP</span>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-3">
            <ShareButton />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Coluna Principal: Galeria & Descrição */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Galeria de Fotos */}
            <div className="bg-white border border-slate-200 rounded-3xl p-3 shadow-sm overflow-hidden">
              <ImageCarousel images={imovel.fotos} alt={imovel.titulo} />
            </div>

            {/* Descrição Completa */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-4 shadow-sm">
              <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                <span>Descrição do Imóvel</span>
              </h2>
              <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap font-normal">
                {imovel.descricao}
              </p>
            </div>

            {/* Ficha Técnica / Características */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-4 shadow-sm">
              <h2 className="text-xl font-extrabold text-slate-900">Especificações do Imóvel</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl text-center space-y-1">
                  <BedDouble className="w-6 h-6 text-blue-600 mx-auto" />
                  <span className="block font-black text-lg text-slate-900">{imovel.caracteristicas?.quartos ?? '—'}</span>
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Quartos</span>
                </div>

                <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl text-center space-y-1">
                  <ShowerHead className="w-6 h-6 text-blue-600 mx-auto" />
                  <span className="block font-black text-lg text-slate-900">{imovel.caracteristicas?.suites ?? '—'}</span>
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Suítes</span>
                </div>

                <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl text-center space-y-1">
                  <ShowerHead className="w-6 h-6 text-blue-600 mx-auto" />
                  <span className="block font-black text-lg text-slate-900">{imovel.caracteristicas?.banheiros ?? '—'}</span>
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Banheiros</span>
                </div>

                <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl text-center space-y-1">
                  <Maximize className="w-6 h-6 text-blue-600 mx-auto" />
                  <span className="block font-black text-lg text-slate-900">{imovel.caracteristicas?.areaUtil ? `${imovel.caracteristicas.areaUtil}m²` : '—'}</span>
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Área Útil</span>
                </div>
              </div>
            </div>

          </div>

          {/* Coluna Lateral: Card de Contato & Valor */}
          <div className="lg:col-span-4">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm sticky top-24">
              
              <div className="border-b border-slate-100 pb-6 space-y-1">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Valor do Imóvel</span>
                <p className="text-3xl font-black text-emerald-600">
                  {preco ? formatCurrency(preco) : 'Consulte'}
                  {imovel.transacao === 'Locação' && <span className="text-sm font-semibold text-slate-500"> /mês</span>}
                </p>
              </div>

              <div className="space-y-3">
                <TrackedWhatsAppLink
                  href={whatsappUrl}
                  source="property_detail"
                  className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl text-xs uppercase tracking-wider shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2.5"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>Chamar no WhatsApp ({imovel.referencia})</span>
                </TrackedWhatsAppLink>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs text-slate-600 space-y-2">
                <div className="flex items-center gap-2 font-bold text-slate-900">
                  <ShieldCheck className="w-4 h-4 text-blue-600" />
                  <span>Atendimento em Taboão da Serra e imediações</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  {imovel.corretor?.nome && imovel.corretor.nome !== 'Corretor'
                    ? `Fale com o corretor responsável ${imovel.corretor.nome} para agendar uma visita ao imóvel REF: `
                    : 'Entre em contato diretamente para agendar uma visita ao imóvel REF: '}
                  <strong>{imovel.referencia}</strong>.
                </p>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
