const defaultProdApiUrl = 'https://imoveis-taboao-api-production-4cd9.up.railway.app';
const envUrl = process.env.NEXT_PUBLIC_API_URL || (
  process.env.NODE_ENV === 'production'
    ? defaultProdApiUrl
    : 'http://localhost:3001'
);
const cleanBaseUrl = envUrl.trim().replace(/\/+$/, '').replace(/\/api\/v1\/?$/, '');

export const API_BASE_URL = `${cleanBaseUrl}/api/v1`;



function getBrokerToken(): string | null {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem('auth_token');
}

export async function fetchBrokerApi<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<{ success: boolean; data?: T; error?: string; message?: string }> {
  const token = getBrokerToken();
  if (!token) {
    return { success: false, error: 'Sessão expirada. Faça login novamente.' };
  }

  return fetchApi<T>(endpoint, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function fetchApi<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<{ success: boolean; data?: T; error?: string; message?: string }> {
  const cleanEndpoint = endpoint.replace(/^\/+/, '');
  const url = `${API_BASE_URL}/${cleanEndpoint}`;

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
 * Persiste a sessão devolvida pelo auto-login. Deve ser chamada SOMENTE depois de um
 * `exchangeMagicToken` bem-sucedido.
 */
export function persistBrokerSession(sessionToken: string, user: any): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem('auth_token', sessionToken);
  const isHttps = window.location.protocol === 'https:';
  document.cookie = `auth_token=${sessionToken}; path=/; max-age=2592000; SameSite=Lax${isHttps ? '; Secure' : ''}`;
  if (user) {
    window.localStorage.setItem('user_info', JSON.stringify(user));
  }
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

export async function getApprovalDetails(adId: string, token: string) {
  const invalid = missingMagicLinkCredentials(token, adId);
  if (invalid) return invalid;
  const params = new URLSearchParams({ ad_id: adId.trim(), token: token.trim() });
  return fetchApi(`/approval?${params.toString()}`, {
    method: 'GET',
  });
}

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

