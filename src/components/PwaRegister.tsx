'use client';

import { useEffect } from 'react';

/**
 * Registra o service worker somente em producao.
 *
 * Em `next dev` o SW intercepta os HMR websockets e o HTML gerado a cada
 * requisicao, deixando o desenvolvimento com cache fantasma. Em producao ele
 * dá o offline do app shell; falhas de registro sao silenciosas porque um SW
 * indisponivel nao pode quebrar o login nem a vitrine.
 */
export default function PwaRegister() {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') return;
    if (typeof navigator === 'undefined' || !('serviceWorker' in navigator)) return;

    const registrar = () => {
      navigator.serviceWorker.register('/sw.js', { scope: '/' }).catch(() => {
        // Sem SW o site continua funcionando online; nao ha o que mostrar ao usuario.
      });
    };

    if (document.readyState === 'complete') {
      registrar();
    } else {
      window.addEventListener('load', registrar, { once: true });
      return () => window.removeEventListener('load', registrar);
    }
  }, []);

  return null;
}
