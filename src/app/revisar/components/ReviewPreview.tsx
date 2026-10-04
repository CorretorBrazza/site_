'use client';

import React, { useState } from 'react';
import { ReviewPreviewData } from '@/lib/api';
import { Eye, Copy, Check, Share2, Globe, MessageSquare, Tag, RefreshCw } from 'lucide-react';

interface ReviewPreviewProps {
  preview: ReviewPreviewData | null;
  onRefreshPreview: () => void;
  isRefreshing?: boolean;
}

export function ReviewPreview({
  preview,
  onRefreshPreview,
  isRefreshing = false,
}: ReviewPreviewProps) {
  const [activeTab, setActiveTab] = useState<'portal' | 'whatsapp' | 'social' | 'ficha'>('portal');
  const [copiedTab, setCopiedTab] = useState<string | null>(null);

  if (!preview) {
    return null;
  }

  const copyToClipboard = (text: string, tabKey: string) => {
    navigator.clipboard.writeText(text);
    setCopiedTab(tabKey);
    setTimeout(() => setCopiedTab(null), 2000);
  };

  const getActiveContent = () => {
    switch (activeTab) {
      case 'whatsapp':
        return preview.texto_whatsapp;
      case 'social':
        return preview.redes_sociais;
      case 'ficha':
        return preview.ficha_tecnica;
      case 'portal':
      default:
        return preview.texto_portal;
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
          <Eye className="w-5 h-5 text-blue-600" />
          <span>Prévia Comercial do Anúncio</span>
        </h2>
        <button
          type="button"
          onClick={onRefreshPreview}
          disabled={isRefreshing}
          className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 p-1 rounded-lg hover:bg-blue-50 transition-colors"
          title="Recalcular prévia com novas edições"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>Atualizar prévia</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto no-scrollbar gap-1.5 p-1 bg-slate-100 rounded-2xl">
        <button
          type="button"
          onClick={() => setActiveTab('portal')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold shrink-0 transition-all ${
            activeTab === 'portal'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Globe className="w-3.5 h-3.5 text-blue-600" />
          Portal
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('whatsapp')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold shrink-0 transition-all ${
            activeTab === 'whatsapp'
              ? 'bg-white text-emerald-800 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
          WhatsApp
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('social')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold shrink-0 transition-all ${
            activeTab === 'social'
              ? 'bg-white text-purple-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Share2 className="w-3.5 h-3.5 text-purple-600" />
          Redes Sociais
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('ficha')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold shrink-0 transition-all ${
            activeTab === 'ficha'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Tag className="w-3.5 h-3.5 text-slate-600" />
          Ficha Técnica
        </button>
      </div>

      {/* Conteúdo da Prévia */}
      <div className="relative bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5">
        <button
          type="button"
          onClick={() => copyToClipboard(getActiveContent(), activeTab)}
          className="absolute top-3 right-3 text-xs bg-white border border-slate-200 text-slate-700 font-bold px-2.5 py-1.5 rounded-lg shadow-sm hover:bg-slate-100 flex items-center gap-1 transition-all"
        >
          {copiedTab === activeTab ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-emerald-700">Copiado!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-slate-500" />
              <span>Copiar</span>
            </>
          )}
        </button>

        <div className="pr-16">
          <p className="text-xs text-slate-800 font-mono whitespace-pre-wrap leading-relaxed">
            {getActiveContent()}
          </p>
        </div>
      </div>

      {/* Destaques e Tags */}
      {preview.destaques && preview.destaques.length > 0 && (
        <div className="space-y-1.5">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Pontos Fortes Identificados:</span>
          <div className="flex flex-wrap gap-1.5">
            {preview.destaques.map((item, idx) => (
              <span
                key={idx}
                className="bg-blue-50 text-blue-800 border border-blue-200 text-[11px] font-bold px-2.5 py-1 rounded-lg"
              >
                ✨ {item}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
