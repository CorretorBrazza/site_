import { Imovel, TipoTransacao } from '@/types/imovel';

/**
 * Mapper único de anúncio da API para `Imovel` do site.
 *
 * POR QUE ELE EXISTE
 *
 * A mesma conversão de ~60 linhas vivia em dois lugares — no server action
 * (`getImoveis`, usado no SSR) e no hook `useLiveImoveis` (usado no cliente) — e
 * já tinha divergido: o hook convertia `created_at._seconds`, o action não; o
 * hook usava um fallback de título diferente. O mesmo anúncio podia aparecer com
 * dados distintos conforme quem renderizou.
 *
 * Aqui a regra é única. Qualquer campo novo de `Imovel` entra em um lugar só.
 */

/** Status que podem aparecer no catálogo público. */
export function statusPublico(item: { status?: unknown }): boolean {
  const st = String(item?.status || '').toUpperCase();
  return st === 'APPROVED' || st === 'DELIVERED' || st === 'PUBLISHED' || st === 'ATIVO';
}

/** Converte timestamp do Firestore (`{ _seconds }` ou `{ seconds }`) ou string ISO. */
function paraIso(valor: unknown): string | undefined {
  if (!valor) return undefined;
  if (typeof valor === 'string') return valor;
  if (valor instanceof Date) return valor.toISOString();
  if (typeof valor === 'object') {
    const segundos = (valor as { _seconds?: unknown; seconds?: unknown })._seconds
      ?? (valor as { _seconds?: unknown; seconds?: unknown }).seconds;
    if (typeof segundos === 'number' && Number.isFinite(segundos)) {
      return new Date(segundos * 1000).toISOString();
    }
  }
  return undefined;
}

function numeroOuNulo(valor: unknown): number | null {
  if (valor === null || valor === undefined || valor === '') return null;
  const n = Number(valor);
  return Number.isFinite(n) ? n : null;
}

export function mapearAnuncioParaImovel(item: any): Imovel {
  const ref = item?.dados_refinados || item?.dados_brutos || {};
  const mediaKit = item?.media_kit || item?.conteudo_gerado || {};
  const canalPortais = mediaKit?.canal_1_portais || {};

  const fotos = (Array.isArray(item?.fotos) ? item.fotos : [])
    .map((f: any) => (typeof f === 'string' ? f : f?.url_optimized || f?.url || f?.url_original))
    .filter((url: unknown): url is string => typeof url === 'string' && url.length > 0);

  const rawTransacao = String(ref.transacao || item?.transacao || ref.finalidade || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
  const isLocacao = rawTransacao.includes('loca') || rawTransacao.includes('alug');
  const isVenda = rawTransacao.includes('venda') || rawTransacao.includes('compra');

  const transacao: TipoTransacao = isLocacao && isVenda
    ? 'Venda e Locação'
    : (isLocacao ? 'Locação' : (isVenda ? 'Venda' : (ref.precoLocacao || item?.precoLocacao ? 'Locação' : 'Venda')));

  const precoLocacao = numeroOuNulo(
    ref.precoLocacao !== undefined && ref.precoLocacao !== null && ref.precoLocacao !== ''
      ? ref.precoLocacao
      : (item?.precoLocacao ?? ref.precoPacote ?? item?.precoPacote ?? (isLocacao ? (ref.preco ?? item?.preco) : null)),
  );

  const precoVenda = numeroOuNulo(
    ref.precoVenda !== undefined && ref.precoVenda !== null && ref.precoVenda !== ''
      ? ref.precoVenda
      : (item?.precoVenda ?? (isVenda ? (ref.preco ?? item?.preco) : null)),
  );

  const referencia = String(item?.referencia || ref.referencia || 'BRA0000');

  return {
    // Fallback determinístico: `Math.random()` gerava id novo a cada fetch, o
    // que remontava a lista inteira e recarregava todas as imagens.
    id: String(item?.ad_id || referencia.toLowerCase()),
    referencia,
    titulo: ref.titulo || canalPortais.titulo_comercial || mediaKit?.titulo_seo || `Imóvel ${referencia}`,
    descricao: ref.descricao
      || canalPortais.descricao_completa
      || mediaKit?.descricao_completa
      || mediaKit?.descricao_media
      || mediaKit?.legenda_social
      || '',
    tipo: ref.tipo || ref.tipoImovel || 'Imóvel',
    tipoImovel: ref.tipoImovel || ref.tipo || 'Imóvel',
    transacao,
    precoVenda,
    precoLocacao,
    precoPacote: numeroOuNulo(ref.precoPacote ?? item?.precoPacote),
    // `condominio` é o NOME (texto); a taxa mora em `valorCondominio`. Anúncios
    // antigos guardavam a taxa em `condominio`: o número é lido como taxa.
    condominio: typeof ref.condominio === 'string' ? ref.condominio : null,
    valorCondominio: typeof ref.valorCondominio === 'number'
      ? ref.valorCondominio
      : (typeof ref.condominio === 'number' ? ref.condominio : null),
    // `iptu` é legado (não está no tipo `Imovel`); o campo tipado é `iptuMensal`.
    iptuMensal: numeroOuNulo(ref.iptuMensal ?? ref.iptu),
    bairro: ref.bairro || ref.endereco?.bairro || '',
    cidade: ref.cidade || ref.endereco?.cidade || '',
    endereco: {
      rua: ref.rua || ref.endereco?.rua || '',
      numero: ref.numero || ref.endereco?.numero || '',
      bairro: ref.bairro || ref.endereco?.bairro || '',
      cidade: ref.cidade || ref.endereco?.cidade || '',
      estado: ref.estado || ref.endereco?.estado || 'SP',
      cep: ref.cep || ref.endereco?.cep || '',
    },
    fotos,
    caracteristicas: {
      quartos: ref.quartos ?? ref.caracteristicas?.quartos ?? null,
      suites: ref.suites ?? ref.caracteristicas?.suites ?? null,
      banheiros: ref.banheiros ?? ref.caracteristicas?.banheiros ?? null,
      vagas: ref.vagas ?? ref.caracteristicas?.vagas ?? null,
      areaUtil: ref.areaUtil ?? ref.caracteristicas?.areaUtil ?? null,
      areaTotal: ref.areaTotal ?? ref.caracteristicas?.areaTotal ?? null,
    },
    corretor: item?.corretor || {
      nome: item?.corretor_nome || 'Corretor',
      telefone: item?.corretor_telefone || '',
    },
    status: 'Ativo',
    destaque: true,
    createdAt: paraIso(item?.created_at),
    updatedAt: paraIso(item?.updated_at),
  };
}
