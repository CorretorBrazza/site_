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
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shadow-xs">
          <Coins className="w-6 h-6" />
        </div>

        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Saldo do Banco</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-green-100 text-green-700 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> Conta Ativa ({planoAtual})
            </span>
          </div>

          <div className="flex items-baseline gap-2 mt-0.5">
            <span className="text-3xl font-black text-gray-900">{saldoCreditos}</span>
            <span className="text-sm font-semibold text-gray-500">
              {saldoCreditos === 1 ? 'crédito disponível' : 'créditos disponíveis'}
            </span>
          </div>
        </div>
      </div>

      <button
        onClick={onAbrirRecarga}
        className="w-full sm:w-auto px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all text-xs flex items-center justify-center gap-2"
      >
        <PlusCircle className="w-4 h-4" />
        Recarregar Créditos (a partir de R$ 9,99)
      </button>
    </div>
  );
}
