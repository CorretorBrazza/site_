const defaultProdApiUrl = 'https://imoveis-taboao-api-production-4cd9.up.railway.app';
const envUrl = process.env.NEXT_PUBLIC_API_URL || (
  process.env.NODE_ENV === 'production'
    ? defaultProdApiUrl
    : 'http://localhost:3001'
);
const cleanBaseUrl = envUrl.trim().replace(/\/+$/, '').replace(/\/api\/v1\/?$/, '');

/** Base absoluta. Usada no servidor (server actions), onde URL relativa não funciona. */
export const API_BASE_URL = `${cleanBaseUrl}/api/v1`;

/**
 * Base usada no navegador: relativa de propósito.
 *
 * Passa pelo rewrite `/api/v1/:path*` do next.config.ts e sai para a Railway,
 * o que faz a requisição ser same-origin. É o que permite o cookie de sessão
 * httpOnly ser first-party e valer com `SameSite=Lax`, em vez de depender de
 * `SameSite=None` e de o usuário não bloquear cookies de terceiros.
 */
export const API_BROWSER_BASE_URL = '/api/v1';

const COOKIE_CSRF = 'imv_csrf';

/** O token de CSRF é legível de propósito: o JS precisa colocá-lo no header. */
function lerTokenCsrf(): string | null {
  if (typeof document === 'undefined') return null;
  for (const parte of document.cookie.split(';')) {
    const eq = parte.indexOf('=');
    if (eq < 0) continue;
    if (parte.slice(0, eq).trim() === COOKIE_CSRF) {
      try {
        return decodeURIComponent(parte.slice(eq + 1).trim());
      } catch {
        return parte.slice(eq + 1).trim();
      }
    }
  }
  return null;
}

const METODOS_SEGUROS = new Set(['GET', 'HEAD']);

/**
 * Chamadas autenticadas do corretor.
 *
 * Não manda `Authorization`: a credencial é o cookie httpOnly, que o JS não
 * enxerga. Manda o header de CSRF quando muda estado, porque cookie vai sozinho
 * no request e um POST cross-site poderia chegar com a sessão da vítima.
 *
 * Não há mais "tem token?" no cliente: quem decide se a sessão vale é a API. Um
 * 401 aqui é o mesmo sinal de sessão expirada que antes vinha do localStorage.
 */
export async function fetchBrokerApi<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<{ success: boolean; data?: T; error?: string; message?: string }> {
  const headers: Record<string, string> = { ...(options.headers as Record<string, string>) };
  const metodo = String(options.method || 'GET').toUpperCase();

  if (!METODOS_SEGUROS.has(metodo)) {
    const csrf = lerTokenCsrf();
    if (csrf) headers['x-csrf-token'] = csrf;
  }

  return fetchApi<T>(endpoint, { ...options, headers, credentials: 'same-origin' });
}

const COOKIE_ADMIN_CSRF = 'imv_admin_csrf';

function lerTokenCsrfAdmin(): string | null {
  if (typeof document === 'undefined') return null;
  for (const parte of document.cookie.split(';')) {
    const eq = parte.indexOf('=');
    if (eq < 0) continue;
    if (parte.slice(0, eq).trim() === COOKIE_ADMIN_CSRF) {
      try {
        return decodeURIComponent(parte.slice(eq + 1).trim());
      } catch {
        return parte.slice(eq + 1).trim();
      }
    }
  }
  return null;
}

/**
 * Chamadas do painel administrativo.
 *
 * O painel lia um JWT do `localStorage` e o mandava em `Authorization`. Isso
 * punha a credencial no mesmo origin que carrega GTM, GA e AdSense: qualquer
 * XSS — que a CSP não bloqueia, porque `script-src` tem `unsafe-inline` — lia o
 * token e passava a injetar crédito, excluir anúncio e ler o e-mail e telefone
 * de todos os corretores.
 *
 * A sessão do admin agora também é cookie httpOnly, em cookie próprio
 * (`imv_admin_session`). O XSS ainda age como a vítima, mas não consegue roubar
 * a credencial para usar depois. `Bearer` continua aceito pela API para uso por
 * script e testes.
 */
