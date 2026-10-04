'use client';

import React, { useState } from 'react';
import { DynamicQuestion } from '@/lib/api';
import { HelpCircle, CheckCircle2, ChevronRight, AlertCircle } from 'lucide-react';

interface ReviewQuestionsProps {
  perguntas: DynamicQuestion[];
  onAnswerQuestion: (questionId: string, resposta: unknown) => void;
  disabled?: boolean;
}

export function ReviewQuestions({
  perguntas,
  onAnswerQuestion,
  disabled = false,
}: ReviewQuestionsProps) {
  const [selectedInputs, setSelectedInputs] = useState<Record<string, any>>({});
  const [multiSelected, setMultiSelected] = useState<Record<string, string[]>>({});

  if (!perguntas || perguntas.length === 0) {
    return null;
  }

  const pendentes = perguntas.filter((p) => !p.respondida);
  const respondidasCount = perguntas.length - pendentes.length;

  const handleBotoesClick = (q: DynamicQuestion, opcao: string) => {
    onAnswerQuestion(q.id, opcao);
  };

  const handleMultiToggle = (qId: string, opcao: string) => {
    const current = multiSelected[qId] || [];
    const updated = current.includes(opcao)
      ? current.filter((item) => item !== opcao)
      : [...current, opcao];

    setMultiSelected({ ...multiSelected, [qId]: updated });
  };

  const handleMultiSubmit = (qId: string) => {
    const selected = multiSelected[qId] || [];
    onAnswerQuestion(qId, selected.length > 0 ? selected : 'Não informado');
  };

  const handleInputChange = (qId: string, value: any) => {
    setSelectedInputs({ ...selectedInputs, [qId]: value });
  };

  const handleInputSubmit = (qId: string) => {
    const val = selectedInputs[qId];
    if (val !== undefined && val !== '') {
      onAnswerQuestion(qId, val);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-sm space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-blue-600" />
          <span>Perguntas Inteligentes sobre o Imóvel</span>
        </h2>
        <span className="text-xs font-bold text-slate-500">
          {respondidasCount} de {perguntas.length} respondidas
        </span>
      </div>

      {pendentes.length === 0 ? (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-center space-y-1">
          <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto" />
          <p className="text-xs font-bold text-emerald-800">Todas as perguntas principais foram respondidas!</p>
          <p className="text-[11px] text-emerald-600">Seu anúncio está pronto e detalhado com máxima precisão.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {pendentes.map((q, idx) => (
            <div
              key={q.id}
              className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                q.critica
                  ? 'border-amber-400 bg-amber-50/30'
                  : 'border-slate-200 bg-slate-50/50'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="bg-blue-100 text-blue-800 text-[10px] font-black px-2 py-0.5 rounded-full">
                      Pergunta #{idx + 1}
                    </span>
                    {q.obrigatoria && (
                      <span className="bg-red-100 text-red-700 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5">
                        <AlertCircle className="w-2.5 h-2.5" /> Obrigatória
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm font-extrabold text-slate-900 leading-snug">
                    {q.pergunta}
                  </h3>
                  {q.ajuda && <p className="text-[11px] text-slate-500 mt-0.5">{q.ajuda}</p>}
                </div>
              </div>

              {/* TIPO: BOTÕES */}
              {q.tipo === 'botoes' && q.opcoes && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3">
                  {q.opcoes.map((opcao) => (
                    <button
                      key={opcao}
                      type="button"
                      disabled={disabled}
                      onClick={() => handleBotoesClick(q, opcao)}
                      className="w-full py-3 px-4 min-h-[48px] bg-white border border-slate-200 hover:border-blue-500 hover:bg-blue-50 text-slate-800 font-bold text-xs rounded-xl text-left flex items-center justify-between shadow-sm transition-all active:scale-98"
                    >
                      <span>{opcao}</span>
                      <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                    </button>
                  ))}
                </div>
              )}

              {/* TIPO: SELEÇÃO MÚLTIPLA */}
              {q.tipo === 'selecao_multipla' && q.opcoes && (
                <div className="space-y-3 mt-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {q.opcoes.map((opcao) => {
                      const isChecked = (multiSelected[q.id] || []).includes(opcao);
                      return (
                        <button
                          key={opcao}
                          type="button"
                          disabled={disabled}
                          onClick={() => handleMultiToggle(q.id, opcao)}
                          className={`w-full py-2.5 px-3.5 min-h-[44px] border text-xs font-bold rounded-xl text-left flex items-center justify-between transition-all ${
                            isChecked
                              ? 'bg-blue-50 border-blue-600 text-blue-900'
                              : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                          }`}
                        >
                          <span>{opcao}</span>
                          <span
                            className={`w-4 h-4 rounded flex items-center justify-center border ${
                              isChecked ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-300 bg-white'
                            }`}
                          >
                            {isChecked && '✓'}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                  <div className="flex items-center justify-end gap-2 pt-1">
                    <button
                      type="button"
                      disabled={disabled}
                      onClick={() => onAnswerQuestion(q.id, 'Não informado')}
                      className="text-xs text-slate-500 font-bold px-3 py-2 rounded-lg hover:bg-slate-200"
                    >
                      Pular por enquanto
                    </button>
                    <button
                      type="button"
                      disabled={disabled}
                      onClick={() => handleMultiSubmit(q.id)}
                      className="bg-blue-600 text-white text-xs font-bold px-4 py-2 rounded-xl shadow hover:bg-blue-700"
                    >
                      Confirmar Seleção
                    </button>
                  </div>
                </div>
              )}

              {/* TIPO: NÚMERO / MOEDA / TEXTO */}
              {(q.tipo === 'numero' || q.tipo === 'moeda' || q.tipo === 'texto') && (
                <div className="mt-3 flex flex-col sm:flex-row gap-2">
                  <input
                    type={q.tipo === 'numero' ? 'number' : 'text'}
                    placeholder={
                      q.tipo === 'moeda'
                        ? 'Ex: R$ 350.000 ou 2.500'
                        : q.tipo === 'numero'
                        ? 'Ex: 65'
                        : 'Digite a resposta...'
                    }
                    value={selectedInputs[q.id] ?? ''}
                    onChange={(e) => handleInputChange(q.id, e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleInputSubmit(q.id);
                    }}
                    className="flex-1 text-xs font-bold text-slate-900 border border-slate-300 rounded-xl px-3.5 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/30"
                  />
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={disabled}
                      onClick={() => onAnswerQuestion(q.id, 'Não informado')}
                      className="text-xs text-slate-500 font-bold px-3 py-2.5 rounded-xl hover:bg-slate-100"
                    >
                      Não informado
                    </button>
                    <button
                      type="button"
                      disabled={disabled}
                      onClick={() => handleInputSubmit(q.id)}
                      className="bg-blue-600 text-white text-xs font-bold px-5 py-2.5 min-h-[44px] rounded-xl shadow hover:bg-blue-700 active:scale-98"
                    >
                      Salvar
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
