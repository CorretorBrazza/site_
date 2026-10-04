'use client';

import React, { useState } from 'react';
import { SaveState } from '../hooks/useReviewAutosave';
import { CheckCircle2, AlertCircle, Loader2, AlertTriangle, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';

interface ReviewHeaderProps {
  referencia: string;
  status: string;
  completude: number;
  camposPendentes: string[];
  saveState: SaveState;
  lastSavedAt: Date | null;
  errorMessage?: string | null;
}

export function ReviewHeader({
  referencia,
  status,
  completude,
  camposPendentes,
  saveState,
  lastSavedAt,
  errorMessage,
}: ReviewHeaderProps) {
  const [showPendentes, setShowPendentes] = useState(false);

  // Cor da barra de completude
  const getCompletudeColor = (score: number) => {
    if (score >= 80) return 'bg-emerald-500';
    if (score >= 50) return 'bg-amber-500';
    return 'bg-blue-500';
  };

  return (
    <header className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-sm space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="bg-blue-50 border border-blue-200 text-blue-800 text-xs font-black px-3 py-1.5 rounded-xl uppercase tracking-wider">
            REF: {referencia || 'NOVO'}
          </span>
          <span className="bg-slate-100 text-slate-700 text-xs font-bold px-2.5 py-1 rounded-lg">
            {status === 'QUEUED_FOR_REVIEW' ? 'Em Revisão' : status}
          </span>
        </div>

        {/* Indicador de Autosave */}
        <div className="flex items-center gap-1.5 text-xs font-semibold">
          {saveState === 'saving' && (
            <span className="text-blue-600 flex items-center gap-1">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              Salvando...
            </span>
          )}
          {saveState === 'saved' && (
            <span className="text-emerald-600 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Salvo
            </span>
          )}
          {saveState === 'error' && (
            <span className="text-red-600 flex items-center gap-1" title={errorMessage || undefined}>
              <AlertCircle className="w-3.5 h-3.5" />
              Erro ao salvar
            </span>
          )}
          {saveState === 'conflict' && (
            <span className="text-amber-600 flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5" />
              Conflito detectado
            </span>
          )}
          {saveState === 'idle' && lastSavedAt && (
            <span className="text-slate-400 text-[11px]">
              Salvo às {lastSavedAt.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
            </span>
          )}
        </div>
      </div>

      {/* Barra de Completude */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-slate-700 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            Qualidade e completude do anúncio
          </span>
          <span className="font-extrabold text-slate-900">{completude}%</span>
        </div>
        <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-500 rounded-full ${getCompletudeColor(completude)}`}
            style={{ width: `${Math.max(5, completude)}%` }}
          />
        </div>
      </div>

      {/* Pendências */}
      {camposPendentes.length > 0 && (
        <div className="border-t border-slate-100 pt-3">
          <button
            type="button"
            onClick={() => setShowPendentes(!showPendentes)}
            className="w-full flex items-center justify-between text-xs text-amber-700 font-bold hover:text-amber-800 transition-colors"
          >
            <span className="flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
              {camposPendentes.length} {camposPendentes.length === 1 ? 'campo pendente' : 'campos pendentes de resposta'}
            </span>
            {showPendentes ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showPendentes && (
            <ul className="mt-2 space-y-1 pl-6 text-xs text-slate-600 list-disc">
              {camposPendentes.map((item, idx) => (
                <li key={idx} className="leading-tight">
                  {item}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </header>
  );
}
