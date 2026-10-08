import { Metadata } from 'next';
import { Suspense } from 'react';
import { getImoveis } from '@/app/actions/imovel-server-actions';
import LocacaoClient from './LocacaoClient';
import { safeJsonLd } from '@/lib/jsonld';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Imóveis para Alugar em Taboão da Serra e imediações — Imóveis Taboão',
  description: 'Encontre as melhores opções de casas, apartamentos e salões para alugar em Taboão da Serra e imediações.',
  openGraph: {
    title: 'Imóveis para Alugar em Taboão da Serra e imediações — Imóveis Taboão',
    description: 'Encontre as melhores opções de casas, apartamentos e salões para alugar em Taboão da Serra e imediações.',
    url: 'https://imoveistaboao.com.br/locacao',
    type: 'website',
  },
};

export default async function LocacaoPage() {
  const { imoveis: allImoveis, fallback: catalogoFallback } = await getImoveis();
  const imoveisLocacao = allImoveis.filter((i) => {
    const raw = String(i.transacao || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    const isLoc = raw.includes('loca') || raw.includes('alug') || Boolean(i.precoLocacao);
    return isLoc && (i.status === 'Ativo' || !i.status);
  });

  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Imóveis para Alugar em Taboão da Serra e imediações',
    description: 'Lista de apartamentos, casas e salões comerciais para alugar em Taboão da Serra e região.',
    numberOfItems: imoveisLocacao.length,
    itemListElement: imoveisLocacao.slice(0, 30).map((imovel, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'RealEstateListing',
        name: imovel.titulo,
        description: imovel.descricao ? `${imovel.descricao.substring(0, 150)}...` : undefined,
        url: `https://imoveistaboao.com.br/imovel/${imovel.id}/`,
        image: imovel.fotos && imovel.fotos.length > 0 ? imovel.fotos[0] : undefined,
        offers: imovel.precoLocacao ? {
          '@type': 'Offer',
          price: imovel.precoLocacao,
          priceCurrency: 'BRL',
        } : undefined,
        address: {
          '@type': 'PostalAddress',
          addressLocality: imovel.endereco?.bairro || 'Taboão da Serra',
          addressRegion: 'SP',
          addressCountry: 'BR',
        },
      },
    })),
  };

  return (
    <div className="min-h-screen bg-[#0b132b] text-slate-100 py-12 px-4">
      {catalogoFallback && (
        <div className="max-w-7xl mx-auto mb-6 bg-amber-500/10 border border-amber-400/40 text-amber-200 text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-xl text-center">
          Estamos com instabilidade no catálogo — os imóveis abaixo podem estar desatualizados. Tente novamente em instantes.
        </div>
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(itemListJsonLd) }}
      />
      <div className="max-w-7xl mx-auto">
        <Suspense fallback={
          <div className="text-center py-20 text-slate-400">Carregando imóveis para alugar em Taboão da Serra e imediações...</div>
        }>
          <LocacaoClient allImoveis={allImoveis} />
        </Suspense>
      </div>
    </div>
  );
}
