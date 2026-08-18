'use client';

import { Coins, PlusCircle, ShieldCheck } from 'lucide-react';

interface HeaderSaldoCreditosProps {
  saldoCreditos: number;
  planoAtual?: string;
  onAbrirRecarga: () => void;
}

export default function HeaderSaldoCreditos({
  saldoCreditos = 1,
  planoAtual = 'Start',
  onAbrirRecarga,
}: HeaderSaldoCreditosProps) {
  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative overflow-hidden">
      <div className="flex items-center gap-5">
        <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shadow-xs">
          <Coins className="w-7 h-7" />
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Saldo do Banco de Créditos</span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Conta Ativa ({planoAtual})
            </span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-black text-blue-600">{saldoCreditos}</span>
            <span className="text-sm font-bold text-slate-700">
              {saldoCreditos === 1 ? 'crédito disponível' : 'créditos disponíveis'}
            </span>
          </div>
        </div>
      </div>

      <button
        onClick={onAbrirRecarga}
        className="w-full sm:w-auto px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl shadow-md transition-all text-xs uppercase tracking-wider flex items-center justify-center gap-2"
      >
        <PlusCircle className="w-4 h-4" />
        Recarregar Créditos (a partir de R$ 12,90)
      </button>
    </div>
  );
}