export async function fetchAdminApi<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T & { success: boolean; data?: any; error?: string; message?: string }> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  const metodo = String(options.method || 'GET').toUpperCase();

  if (!METODOS_SEGUROS.has(metodo)) {
    const csrf = lerTokenCsrfAdmin();
    if (csrf) headers['x-csrf-token'] = csrf;
  }

  // Devolve o corpo INTEIRO, e não só `data`: os endpoints de /admin respondem
  // com `{ success, data, ...data }`, e o painel lê campos do topo (`corretores`,
  // `gemini_metrics`). `fetchApi` reduziria a `{ success, data }` e quebraria.
  const res = await fetch(resolveApiUrl(endpoint), {
    ...options,
    headers,
    credentials: 'same-origin',
  });

  const text = await res.text();
  if (!text) {
    return { success: res.ok } as never;
  }
  try {
    return JSON.parse(text);
  } catch {
    return { success: false, error: `Resposta inesperada do servidor (HTTP ${res.status}).` } as never;
  }
}

/** Logout do admin: expira o cookie httpOnly no servidor, não só no navegador. */
export async function logoutAdminSession(): Promise<void> {
  try {
    await fetchAdminApi('/admin/logout', { method: 'POST' });
  } catch {
    // Mesmo que a chamada falhe, o cookie é expirado na próxima navegação.
  }
}

/**
 * O site roda com `trailingSlash: true`, que responde 308 de `/api/v1/x` para
 * `/api/v1/x/`. Um 308 em toda chamada significa um round-trip extra e um POST
 * dependendo de o fetch seguir redirect preservando o corpo.
 *
 * Normalizar a barra aqui evita o 308 por completo. O Express aceita barra
 * final por padrao, entao `/anuncios/?limit=3` responde igual a `/anuncios`.
 */
function comBarraFinal(endpoint: string): string {
  const [caminho, query] = endpoint.split('?');
  const alvo = caminho.replace(/\/+$/, '');
  return query !== undefined ? `${alvo}/?${query}` : `${alvo}/`;
}

/** URL final de uma chamada, respeitando a barra final e o proxy do browser. */
export function resolveApiUrl(endpoint: string): string {
  const finalEndpoint = comBarraFinal(endpoint.replace(/^\/+/, ''));
  return typeof window === 'undefined'
    ? `${API_BASE_URL}/${finalEndpoint}`
    : `${API_BROWSER_BASE_URL}/${finalEndpoint}`;
}

export async function fetchApi<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<{ success: boolean; data?: T; error?: string; message?: string }> {
  const finalEndpoint = comBarraFinal(endpoint.replace(/^\/+/, ''));
  const url = typeof window === 'undefined'
    ? `${API_BASE_URL}/${finalEndpoint}`
    : `${API_BROWSER_BASE_URL}/${finalEndpoint}`;

  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    });

    const text = await res.text();
    let json: any = {};

    if (text) {
      // Se a resposta for HTML (ex: 404 do Railway, erro 502/503 ou fallback local)
      if (text.trim().startsWith('<') || text.includes('<!DOCTYPE')) {
        return {
          success: false,
          error: `A API no Railway retornou página HTML (Status ${res.status}). URL chamada: ${url}. Verifique se a URL da API no Railway está ativa.`,
        };
      }

      try {
        json = JSON.parse(text);
      } catch (e) {
        return {
          success: false,
          error: `Erro ao ler resposta da API (${res.status}). URL chamada: ${url}`,
        };
      }
    }

    if (!res.ok) {
      // Quem valida a sessão é a API, não o cliente. Um 401 aqui é o sinal de
      // sessão expirada, que antes vinha da ausência do token no localStorage.
      if (res.status === 401) {
        return { success: false, error: 'Sessão expirada. Faça login novamente.' };
      }
      if (res.status === 403 && /csrf/i.test(String(json.message || json.error || ''))) {
        return { success: false, error: 'Sessão expirada. Faça login novamente.' };
      }
      return {
        success: false,
        error: json.message || json.error || `Erro HTTP ${res.status}`,
      };
    }

    return json;
  } catch (err: any) {
    return {
      success: false,
      error: `Falha na conexão com a API (${url}): ${err.message}`,
    };
  }
}



// Métodos de API específicos para o ecossistema V2 Imóveis Taboão

type ApiResult<T = any> = { success: boolean; data?: T; error?: string; message?: string };

/**
 * Troca o Magic Token de nível de conta (o de 24h enviado no resumo do WhatsApp) por uma
 * sessão de corretor.
 *
 * Regra de segurança: este fluxo autentica a CONTA, então o token de aprovação de anúncio
 * (o de ~7d que vai no link /aprovar) é rejeitado pela API. Nunca grave o token da URL
 * direto no storage: grave apenas o `sessionToken` devolvido aqui, depois de validado.
 */
