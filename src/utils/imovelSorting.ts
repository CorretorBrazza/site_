import { Imovel } from '@/types/imovel';

/**
 * Regra de Ordenação e Tagging de Imóveis:
 * 1. Ordena todos os imóveis por data de atualização/criação decrescente (mais recentes primeiro).
 * 2. Os primeiros 10 imóveis recebem a tag `isNovo = true` ("NOVO ANÚNCIO") e aparecem primeiro.
 * 3. Do 11º imóvel em diante, a tag `isNovo = false` é aplicada e a ordem entre eles é embaralhada de forma randômica a cada recarregamento da página.
 */
export function processarEOrdenarImoveis(imoveis: Imovel[]): Imovel[] {
  if (!imoveis || imoveis.length === 0) return [];

  // Ordena por data (updatedAt ou createdAt) decrescente
  const ordenadosPorData = [...imoveis].sort((a, b) => {
    const dataA = new Date(a.updatedAt || a.createdAt || 0).getTime();
    const dataB = new Date(b.updatedAt || b.createdAt || 0).getTime();
    return dataB - dataA;
  });

  // Separa os 10 mais recentes (Tag "NOVO")
  const os10Novos = ordenadosPorData.slice(0, 10).map((imovel) => ({
    ...imovel,
    isNovo: true,
  }));

  // Pega os imóveis restantes (mais antigos que o 10º)
  const antigos = ordenadosPorData.slice(10).map((imovel) => ({
    ...imovel,
    isNovo: false,
  }));

  // Embaralha de forma randômica (Fisher-Yates shuffle) os imóveis mais antigos
  for (let i = antigos.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [antigos[i], antigos[j]] = [antigos[j], antigos[i]];
  }

  // Retorna os 10 novos primeiro, seguidos pelos antigos em ordem randômica
  return [...os10Novos, ...antigos];
}
