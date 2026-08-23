'use client';

import { useState, useEffect } from 'react';
import { Imovel } from '@/types/imovel';

import { API_BASE_URL } from '@/lib/api';

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

              const rawTransacao = String(ref.transacao || item.transacao || ref.finalidade || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
              const isLoc = rawTransacao.includes('loca') || rawTransacao.includes('alug');
              const isVen = rawTransacao.includes('venda') || rawTransacao.includes('compra');
              const finalTransacao = isLoc && isVen ? 'Venda e Locação' : (isLoc ? 'Locação' : (isVen ? 'Venda' : (ref.precoLocacao || item.precoLocacao ? 'Locação' : 'Venda')));

              const finalPrecoLocacao = ref.precoLocacao !== undefined && ref.precoLocacao !== null && ref.precoLocacao !== ''
                ? Number(ref.precoLocacao)
                : (item.precoLocacao || ref.precoPacote || item.precoPacote || (isLoc ? (ref.preco || item.preco) : null) || null);

              const finalPrecoVenda = ref.precoVenda !== undefined && ref.precoVenda !== null && ref.precoVenda !== ''
                ? Number(ref.precoVenda)
                : (item.precoVenda || (isVen ? (ref.preco || item.preco) : null) || null);

              return {
                id: item.ad_id || item.referencia?.toLowerCase() || `imv_${Math.random()}`,
                referencia: item.referencia || 'BRA0000',
                titulo: ref.titulo || item.media_kit?.titulo_seo || `Imóvel ${item.referencia}`,
                descricao: ref.descricao || item.media_kit?.legenda_social || '',
                tipo: ref.tipo || ref.tipoImovel || 'Imóvel',
                transacao: finalTransacao,
                precoVenda: finalPrecoVenda ? Number(finalPrecoVenda) : null,
                precoLocacao: finalPrecoLocacao ? Number(finalPrecoLocacao) : null,
                condominio: ref.condominio || null,
                iptu: ref.iptu || null,
                bairro: ref.bairro || ref.endereco?.bairro || '',
                cidade: ref.cidade || ref.endereco?.cidade || '',
                endereco: {
                  rua: ref.rua || ref.endereco?.rua || '',
                  bairro: ref.bairro || ref.endereco?.bairro || '',
                  cidade: ref.cidade || ref.endereco?.cidade || '',
                  estado: ref.estado || ref.endereco?.estado || 'SP',
                  cep: ref.cep || ref.endereco?.cep || '',
                },
                fotos: fotosArray,
                caracteristicas: {
                  quartos: ref.quartos ?? ref.caracteristicas?.quartos ?? null,
                  suites: ref.suites ?? ref.caracteristicas?.suites ?? null,
                  banheiros: ref.banheiros ?? ref.caracteristicas?.banheiros ?? null,
                  vagas: ref.vagas ?? ref.caracteristicas?.vagas ?? null,
                  areaUtil: ref.areaUtil ?? ref.caracteristicas?.areaUtil ?? null,
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
