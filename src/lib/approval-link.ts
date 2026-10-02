/**
 * Núcleo do fluxo de aprovação por fragmento + POST.
 *
 * Módulo deliberadamente sem React, sem Next e sem `window`: só tipos e funções
 * puras com dependências injetadas. É isso que permite testar o comportamento
 * que importa — de onde o token vem, para onde ele vai e o que a tela mostra
 * quando ele falha — sem backend real, sem jsdom e sem navegador.
 *
 * NENHUMA função aqui registra o token. Não há `console`, não há `analytics`, não
 * há `Sentry`. O token sai do fragmento, vai para o corpo de um POST e some.
 */

/** Motivo pelo qual o link não pode ser usado. Derivado só do status HTTP. */
export type ApprovalFailure =
  | 'ausente'
  | 'invalido'
  | 'ja-utilizado'
  | 'sem-credito'
  | 'indisponivel'
  | 'desconhecido';

export interface ApprovalLink {
  /** Token do link. Vazio quando o fragmento não trouxe token. */
  token: string;
  /**
   * `ad_id` do fragmento. É APENAS checagem de consistência: quem autoriza é o
   * hash do token no backend. A tela nunca o usa para escolher o anúncio, e a
   * resposta do backend é sempre a que decide qual anúncio é este.
   */
  adId: string;
}

/** Janela mínima, injetada para manter o módulo testável fora do navegador. */
export interface ApprovalWindow {
  location: { hash: string; pathname: string };
  history: { replaceState: (data: unknown, unused: string, url?: string) => void };
}

/**
 * Lê o par `token`/`ad_id` do FRAGMENTO.
 *
 * Deliberadamente não existe leitura de `location.search`: o contrato novo é
 * `#token=...&ad_id=...`, e uma query string com token é exatamente o vetor que
 * esta migração remove (log de acesso do proxy, `Referer` de terceiro, histórico,
 * analytics). Aceitar `?token=` "por compatibilidade" reintroduziria o problema
 * inteiro, então um link antigo cai no estado "ausente" em vez de funcionar.
 */
export function lerLinkDoFragmento(hash: string): ApprovalLink {
  const bruto = String(hash || '');
  const semHash = bruto.charAt(0) === '#' ? bruto.slice(1) : bruto;
  if (!semHash) return { token: '', adId: '' };

  let params: URLSearchParams;
  try {
    params = new URLSearchParams(semHash);
  } catch {
    return { token: '', adId: '' };
  }

  // `adId` também aceita `adId` porque é a grafia que o portal já usava em
  // links antigos dentro do fragmento; os dois nomes são o MESMO campo de
  // consistência, nunca autoridade.
  const adId = String(params.get('ad_id') || params.get('adId') || '').trim();
  const token = String(params.get('token') || '').trim();

  return { token, adId };
}

/**
 * Remove a credencial da barra de endereços.
 *
 * `replaceState(null, '', window.location.pathname)` troca a entrada do histórico
 * em vez de empilhar uma nova, então o `#token=...` não fica disponível no botão
 * "voltar" do navegador. Passar só o `pathname` também descarta a query string,
 * o que cobre o link antigo em `?token=`: mesmo que esta página não o leia, ela
 * não o deixa na barra de endereços para vazar no `Referer` de um link clicado
 * depois daqui.
 *
 * Falha de `replaceState` não pode derrubar a tela: um navegador com histórico
 * restrito ainda precisa dizer "link inválido" ao corretor.
 */
export function limparUrlDaAprovacao(win: ApprovalWindow): void {
  try {
    win.history.replaceState(null, '', win.location.pathname);
  } catch {
    // sem histórico manipulável: segue sem limpar. A tela ainda funciona.
  }
}

/**
 * Ponto de entrada do fluxo: lê o fragmento e limpa a URL imediatamente.
 *
 * A limpeza acontece ANTES de qualquer `await`, e acontece mesmo quando o
 * fragmento não tem token. Se a leitura viesse primeiro e a limpeza depois, uma
 * falha de rede deixaria o `#token=` exposto na barra de endereços durante toda
 * a sessão — que é o intervalo em que o usuário pode copiar a URL,sharing de
 * tela ou clicar em um link interno e vazar o fragmento no `Referer`.
 */
export function lerLinkDeAprovacao(win: ApprovalWindow): ApprovalLink {
  const link = lerLinkDoFragmento(win.location.hash);
  limparUrlDaAprovacao(win);
  return link;
}