export async function exchangeMagicToken(magicToken: string) {
  const clean = String(magicToken || '').trim();
  if (!clean) {
    return { success: false, error: 'Link de acesso sem token de segurança.' };
  }

  const res = await fetchApi<{ token?: string; user?: any }>('/auth/magic-login', {
    method: 'POST',
    body: JSON.stringify({ token: clean }),
  });

  if (!res.success) {
    return { success: false, error: res.error || 'Link de acesso inválido ou expirado.' };
  }

  const sessionToken = res.data?.token;
  if (!sessionToken) {
    return { success: false, error: 'A API não retornou uma sessão válida para este link.' };
  }

  return { success: true, data: { sessionToken, user: res.data?.user || null } };
}

/**
 * A sessão NÃO é guardada aqui.
 *
 * O token fica em cookie httpOnly, que o JavaScript não consegue ler. Guardá-lo
 * em localStorage seria devolver o problema que a migração resolveu: qualquer
 * XSS lê o credential e leva a sessão embora. O que sobra no storage é o perfil,
 * só para a UI não piscar no primeiro render.
 */
export function persistBrokerSession(_sessionToken: string, user: any): void {
  if (typeof window === 'undefined') return;
  if (user) {
    window.localStorage.setItem('user_info', JSON.stringify(user));
  }
}

/**
 * Encerra a sessão.
 *
 * Apagar o localStorage não basta: o cookie httpOnly sobrevive a isso, porque
 * só o servidor consegue expirá-lo. Sem esta chamada, "sair" no site deixaria a
 * sessão ativa — o pior tipo de bug de logout, porque passa despercebido.
 */
export async function logoutBrokerSession(): Promise<void> {
  try {
    await fetchApi('/auth/logout', { method: 'POST' });
  } catch {
    // Mesmo que a chamada falhe, o localStorage é limpo abaixo. O cookie
    // expira por conta própria no Max-Age, e o /auth/me passa a recusar.
  }
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem('auth_token');
  window.localStorage.removeItem('user_info');
}

/**
 * Remove o token da query string assim que ele for consumido, para não vazar em Referer,
 * histórico do navegador e logs do servidor.
 */
export function stripTokenFromUrl(): void {
  if (typeof window === 'undefined') return;
  const url = new URL(window.location.href);
  let changed = false;
  for (const key of ['token', 'auth_token', 'ad_id']) {
    if (url.searchParams.has(key)) {
      url.searchParams.delete(key);
      changed = true;
    }
  }
  if (!changed) return;
  window.history.replaceState(null, '', url.pathname + url.search + url.hash);
}

function missingMagicLinkCredentials(token: string | undefined | null, adId?: string | null): ApiResult | null {
  if (!String(token || '').trim()) return { success: false, error: 'Magic Link sem token de segurança. Abra o link completo recebido por e-mail ou WhatsApp.' };
  if (adId !== undefined && adId !== null && !String(adId).trim()) return { success: false, error: 'Magic Link sem identificação do anúncio.' };
  return null;
}

export async function validateMagicToken(token: string, adId?: string) {
  const invalid = missingMagicLinkCredentials(token, adId);
  if (invalid) return invalid;
  return fetchApi('/validate-token', {
    method: 'POST',
    body: JSON.stringify({ token: token.trim(), ad_id: adId?.trim() || undefined }),
  });
}

/**
 * `getApprovalDetails` foi removido daqui de prop├│sito.
 *
 * Ele fazia `GET /approval?ad_id=...&token=...`, e a query string ├® exatamente
 * o vetor que a migra├º├úo de `/aprovar` eliminou: log de acesso do proxy,
 * `Referer` de terceiro, hist├│rico do navegador, analytics. O backend removeu a
 * rota GET correspondente, ent├úo a fun├º├úo j├í estava quebrada E insegura.
 *
 * O fluxo de aprova├º├úo usa `src/lib/approval-client.ts`, que faz POST com o
 * token no corpo. A tela nunca precisou desta fun├º├úo.
 */

export async function approveAd(token: string, adId: string, dadosEditados?: any) {
  const invalid = missingMagicLinkCredentials(token, adId);
  if (invalid) return invalid;
  return fetchApi('/approve', {
    method: 'POST',
    body: JSON.stringify({
      token: token.trim(),
      ad_id: adId.trim(),
      acao: 'APROVAR',
      dados_editados: dadosEditados,
    }),
  });
}

