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
    fotos: { id: string; r2_key?: string | null; storage?: 'R2' | 'LEGACY_SOURCE'; display_url?: string; download_url: string }[];
  } | null>(null);
  const [textoAnotacao, setTextoAnotacao] = useState('');
  const [erroAcervo, setErroAcervo] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen || !adId) return;

    setLoading(true);
    setErroAcervo(null);
    fetchBrokerApi(`/storage/acervo/${encodeURIComponent(adId)}`)
      .then((json) => {
        if (json.success && json.data) {
          setDadosAcervo(json.data);
          setTextoAnotacao(json.data.anotacoes_privadas || '');
        } else {
          setErroAcervo(json.error || json.message || null);
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
        alert(json.error || json.message || 'Erro ao salvar anotação.');
      }
    } catch {
      alert('Erro de conexão ao salvar anotação.');
    } finally {
      setSalvandoNota(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90dvh] overflow-y-auto p-4 sm:p-6 shadow-2xl relative border border-line animate-in fade-in zoom-in duration-200 my-auto">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 p-2 text-muted hover:text-ink rounded-full hover:bg-paper transition-all z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Header */}
        <div className="flex items-center gap-3 mb-4 sm:mb-6 pb-4 border-b border-line pr-10">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-brand-900/5 text-brand-800 flex items-center justify-center font-bold shrink-0">
            <HardDrive className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-lg sm:text-xl font-black text-brand-900">Acervo do Imóvel {referencia}</h3>
              <span className="bg-success/10 text-success text-[10px] font-bold px-2 py-0.5 rounded-full hidden sm:inline">
                Nuvem Imóveis Taboão ☁️
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-muted mt-0.5">
              {dadosAcervo?.titulo || 'Gerencie suas fotos em alta resolução e anotações'}
            </p>
          </div>
        </div>

        {loading ? (
          <div className="py-20 text-center text-muted font-medium">
            Carregando acervo de fotos em alta resolução...
          </div>
        ) : dadosAcervo ? (
          <div className="space-y-6">
            {/* Banner Espaço Salvo */}
            <div className="bg-brand-900/5 border border-brand-700/30 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <ImageIcon className="w-5 h-5 text-brand-800" />
                <div>
                  <span className="text-xs font-bold text-brand-800 block">
                    {dadosAcervo.fotos_no_r2} de {dadosAcervo.total_fotos} fotos com backup confirmado no Cloudflare R2
                  </span>
                  <span className="text-[11px] text-brand-800">
                    Você economizou aproximadamente <strong>{dadosAcervo.espaco_salvo_mb}</strong> de espaço no celular!
                  </span>
                </div>
              </div>

              {/* O ZIP exige fotos com r2_key (storage.controller.ts:166-169).
                  Anúncios legados só têm URLs no fallback e devolvem 404. */}
              {dadosAcervo.fotos.some((foto) => foto.r2_key) && (
                <a
                  href={`/api/v1/storage/acervo/${encodeURIComponent(adId)}/download`}
                  download
                  className="bg-brand-900 hover:bg-brand-800 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-xs transition-all w-full sm:w-auto justify-center flex items-center gap-1.5"
                >
                  <Download className="w-4 h-4" /> Baixar Fotos em ZIP
                </a>
              )}
            </div>

            {/* Galeria de Fotos */}
            <div>
              <h4 className="text-sm font-bold text-brand-900 mb-3 flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-ink" /> Fotos em Alta Resolução
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {dadosAcervo.fotos.map((foto, idx) => (
                  <div key={foto.id} className="group relative rounded-xl overflow-hidden border border-line bg-paper">
                    <img
                      src={foto.display_url || foto.download_url}
                      alt={`Foto ${idx + 1}`}
                      loading="lazy"
                      className="w-full h-32 object-cover transition-transform group-hover:scale-105"
                    />
                    <span className={`absolute top-1.5 left-1.5 rounded px-1.5 py-0.5 text-[9px] font-bold ${foto.storage === 'R2' ? 'bg-success text-white' : 'bg-gold text-gold'}`}>
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
            <div className="bg-paper border border-line rounded-xl p-4">
              <label className="block text-sm font-bold text-brand-900 mb-1 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-brand-800" />
                Anotações Privadas do Imóvel (Uso Exclusivo do Corretor)
              </label>
              <p className="text-xs text-muted mb-2">
                Guarde informações internas como localização das chaves, horários de visita ou condições do proprietário.
              </p>
              <textarea
                value={textoAnotacao}
                onChange={(e) => setTextoAnotacao(e.target.value)}
                placeholder="Exemplo: Chave 42 na portaria com o zelador Sr. Carlos. Proprietário aceita permuta até R$ 200 mil..."
                rows={4}
                className="w-full p-3 bg-white border border-line rounded-xl text-sm text-brand-900 focus:ring-2 focus:ring-brand-700 focus:border-transparent"
              />
              <div className="flex justify-end mt-2">
                <button
                  type="button"
                  onClick={handleSalvarAnotacao}
                  disabled={salvandoNota}
                  className="bg-brand-900 hover:bg-black text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 disabled:opacity-50"
                >
                  <Save className="w-3.5 h-3.5" />
                  {salvandoNota ? 'Salvando...' : 'Salvar Anotações'}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="py-12 text-center text-muted">
            {erroAcervo || 'Não foi possível carregar o acervo deste imóvel.'}
          </div>
        )}
      </div>
    </div>
  );
}
