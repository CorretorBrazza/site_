import { Imovel } from '@/types/imovel';
import { API_BASE_URL } from '@/lib/api';
import { mapearAnuncioParaImovel, statusPublico } from '@/lib/imovelMapper';

export interface ResultadoCatalogoImoveis {
  imoveis: Imovel[];
  /** true quando a resposta da API falhou e o catálogo veio do último bom em memória. */
  fallback: boolean;
}

declare global {
  // eslint-disable-next-line no-var
  var __ultimoCatalogoImoveis: { imoveis: Imovel[]; em: number } | undefined;
}

/**
 * Busca anúncios entregues/publicados na API oficial do Imóveis Taboão.
 *
 * Em falha total da API, serve o último catálogo válido em memória em vez de
 * devolver `[]` silenciosamente — uma lista vazia pareceria "portal sem
 * imóveis", enganando o visitante e zerando o sitemap. `fallback: true` deixa
 * a UI avisar que os dados podem estar desatualizados.
 *
 * A conversão anúncio → `Imovel` mora em `lib/imovelMapper.ts` e é a MESMA usada
 * pelo hook do cliente. Antes eram duas cópias que já tinham divergido.
 */
export async function getImoveis(): Promise<ResultadoCatalogoImoveis> {
  try {
    // Paginação: a API devolve no máximo 100 por página e informa `has_more`.
    // Antes o site pedia só a primeira e o anúncio 101 nunca aparecia — nem na
    // vitrine, nem no sitemap, sem nenhum aviso. O teto de 5 páginas (500
    // anúncios) evita um laço sem fim se a API responder algo inesperado.
    const MAX_PAGINAS = 5;

    const recebidos: any[] = [];
    let algumaPaginaOk = false;

    for (let pagina = 1; pagina <= MAX_PAGINAS; pagina += 1) {
      const res = await fetch(
        `${API_BASE_URL}/anuncios?limit=100&page=${pagina}&status=DELIVERED`,
        {
          next: { revalidate: 60 },
          // Sem teto, uma API em cold start deixava o build/ISR pendurado.
          signal: AbortSignal.timeout(20_000),
        },
      );
      if (!res.ok) break;

      const json = await res.json();
      if (!json?.success || !Array.isArray(json.data)) break;

      algumaPaginaOk = true;
      recebidos.push(...json.data);

      if (json.has_more !== true || json.data.length === 0) break;
    }

    if (algumaPaginaOk) {
      const apiImoveis: Imovel[] = recebidos
        .filter(statusPublico)
        .map(mapearAnuncioParaImovel);

      if (apiImoveis.length > 0) {
        globalThis.__ultimoCatalogoImoveis = {
          imoveis: apiImoveis,
          em: Date.now(),
        };
      }

      // Sucesso legítimo com catálogo vazio: não é falha, não sobrescreve o
      // último bom e não merece aviso de instabilidade.
      return { imoveis: apiImoveis, fallback: false };
    }
  } catch (err) {
    console.error('Erro ao buscar anúncios da API:', err);
  }

  // Falha: serve o último catálogo válido (se houver) sinalizando fallback.
  const ultimoBom = globalThis.__ultimoCatalogoImoveis;
  if (ultimoBom && ultimoBom.imoveis.length > 0) {
    return { imoveis: ultimoBom.imoveis, fallback: true };
  }

  return { imoveis: [], fallback: true };
}
