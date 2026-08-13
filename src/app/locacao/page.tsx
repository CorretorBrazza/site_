import { Metadata } from 'next';
import { Suspense } from 'react';
import { getImoveis } from '@/app/actions/imovel-server-actions';
import LocacaoClient from './LocacaoClient';

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
  const allImoveis = await getImoveis();

  return (
    <div className="min-h-screen bg-[#0b132b] text-slate-100 py-12 px-4">
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
