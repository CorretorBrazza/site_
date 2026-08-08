'use client';

import { useState } from 'react';
import { Sparkles, Copy, Check, Share2, MessageCircle, Instagram, FileText, X } from 'lucide-react';

interface MediaKitData {
  titulo?: string;
  copy_instagram?: string;
  copy_whatsapp?: string;
  copy_portal?: string;
  pontos_fortes?: string[];
}

interface ModalMediaKitProps {
  isOpen: boolean;
  onClose: () => void;
  referencia: string;
  mediaKit: MediaKitData | null;
}

export default function ModalMediaKit({
  isOpen,
  onClose,
  referencia,
  mediaKit,
}: ModalMediaKitProps) {
  const [copiadoTipo, setCopiadoTipo] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopiar = (texto: string, tipo: string) => {
    if (!texto) return;
    navigator.clipboard.writeText(texto);
    setCopiadoTipo(tipo);
    setTimeout(() => setCopiadoTipo(null), 2500);
  };

  const copyInstagram = mediaKit?.copy_instagram || 
    `🔥 EXCELENTE OPORTUNIDADE EM TABOÃO DA SERRA! (${referencia})\n\nApartamento impecável pronto para morar! Ideal para sua família.\n\n📲 Entre em contato hoje mesmo para agendar uma visita!\n\n#imoveistaboao #taboaodaserra #corretordeimoveis #imovelavenda`;

  const copyWhatsapp = mediaKit?.copy_whatsapp || 
    `🚨 *NOVIDADE DE HOJE (${referencia})* 🚨\n\nExcelente imóvel em Taboão da Serra!\n- Pronto para morar\n- Ótima localização\n\nFale comigo para mais detalhes e agendamento de visita!`;

  const copyPortal = mediaKit?.copy_portal || mediaKit?.titulo || `Imóvel referência ${referencia} em Taboão da Serra.`;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl relative border border-gray-100 animate-in fade-in zoom-in duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-all z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Header */}
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
          <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-black text-gray-900">Media Kit do Imóvel {referencia}</h3>
              <span className="bg-purple-100 text-purple-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                IA Gerada ✨
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              Copie os textos otimizados em 1 clique para postar no Instagram e WhatsApp
            </p>
          </div>
        </div>

        {/* Mensagem de Feedback de Cópia */}
        {copiadoTipo && (
          <div className="mb-4 bg-green-600 text-white px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-md animate-in slide-in-from-top-2 duration-200">
            <Check className="w-4 h-4" />
            Copiado com sucesso para a área de transferência! Agora é só colar no {copiadoTipo}.
          </div>
        )}

        <div className="space-y-6">
          {/* Card 1: Copy para WhatsApp */}
          <div className="bg-emerald-50/50 border border-emerald-200 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-emerald-600 fill-emerald-100" />
                <span className="text-sm font-bold text-emerald-950">Texto Direto para WhatsApp & Grupos</span>
              </div>
              <button
                type="button"
                onClick={() => handleCopiar(copyWhatsapp, 'WhatsApp')}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-1.5 rounded-lg text-xs font-bold shadow-xs transition-all flex items-center gap-1.5"
              >
                {copiadoTipo === 'WhatsApp' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copiadoTipo === 'WhatsApp' ? 'Copiado!' : 'Copiar Texto WhatsApp'}
              </button>
            </div>
            <div className="bg-white p-3 rounded-lg border border-emerald-100 text-xs text-gray-800 font-mono whitespace-pre-wrap">
              {copyWhatsapp}
            </div>
          </div>

          {/* Card 2: Copy para Instagram */}
          <div className="bg-pink-50/50 border border-pink-200 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Instagram className="w-4 h-4 text-pink-600" />
                <span className="text-sm font-bold text-pink-950">Legenda Persuasiva para Instagram / Feed</span>
              </div>
              <button
                type="button"
                onClick={() => handleCopiar(copyInstagram, 'Instagram')}
                className="bg-pink-600 hover:bg-pink-700 text-white px-3.5 py-1.5 rounded-lg text-xs font-bold shadow-xs transition-all flex items-center gap-1.5"
              >
                {copiadoTipo === 'Instagram' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copiadoTipo === 'Instagram' ? 'Copiado!' : 'Copiar Legenda Instagram'}
              </button>
            </div>
            <div className="bg-white p-3 rounded-lg border border-pink-100 text-xs text-gray-800 font-sans whitespace-pre-wrap max-h-48 overflow-y-auto">
              {copyInstagram}
            </div>
          </div>

          {/* Card 3: Descrição Oficial do Anúncio */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-bold text-gray-900">Descrição Completa do Anúncio</span>
              </div>
              <button
                type="button"
                onClick={() => handleCopiar(copyPortal, 'Descrição')}
                className="bg-gray-800 hover:bg-gray-900 text-white px-3.5 py-1.5 rounded-lg text-xs font-bold shadow-xs transition-all flex items-center gap-1.5"
              >
                {copiadoTipo === 'Descrição' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copiadoTipo === 'Descrição' ? 'Copiado!' : 'Copiar Descrição'}
              </button>
            </div>
            <div className="bg-white p-3 rounded-lg border border-gray-200 text-xs text-gray-800 whitespace-pre-wrap max-h-36 overflow-y-auto">
              {copyPortal}
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-gray-100 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 text-sm font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all"
          >
            Fechar Media Kit
          </button>
        </div>
      </div>
    </div>
  );
}
