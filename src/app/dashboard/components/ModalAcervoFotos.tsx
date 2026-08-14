'use client';

import { useState, useEffect } from 'react';
import { Download, Save, HardDrive, FileText, X, Image as ImageIcon } from 'lucide-react';

interface ModalAcervoFotosProps {
  isOpen: boolean;
  onClose: () => void;
  adId: string;
  referencia: string;
}

import { fetchBrokerApi } from '@/lib/api';

export default function ModalAcervoFotos({
  isOpen,
  onClose,
  adId,
  referencia,
}: ModalAcervoFotosProps) {
  const [loading, setLoading] = useState(true);
  const [salvandoNota, setSalvandoNota] = useState(false);
  const [dadosAcervo, setDadosAcervo] = useState<{
    titulo: string;
    anotacoes_privadas: string;
    total_fotos: number;
    fotos_no_r2: number;
    espaco_salvo_mb: string;
    fotos: { id: string; r2_key?: string | null; storage?: 'R2' | 'LEGACY_SOURCE'; download_url: string }[];
  } | null>(null);
  const [textoAnotacao, setTextoAnotacao] = useState('');

  useEffect(() => {
    if (!isOpen || !adId) return;

    setLoading(true);
    fetchBrokerApi(`/storage/acervo/${encodeURIComponent(adId)}`)
      .then((json) => {
        if (json.success && json.data) {
          setDadosAcervo(json.data);
          setTextoAnotacao(json.data.anotacoes_privadas || '');
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [isOpen, adId]);

  if (!isOpen) return null;

  const handleSalvarAnotacao = async () => {
    setSalvandoNota(true);
    try {
      const json = await fetchBrokerApi('/storage/anotacao', {
        method: 'POST',
        body: JSON.stringify({
          ad_id: adId,
          anotacao: textoAnotacao,
        }),
      });
      if (json.success) {
        alert('Anotações salvas no seu acervo!');
      } else {
        alert(json.message || 'Erro ao salvar anotação.');
      }
    } catch {
      alert('Erro de conexão ao salvar anotação.');
    } finally {
      setSalvandoNota(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl relative border border-gray-100 animate-in fade-in zoom-in duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-all z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Header */}
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
          <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
            <HardDrive className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-black text-gray-900">Acervo do Imóvel {referencia}</h3>
              <span className="bg-green-100 text-green-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                Nuvem Imóveis Taboão ☁️
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              {dadosAcervo?.titulo || 'Gerencie suas fotos em alta resolução e anotações'}
            </p>
          </div>
        </div>

        {loading ? (
          <div className="py-20 text-center text-gray-500 font-medium">
            Carregando acervo de fotos em alta resolução...
          </div>
        ) : dadosAcervo ? (
          <div className="space-y-6">
            {/* Banner Espaço Salvo */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ImageIcon className="w-5 h-5 text-blue-600" />
                <div>
                  <span className="text-xs font-bold text-blue-900 block">
                    {dadosAcervo.fotos_no_r2} de {dadosAcervo.total_fotos} fotos com backup confirmado no Cloudflare R2
                  </span>
                  <span className="text-[11px] text-blue-700">
                    Você economizou aproximadamente <strong>{dadosAcervo.espaco_salvo_mb}</strong> de espaço no celular!
                  </span>
                </div>
              </div>

              {dadosAcervo.fotos.length > 0 && (
                <a
                  href={dadosAcervo.fotos[0].download_url}
                  download
                  target="_blank"
                  rel="noreferrer"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-xs transition-all flex items-center gap-1.5"
                >
                  <Download className="w-4 h-4" /> Baixar Fotos
                </a>
              )}
            </div>

            {/* Galeria de Fotos */}
            <div>
              <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-gray-600" /> Fotos em Alta Resolução
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {dadosAcervo.fotos.map((foto, idx) => (
                  <div key={foto.id} className="group relative rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
                    <img
                      src={foto.download_url}
                      alt={`Foto ${idx + 1}`}
                      className="w-full h-32 object-cover transition-transform group-hover:scale-105"
                    />
                    <span className={`absolute top-1.5 left-1.5 rounded px-1.5 py-0.5 text-[9px] font-bold ${foto.storage === 'R2' ? 'bg-emerald-600 text-white' : 'bg-amber-500 text-amber-950'}`}>
                      {foto.storage === 'R2' ? 'BACKUP R2' : 'LEGADO'}
                    </span>
                    <a
                      href={foto.download_url}
                      download
                      target="_blank"
                      rel="noreferrer"
                      className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-1"
                    >
                      <Download className="w-4 h-4" /> Baixar Alta
                    </a>
                  </div>
                ))}
              </div>
            </div>

            {/* Bloco de Notas Simples do Imóvel (Para público 50+) */}
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
              <label className="block text-sm font-bold text-gray-900 mb-1 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-blue-600" />
                Anotações Privadas do Imóvel (Uso Exclusivo do Corretor)
              </label>
              <p className="text-xs text-gray-500 mb-2">
                Guarde informações internas como localização das chaves, horários de visita ou condições do proprietário.
              </p>
              <textarea
                value={textoAnotacao}
                onChange={(e) => setTextoAnotacao(e.target.value)}
                placeholder="Exemplo: Chave 42 na portaria com o zelador Sr. Carlos. Proprietário aceita permuta até R$ 200 mil..."
                rows={4}
                className="w-full p-3 bg-white border border-gray-300 rounded-xl text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <div className="flex justify-end mt-2">
                <button
                  type="button"
                  onClick={handleSalvarAnotacao}
                  disabled={salvandoNota}
                  className="bg-gray-900 hover:bg-black text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 disabled:opacity-50"
                >
                  <Save className="w-3.5 h-3.5" />
                  {salvandoNota ? 'Salvando...' : 'Salvar Anotações'}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="py-12 text-center text-gray-500">
            Não foi possível carregar o acervo deste imóvel.
          </div>
        )}
      </div>
    </div>
  );
}
