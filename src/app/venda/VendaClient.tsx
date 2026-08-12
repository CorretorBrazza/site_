'use client';

import { useSearchParams } from 'next/navigation';
import { Imovel } from '@/types/imovel';
import CardImovel from '@/components/CardImovel';
import { Building2, Filter, MapPin } from 'lucide-react';
import Link from 'next/link';

import { processarEOrdenarImoveis } from '@/utils/imovelSorting';
import { useLiveImoveis } from '@/hooks/useLiveImoveis';

interface VendaClientProps {
  allImoveis: Imovel[];
}

export default function VendaClient({ allImoveis }: VendaClientProps) {
  const { imoveis: currentImoveis } = useLiveImoveis(allImoveis);
  const searchParams = useSearchParams();
  const bairro = searchParams.get('bairro');
  const tipo = searchParams.get('tipo');
  const precoMax = searchParams.get('precoMax');
  const quartos = searchParams.get('quartos');

  let imoveis = currentImoveis.filter(
    (i) => (i.transacao === 'Venda' || i.transacao === 'Venda e Locação') && i.status === 'Ativo'
  );

  if (tipo) {
    imoveis = imoveis.filter((i) => i.tipo?.toLowerCase() === tipo.toLowerCase());
  }

  if (precoMax) {
    const max = parseFloat(precoMax);
    if (!isNaN(max)) {
      imoveis = imoveis.filter((i) => (i.precoVenda ?? 0) <= max);
    }
  }

  if (quartos) {
    const minQts = parseInt(quartos, 10);
    if (!isNaN(minQts)) {
      imoveis = imoveis.filter((i) => (i.caracteristicas?.quartos ?? 0) >= minQts);
    }
  }

  if (bairro && bairro.trim().length > 0 && !bairro.toLowerCase().includes('imediações')) {
    const term = bairro.toLowerCase().trim();
    imoveis = imoveis.filter(
      (i) =>
        i.endereco?.bairro?.toLowerCase().includes(term) ||
        i.bairro?.toLowerCase().includes(term) ||
        i.titulo?.toLowerCase().includes(term)
    );
  }

  imoveis = processarEOrdenarImoveis(imoveis);

  return (
    <div className="space-y-8">
      {/* Cabeçalho de Vendas com Estilo Dark Luxury */}
      <header className="bg-gradient-to-r from-slate-950 via-[#0b132b] to-slate-950 border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-extrabold uppercase tracking-wider">
            <MapPin className="w-4 h-4 text-amber-500 shrink-0" />
            <span>Taboão da Serra e imediações</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
            Imóveis à Venda em <span className="text-amber-500">Taboão da Serra e imediações</span>
          </h1>

          <p className="text-sm md:text-base text-slate-300 max-w-2xl font-medium">
            Encontramos <strong className="text-amber-400">{imoveis.length}</strong> oportunidades disponíveis de casas, apartamentos e sobrados.
          </p>
        </div>
      </header>

      {/* Barra de Filtros Ativos */}
      {(tipo || precoMax || quartos || (bairro && !bairro.includes('imediações'))) && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-300 font-bold">
            <Filter className="w-4 h-4 text-amber-500" />
            <span>Filtros Aplicados:</span>
            {tipo && <span className="bg-amber-500/20 text-amber-400 px-2.5 py-1 rounded-lg border border-amber-500/30">{tipo}</span>}
            {precoMax && <span className="bg-amber-500/20 text-amber-400 px-2.5 py-1 rounded-lg border border-amber-500/30">Até R$ {parseFloat(precoMax).toLocaleString('pt-BR')}</span>}
            {quartos && <span className="bg-amber-500/20 text-amber-400 px-2.5 py-1 rounded-lg border border-amber-500/30">{quartos}+ Quartos</span>}
          </div>

          <Link href="/venda" className="text-xs font-bold text-amber-400 hover:underline">
            Limpar Filtros ✕
          </Link>
        </div>
      )}

      {/* Grid de Imóveis à Venda */}
      {imoveis.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {imoveis.map((imovel) => (
            <CardImovel key={imovel.id} imovel={imovel} />
          ))}
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center space-y-4 max-w-lg mx-auto">
          <Building2 className="w-12 h-12 text-amber-500 mx-auto opacity-70" />
          <h2 className="text-xl font-bold text-white">Nenhum imóvel encontrado com esses filtros</h2>
          <p className="text-xs text-slate-400">
            Tente selecionar outros tipos de imóvel ou buscar por regiões vizinhas em Taboão da Serra e imediações.
          </p>
          <div className="pt-2">
            <Link
              href="/venda"
              className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl inline-block shadow-md"
            >
              Ver Todos os Imóveis à Venda
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
