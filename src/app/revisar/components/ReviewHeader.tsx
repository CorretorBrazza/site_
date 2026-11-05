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
    if (score >= 80) return 'bg-success';
    if (score >= 50) return 'bg-gold';
    return 'bg-brand-900';
  };

  return (
    <header className="bg-white border border-line rounded-3xl p-5 sm:p-6 shadow-sm space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="bg-brand-900/5 border border-brand-700/30 text-brand-800 text-xs font-black px-3 py-1.5 rounded-xl uppercase tracking-wider">
            REF: {referencia || 'NOVO'}
          </span>
          <span className="bg-paper text-ink text-xs font-bold px-2.5 py-1 rounded-lg">
            {status === 'QUEUED_FOR_REVIEW' ? 'Em Revisão' : status}
          </span>
        </div>

        {/* Indicador de Autosave */}
        <div className="flex items-center gap-1.5 text-xs font-semibold">
          {saveState === 'saving' && (
            <span className="text-brand-800 flex items-center gap-1">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              Salvando...
            </span>
          )}
          {saveState === 'saved' && (
            <span className="text-success flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Salvo
            </span>
          )}
          {saveState === 'error' && (
            <span className="text-danger flex items-center gap-1" title={errorMessage || undefined}>
              <AlertCircle className="w-3.5 h-3.5" />
              Erro ao salvar
            </span>
          )}
          {saveState === 'conflict' && (
            <span className="text-gold flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5" />
              Conflito detectado
            </span>
          )}
          {saveState === 'idle' && lastSavedAt && (
            <span className="text-muted text-[11px]">
              Salvo às {lastSavedAt.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
            </span>
          )}
        </div>
      </div>

      {/* Barra de Completude */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-ink flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-gold" />
            Qualidade e completude do anúncio
          </span>
          <span className="font-extrabold text-brand-900">{completude}%</span>
        </div>
        <div className="w-full h-2.5 bg-paper rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-500 rounded-full ${getCompletudeColor(completude)}`}
            style={{ width: `${Math.max(5, completude)}%` }}
          />
        </div>
      </div>

      {/* Pendências */}
      {camposPendentes.length > 0 && (
        <div className="border-t border-line pt-3">
          <button
            type="button"
            onClick={() => setShowPendentes(!showPendentes)}
            className="w-full flex items-center justify-between text-xs text-gold font-bold hover:text-gold transition-colors"
          >
            <span className="flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-gold shrink-0" />
              {camposPendentes.length} {camposPendentes.length === 1 ? 'campo pendente' : 'campos pendentes de resposta'}
            </span>
            {showPendentes ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showPendentes && (
            <ul className="mt-2 space-y-1 pl-6 text-xs text-ink list-disc">
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
