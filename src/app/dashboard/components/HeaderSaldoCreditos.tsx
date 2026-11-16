'use client';

import { Coins, PlusCircle, ShieldCheck } from 'lucide-react';

interface HeaderSaldoCreditosProps {
  saldoCreditos: number;
  saldoDisponivel?: number;
  creditosReservados?: number;
  planoAtual?: string;
  onAbrirRecarga: () => void;
}

export default function HeaderSaldoCreditos({
  saldoCreditos = 0,
  saldoDisponivel,
  creditosReservados = 0,
  planoAtual = 'Start',
  onAbrirRecarga,
}: HeaderSaldoCreditosProps) {
  const disponivel = Math.max(0, Number(saldoDisponivel ?? saldoCreditos ?? 0));
  const reservado = Math.max(0, Number(creditosReservados ?? 0));
  const temReserva = reservado > 0;

  return (
    <div className="bg-white rounded-3xl p-4 sm:p-6 border border-line shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6 relative overflow-hidden">
      <div className="flex items-center gap-4 sm:gap-5 min-w-0">
        <div className="w-14 h-14 rounded-2xl bg-brand-900/5 border border-brand-700/30 flex items-center justify-center text-brand-800 shadow-xs shrink-0">
          <Coins className="w-7 h-7" />
        </div>

        <div className="space-y-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-muted uppercase tracking-wider">Saldo disponível</span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gold/10 border border-gold/30 text-gold text-[10px] font-bold uppercase tracking-wider">
              <ShieldCheck className="w-3 h-3" />
              Plano {planoAtual}
            </span>
          </div>

          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="text-2xl sm:text-3xl font-extrabold text-brand-900 tabular-nums">{disponivel}</span>
            <span className="text-xs sm:text-sm font-medium text-muted">
              {disponivel === 1 ? 'crédito disponível' : 'créditos disponíveis'}
            </span>
          </div>
          <p className="text-[11px] text-muted leading-snug">
            {temReserva
              ? `${saldoCreditos} no total • ${reservado} reservado(s) em processamento`
              : `${saldoCreditos} crédito(s) no total`}
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={onAbrirRecarga}
        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-brand-900 text-white text-sm font-bold hover:bg-brand-800 transition-colors shrink-0"
      >
        <PlusCircle className="w-4 h-4" />
        Recarregar Créditos
      </button>
    </div>
  );
}