export async function rejectAd(token: string, adId: string, motivo?: string) {
  const invalid = missingMagicLinkCredentials(token, adId);
  if (invalid) return invalid;
  return fetchApi('/approve', {
    method: 'POST',
    body: JSON.stringify({
      token: token.trim(),
      ad_id: adId.trim(),
      acao: 'REJEITAR',
      motivo_rejeicao: motivo || 'Rejeitado na tela de aprovação do site',
    }),
  });
}

export async function editAd(token: string, adId: string, camposEditados: any) {
  const invalid = missingMagicLinkCredentials(token, adId);
  if (invalid) return invalid;
  return fetchApi('/edit', {
    method: 'POST',
    body: JSON.stringify({
      token: token.trim(),
      ad_id: adId.trim(),
      campos_editados: camposEditados,
    }),
  });
}

export async function reorderPhotos(token: string, adId: string, novaOrdem: number[]) {
  const invalid = missingMagicLinkCredentials(token, adId);
  if (invalid) return invalid;
  return fetchApi('/reorder-photos', {
    method: 'POST',
    body: JSON.stringify({
      token: token.trim(),
      ad_id: adId.trim(),
      nova_ordem: novaOrdem,
    }),
  });
}

/** Snapshot de revisão devolvido por `POST /review/resolve`. Espelha `ReviewSnapshot` da API. */
export interface ReviewSnapshot {
  ad_id: string;
  referencia: string;
  status: string;
  knowledge_status: string | null;
  review_gate: string | null;
  valor: number | null;
  dados: Record<string, any>;
  fotos: string[];
  created_at: any;
}

/**
 * Resultado da resolução do token de revisão.
 *
 * Discriminado de propósito, e não um `{ success, error }` genérico. A tela precisa reagir
 * diferente a "link inválido" e "sistema indisponível": o primeiro é definitivo, o segundo é
 * retentável. Um único `error` com a mensagem dentro obrigaria a página a interpretar texto para
 * decidir se mostra "tente novamente", e a decisão passaria a depender da redação da mensagem.
 */
export type ReviewResolveResult =
  | { kind: 'ok'; anuncio: ReviewSnapshot }
  | { kind: 'invalid' }
  | { kind: 'unavailable' };

/**
 * Resolve um token de revisão no anúncio correspondente.
 *
 * Não usa `fetchApi` porque o resultado precisa do STATUS HTTP: é o status que separa 404
 * (link inválido) de 503 (indisponível), e `fetchApi` achata os dois em `{ success: false }`.
 *
 * O token vai no corpo de um POST, nunca na URL. Esta função não loga, não persiste e não
 * coloca o token em nenhum header além do corpo; quem a chama é responsável por não guardá-lo
 * fora da memória do componente.
 */
export async function resolveReviewToken(token: string): Promise<ReviewResolveResult> {
  const clean = String(token || '').trim();
  if (!clean) return { kind: 'invalid' };

  const url = resolveApiUrl('/review/resolve');

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: clean }),
    });

    // 400 (corpo inválido) e 404 (token inexistente/expirado/fora do portão) são o mesmo
    // desfecho para o usuário: o link não abre. A API responde a mesma mensagem para os dois.
    if (res.status === 400 || res.status === 404) return { kind: 'invalid' };

    // 503 e qualquer outro não-2xx (incluindo 5xx e o HTML de proxy fora do ar) são retentáveis.
    if (!res.ok) return { kind: 'unavailable' };

    const json = (await res.json().catch(() => null)) as
      | { success?: boolean; data?: { anuncio?: ReviewSnapshot } }
      | null;
    const anuncio = json?.data?.anuncio;
    if (!json?.success || !anuncio) return { kind: 'unavailable' };

    return { kind: 'ok', anuncio };
  } catch {
    // Falha de rede/DNS/offline: indistinguível de indisponibilidade para o usuário.
    return { kind: 'unavailable' };
  }
}

export async function getCorretorProfile() {
  return fetchBrokerApi('/corretor/me', { method: 'GET' });
}

export async function registerCorretor(dados: { nome: string; email: string; telefone?: string; plano?: string }) {
  return fetchApi('/corretor', {
    method: 'POST',
    body: JSON.stringify(dados),
  });
}

