import { Metadata } from 'next';
import { Suspense } from 'react';
import { getImoveis } from '@/app/actions/imovel-server-actions';
import { ListagemImoveis } from '@/components/listagem/ListagemImoveis';
import { safeJsonLd } from '@/lib/jsonld';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Imóveis à Venda em Taboão da Serra e imediações — Imóveis Taboão',
  description: 'Confira as melhores oportunidades de casas, sobrados e apartamentos à venda em Taboão da Serra e imediações.',
  openGraph: {
    title: 'Imóveis à Venda em Taboão da Serra e imediações — Imóveis Taboão',
    description: 'Confira as melhores oportunidades de casas, sobrados e apartamentos à venda em Taboão da Serra e imediações.',
    url: 'https://imoveistaboao.com.br/venda',
    type: 'website',
  },
};

export default async function VendaPage() {
  const { imoveis: allImoveis, fallback: catalogoFallback } = await getImoveis();
  const imoveisVenda = allImoveis.filter((i) => {
    const raw = String(i.transacao || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    const isVen = raw.includes('venda') || raw.includes('compra') || Boolean(i.precoVenda);
    return isVen && (i.status === 'Ativo' || !i.status);
  });

  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Imóveis à Venda em Taboão da Serra e imediações',
    description: 'Lista de casas, sobrados e apartamentos à venda em Taboão da Serra e região.',
    numberOfItems: imoveisVenda.length,
    itemListElement: imoveisVenda.slice(0, 30).map((imovel, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'RealEstateListing',
        name: imovel.titulo,
        description: imovel.descricao ? `${imovel.descricao.substring(0, 150)}...` : undefined,
        url: `https://imoveistaboao.com.br/imovel/${encodeURIComponent(imovel.referencia || imovel.id)}/`,
        image: imovel.fotos && imovel.fotos.length > 0 ? imovel.fotos[0] : undefined,
        offers: imovel.precoVenda ? {
          '@type': 'Offer',
          price: imovel.precoVenda,
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
            Carregando imóveis à venda em Taboão da Serra e imediações...
          </div>
        )}
      >
        <ListagemImoveis imoveis={allImoveis} modo="venda" />
      </Suspense>
    </div>
  );
}
