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
    <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative overflow-hidden">
      <div className="flex items-center gap-5">
        <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-inner">
          <Coins className="w-7 h-7" />
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Saldo do Banco de Créditos</span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Conta Ativa ({planoAtual})
            </span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-black text-amber-400">{saldoCreditos}</span>
            <span className="text-sm font-semibold text-slate-300">
              {saldoCreditos === 1 ? 'crédito disponível' : 'créditos disponíveis'}
            </span>
          </div>
        </div>
      </div>

      <button
        onClick={onAbrirRecarga}
        className="w-full sm:w-auto px-6 py-3.5 bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-400 hover:to-amber-600 text-slate-950 font-black rounded-2xl shadow-lg hover:shadow-amber-500/20 transition-all text-xs uppercase tracking-wider flex items-center justify-center gap-2"
      >
        <PlusCircle className="w-4 h-4" />
        Recarregar Créditos (a partir de R$ 12,90)
      </button>
    </div>
  );
}