export async function getAnunciosPublicos(limit = 20) {
  return fetchApi(`/anuncios?limit=${limit}`, { method: 'GET' });
}

export async function getMeusAnuncios(limit = 100) {
  return fetchBrokerApi(`/me/anuncios?limit=${limit}`, { method: 'GET' });
}

export async function getAnuncioForBroker(adId: string) {
  return fetchBrokerApi(`/me/anuncios/${encodeURIComponent(adId)}`, { method: 'GET' });
}

export async function updateAnuncioForBroker(adId: string, data: Record<string, any>) {
  return fetchBrokerApi(`/me/anuncios/${encodeURIComponent(adId)}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}



// ==========================================
// PRODUTO: LINK DINÂMICO DE PUBLICAÇÃO
// ==========================================

export type TipoPergunta = 'botoes' | 'selecao_multipla' | 'moeda' | 'numero' | 'texto';

/**
 * Procedência de um valor, exatamente como o backend a nomeia.
 *
 * As nove entradas espelham a união `OrigemDado` de `review.types.ts`. A versão anterior deste
 * tipo listava quatro delas, e a consequência não era um erro de compilação: `ReviewField.origem`
 * chegava do JSON como `string`, o `switch` do componente não casava com `A_VALIDAR` nem com
 * `CONFLITANTE`, e o `default` — que era "Declarado" — os mostrava ao corretor como declaração
 * dele. Um campo que a Extraction V2 marcou como pendente aparecia como confirmado, e o corretor
 * aprovava sem ver.
 *
 * `VALIDADO` não faz parte de `ExtractionStatus`: existe só em `pistas_geograficas`, onde uma
 * fonte externa confirmou o bairro. É mais forte que `DECLARADO` — por isso tem entrada própria
 * em vez de ser dobrado em `A_VALIDAR`.
 *
 * `NAO_APLICAVEL` existe para o campo que não vale para este tipo de imóvel. Não é dado faltando,
 * e tratá-lo como pendência ensinaria o corretor a preencher o que não existe.
 */
export type OrigemDado =
  | 'DECLARADO'
  | 'VISUAL'
  | 'INFERIDO'
  | 'CORRETOR'
  | 'VALIDADO'
  | 'A_VALIDAR'
  | 'CONFLITANTE'
  | 'NAO_INFORMADO'
  | 'NAO_APLICAVEL';

export interface DynamicQuestion {
  id: string;
  campo: string;
  tipo: TipoPergunta;
  pergunta: string;
  opcoes?: string[];
  obrigatoria: boolean;
  critica?: boolean;
  respondida: boolean;
  resposta_atual?: unknown;
ajuda?: string;
  /**
   * Procedência da resposta, quando a pergunta veio de uma fonte rastreável.
   *
   * O backend popula este campo (`origemDoStatus` em `review-extraction-v2.adapter.ts`), mas a
   * pergunta dinâmica aparecia na tela sem selo de procedência: a ausência não era falta de dado,
   * era o tipo `DynamicQuestion` sem o campo. Sem ele, uma pergunta que a V2 lançou para resolver
   * uma pista fraca parece a pergunta que o corretor mesmo ideou, e as duas têm pesos diferentes
   * no cálculo de completude.
   */
  origem?: OrigemDado;
}

export interface ReviewField {
  campo: string;
  rotulo: string;
  valor: unknown;
  origem: OrigemDado;
  confianca: number;
  confirmado: boolean;
  editavel: boolean;
  obrigatorio?: boolean;
  critico?: boolean;
  /**
   * Estado da Extraction V2 que originou o campo.
   *
   * Diferente de `origem`: a origem diz de onde veio o valor, o status diz o quanto a V2 confia
   * nele. Uma pista `A_VALIDAR` que virou campo editável tem `origem: 'A_VALIDAR'` e
   * `status: 'A_VALIDAR'`; um campo criado a partir de dado visual tem `origem: 'VISUAL'` e
   * `status: 'CONFIRMADO'`. Lendo o par, sabe-se se o selo é de procedência ou de verificação.
   */
  status?: string;
  /**
   * ID da pista de evidência que originou o campo.
   *
   * Sem isto, `A_VALIDAR` e `CONFLITANTE` são rótulos sem lastro: o corretor é avisado de que
   * precisa confirmar, mas não tem como saber o que viu. É o mesmo identificador que a tela de
   * evidência usa para abrir a origem.
   */
  evidence_id?: string;
}

export interface ReviewPreviewData {
  titulo: string;
  descricao: string;
  ficha_tecnica: string;
  destaques: string[];
  texto_portal: string;
  texto_whatsapp: string;
  redes_sociais: string;
  tags: string[];
}

export interface ReviewSessionData {
  ad_id: string;
  referencia: string;
  status: string;
  knowledge_status: string | null;
  review_gate: string | null;
  expires_at: string;
  valor: number | null;
  fotos: string[];
  capa_index: number;
  capa_sugerida_ia: number | null;
  dados: Record<string, any>;
  campos_identificados: ReviewField[];
  campos_pendentes: string[];
  perguntas_dinamicas: DynamicQuestion[];
  conflitos: Array<{ campo: string; descricao: string }>;
  preview: ReviewPreviewData | null;
  review_state_version: number;
  completude: number; // 0-100%
  created_at: string | null;
}

export interface PublishResult {
  ad_id: string;
  referencia: string;
  status: string;
  saldo_restante: number;
  published_at: string;
  media_kit?: unknown;
  message?: string;
}

export type ReviewSessionResult =
  | { kind: 'ok'; session: ReviewSessionData }
  | { kind: 'invalid' }
  | { kind: 'unavailable' };

/**
 * Carrega a sessão completa do Link Dinâmico.
 */
export async function getReviewSession(token: string): Promise<ReviewSessionResult> {
  const clean = String(token || '').trim();
  if (!clean) return { kind: 'invalid' };

  const url = resolveApiUrl('/review/session');

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: clean }),
    });

    if (res.status === 400 || res.status === 404) return { kind: 'invalid' };
    if (!res.ok) return { kind: 'unavailable' };

    const json = (await res.json().catch(() => null)) as
      | { success?: boolean; data?: { session?: ReviewSessionData } }
      | null;
    const session = json?.data?.session;
    if (!json?.success || !session) return { kind: 'unavailable' };

    return { kind: 'ok', session };
  } catch {
    return { kind: 'unavailable' };
  }
}

/**
 * Lê o inteiro de "Conflito de edição: a versão <n> já está salva".
 *
 * Devolve `null` em vez de adivinhar quando não há número legível. Adivinhar `version + 1` seria
 * pior que não reconciliar: um palpite errado produz outro 409, e o 409 seguinte repete o palpite.
 * É exatamente o loop que a correção do controle de versão elimina, e um fallback otimista o
 * reabria.
 */
function lerVersaoDaMensagem(mensagem: unknown): number | null {
  if (typeof mensagem !== 'string') return null;
  const achado = mensagem.match(/vers[aã]o\s+(\d+)/i);
  if (!achado) return null;
  const numero = Number(achado[1]);
  return Number.isInteger(numero) && numero >= 0 ? numero : null;
}

/**
 * Salva rascunho de edições do corretor (Autosave).
 *
 * `serverVersion` só aparece no 409, e ele existe por um motivo específico: o `ConflictError` do
 * backend não tem campo estruturado para a versão, só a frase `Conflito de edição: a versão <n>
 * já está salva. Recarregue para atualizar.` O controlador de versão precisa do `<n>` para
 * reconciliar sozinho; sem ele, sobraria só a opção de parar e mandar o corretor recarregar, o que
 * jogaria fora a edição em curso. A extração fica aqui, num único lugar, para que o parsing da
 * frase não seja reimplementado — nem errado de novo — em cada tela.
 */
export async function autosaveReview(
  token: string,
  dados: Record<string, unknown>,
  version: number,
  capaIndex?: number,
): Promise<{
  success: boolean;
  version?: number;
  error?: string;
  isConflict?: boolean;
  serverVersion?: number;
}> {
  const clean = String(token || '').trim();
  if (!clean) return { success: false, error: 'Token ausente' };

  const url = resolveApiUrl('/review/autosave');

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        token: clean,
        dados,
        version,
        capa_index: capaIndex,
      }),
    });

    const json = await res.json().catch(() => null);

    if (res.status === 409) {
      return {
        success: false,
        isConflict: true,
        error: json?.message || 'Conflito de versão',
        // `?? undefined` e não `??`: a propriedade é opcional, e `null` aqui faria o chamador
        // distinguir "não li" de "não existe" sem necessidade.
        serverVersion: lerVersaoDaMensagem(json?.message) ?? lerVersaoDaMensagem(json?.error) ?? undefined,
      };
    }

    if (!res.ok) {
      return { success: false, error: json?.message || `Erro HTTP ${res.status}` };
    }

    return { success: true, version: json?.data?.version };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Falha na conexão';
    return { success: false, error: msg };
  }
}

/**
 * Salva resposta de pergunta dinâmica.
 *
 * Esta chamadabumpara `review_state_version`: `saveAnswer` incrementa o contador no Firestore e
 * devolve a versão nova em `data.version`. É a informação que faltava ser repassada adiante — a
 * versão ignorada aqui fazia o autosave seguinte mandar o número velho e tomar 409. Quem chama é
 * obrigado a aplicar o `version` devolvido.
 */
export async function answerReviewQuestion(
  token: string,
  questionId: string,
  resposta: unknown,
): Promise<{ success: boolean; version?: number; error?: string }> {
  const clean = String(token || '').trim();
  if (!clean) return { success: false, error: 'Token ausente' };

  const url = resolveApiUrl('/review/answer');

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        token: clean,
        question_id: questionId,
        resposta,
      }),
    });

    const json = await res.json().catch(() => null);
    if (!res.ok) {
      return { success: false, error: json?.message || `Erro HTTP ${res.status}` };
    }

    return { success: true, version: json?.data?.version };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Falha na conexão';
    return { success: false, error: msg };
  }
}

/**
 * Seleciona a foto de capa.
 *
 * Não bumpa `review_state_version`. `setCover` grava `capa_index` e devolve só `{ success,
 * capa_index }` — não há `version` no corpo porque não houve incremento. Confundir as duas rotas
 * custaria um 409 evitável: tratar a capa como se tivesse bumpado a versão faz o cliente avançar o
 * contador local, e o próximo autosave manda um número que o servidor nunca guardou.
 */
export async function selectReviewCover(
  token: string,
  photoIndex: number,
): Promise<{ success: boolean; capa_index?: number; error?: string }> {
  const clean = String(token || '').trim();
  if (!clean) return { success: false, error: 'Token ausente' };

  const url = resolveApiUrl('/review/cover');

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        token: clean,
        photo_index: photoIndex,
      }),
    });

    const json = await res.json().catch(() => null);
    if (!res.ok) {
      return { success: false, error: json?.message || `Erro HTTP ${res.status}` };
    }

    return { success: true, capa_index: json?.data?.capa_index };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Falha na conexão';
    return { success: false, error: msg };
  }
}

/**
 * Regenera a prévia comercial viva.
 */
export async function generateReviewPreview(
  token: string,
): Promise<{ success: boolean; preview?: ReviewPreviewData; error?: string }> {
  const clean = String(token || '').trim();
  if (!clean) return { success: false, error: 'Token ausente' };

  const url = resolveApiUrl('/review/preview');

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: clean }),
    });

    const json = await res.json().catch(() => null);
    if (!res.ok) {
      return { success: false, error: json?.message || `Erro HTTP ${res.status}` };
    }

    return { success: true, preview: json?.data?.preview };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Falha na conexão';
    return { success: false, error: msg };
  }
}

/**
 * Publicação final e débito atômico de 1 crédito.
 */
export async function publishReview(
  token: string,
  idempotencyKey?: string,
): Promise<{ success: boolean; result?: PublishResult; error?: string; code?: string }> {
  const clean = String(token || '').trim();
  if (!clean) return { success: false, error: 'Token ausente', code: 'TOKEN_AUSENTE' };

  const url = resolveApiUrl('/review/publish');

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        token: clean,
        idempotency_key: idempotencyKey,
      }),
    });

    const json = await res.json().catch(() => null);

    if (res.status === 402) {
      return {
        success: false,
        error: json?.message || 'Saldo insuficiente de créditos. Recarregue para publicar.',
        code: 'SALDO_INSUFICIENTE',
      };
    }

    if (res.status === 401 || res.status === 404) {
      return {
        success: false,
        error: json?.message || 'Link de publicação inválido ou expirado.',
        code: 'TOKEN_INVALIDO',
      };
    }

    if (!res.ok) {
      return {
        success: false,
        error: json?.message || `Erro HTTP ${res.status}`,
        code: 'ERRO_PUBLICACAO',
      };
    }

    return { success: true, result: json?.data?.result };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Falha na conexão com o servidor';
    return { success: false, error: msg, code: 'ERRO_REDE' };
  }
}
