'use client';

import { useState } from 'react';
import { Trash2, CheckCircle2, AlertTriangle, X } from 'lucide-react';

interface ModalExclusaoInteligenteProps {
  isOpen: boolean;
  onClose: () => void;
  adId: string;
  referencia: string;
  userEmail: string;
  onSuccess: () => void;
}

export default function ModalExclusaoInteligente({
  isOpen,
  onClose,
  adId,
  referencia,
  userEmail,
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
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://imoveis-taboao-api-production-4cd9.up.railway.app';
      const res = await fetch(`${apiUrl}/api/v1/anuncios/${adId}/excluir`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: userEmail,
          motivo,
          foi_pelo_portal: foiPeloPortal,
          deletar_fotos_r2: deletarFotosR2,
        }),
      });

      const json = await res.json();

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
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative border border-gray-100 animate-in fade-in zoom-in duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold">
            <Trash2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Remover Imóvel {referencia}</h3>
            <p className="text-xs text-gray-500">Responda a pesquisa rápida para concluir</p>
          </div>
        </div>

        <div className="space-y-4 text-sm text-gray-700">
          {/* Pergunta 1 */}
          <div>
            <label className="block font-bold text-gray-900 mb-1.5">
              1. Por que está desativando este imóvel?
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setMotivo('vendido')}
                className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                  motivo === 'vendido'
                    ? 'bg-green-600 text-white border-green-600 shadow-sm'
                    : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                }`}
              >
                🎉 Vendido
              </button>
              <button
                type="button"
                onClick={() => setMotivo('alugado')}
                className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                  motivo === 'alugado'
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                    : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                }`}
              >
                🏠 Alugado
              </button>
              <button
                type="button"
                onClick={() => setMotivo('desativado')}
                className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                  motivo === 'desativado'
                    ? 'bg-gray-800 text-white border-gray-800 shadow-sm'
                    : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                }`}
              >
                ⏸️ Desistiu
              </button>
            </div>
          </div>

          {/* Pergunta 2 */}
          {(motivo === 'vendido' || motivo === 'alugado') && (
            <div>
              <label className="block font-bold text-gray-900 mb-1.5">
                2. Foi negociado através do Imóveis Taboão?
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setFoiPeloPortal(true)}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                    foiPeloPortal
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-gray-50 text-gray-700 border-gray-200'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5 inline mr-1" /> Sim, pelo portal!
                </button>
                <button
                  type="button"
                  onClick={() => setFoiPeloPortal(false)}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                    !foiPeloPortal
                      ? 'bg-gray-700 text-white border-gray-700'
                      : 'bg-gray-50 text-gray-700 border-gray-200'
                  }`}
                >
                  Outro canal
                </button>
              </div>
            </div>
          )}

          {/* Pergunta 3: Limpeza R2 */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs">
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={deletarFotosR2}
                onChange={(e) => setDeletarFotosR2(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <div>
                <span className="font-bold text-amber-900 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                  Excluir fotos do seu Acervo de Backup?
                </span>
                <p className="text-amber-800 mt-0.5">
                  Marcação recomendada para liberar espaço no seu acervo de fotos da nuvem.
                </p>
              </div>
            </label>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold text-gray-600 hover:text-gray-800"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleExcluir}
            disabled={loading}
            className="px-5 py-2.5 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-md disabled:opacity-50 transition-all flex items-center gap-2"
          >
            {loading ? 'Processando...' : 'Confirmar Exclusão'}
          </button>
        </div>
      </div>
    </div>
  );
}
