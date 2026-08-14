'use client';

import React, { useState } from 'react';
import { Copy, Check, Sparkles, MessageCircle, Instagram, Globe, LayoutList, Hash, Award } from 'lucide-react';

interface MediaKitProps {
  mediaKit: {
    descricao_completa?: string;
    descricao_media?: string;
    legenda_social?: string;
    descricao_mda_social?: string;
    mensagem_whatsapp?: string;
    titulo_seo?: string;
    hashtags?: string[];
    pontos_fortes?: string[];
  };
  referencia: string;
}

export default function MediaKitDisplay({ mediaKit, referencia }: MediaKitProps) {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const copyToClipboard = (text: string, sectionKey: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionKey);
    setTimeout(() => setCopiedSection(null), 2500);
  };

  const socialCopy = mediaKit.legenda_social || mediaKit.descricao_mda_social || '';
  const hashtagsText = Array.isArray(mediaKit.hashtags) ? mediaKit.hashtags.join(' ') : (mediaKit.hashtags || '');

  return (
    <div className="space-y-6">
      {/* Banner de destaque */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-lg flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-5 h-5 text-yellow-300 animate-pulse" />
            <span className="text-xs uppercase tracking-wider font-bold bg-white/20 px-2.5 py-0.5 rounded-full">
              Media Kit gerado por IA • Ref.: {referencia}
            </span>
          </div>
          <h3 className="text-xl font-extrabold">Copie e Publique nos seus Canais</h3>
          <p className="text-sm text-blue-100 mt-1">
            Textos otimizados com técnicas de copywriting de alta conversão imobiliária.
          </p>
        </div>
      </div>

      {/* Grid de Canais */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* 1. WhatsApp */}
        <div className="bg-emerald-50/50 border border-emerald-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-emerald-800 font-bold">
              <MessageCircle className="w-5 h-5 text-emerald-600" />
              <span>Texto para WhatsApp</span>
            </div>
            <button
              onClick={() => copyToClipboard(mediaKit.mensagem_whatsapp || '', 'whatsapp')}
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition-colors shadow-sm"
            >
              {copiedSection === 'whatsapp' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copiedSection === 'whatsapp' ? 'Copiado!' : 'Copiar'}
            </button>
          </div>
          <div className="bg-white border border-emerald-100 rounded-xl p-3.5 text-xs font-mono text-slate-800 whitespace-pre-line max-h-48 overflow-y-auto">
            {mediaKit.mensagem_whatsapp || 'A mensagem para WhatsApp será exibida aqui após o processamento.'}
          </div>
        </div>

        {/* 2. Redes Sociais */}
        <div className="bg-pink-50/50 border border-pink-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-pink-800 font-bold">
              <Instagram className="w-5 h-5 text-pink-600" />
              <span>Instagram & Facebook (Legenda)</span>
            </div>
            <button
              onClick={() => copyToClipboard(`${socialCopy}\n\n${hashtagsText}`, 'social')}
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-pink-600 hover:bg-pink-700 text-white transition-colors shadow-sm"
            >
              {copiedSection === 'social' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copiedSection === 'social' ? 'Copiado!' : 'Copiar'}
            </button>
          </div>
          <div className="bg-white border border-pink-100 rounded-xl p-3.5 text-xs text-slate-800 whitespace-pre-line max-h-48 overflow-y-auto">
            {socialCopy}
            {hashtagsText && (
              <div className="mt-2 text-pink-700 font-medium">{hashtagsText}</div>
            )}
          </div>
        </div>

        {/* 3. Portais Imobiliários */}
        <div className="bg-amber-50/50 border border-amber-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-amber-800 font-bold">
              <LayoutList className="w-5 h-5 text-amber-600" />
              <span>Portais (ZAP, VivaReal, OLX)</span>
            </div>
            <button
              onClick={() => copyToClipboard(mediaKit.descricao_media || '', 'portais')}
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white transition-colors shadow-sm"
            >
              {copiedSection === 'portais' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copiedSection === 'portais' ? 'Copiado!' : 'Copiar'}
            </button>
          </div>
          <div className="bg-white border border-amber-100 rounded-xl p-3.5 text-xs text-slate-800 whitespace-pre-line max-h-48 overflow-y-auto">
            {mediaKit.descricao_media || 'A descrição para portais será exibida aqui após o processamento.'}
          </div>
        </div>

        {/* 4. Descrição Completa Site */}
        <div className="bg-blue-50/50 border border-blue-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-blue-800 font-bold">
              <Globe className="w-5 h-5 text-blue-600" />
              <span>Descrição Completa (Site Próprio)</span>
            </div>
            <button
              onClick={() => copyToClipboard(mediaKit.descricao_completa || '', 'completa')}
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors shadow-sm"
            >
              {copiedSection === 'completa' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copiedSection === 'completa' ? 'Copiado!' : 'Copiar'}
            </button>
          </div>
          <div className="bg-white border border-blue-100 rounded-xl p-3.5 text-xs text-slate-800 whitespace-pre-line max-h-48 overflow-y-auto">
            {mediaKit.descricao_completa || 'A descrição completa para o site será exibida aqui após o processamento.'}
          </div>
        </div>

      </div>

      {/* Pontos Fortes e SEO */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="flex items-center gap-2 text-slate-800 font-bold text-sm mb-2">
            <Award className="w-4 h-4 text-blue-600" />
            <span>Destaques & Pontos Fortes</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {mediaKit.pontos_fortes && mediaKit.pontos_fortes.length > 0 ? (
              mediaKit.pontos_fortes.map((p, idx) => (
                <span key={idx} className="bg-white border border-slate-200 text-slate-700 px-2.5 py-1 rounded-lg text-xs font-medium shadow-xs">
                  ✨ {p}
                </span>
              ))
            ) : (
              <span className="text-xs text-slate-400">Nenhum destaque gerado.</span>
            )}
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 text-slate-800 font-bold text-sm mb-2">
            <Hash className="w-4 h-4 text-purple-600" />
            <span>Título SEO Otimizado para o Google</span>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-2.5 text-xs font-medium text-slate-800 flex justify-between items-center">
            <span>{mediaKit.titulo_seo || 'Título SEO'}</span>
            <button
              onClick={() => copyToClipboard(mediaKit.titulo_seo || '', 'seo')}
              className="text-slate-500 hover:text-slate-800 p-1"
            >
              {copiedSection === 'seo' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
