'use client';

import { useState, useEffect } from 'react';
import { Imovel } from '@/types/imovel';
import { mapearAnuncioParaImovel, statusPublico } from '@/lib/imovelMapper';

export function useLiveImoveis(initialImoveis: Imovel[]) {
  const [imoveis, setImoveis] = useState<Imovel[]>(initialImoveis);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;

    async function fetchLive() {
      try {
        setLoading(true);
        const res = await fetch(`/api/v1/anuncios/?limit=100&status=DELIVERED`, {
          cache: 'no-store',
          signal: AbortSignal.timeout(20_000),
        });
        const json = await res.json();

        if (json.success && Array.isArray(json.data) && active) {
          // Mesmo mapper do SSR (`lib/imovelMapper.ts`). A duplicação anterior
          // já tinha divergido: este hook convertia `created_at._seconds` e o
          // server action não, então o mesmo anúncio vinha com campos diferentes
          // conforme quem renderizou.
          const liveList: Imovel[] = json.data
            .filter(statusPublico)
            .map(mapearAnuncioParaImovel);

          setImoveis(liveList);
        }
      } catch (err) {
        // Timeout ou rede: mantém o catálogo que veio do SSR, que é melhor que
        // uma lista vazia.
        console.error('Erro ao buscar imóveis em tempo real:', err);
      } finally {
        if (active) setLoading(false);
      }
    }

    fetchLive();

    return () => {
      active = false;
    };
  }, []);

  return { imoveis, loading };
}
