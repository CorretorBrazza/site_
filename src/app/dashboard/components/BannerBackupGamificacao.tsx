'use client';

import { HardDrive, ShieldCheck, Download, Sparkles } from 'lucide-react';

interface BannerBackupGamificacaoProps {
  gigabytesEconomizados?: number;
  totalFotosBackup?: number;
  onAbrirBackupModal?: () => void;
}

export default function BannerBackupGamificacao({
  gigabytesEconomizados = 4.5,
  totalFotosBackup = 28,
  onAbrirBackupModal,
}: BannerBackupGamificacaoProps) {
  return (
    <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 text-white shadow-xl border border-indigo-900/40 relative overflow-hidden my-6">
      {/* Elementos decorativos */}
      <div className="absolute top-0 right-0 -mt-8 -mr-8 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 -mb-8 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-full text-xs font-semibold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-indigo-400" />
            Central de Backups do Corretor (Seguro de Fotos)
          </div>

          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white">
            Você economizou <span className="text-yellow-400 font-extrabold">{gigabytesEconomizados} GB</span> de memória no seu celular hoje!
          </h2>

          <p className="text-slate-300 text-xs md:text-sm leading-relaxed">
            Suas <strong>{totalFotosBackup} fotos de alta resolução</strong> estão armazenadas com segurança no nosso depósito em nuvem Cloudflare R2 sem ocupar espaço no seu aparelho.
          </p>
        </div>

        <div className="flex flex-wrap md:flex-col items-center gap-3 w-full md:w-auto">
          <button
            onClick={onAbrirBackupModal}
            className="w-full md:w-auto px-5 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-md hover:shadow-indigo-500/25 transition-all text-xs flex items-center justify-center gap-2 whitespace-nowrap"
          >
            <Download className="w-4 h-4" />
            Baixar Fotos em Alta Resolução
          </button>

          <div className="text-[11px] text-slate-400 flex items-center gap-1.5 justify-center w-full">
            <Sparkles className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
            Vitrine Web: 5 fotos | Depósito: 25 fotos
          </div>
        </div>
      </div>
    </div>
  );
}
