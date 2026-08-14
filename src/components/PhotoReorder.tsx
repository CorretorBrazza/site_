'use client';

import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Star, Image as ImageIcon, Save, Check } from 'lucide-react';

export interface PhotoItem {
  public_id?: string;
  url: string;
  url_optimized?: string;
  ordem: number;
  eh_capa: boolean;
  /** Índice da foto no array original do anúncio; não muda ao mover a foto na interface. */
  source_index?: number;
}

interface PhotoReorderProps {
  initialPhotos: PhotoItem[];
  onSaveOrder: (newPhotos: PhotoItem[]) => Promise<void>;
  isLoading?: boolean;
}

export default function PhotoReorder({ initialPhotos, onSaveOrder, isLoading = false }: PhotoReorderProps) {
  const [photos, setPhotos] = useState<PhotoItem[]>(() => (initialPhotos || []).map((photo, index) => ({
    ...photo,
    source_index: photo.source_index ?? index,
  })));
  const [isSaved, setIsSaved] = useState(false);

  const movePhoto = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= photos.length) return;
    const updated = [...photos];
    const item = updated.splice(fromIndex, 1)[0];
    updated.splice(toIndex, 0, item);

    // Atualiza ordem e define a primeira como capa
    const reordered = updated.map((p, idx) => ({
      ...p,
      ordem: idx,
      eh_capa: idx === 0,
    }));

    setPhotos(reordered);
    setIsSaved(false);
  };

  const setAsCover = (index: number) => {
    movePhoto(index, 0);
  };

  const handleSave = async () => {
    await onSaveOrder(photos);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  if (!photos || photos.length === 0) {
    return (
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-center text-slate-500">
        <ImageIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
        <p className="text-sm">Nenhuma foto cadastrada para este imóvel.</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-blue-600" />
            <span>Reordenar Fotos (Fotos do Anúncio)</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            A 1ª foto será definida automaticamente como a **Foto de Capa** do imóvel.
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={isLoading}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
        >
          {isSaved ? <Check className="w-4 h-4 text-emerald-300" /> : <Save className="w-4 h-4" />}
          {isSaved ? 'Ordem Salva!' : 'Salvar Nova Ordem'}
        </button>
      </div>

      {/* Grid de Fotos */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {photos.map((photo, index) => {
          const displayUrl = photo.url_optimized || photo.url;
          return (
            <div
              key={index}
              className={`relative group rounded-xl overflow-hidden border-2 transition-all bg-slate-100 ${
                index === 0
                  ? 'border-blue-600 ring-2 ring-blue-500/20 shadow-md'
                  : 'border-slate-200 hover:border-slate-400'
              }`}
            >
              {/* Imagem */}
              <div className="aspect-4/3 w-full overflow-hidden bg-slate-900">
                <img
                  src={displayUrl}
                  alt={`Foto ${index + 1}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Badge de Capa ou Posição */}
              <div className="absolute top-2 left-2 flex items-center gap-1">
                {index === 0 ? (
                  <span className="bg-blue-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-md shadow-md flex items-center gap-1">
                    <Star className="w-3 h-3 fill-current text-yellow-300" />
                    CAPA
                  </span>
                ) : (
                  <span className="bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                    #{index + 1}
                  </span>
                )}
              </div>

              {/* Controles de Movimento */}
              <div className="p-2 bg-white flex items-center justify-between border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => movePhoto(index, index - 1)}
                  disabled={index === 0}
                  className="p-1 rounded-lg text-slate-600 hover:bg-slate-100 disabled:opacity-30 transition-colors"
                  title="Mover para esquerda"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                </button>

                {index !== 0 && (
                  <button
                    type="button"
                    onClick={() => setAsCover(index)}
                    className="text-[10px] font-semibold text-blue-600 hover:underline px-1"
                  >
                    Virar Capa
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => movePhoto(index, index + 1)}
                  disabled={index === photos.length - 1}
                  className="p-1 rounded-lg text-slate-600 hover:bg-slate-100 disabled:opacity-30 transition-colors"
                  title="Mover para direita"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
