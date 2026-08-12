import { Metadata } from 'next';
import { Suspense } from 'react';
import { getImoveis } from '@/app/actions/imovel-server-actions';
import VendaClient from './VendaClient';

export const metadata: Metadata = {
  title: 'Imóveis à Venda em Taboão da Serra e imediações — Imóveis Taboão',
  description: 'Confira as melhores oportunidades de casas, sobrados e apartamentos à venda em Taboão da Serra e imediações.',
};

export default async function VendaPage() {
  const allImoveis = await getImoveis();

  return (
    <div className="min-h-screen bg-[#0b132b] text-slate-100 py-12 px-4">
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
