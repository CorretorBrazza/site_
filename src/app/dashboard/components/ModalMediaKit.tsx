'use client';

import { useState } from 'react';
import {
  Sparkles,
  Copy,
  Check,
  MessageCircle,
  Instagram,
  FileText,
  Video,
  Tag,
  X,
} from 'lucide-react';

interface MediaKitData {
  canal_1_portais?: {
    titulo_curto?: string;
    titulo_comercial?: string;
    descricao_enxuta?: string;
    descricao_completa?: string;
    ficha_tecnica?: string;
  };
  canal_2_whatsapp?: string;
  canal_3_meta_ads?: string;
  canal_4_roteiro_canva?: Array<{
    cena?: number;
    falar?: string;
    texto_tela_canva?: string;
  }>;
  canal_5_seo_tags?: string[];
  // Campos legados
  copy_instagram?: string;
  copy_whatsapp?: string;
  copy_portal?: string;
  descricao_completa?: string;
  mensagem_whatsapp?: string;
  titulo_seo?: string;
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
  const [abaAtiva, setAbaAtiva] = useState<'whatsapp' | 'instagram' | 'canva' | 'portais' | 'seo'>('whatsapp');
  const [copiadoTipo, setCopiadoTipo] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopiar = (texto: string, tipo: string) => {
    if (!texto) return;
    navigator.clipboard.writeText(texto);
    setCopiadoTipo(tipo);
    setTimeout(() => setCopiadoTipo(null), 2500);
  };

  const copyWhatsapp =
    mediaKit?.canal_2_whatsapp ||
    mediaKit?.mensagem_whatsapp ||
    mediaKit?.copy_whatsapp ||
    `🚨 *NOVIDADE EM TABOÃO DA SERRA (${referencia})* 🚨\n\nExcelente imóvel disponível!\n📲 Fale comigo para agendar uma visita!`;

  const copyInstagram =
    mediaKit?.canal_3_meta_ads ||
    mediaKit?.copy_instagram ||
    `🔥 EXCELENTE OPORTUNIDADE EM TABOÃO DA SERRA! (${referencia})\n\nImóvel impecável pronto para morar! Ideal para sua família.\n\n📲 Entre em contato hoje mesmo para agendar uma visita!\n\n#imoveistaboao #taboaodaserra #corretordeimoveis`;

  const canal1 = mediaKit?.canal_1_portais;
  const copyPortais =
    canal1?.descricao_completa ||
    mediaKit?.descricao_completa ||
    mediaKit?.copy_portal ||
    `Imóvel referência ${referencia} em Taboão da Serra. Documentação ok.`;

  const roteiroCanva = mediaKit?.canal_4_roteiro_canva || [];
  const roteiroCanvaTexto = roteiroCanva.length > 0
    ? roteiroCanva
        .map(
          (c, i) =>
            `🎬 CENA ${c.cena || i + 1}:\n• O QUE FALAR: "${c.falar}"\n• TEXTO CANVA/TELA: "${c.texto_tela_canva}"\n`
        )
        .join('\n')
    : `🎬 ROTEIRO REELS / CANVA:\nCena 1: Mostre a entrada e diga "Conheça este incrível imóvel em Taboão da Serra!"\nCena 2: Mostre a sala e os quartos destacando o acabamento.`;

