'use client';

import { useState, useEffect } from 'react';
import { Imovel } from '@/types/imovel';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://imoveis-taboao-api-production-4cd9.up.railway.app/api/v1';

export function useLiveImoveis(initialImoveis: Imovel[]) {
  const [imoveis, setImoveis] = useState<Imovel[]>(initialImoveis);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;

    async function fetchLive() {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE_URL}/anuncios?limit=100&status=DELIVERED`, {
          cache: 'no-store',
        });
        const json = await res.json();

        if (json.success && Array.isArray(json.data) && active) {
          const liveList: Imovel[] = json.data
            .filter((item: any) => {
              const st = (item.status || '').toUpperCase();
              return st === 'APPROVED' || st === 'DELIVERED' || st === 'PUBLISHED' || st === 'ATIVO';
            })
            .map((item: any) => {
              const ref = item.dados_refinados || item.dados_brutos || {};
              const fotosArray = (item.fotos || []).map((f: any) =>
                typeof f === 'string' ? f : f.url_optimized || f.url || f.url_original
              );

              return {
                id: item.ad_id || item.referencia?.toLowerCase() || `imv_${Math.random()}`,
                referencia: item.referencia || 'BRA0000',
                titulo: ref.titulo || item.media_kit?.titulo_seo || `Imóvel ${item.referencia}`,
                descricao: ref.descricao || item.media_kit?.legenda_social || '',
                tipo: ref.tipo || ref.tipoImovel || 'Apartamento',
                transacao: ref.transacao || ref.finalidade || (ref.precoLocacao ? 'Locação' : 'Venda'),
                precoVenda: ref.precoVenda || null,
                precoLocacao: ref.precoLocacao || null,
                condominio: ref.condominio || null,
                iptu: ref.iptu || null,
                bairro: ref.bairro || ref.endereco?.bairro || 'Taboão da Serra',
                cidade: ref.cidade || ref.endereco?.cidade || 'Taboão da Serra',
                endereco: {
                  rua: ref.rua || ref.endereco?.rua || '',
                  bairro: ref.bairro || ref.endereco?.bairro || 'Taboão da Serra',
                  cidade: ref.cidade || ref.endereco?.cidade || 'Taboão da Serra',
                  estado: ref.estado || ref.endereco?.estado || 'SP',
                  cep: ref.cep || ref.endereco?.cep || '',
                },
                fotos: fotosArray.length > 0 ? fotosArray : ['https://images.unsplash.com/photo-1560518883-ce09059eeffa'],
                caracteristicas: {
                  quartos: ref.quartos || ref.caracteristicas?.quartos || 0,
                  suites: ref.suites || ref.caracteristicas?.suites || 0,
                  banheiros: ref.banheiros || ref.caracteristicas?.banheiros || 0,
                  vagas: ref.vagas || ref.caracteristicas?.vagas || 0,
                  areaUtil: ref.areaUtil || ref.caracteristicas?.areaUtil || 0,
                },
                status: 'Ativo',
                destaque: true,
                createdAt: item.created_at?._seconds
                  ? new Date(item.created_at._seconds * 1000).toISOString()
                  : item.created_at || new Date().toISOString(),
                updatedAt: item.updated_at?._seconds
                  ? new Date(item.updated_at._seconds * 1000).toISOString()
                  : item.updated_at || new Date().toISOString(),
              };
            });

          setImoveis(liveList);
        }
      } catch (err) {
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
