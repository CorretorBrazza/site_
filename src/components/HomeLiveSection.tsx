'use client';

import { Imovel } from '@/types/imovel';
import CardImovel from '@/components/CardImovel';
import { processarEOrdenarImoveis } from '@/utils/imovelSorting';
import { useLiveImoveis } from '@/hooks/useLiveImoveis';
import { Building2 } from 'lucide-react';

interface HomeLiveSectionProps {
  initialImoveis: Imovel[];
}

export default function HomeLiveSection({ initialImoveis }: HomeLiveSectionProps) {
  const { imoveis: currentImoveis } = useLiveImoveis(initialImoveis);
  const imoveisAtivos = currentImoveis.filter((i) => i.status === 'Ativo');
  const destaques = processarEOrdenarImoveis(imoveisAtivos).slice(0, 6);

  if (destaques.length === 0) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-10 text-center space-y-4 max-w-xl mx-auto">
        <Building2 className="w-12 h-12 text-amber-500 mx-auto opacity-80" />
        <h3 className="text-lg font-bold text-white">Nenhum imóvel listado no momento</h3>
        <p className="text-xs text-slate-400">
          Seja o primeiro corretor a publicar um imóvel em Taboão da Serra e imediações com Inteligência Artificial!
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {destaques.map((imovel) => (
        <CardImovel key={imovel.id} imovel={imovel} />
      ))}
    </div>
  );
}
