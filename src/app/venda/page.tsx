import { Metadata } from 'next';
import { Suspense } from 'react';
import { getImoveis } from '@/app/actions/imovel-server-actions';
import VendaClient from './VendaClient';

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
  const allImoveis = await getImoveis();
  const imoveisVenda = allImoveis.filter(
    (i) => (i.transacao === 'Venda' || i.transacao === 'Venda e Locação') && i.status === 'Ativo'
  );

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
        url: `https://imoveistaboao.com.br/imovel/${imovel.id}/`,
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
    <div className="min-h-screen bg-[#0b132b] text-slate-100 py-12 px-4">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />
      <div className="max-w-7xl mx-auto">
        <Suspense fallback={
          <div className="text-center py-20 text-slate-400">Carregando imóveis à venda em Taboão da Serra e imediações...</div>
        }>
          <VendaClient allImoveis={allImoveis} />
        </Suspense>
      </div>
    </div>
  );
}
