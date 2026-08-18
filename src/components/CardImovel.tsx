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
      <div className="bg-white rounded-3xl overflow-hidden transition-all duration-300 border border-slate-200 hover:border-blue-500 shadow-sm hover:shadow-xl h-full flex flex-col">
        
        {/* Imagem com Overlay Suave */}
        <div className="relative h-60 w-full overflow-hidden bg-slate-100">
          <img
            src={imovel.fotos?.[0] || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=800'}
            alt={imovel.titulo}
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
          />
          
          <div className="absolute top-4 left-4 flex gap-2">
            <div className="bg-white/95 backdrop-blur-sm text-slate-800 text-[10px] uppercase tracking-wider font-black px-3 py-1.5 rounded-xl border border-slate-200 shadow-sm">
              {imovel.transacao}
            </div>
            {imovel.isNovo && (
              <div className="bg-blue-600 text-white text-[10px] uppercase tracking-wider font-black px-3 py-1.5 rounded-xl shadow-sm">
                ✨ NOVO
              </div>
            )}
          </div>

          <div className="absolute bottom-3 left-4 right-4 flex justify-between items-end">
            <div className="bg-emerald-600 text-white px-3.5 py-1.5 rounded-xl font-black text-lg shadow-md">
              {preco ? formatCurrency(preco) : 'Consulte'}
              {imovel.transacao === 'Locação' && <span className="text-xs font-semibold text-emerald-100"> /mês</span>}
            </div>
          </div>
        </div>

        {/* Informações do Imóvel */}
        <div className="p-5 flex flex-col flex-grow space-y-3">
          
          <div className="flex items-center gap-1.5 text-slate-500 text-xs font-semibold">
            <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <span className="truncate">{imovel.endereco?.bairro || 'Taboão da Serra'}, Taboão da Serra e imediações</span>
          </div>

          <h3 className="text-base font-bold text-slate-900 line-clamp-2 group-hover:text-blue-600 transition-colors leading-tight">
            {imovel.titulo}
          </h3>

          <div className="mt-auto grid grid-cols-4 gap-2 text-slate-600 border-t border-slate-100 pt-3.5">
            <div className="flex flex-col items-center gap-0.5" title="Quartos">
              <BedDouble size={16} className="text-blue-600" />
              <span className="text-[11px] font-bold text-slate-700">{imovel.caracteristicas?.quartos ?? '—'} Qts</span>
            </div>
            <div className="flex flex-col items-center gap-0.5" title="Banheiros">
              <ShowerHead size={16} className="text-blue-600" />
              <span className="text-[11px] font-bold text-slate-700">{imovel.caracteristicas?.banheiros ?? '—'} Ban</span>
            </div>
            <div className="flex flex-col items-center gap-0.5" title="Vagas">
              <Car size={16} className="text-blue-600" />
              <span className="text-[11px] font-bold text-slate-700">{imovel.caracteristicas?.vagas ?? '—'} Vag</span>
            </div>
            <div className="flex flex-col items-center gap-0.5" title="Área Útil">
              <Maximize size={16} className="text-blue-600" />
              <span className="text-[11px] font-bold text-slate-700">{imovel.caracteristicas?.areaUtil ? `${imovel.caracteristicas.areaUtil}m²` : '—'}</span>
            </div>
          </div>

        </div>
      </div>
    </Link>
  );
}
