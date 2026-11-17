import { Metadata } from 'next';
import { Suspense } from 'react';
import { getImoveis } from '@/app/actions/imovel-server-actions';
import { ListagemImoveis } from '@/components/listagem/ListagemImoveis';
import { safeJsonLd } from '@/lib/jsonld';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Imóveis para Alugar em Taboão da Serra e imediações — Imóveis Taboão',
  description: 'Encontre as melhores opções de casas, apartamentos e salões para alugar em Taboão da Serra e imediações.',
  alternates: {
    canonical: '/locacao/',
  },
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
        url: `https://imoveistaboao.com.br/imovel/${encodeURIComponent(imovel.referencia || imovel.id)}/`,
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
    <div className="flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(itemListJsonLd) }}
      />

      {catalogoFallback && (
        <div className="border-b border-gold-500/30 bg-gold-500/10 px-4 py-2.5 text-center text-xs font-semibold text-gold-700 sm:text-sm">
          Estamos com instabilidade no catálogo — os imóveis abaixo podem estar desatualizados. Tente novamente em instantes.
        </div>
      )}

      <Suspense
        fallback={(
          <div className="mx-auto max-w-[1240px] px-4 py-20 text-center text-sm text-muted">
            Carregando imóveis para alugar em Taboão da Serra e imediações...
          </div>
        )}
      >
        <ListagemImoveis imoveis={allImoveis} modo="locacao" />
      </Suspense>
    </div>
  );
}
