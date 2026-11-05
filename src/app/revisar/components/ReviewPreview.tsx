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
    <div className="bg-white border border-line rounded-3xl p-5 sm:p-6 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-extrabold text-brand-900 flex items-center gap-2">
          <Eye className="w-5 h-5 text-brand-800" />
          <span>Prévia Comercial do Anúncio</span>
        </h2>
        <button
          type="button"
          onClick={onRefreshPreview}
          disabled={isRefreshing}
          className="text-xs font-bold text-brand-800 hover:text-brand-800 flex items-center gap-1 p-1 rounded-lg hover:bg-brand-900/5 transition-colors"
          title="Recalcular prévia com novas edições"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>Atualizar prévia</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto no-scrollbar gap-1.5 p-1 bg-paper rounded-2xl">
        <button
          type="button"
          onClick={() => setActiveTab('portal')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold shrink-0 transition-all ${
            activeTab === 'portal'
              ? 'bg-white text-brand-900 shadow-sm'
              : 'text-ink hover:text-brand-900'
          }`}
        >
          <Globe className="w-3.5 h-3.5 text-brand-800" />
          Portal
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('whatsapp')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold shrink-0 transition-all ${
            activeTab === 'whatsapp'
              ? 'bg-white text-success shadow-sm'
              : 'text-ink hover:text-brand-900'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5 text-success" />
          WhatsApp
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('social')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold shrink-0 transition-all ${
            activeTab === 'social'
              ? 'bg-white text-brand-800 shadow-sm'
              : 'text-ink hover:text-brand-900'
          }`}
        >
          <Share2 className="w-3.5 h-3.5 text-brand-800" />
          Redes Sociais
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('ficha')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold shrink-0 transition-all ${
            activeTab === 'ficha'
              ? 'bg-white text-brand-900 shadow-sm'
              : 'text-ink hover:text-brand-900'
          }`}
        >
          <Tag className="w-3.5 h-3.5 text-ink" />
          Ficha Técnica
        </button>
      </div>

      {/* Conteúdo da Prévia */}
      <div className="relative bg-paper border border-line rounded-2xl p-4 sm:p-5">
        <button
          type="button"
          onClick={() => copyToClipboard(getActiveContent(), activeTab)}
          className="absolute top-3 right-3 text-xs bg-white border border-line text-ink font-bold px-2.5 py-1.5 rounded-lg shadow-sm hover:bg-paper flex items-center gap-1 transition-all"
        >
          {copiedTab === activeTab ? (
            <>
              <Check className="w-3.5 h-3.5 text-success" />
              <span className="text-success">Copiado!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-muted" />
              <span>Copiar</span>
            </>
          )}
        </button>

        <div className="pr-16">
          <p className="text-xs text-ink font-mono whitespace-pre-wrap leading-relaxed">
            {getActiveContent()}
          </p>
        </div>
      </div>

      {/* Destaques e Tags */}
      {preview.destaques && preview.destaques.length > 0 && (
        <div className="space-y-1.5">
          <span className="text-[11px] font-bold text-muted uppercase tracking-wider">Pontos Fortes Identificados:</span>
          <div className="flex flex-wrap gap-1.5">
            {preview.destaques.map((item, idx) => (
              <span
                key={idx}
                className="bg-brand-900/5 text-brand-800 border border-brand-700/30 text-[11px] font-bold px-2.5 py-1 rounded-lg"
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