export interface RespostaAprovacao<T> {
  ok: boolean;
  data?: T;
  /** Preenchido só quando `ok` é falso. Derivado do status HTTP, nunca do texto. */
  falha?: ApprovalFailure;
}

/**
 * Traduz status HTTP em motivo de falha.
 *
 * Só o status entra na decisão. Parsar a mensagem do backend para separar
 * "expirado" de "inexistente" reconstruiria o oráculo que a FASE 1C removeu: a
 * tela voltaria a contar o que o link existe, e o texto do erro passaria a ser
 * parte do contrato. Um 401 é a mesma coisa para quem está do outro lado — não
 * sabemos, e não vamos fingir que sabemos.
 *
 * 409 é o único caso que ganha mensagem própria, e só porque o backend o usa
 * para "este anúncio já foi processado": o estado já é público para quem tem o
 * link, e sem ele o corretor que já aprovou receberia "link inválido", que é
 * factualmente errado e faz ele pedir um link novo à toa.
 */
export function classificarFalha(status: number): ApprovalFailure {
  if (status === 409) return 'ja-utilizado';
  if (status === 402) return 'sem-credito';
  if (status === 401 || status === 403 || status === 404) return 'invalido';
  if (status >= 500) return 'indisponivel';
  return 'desconhecido';
}

/**
 * Texto exibido para cada estado.
 *
 * Um único texto genérico cobre ausente, inválido, expirado e divergente. A tela
 * não confirma se o anúncio existe, se o token existiu ou se o corretor está
 * cadastrado — responder isso seria a enumeração que a autorização por hash
 * existe para impedir.
 */
export const MENSAGEM_LINK_INVALIDO = 'Este link é inválido ou expirou.';

export function mensagemDaFalha(falha: ApprovalFailure): string {
  switch (falha) {
    case 'ausente':
      return MENSAGEM_LINK_INVALIDO;
    case 'invalido':
      return MENSAGEM_LINK_INVALIDO;
    case 'ja-utilizado':
      return 'Este link já foi utilizado.';
    case 'sem-credito':
      return 'Você não possui créditos disponíveis para publicar este anúncio.';
    case 'indisponivel':
      return 'Não foi possível falar com o servidor agora. Tente novamente em instantes.';
    default:
      return MENSAGEM_LINK_INVALIDO;
  }
}

export interface DependenciasAprovacao {
  /** Converte um caminho (`validate-token`) na URL final. Injetado para não duplicar a base. */
  resolver: (caminho: string) => string;
  fetchImpl: typeof fetch;
}

/**
 * A única forma de chamar a API neste fluxo: POST, token no corpo.
 *
 * O guard de `?` e `#` no caminho não é decoração. Ele transforma "alguém um dia
 * acrescentou um query param de conveniência" em erro de teste, em vez de token
 * em log de acesso do Railway às 3h da manhã. O caminho do endpoint vem de uma
 * constante neste arquivo, então o guard só dispara se alguém entender o
 * endpoint como "aceita query".
 */
export async function postAprovacao<T>(
  caminho: string,
  corpo: Record<string, unknown>,
  deps: DependenciasAprovacao
): Promise<RespostaAprovacao<T>> {
  if (caminho.includes('?') || caminho.includes('#')) {
    throw new Error('Endpoint de aprovação não pode carregar query string nem fragmento.');
  }

  const url = deps.resolver(caminho);

  let res: Response;
  try {
    res = await deps.fetchImpl(url, {
      method: 'POST',
      // `same-origin` porque a chamada sai pelo rewrite `/api/v1` do próprio
      // Next e continua first-party. Nenhum cookie de sessão do corretor é
      // necessário aqui: a credencial é o token do link.
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(corpo),
    });
  } catch {
    // `catch` sem variável de propósito: a mensagem de rede costuma trazer a
    // URL completa, e a URL completa seria o token.
    return { ok: false, falha: 'indisponivel' };
  }

  let payload: unknown = null;
  try {
    const texto = await res.text();
    if (texto) payload = JSON.parse(texto);
  } catch {
    payload = null;
  }

  if (!res.ok) {
    return { ok: false, falha: classificarFalha(res.status) };
  }

  // Sucesso com corpo não-JSON é resposta de proxy quebrada, não autorização.
  const envelope = payload as { success?: boolean; data?: T } | null;
  if (!envelope || typeof envelope !== 'object' || envelope.success !== true) {
    return { ok: false, falha: 'indisponivel' };
  }

  return { ok: true, data: envelope.data };
}