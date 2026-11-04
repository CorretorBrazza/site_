'use client';

import { useEffect, useId, useRef } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/cn';

export interface SheetProps {
  aberto: boolean;
  aoFechar: () => void;
  titulo: string;
  /** `right` para menu; `bottom` para filtros no mobile. */
  lado?: 'right' | 'bottom';
  children: React.ReactNode;
  className?: string;
}

/**
 * Painel deslizante (menu mobile e filtros).
 *
 * Por que existe: no mobile, dropdown do header e filtros da listagem precisam
 * de um padrão único — com fundo escurecido, ESC, foco preso no painel e trava
 * de scroll do body. Antes cada um fazia de um jeito (ou não fazia).
 */
export function Sheet({ aberto, aoFechar, titulo, lado = 'right', children, className }: SheetProps) {
  const painelRef = useRef<HTMLDivElement | null>(null);
  const tituloId = useId();

  useEffect(() => {
    if (!aberto) return undefined;

    const anterior = document.activeElement as HTMLElement | null;
    document.body.style.overflow = 'hidden';
    painelRef.current?.focus();

    const aoTeclar = (evento: KeyboardEvent) => {
      if (evento.key === 'Escape') aoFechar();
    };

    window.addEventListener('keydown', aoTeclar);
    return () => {
      window.removeEventListener('keydown', aoTeclar);
      document.body.style.overflow = '';
      anterior?.focus?.();
    };
  }, [aberto, aoFechar]);

  if (!aberto) return null;

  return (
    <div className="fixed inset-0 z-[80]">
      <button
        type="button"
        aria-label="Fechar"
        onClick={aoFechar}
        className="absolute inset-0 h-full w-full cursor-default bg-brand-950/60 backdrop-blur-sm"
      />

      <div
        ref={painelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={tituloId}
        tabIndex={-1}
        className={cn(
          'absolute flex flex-col bg-surface shadow-2xl focus:outline-none',
          lado === 'right'
            ? 'inset-y-0 right-0 w-[86%] max-w-sm animate-in slide-in-from-right duration-200'
            : 'inset-x-0 bottom-0 max-h-[88dvh] rounded-t-3xl animate-in slide-in-from-bottom duration-200',
          className,
        )}
      >
        <div className="flex items-center justify-between gap-4 border-b border-line px-5 py-4">
          <h2 id={tituloId} className="text-base font-extrabold text-ink">
            {titulo}
          </h2>
          <button
            type="button"
            onClick={aoFechar}
            aria-label="Fechar painel"
            className="rounded-full p-2 text-muted hover:bg-ink/5 hover:text-ink"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">{children}</div>
      </div>
    </div>
  );
}
