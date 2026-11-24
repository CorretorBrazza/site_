'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { RefreshCw } from 'lucide-react';

export default function ErrorVitrine({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Falha ao renderizar vitrine do corretor:', error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center bg-[#070e1c] px-4 py-16 text-white">
      <div className="w-full max-w-lg rounded-2xl border border-brand-800 bg-brand-900/60 p-6 text-center sm:p-8">
        <h1 className="text-xl font-black sm:text-2xl">Vitrine temporariamente indisponível</h1>
        <p className="mt-2 text-sm text-white-70">
          Não conseguimos carregar os imóveis deste corretor agora. Tente novamente em instantes —
          o endereço da vitrine continua o mesmo.
        </p>
        <div className="mt-6 flex flex-col justify-center gap-2 sm:flex-row">
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gold px-5 py-2.5 text-sm font-bold text-brand-950 transition-colors hover:bg-gold-400"
          >
            <RefreshCw className="h-4 w-4" /> Tentar novamente
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-xl border border-brand-700 px-5 py-2.5 text-sm font-bold text-white-80 transition-colors hover:text-white"
          >
            Ir para o início
          </Link>
        </div>
      </div>
    </div>
  );
}
