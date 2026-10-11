'use client';

import React, { useState } from 'react';
import {
  Copy,
  Check,
  Sparkles,
  MessageCircle,
  Instagram,
  Video,
  Globe,
  Tag,
  FileText,
} from 'lucide-react';

interface CenaCanva {
  cena?: number;
  falar?: string;
  texto_tela_canva?: string;
}

interface MediaKitProps {
  mediaKit: {
    canal_1_portais?: {
      titulo_curto?: string;
      titulo_comercial?: string;
      descricao_enxuta?: string;
      descricao_completa?: string;
      ficha_tecnica?: string;
    };
    canal_2_whatsapp?: string;
    canal_3_meta_ads?: string;
    canal_4_roteiro_canva?: CenaCanva[];
    canal_5_seo_tags?: string[];
    // Legados
    descricao_completa?: string;
    descricao_media?: string;
    legenda_social?: string;
    descricao_mda_social?: string;
    mensagem_whatsapp?: string;
    titulo_seo?: string;
    hashtags?: string[] | string;
    pontos_fortes?: string[];
  };
  referencia: string;
}

export default function MediaKitDisplay({ mediaKit, referencia }: MediaKitProps) {
  const [abaAtiva, setAbaAtiva] = useState<'whatsapp' | 'instagram' | 'canva' | 'portais' | 'seo'>('whatsapp');
  const [copiadoSecao, setCopiadoSecao] = useState<string | null>(null);

  const copyToClipboard = (text: string, secao: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiadoSecao(secao);
    setTimeout(() => setCopiadoSecao(null), 2500);
  };

  // Mapeamentos com fallbacks inteligentes
  const copyWhatsapp =
    mediaKit?.canal_2_whatsapp ||
    mediaKit?.mensagem_whatsapp ||
    `⏳ O texto do WhatsApp para o imóvel ${referencia} está sendo preparado.`;

  const copyInstagram =
    mediaKit?.canal_3_meta_ads ||
    mediaKit?.legenda_social ||
    mediaKit?.descricao_mda_social ||
    `⏳ A copy do Meta Ads / Instagram para o imóvel ${referencia} está sendo preparada.`;

  const canal1 = mediaKit?.canal_1_portais;
  const copyPortais =
    canal1?.descricao_completa ||
    mediaKit?.descricao_completa ||
    canal1?.descricao_enxuta ||
    mediaKit?.descricao_media ||
    `⏳ A descrição para portais do imóvel ${referencia} está sendo preparada.`;

  const roteiroCanva = mediaKit?.canal_4_roteiro_canva || [];
  const roteiroTexto = roteiroCanva.length > 0
    ? roteiroCanva
        .map((c, i) => {
          const num = c.cena || i + 1;
          const fala = c.falar || 'Apresentação do imóvel';
          const tela = c.texto_tela_canva || '';
          return `🎬 CENA ${num}:\n• O QUE FALAR: "${fala}"\n• TEXTO NA TELA / CANVA: "${tela}"\n`;
        })
        .join('\n')
    : `⏳ O roteiro para Canva / Reels do imóvel ${referencia} está sendo preparado.`;

  const tagsSeo = mediaKit?.canal_5_seo_tags || (Array.isArray(mediaKit?.hashtags) ? mediaKit.hashtags : []);
  const tagsTexto = tagsSeo.length > 0 ? tagsSeo.join(', ') : `${referencia.toLowerCase()}, imoveis taboao, taboao da serra`;

  return (
    <div className="space-y-6">
      {/* Banner de Apresentação Premium */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 rounded-3xl p-6 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
            <span className="text-xs uppercase tracking-wider font-extrabold bg-white/20 px-3 py-1 rounded-full">
              Media Kit Comercial de Alta Conversão • REF: {referencia}
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black">5 Canais Prontos para Publicação</h3>
          <p className="text-xs text-blue-100 mt-1 max-w-xl">
            Textos calibrados exclusivamente com os fatos confirmados do imóvel. Sem clichês genéricos e prontos para atrair compradores reais.
          </p>
        </div>
      </div>

      {/* Navegação entre os 5 Canais */}
      <div className="flex gap-2 border-b border-slate-200 pb-2 overflow-x-auto no-scrollbar">
        <button
          type="button"
          onClick={() => setAbaAtiva('whatsapp')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all shrink-0 ${
            abaAtiva === 'whatsapp'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <MessageCircle className="w-4 h-4" />
          <span>Canal 2: WhatsApp</span>
        </button>

        <button
          type="button"
          onClick={() => setAbaAtiva('instagram')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all shrink-0 ${
            abaAtiva === 'instagram'
              ? 'bg-pink-600 text-white shadow-md'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Instagram className="w-4 h-4" />
          <span>Canal 3: Meta Ads (Insta/Face)</span>
        </button>

        <button
          type="button"
          onClick={() => setAbaAtiva('canva')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all shrink-0 ${
            abaAtiva === 'canva'
              ? 'bg-purple-600 text-white shadow-md'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Video className="w-4 h-4" />
          <span>Canal 4: Roteiro Vídeo / Canva</span>
        </button>

        <button
          type="button"
          onClick={() => setAbaAtiva('portais')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all shrink-0 ${
            abaAtiva === 'portais'
               ? 'bg-blue-600 text-white shadow-md'
               : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Globe className="w-4 h-4" />
          <span>Canal 1: Portais & Site</span>
        </button>

        <button
          type="button"
          onClick={() => setAbaAtiva('seo')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all shrink-0 ${
            abaAtiva === 'seo'
              ? 'bg-amber-600 text-white shadow-md'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Tag className="w-4 h-4" />
          <span>Canal 5: SEO Tags</span>
        </button>
      </div>

      {/* ABA 1: WHATSAPP */}
      {abaAtiva === 'whatsapp' && (
        <div className="bg-emerald-50/60 border border-emerald-200 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h4 className="font-extrabold text-emerald-950 text-base flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-emerald-600" />
                <span>Texto Pronto para Disparo no WhatsApp</span>
              </h4>
              <p className="text-xs text-emerald-700 mt-0.5">
                Com formatação nativa de negrito (*asteriscos*), bullets escaneáveis e chamada direta.
              </p>
            </div>
            <button
              type="button"
              onClick={() => copyToClipboard(copyWhatsapp, 'whatsapp')}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow-md transition-all flex items-center gap-2 w-full sm:w-auto justify-center"
            >
              {copiadoSecao === 'whatsapp' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copiadoSecao === 'whatsapp' ? 'Copiado para a área de transferência!' : 'Copiar Texto WhatsApp'}</span>
            </button>
          </div>
          <div className="bg-white border border-emerald-100 rounded-2xl p-5 text-xs text-slate-800 font-mono whitespace-pre-wrap leading-relaxed max-h-96 overflow-y-auto">
            {copyWhatsapp}
          </div>
        </div>
      )}

      {/* ABA 2: META ADS (INSTAGRAM) */}
      {abaAtiva === 'instagram' && (
        <div className="bg-pink-50/60 border border-pink-200 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h4 className="font-extrabold text-pink-950 text-base flex items-center gap-2">
                <Instagram className="w-5 h-5 text-pink-600" />
                <span>Legenda Meta Ads (Instagram & Facebook)</span>
              </h4>
              <p className="text-xs text-pink-700 mt-0.5">
                Com gancho (Hook) de parada de rolagem, diferenciais raros e hashtags locais direcionadas.
              </p>
            </div>
            <button
              type="button"
              onClick={() => copyToClipboard(copyInstagram, 'instagram')}
              className="bg-pink-600 hover:bg-pink-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow-md transition-all flex items-center gap-2 w-full sm:w-auto justify-center"
            >
              {copiadoSecao === 'instagram' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copiadoSecao === 'instagram' ? 'Copiado!' : 'Copiar Legenda Meta Ads'}</span>
            </button>
          </div>
          <div className="bg-white border border-pink-100 rounded-2xl p-5 text-xs text-slate-800 font-sans whitespace-pre-wrap leading-relaxed max-h-96 overflow-y-auto">
            {copyInstagram}
          </div>
        </div>
      )}

      {/* ABA 3: ROTEIRO CANVA / VÍDEO */}
      {abaAtiva === 'canva' && (
        <div className="bg-purple-50/60 border border-purple-200 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h4 className="font-extrabold text-purple-950 text-base flex items-center gap-2">
                <Video className="w-5 h-5 text-purple-600" />
                <span>Roteiro de Gravação (Reels/TikTok) & Canva</span>
              </h4>
              <p className="text-xs text-purple-700 mt-0.5">
                Dividido em 4 cenas com falas fluidas e frases curtas para colar nos templates do Canva.
              </p>
            </div>
            <button
              type="button"
              onClick={() => copyToClipboard(roteiroTexto, 'canva')}
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow-md transition-all flex items-center gap-2 w-full sm:w-auto justify-center"
            >
              {copiadoSecao === 'canva' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copiadoSecao === 'canva' ? 'Copiado!' : 'Copiar Roteiro Completo'}</span>
            </button>
          </div>
          {roteiroCanva.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {roteiroCanva.map((cena, idx) => (
                <div key={idx} className="bg-white border border-purple-100 rounded-2xl p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-black uppercase text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full">
                      Cena #{cena.cena || idx + 1}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase text-slate-400 block">Texto para Falar:</span>
                    <p className="text-xs font-semibold text-slate-800 italic mt-0.5">
                      &quot;{cena.falar}&quot;
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase text-purple-600 block">Texto na Tela (Canva):</span>
                    <p className="text-xs font-black text-purple-950 mt-0.5">
                      {cena.texto_tela_canva}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white border border-purple-100 rounded-2xl p-5 text-xs text-slate-800 whitespace-pre-wrap leading-relaxed">
              {roteiroTexto}
            </div>
          )}
        </div>
      )}

      {/* ABA 4: SITE & PORTAIS */}
      {abaAtiva === 'portais' && (
        <div className="bg-blue-50/60 border border-blue-200 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h4 className="font-extrabold text-blue-950 text-base flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                <span>Descrição Completa e Títulos para Portais</span>
              </h4>
              <p className="text-xs text-blue-700 mt-0.5">
                Textos persuasivos para ZAP Imóveis, VivaReal, OLX e site imobiliário próprio.
              </p>
            </div>
            <button
              type="button"
              onClick={() => copyToClipboard(copyPortais, 'portais')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow-md transition-all flex items-center gap-2 w-full sm:w-auto justify-center"
            >
              {copiadoSecao === 'portais' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copiadoSecao === 'portais' ? 'Copiado!' : 'Copiar Descrição'}</span>
            </button>
          </div>

          {canal1?.titulo_curto && (
            <div className="bg-white p-3.5 rounded-2xl border border-blue-100 text-xs">
              <span className="font-extrabold text-blue-900 block mb-0.5">TÍTULO CURTO (OLX / Classificados):</span>
              <span className="text-slate-800 font-mono">{canal1.titulo_curto}</span>
            </div>
          )}

          {canal1?.titulo_comercial && (
            <div className="bg-white p-3.5 rounded-2xl border border-blue-100 text-xs">
              <span className="font-extrabold text-blue-900 block mb-0.5">TÍTULO COMERCIAL (ZAP / VivaReal):</span>
              <span className="text-slate-800 font-mono">{canal1.titulo_comercial}</span>
            </div>
          )}

          <div className="bg-white border border-blue-100 rounded-2xl p-5 text-xs text-slate-800 font-sans whitespace-pre-wrap leading-relaxed max-h-80 overflow-y-auto">
            {copyPortais}
          </div>

          {canal1?.ficha_tecnica && (
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs space-y-1">
              <span className="font-extrabold text-slate-900 block mb-1">FICHA TÉCNICA RESUMIDA:</span>
              <div className="text-slate-700 font-mono whitespace-pre-wrap">{canal1.ficha_tecnica}</div>
            </div>
          )}
        </div>
      )}

      {/* ABA 5: TAGS DE SEO */}
      {abaAtiva === 'seo' && (
        <div className="bg-amber-50/60 border border-amber-200 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h4 className="font-extrabold text-amber-950 text-base flex items-center gap-2">
                <Tag className="w-5 h-5 text-amber-600" />
                <span>Palavras-Chave Otimizadas para Google & Buscadores</span>
              </h4>
              <p className="text-xs text-amber-700 mt-0.5">
                Termos específicos de busca para ranquear o imóvel no topo das pesquisas locais.
              </p>
            </div>
            <button
              type="button"
              onClick={() => copyToClipboard(tagsTexto, 'seo')}
              className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow-md transition-all flex items-center gap-2 w-full sm:w-auto justify-center"
            >
              {copiadoSecao === 'seo' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copiadoSecao === 'seo' ? 'Copiado!' : 'Copiar Tags SEO'}</span>
            </button>
          </div>
          <div className="bg-white border border-amber-100 rounded-2xl p-5 text-xs text-slate-800 font-mono leading-relaxed">
            {tagsTexto}
          </div>
        </div>
      )}
    </div>
  );
}
