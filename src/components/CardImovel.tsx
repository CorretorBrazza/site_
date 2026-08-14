'use client';

import { Imovel } from '@/types/imovel';
import Link from 'next/link';
import { BedDouble, ShowerHead, Car, Maximize, MapPin } from 'lucide-react';
import { trackEvent } from '@/lib/analytics';

interface CardImovelProps {
  imovel: Imovel;
}

export default function CardImovel({ imovel }: CardImovelProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const preco = imovel.transacao === 'Venda' ? imovel.precoVenda : imovel.precoLocacao;

  return (
    <Link
      href={`/imovel/${imovel.id}`}
      className="block group"
      onClick={() => trackEvent('view_property', { transaction: imovel.transacao })}
    >
      <div className="bg-slate-900 rounded-3xl overflow-hidden transition-all duration-300 border border-slate-800/90 hover:border-amber-500/50 shadow-xl hover:shadow-2xl hover:shadow-amber-500/10 h-full flex flex-col">
        
        {/* Imagem com Overlay de Gradiente */}
        <div className="relative h-60 w-full overflow-hidden bg-slate-950">
          <img
            src={imovel.fotos?.[0] || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=800'}
            alt={imovel.titulo}
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
          />
          
          <div className="absolute top-4 left-4 flex gap-2">
            <div className="bg-slate-950/90 backdrop-blur-sm text-white text-[10px] uppercase tracking-wider font-extrabold px-3 py-1.5 rounded-xl border border-slate-800 shadow-md">
              {imovel.transacao}
            </div>
            {imovel.isNovo && (
              <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 text-slate-950 text-[10px] uppercase tracking-wider font-black px-3 py-1.5 rounded-xl shadow-md border border-amber-400/40">
                ✨ NOVO
              </div>
            )}
          </div>

          <div className="absolute bottom-3 left-4 right-4 flex justify-between items-end">
            <div className="bg-slate-950/95 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-amber-500/40 text-amber-400 font-black text-lg shadow-lg">
              {preco ? formatCurrency(preco) : 'Consulte'}
              {imovel.transacao === 'Locação' && <span className="text-xs font-semibold text-slate-400"> /mês</span>}
            </div>
          </div>
        </div>

        {/* Informações do Imóvel */}
        <div className="p-5 flex flex-col flex-grow space-y-3">
          
          <div className="flex items-center gap-1.5 text-slate-400 text-xs font-semibold">
            <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span className="truncate">{imovel.endereco?.bairro || 'Taboão da Serra'}, Taboão da Serra e imediações</span>
          </div>

          <h3 className="text-base font-extrabold text-white line-clamp-2 group-hover:text-amber-400 transition-colors leading-tight">
            {imovel.titulo}
          </h3>

          <div className="mt-auto grid grid-cols-4 gap-2 text-slate-300 border-t border-slate-800/80 pt-3.5">
            <div className="flex flex-col items-center gap-0.5" title="Quartos">
              <BedDouble size={16} className="text-amber-500" />
              <span className="text-[11px] font-bold text-slate-300">{imovel.caracteristicas?.quartos ?? '—'} Qts</span>
            </div>
            <div className="flex flex-col items-center gap-0.5" title="Banheiros">
              <ShowerHead size={16} className="text-amber-500" />
              <span className="text-[11px] font-bold text-slate-300">{imovel.caracteristicas?.banheiros ?? '—'} Ban</span>
            </div>
            <div className="flex flex-col items-center gap-0.5" title="Vagas">
              <Car size={16} className="text-amber-500" />
              <span className="text-[11px] font-bold text-slate-300">{imovel.caracteristicas?.vagas ?? '—'} Vag</span>
            </div>
            <div className="flex flex-col items-center gap-0.5" title="Área Útil">
              <Maximize size={16} className="text-amber-500" />
              <span className="text-[11px] font-bold text-slate-300">{imovel.caracteristicas?.areaUtil ? `${imovel.caracteristicas.areaUtil}m²` : '—'}</span>
            </div>
          </div>

        </div>
      </div>
    </Link>
  );
}
