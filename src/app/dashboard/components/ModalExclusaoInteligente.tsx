'use client';

import { useState } from 'react';
import { Trash2, CheckCircle2, AlertTriangle, X } from 'lucide-react';

interface ModalExclusaoInteligenteProps {
  isOpen: boolean;
  onClose: () => void;
  adId: string;
  referencia: string;
  onSuccess: () => void;
}

import { fetchBrokerApi } from '@/lib/api';

export default function ModalExclusaoInteligente({
  isOpen,
  onClose,
  adId,
  referencia,
  onSuccess,
}: ModalExclusaoInteligenteProps) {
  const [motivo, setMotivo] = useState<'vendido' | 'alugado' | 'desativado'>('vendido');
  const [foiPeloPortal, setFoiPeloPortal] = useState<boolean>(true);
  const [deletarFotosR2, setDeletarFotosR2] = useState<boolean>(true);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleExcluir = async () => {
    setLoading(true);
    try {
      const json = await fetchBrokerApi(`/anuncios/${encodeURIComponent(adId)}/excluir`, {
        method: 'POST',
        body: JSON.stringify({
          motivo,
          foi_pelo_portal: foiPeloPortal,
          deletar_fotos_r2: deletarFotosR2,
        }),
      });

      if (json.success) {
        alert(json.message || 'Imóvel removido com sucesso!');
        onSuccess();
        onClose();
      } else {
        alert(json.message || 'Erro ao excluir o imóvel.');
      }
    } catch {
      alert('Erro de conexão ao excluir o imóvel.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-md w-full p-4 sm:p-6 max-h-[92dvh] overflow-y-auto shadow-2xl relative border border-line animate-in fade-in zoom-in duration-200 my-auto">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 p-2 text-muted hover:text-ink rounded-full hover:bg-paper transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-danger/10 text-danger flex items-center justify-center font-bold">
            <Trash2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-brand-900">Remover Imóvel {referencia}</h3>
            <p className="text-xs text-muted">Responda a pesquisa rápida para concluir</p>
          </div>
        </div>

        <div className="space-y-4 text-sm text-ink">
          {/* Pergunta 1 */}
          <div>
            <label className="block font-bold text-brand-900 mb-1.5">
              1. Por que está desativando este imóvel?
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setMotivo('vendido')}
                className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                  motivo === 'vendido'
                    ? 'bg-success text-white border-success/50 shadow-sm'
                    : 'bg-paper text-ink border-line hover:bg-paper'
                }`}
              >
                🎉 Vendido
              </button>
              <button
                type="button"
                onClick={() => setMotivo('alugado')}
                className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                  motivo === 'alugado'
                    ? 'bg-brand-900 text-white border-brand-700 shadow-sm'
                    : 'bg-paper text-ink border-line hover:bg-paper'
                }`}
              >
                🏠 Alugado
              </button>
              <button
                type="button"
                onClick={() => setMotivo('desativado')}
                className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                  motivo === 'desativado'
                    ? 'bg-brand-800 text-white border-brand-700 shadow-sm'
                    : 'bg-paper text-ink border-line hover:bg-paper'
                }`}
              >
                ⏸️ Desistiu
              </button>
            </div>
          </div>

          {/* Pergunta 2 */}
          {(motivo === 'vendido' || motivo === 'alugado') && (
            <div>
              <label className="block font-bold text-brand-900 mb-1.5">
                2. Foi negociado através do Imóveis Taboão?
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setFoiPeloPortal(true)}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                    foiPeloPortal
                      ? 'bg-brand-900 text-white border-brand-700'
                      : 'bg-paper text-ink border-line'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5 inline mr-1" /> Sim, pelo portal!
                </button>
                <button
                  type="button"
                  onClick={() => setFoiPeloPortal(false)}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                    !foiPeloPortal
                      ? 'bg-brand-800 text-white border-brand-700'
                      : 'bg-paper text-ink border-line'
                  }`}
                >
                  Outro canal
                </button>
              </div>
            </div>
          )}

          {/* Pergunta 3: Limpeza R2 */}
          <div className="bg-gold/10 border border-gold/30 rounded-xl p-3 text-xs">
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={deletarFotosR2}
                onChange={(e) => setDeletarFotosR2(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded text-brand-800 border-line focus:ring-brand-700"
              />
              <div>
                <span className="font-bold text-gold flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-gold" />
                  Excluir permanentemente as fotos na nuvem?
                </span>
                <p className="text-gold mt-0.5">
                  Esta opção remove as cópias de backup do Cloudflare R2 e as imagens de vitrine gerenciadas pelo sistema. A exclusão só é concluída após confirmação da nuvem.
                </p>
              </div>
            </label>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-line">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold text-ink hover:text-ink"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleExcluir}
            disabled={loading}
            className="px-5 py-2.5 text-sm font-bold text-white bg-danger hover:bg-danger rounded-xl shadow-md disabled:opacity-50 transition-all flex items-center gap-2"
          >
            {loading ? 'Processando...' : 'Confirmar Exclusão'}
          </button>
        </div>
      </div>
    </div>
  );
}
