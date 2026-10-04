'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { PublishResult, publishReview } from '@/lib/api';
import { Send, AlertTriangle, Loader2, CheckCircle2, CreditCard, ArrowLeft } from 'lucide-react';

interface ReviewPublishButtonProps {
  tokenRef: React.MutableRefObject<string>;
  referencia: string;
  onSuccess: (result: PublishResult) => void;
  disabled?: boolean;
}

export function ReviewPublishButton({
  tokenRef,
  referencia,
  onSuccess,
  disabled = false,
}: ReviewPublishButtonProps) {
  const [showModal, setShowModal] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [errorCode, setErrorCode] = useState<string | null>(null);

  // Chave de idempotência única por tentativa para prevenir cobrança duplicada
  const [idempotencyKey] = useState(() => `pub_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`);

  const handleOpenConfirm = () => {
    setErrorMessage(null);
    setErrorCode(null);
    setShowModal(true);
  };

  const handleConfirmPublish = async () => {
    const token = tokenRef.current;
    if (!token || isPublishing) return;

    setIsPublishing(true);
    setErrorMessage(null);
    setErrorCode(null);

    const res = await publishReview(token, idempotencyKey);

    setIsPublishing(false);

    if (res.success && res.result) {
      setShowModal(false);
      onSuccess(res.result);
    } else {
      setErrorMessage(res.error || 'Não foi possível publicar o anúncio. Tente novamente.');
      setErrorCode(res.code || null);
    }
  };

  return (
    <>
      {/* Botão Principal no rodapé da página */}
      <div className="sticky bottom-4 z-40 bg-white/90 backdrop-blur-md border border-slate-200 rounded-3xl p-4 shadow-xl">
        <button
          type="button"
          disabled={disabled || isPublishing}
          onClick={handleOpenConfirm}
          className="w-full min-h-[56px] py-4 px-6 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white text-base font-extrabold rounded-2xl flex items-center justify-center gap-3 shadow-lg shadow-emerald-600/30 transition-all disabled:opacity-50 disabled:pointer-events-none"
        >
          <Send className="w-5 h-5 text-emerald-100" />
          <span>Aprovar e publicar anúncio</span>
        </button>
      </div>

      {/* Modal de Confirmação */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto text-emerald-600 border border-emerald-200">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="text-center space-y-2">
              <h3 className="text-lg font-black text-slate-900">
                Confirmar Publicação
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Você está prestes a publicar este anúncio (<strong className="text-slate-900 font-bold">{referencia}</strong>). Será utilizado <strong>1 crédito</strong> do seu saldo.
              </p>
            </div>

            {/* Mensagem de Erro / Saldo */}
            {errorMessage && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-left space-y-2">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <p className="text-xs font-bold text-red-800">{errorMessage}</p>
                </div>

                {errorCode === 'SALDO_INSUFICIENTE' && (
                  <div className="pt-2">
                    <Link
                      href="/planos"
                      className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-blue-600 text-white rounded-xl text-xs font-bold shadow hover:bg-blue-700 transition-colors"
                    >
                      <CreditCard className="w-4 h-4" />
                      Recarregar Créditos Agora
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* Botões do Modal */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                disabled={isPublishing}
                onClick={() => setShowModal(false)}
                className="flex-1 min-h-[48px] py-3 px-4 border border-slate-300 text-slate-700 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-slate-50 transition-colors"
              >
                Voltar
              </button>

              <button
                type="button"
                disabled={isPublishing}
                onClick={handleConfirmPublish}
                className="flex-1 min-h-[48px] py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold uppercase tracking-wider shadow-md flex items-center justify-center gap-2 transition-all active:scale-98 disabled:opacity-50"
              >
                {isPublishing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Publicando...</span>
                  </>
                ) : (
                  <span>Aprovar e publicar</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
