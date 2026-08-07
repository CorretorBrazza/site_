const rawBaseUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1').trim().replace(/\/+$/, '');
export const API_BASE_URL = rawBaseUrl.endsWith('/api/v1') ? rawBaseUrl : `${rawBaseUrl}/api/v1`;

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
      try {
        json = JSON.parse(text);
      } catch (e) {
        return {
          success: false,
          error: `Resposta da API não é um JSON válido (${res.status}): ${text.substring(0, 150)}`,
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
      error: err.message || 'Falha na conexão com a API Railway.',
    };
  }
}


// Métodos de API específicos para o ecossistema V2 Imóveis Taboão

export async function validateMagicToken(token: string, adId?: string) {
  return fetchApi('/validate-token', {
    method: 'POST',
    body: JSON.stringify({ token, ad_id: adId }),
  });
}

export async function getApprovalDetails(adId: string, token: string) {
  return fetchApi(`/approval?ad_id=${encodeURIComponent(adId)}&token=${encodeURIComponent(token)}`, {
    method: 'GET',
  });
}

export async function approveAd(token: string, adId: string, dadosEditados?: any) {
  return fetchApi('/approve', {
    method: 'POST',
    body: JSON.stringify({
      token,
      ad_id: adId,
      acao: 'APROVAR',
      dados_editados: dadosEditados,
    }),
  });
}

export async function rejectAd(token: string, adId: string, motivo?: string) {
  return fetchApi('/approve', {
    method: 'POST',
    body: JSON.stringify({
      token,
      ad_id: adId,
      acao: 'REJEITAR',
      motivo_rejeicao: motivo || 'Rejeitado na tela de aprovação do site',
    }),
  });
}

export async function editAd(token: string, adId: string, camposEditados: any) {
  return fetchApi('/edit', {
    method: 'POST',
    body: JSON.stringify({
      token,
      ad_id: adId,
      campos_editados: camposEditados,
    }),
  });
}

export async function reorderPhotos(token: string, adId: string, novaOrdem: number[]) {
  return fetchApi('/reorder-photos', {
    method: 'POST',
    body: JSON.stringify({
      token,
      ad_id: adId,
      nova_ordem: novaOrdem,
    }),
  });
}

export async function getCorretorProfile(email: string) {
  return fetchApi(`/corretor/${encodeURIComponent(email)}`, {
    method: 'GET',
  });
}

export async function registerCorretor(dados: { nome: string; email: string; telefone?: string; plano?: string }) {
  return fetchApi('/corretor', {
    method: 'POST',
    body: JSON.stringify(dados),
  });
}

export async function getAnuncios(corretorEmail?: string, status?: string) {
  const query = new URLSearchParams();
  if (corretorEmail) query.append('corretor_email', corretorEmail);
  if (status) query.append('status', status);

  return fetchApi(`/anuncios?${query.toString()}`, {
    method: 'GET',
  });
}