  const seoTagsList = mediaKit?.canal_5_seo_tags || ['imoveis taboao', 'taboao da serra', 'apartamento taboao', 'casa taboao'];
  const seoTagsTexto = seoTagsList.join(', ');

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl relative border border-gray-100 overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header Modal */}
        <div className="bg-slate-900 text-white p-6 relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white font-bold shadow-lg">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-black tracking-tight">Media Kit do Imóvel {referencia}</h3>
                <span className="bg-purple-950 text-purple-300 border border-purple-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">
                  5 Canais Otimizados ✨
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Texto gerado pela IA. Visualize e copie em 1 clique para colar no seu celular ou computador!
              </p>
            </div>
          </div>

          {/* Abas dos 5 Canais */}
          <div className="flex flex-wrap gap-2 mt-6 pt-2 border-t border-slate-800 text-xs font-bold">
            <button
              onClick={() => setAbaAtiva('whatsapp')}
              className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                abaAtiva === 'whatsapp' ? 'bg-emerald-600 text-white shadow-md' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
            </button>
            <button
              onClick={() => setAbaAtiva('instagram')}
              className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                abaAtiva === 'instagram' ? 'bg-pink-600 text-white shadow-md' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <Instagram className="w-3.5 h-3.5" /> Meta Ads (Insta)
            </button>
            <button
              onClick={() => setAbaAtiva('canva')}
              className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                abaAtiva === 'canva' ? 'bg-purple-600 text-white shadow-md' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <Video className="w-3.5 h-3.5" /> Roteiro Canva
            </button>
            <button
              onClick={() => setAbaAtiva('portais')}
              className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                abaAtiva === 'portais' ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <FileText className="w-3.5 h-3.5" /> Site / Portais
            </button>
            <button
              onClick={() => setAbaAtiva('seo')}
              className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                abaAtiva === 'seo' ? 'bg-amber-600 text-white shadow-md' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <Tag className="w-3.5 h-3.5" /> Tags SEO
            </button>
          </div>
        </div>

        {/* Notificação de Cópia */}
        {copiadoTipo && (
          <div className="bg-emerald-600 text-white px-6 py-2.5 text-xs font-bold flex items-center justify-between shadow-md">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4" />
              <span>Texto copiado com sucesso! Agora é só colar no {copiadoTipo}.</span>
            </div>
          </div>
        )}

        {/* Corpo do Conteúdo por Aba */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {/* ABA 1: WHATSAPP */}
          {abaAtiva === 'whatsapp' && (
            <div className="bg-emerald-50/60 border border-emerald-200 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="font-bold text-emerald-950 text-sm flex items-center gap-2">
                    <MessageCircle className="w-4 h-4 text-emerald-600" /> Canal 2: WhatsApp (Corretor Forward)
                  </h4>
                  <p className="text-[11px] text-emerald-700">Com negrito nativo (*asteriscos*) e contato do corretor.</p>
                </div>
                <button
                  onClick={() => handleCopiar(copyWhatsapp, 'WhatsApp')}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-md transition-all flex items-center gap-1.5"
                >
                  {copiadoTipo === 'WhatsApp' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copiadoTipo === 'WhatsApp' ? 'Copiado!' : 'Copiar Texto WhatsApp'}
                </button>
              </div>
              <div className="bg-white p-4 rounded-xl border border-emerald-100 text-xs text-slate-800 font-mono whitespace-pre-wrap leading-relaxed max-h-80 overflow-y-auto">
                {copyWhatsapp}
              </div>
            </div>
          )}

          {/* ABA 2: META ADS (INSTAGRAM) */}
          {abaAtiva === 'instagram' && (
            <div className="bg-pink-50/60 border border-pink-200 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="font-bold text-pink-950 text-sm flex items-center gap-2">
                    <Instagram className="w-4 h-4 text-pink-600" /> Canal 3: Meta Ads (Instagram & Facebook)
                  </h4>
                  <p className="text-[11px] text-pink-700">Legenda persuasiva com HOOK de parada de scroll e hashtags.</p>
                </div>
                <button
                  onClick={() => handleCopiar(copyInstagram, 'Instagram')}
                  className="bg-pink-600 hover:bg-pink-700 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-md transition-all flex items-center gap-1.5"
                >
                  {copiadoTipo === 'Instagram' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copiadoTipo === 'Instagram' ? 'Copiado!' : 'Copiar Legenda Instagram'}
                </button>
              </div>
              <div className="bg-white p-4 rounded-xl border border-pink-100 text-xs text-slate-800 font-sans whitespace-pre-wrap leading-relaxed max-h-80 overflow-y-auto">
                {copyInstagram}
              </div>
            </div>
          )}

          {/* ABA 3: ROTEIRO CANVA / REELS */}
          {abaAtiva === 'canva' && (
            <div className="bg-purple-50/60 border border-purple-200 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="font-bold text-purple-950 text-sm flex items-center gap-2">
                    <Video className="w-4 h-4 text-purple-600" /> Canal 4: Roteiro para Vídeo (Reels/TikTok) & Canva
                  </h4>
                  <p className="text-[11px] text-purple-700">Com o que falar na gravação e frases curtas para colar nos templates do Canva.</p>
                </div>
                <button
                  onClick={() => handleCopiar(roteiroCanvaTexto, 'Roteiro Canva')}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-md transition-all flex items-center gap-1.5"
                >
                  {copiadoTipo === 'Roteiro Canva' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copiadoTipo === 'Roteiro Canva' ? 'Copiado!' : 'Copiar Roteiro Canva'}
                </button>
              </div>
              <div className="bg-white p-4 rounded-xl border border-purple-100 text-xs text-slate-800 font-sans whitespace-pre-wrap leading-relaxed max-h-80 overflow-y-auto">
                {roteiroCanvaTexto}
              </div>
            </div>
          )}

          {/* ABA 4: SITE / PORTAIS */}
          {abaAtiva === 'portais' && (
            <div className="bg-blue-50/60 border border-blue-200 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-blue-950 text-sm flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-600" /> Canal 1: Descrição Completa para Portais & Site
                  </h4>
                  <p className="text-[11px] text-blue-700">Títulos otimizados e descrição fluida sem clichês.</p>
                </div>
                <button
                  onClick={() => handleCopiar(copyPortais, 'Descrição')}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-md transition-all flex items-center gap-1.5"
                >
                  {copiadoTipo === 'Descrição' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copiadoTipo === 'Descrição' ? 'Copiado!' : 'Copiar Descrição'}
                </button>
              </div>

              {canal1?.titulo_curto && (
                <div className="bg-white p-3 rounded-xl border border-blue-100 text-xs">
                  <span className="font-bold text-blue-900 block mb-1">TÍTULO CURTO (OLX / Mercado Livre):</span>
                  <span className="text-slate-800 font-mono">{canal1.titulo_curto}</span>
                </div>
              )}

              {canal1?.titulo_comercial && (
                <div className="bg-white p-3 rounded-xl border border-blue-100 text-xs">
                  <span className="font-bold text-blue-900 block mb-1">TÍTULO COMERCIAL (ZAP Imóveis / VivaReal):</span>
                  <span className="text-slate-800 font-mono">{canal1.titulo_comercial}</span>
                </div>
              )}

              <div className="bg-white p-4 rounded-xl border border-blue-100 text-xs text-slate-800 whitespace-pre-wrap leading-relaxed max-h-60 overflow-y-auto">
                {copyPortais}
              </div>
            </div>
          )}

          {/* ABA 5: TAGS DE SEO */}
          {abaAtiva === 'seo' && (
            <div className="bg-amber-50/60 border border-amber-200 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="font-bold text-amber-950 text-sm flex items-center gap-2">
                    <Tag className="w-4 h-4 text-amber-600" /> Canal 5: Tags de SEO & Palavras-Chave
                  </h4>
                  <p className="text-[11px] text-amber-700">Palavras-chave otimizadas para o Google e buscadores dos portais.</p>
                </div>
                <button
                  onClick={() => handleCopiar(seoTagsTexto, 'Tags SEO')}
                  className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-md transition-all flex items-center gap-1.5"
                >
                  {copiadoTipo === 'Tags SEO' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copiadoTipo === 'Tags SEO' ? 'Copiado!' : 'Copiar Tags SEO'}
                </button>
              </div>
              <div className="bg-white p-4 rounded-xl border border-amber-100 text-xs text-slate-800 font-mono whitespace-pre-wrap">
                {seoTagsTexto}
              </div>
            </div>
          )}
        </div>

        {/* Footer Modal */}
        <div className="p-4 bg-slate-50 border-t border-gray-100 flex justify-end shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl transition-all shadow-xs"
          >
            Fechar Media Kit
          </button>
        </div>
      </div>
    </div>
  );
}
