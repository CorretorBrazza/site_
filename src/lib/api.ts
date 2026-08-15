const envUrl = process.env.NEXT_PUBLIC_API_URL || 'https://imoveis-taboao-api-production-4cd9.up.railway.app';
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

