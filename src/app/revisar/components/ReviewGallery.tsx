'use client';

import React, { useEffect, useState } from 'react';
import { Image as ImageIcon, Sparkles, Check, Crown, X } from 'lucide-react';

interface ReviewGalleryProps {
  fotos: Array<string | { url: string }>;
  capaIndex: number;
  capaSugeridaIa: number | null;
  onSelectCover: (index: number) => void;
  disabled?: boolean;
}

export function ReviewGallery({
  fotos,
  capaIndex,
  capaSugeridaIa,
  onSelectCover,
  disabled = false,
}: ReviewGalleryProps) {
  const [selectedPhotoModal, setSelectedPhotoModal] = useState<string | null>(null);

  /**
   * O zoom era só de mouse: `<img onClick>` não recebe foco, não responde a
   * Enter/Espaço e o leitor de tela nem anuncia que a foto amplia. Fechar
   * também dependia de clique. Aqui o modal ganha ESC e o gatilho vira botão.
   */
  useEffect(() => {
    if (!selectedPhotoModal) return undefined;

    const aoTeclar = (evento: KeyboardEvent) => {
      if (evento.key === 'Escape') setSelectedPhotoModal(null);
    };

    window.addEventListener('keydown', aoTeclar);
    return () => window.removeEventListener('keydown', aoTeclar);
  }, [selectedPhotoModal]);

  // Normaliza: aceita string ou objeto {url}
  const urls: string[] = (fotos || [])
    .map((f) => (typeof f === 'string' ? f : f?.url))
    .filter((u): u is string => typeof u === 'string' && u.length > 0);

  if (urls.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-3xl p-6 text-center shadow-sm space-y-3">
        <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto text-slate-400">
          <ImageIcon className="w-6 h-6" />
        </div>
        <p className="text-xs text-slate-500 font-semibold">Nenhuma foto encontrada para este anúncio.</p>
      </div>
    );
  }

  const fotoPrincipal = urls[capaIndex] || urls[0];

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
          <ImageIcon className="w-5 h-5 text-blue-600" />
          <span>Fotos do Imóvel ({urls.length})</span>
        </h2>
        <span className="text-[11px] font-bold text-slate-400">Toque em uma foto para definir como capa</span>
      </div>

      {/* Foto de Capa em Destaque */}
      <div className="relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-200 aspect-[16/10] sm:aspect-[16/9] shadow-inner">
        <button
          type="button"
          onClick={() => setSelectedPhotoModal(fotoPrincipal)}
          aria-label="Ampliar a foto de capa do anúncio"
          className="block w-full h-full"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={fotoPrincipal}
            alt="Foto de capa do anúncio"
            className="w-full h-full object-cover cursor-zoom-in hover:scale-105 transition-transform duration-300"
          />
        </button>
        <div className="absolute top-3 left-3 bg-blue-600/90 backdrop-blur-sm text-white text-[11px] font-black px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-md uppercase tracking-wider">
          <Crown className="w-3.5 h-3.5 text-amber-300" />
          Foto de Capa Ativa
        </div>
      </div>

      {/* Grid de Seleção de Capa */}
      <div className="space-y-2">
        <p className="text-xs font-bold text-slate-700">Selecione a foto principal (Capa):</p>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2.5">
          {urls.map((foto, idx) => {
            const isSelected = idx === capaIndex;
            const isIaSuggested = idx === capaSugeridaIa;

            return (
              <button
                key={`${foto}-${idx}`}
                type="button"
                disabled={disabled}
                onClick={() => onSelectCover(idx)}
                className={`group relative rounded-xl overflow-hidden aspect-square border-2 transition-all duration-200 text-left ${
                  isSelected
                    ? 'border-blue-600 ring-2 ring-blue-600/30 scale-95 shadow-md'
                    : 'border-slate-200 hover:border-blue-400 opacity-80 hover:opacity-100'
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={foto} alt={`Foto ${idx + 1}`} className="w-full h-full object-cover" />

                {isSelected && (
                  <div className="absolute inset-0 bg-blue-900/30 flex items-center justify-center">
                    <span className="bg-blue-600 text-white rounded-full p-1 shadow-md">
                      <Check className="w-4 h-4 stroke-[3]" />
                    </span>
                  </div>
                )}

                {isIaSuggested && !isSelected && (
                  <div className="absolute top-1 right-1 bg-amber-500 text-slate-900 text-[9px] font-black px-1.5 py-0.5 rounded-md shadow flex items-center gap-0.5">
                    <Sparkles className="w-2.5 h-2.5" />
                    IA
                  </div>
                )}

                <div className="absolute bottom-1 left-1 bg-black/60 text-white text-[9px] font-mono font-bold px-1 rounded">
                  #{idx + 1}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Modal de Zoom de Foto */}
      {selectedPhotoModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Foto ampliada"
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedPhotoModal(null)}
        >
          <button
            type="button"
            onClick={() => setSelectedPhotoModal(null)}
            aria-label="Fechar foto ampliada"
            className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-white/10 text-white hover:bg-white/20"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
          <div className="relative max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={selectedPhotoModal} alt="Foto ampliada" className="w-full h-full object-contain" />
          </div>
        </div>
      )}
    </div>
  );
}