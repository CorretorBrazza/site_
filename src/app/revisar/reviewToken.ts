/**
 * Leitura e descarte do token do Link Dinâmico (`/revisar#token=...`).
 *
 * Este módulo existe para que a regra de ouro da tela seja testável sem Next,
 * sem React e sem navegador: o token vem SÓ do fragmento, e o fragmento é
 * apagado da URL ANTES de qualquer requisição. A janela é injetada para que o
 * teste consiga observar o `replaceState` sem jsdom.
 *
 * Nada aqui persiste credencial: o token volta ao chamador e fica só na memória
 * do componente até a página ser fechada.
 */

/** Janela mínima necessária para ler e limpar o fragmento. */
export interface JanelaFragmento {
  location: { hash: string; pathname: string; search: string };
  history: { replaceState: (data: unknown, unused: string, url?: string) => void };
}

function janelaAtual(): JanelaFragmento | undefined {
  if (typeof window === 'undefined') return undefined;
  return window as unknown as JanelaFragmento;
}

/**
 * Lê `token` do fragmento (`#token=...`).
 *
 * `location.search` deliberadamente NÃO é fonte: query string com token vaza em
 * log de proxy, `Referer`, histórico e analytics. Link antigo com `?token=`
 * cai no estado "inválido" em vez de funcionar — é a decisão de segurança.
 */
export function lerTokenDoFragmento(win: JanelaFragmento | undefined = janelaAtual()): string {
  if (!win) return '';
  const hash = String(win.location.hash || '');
  if (!hash) return '';
  try {
    const params = new URLSearchParams(hash.startsWith('#') ? hash.slice(1) : hash);
    return (params.get('token') || '').trim();
  } catch {
    return '';
  }
}

/**
 * Remove a credencial da URL imediatamente.
 *
 * `replaceState` troca a entrada atual do histórico em vez de empilhar uma nova,
 * então o botão "voltar" não reapresenta o `#token=`. A query string é limpa
 * apenas das chaves de credencial de links antigos (`token`, `auth_token`,
 * `ad_id`): parâmetros de campanha (`utm_*`) não são segredo e devem sobreviver.
 * Falha de `replaceState` não derruba a tela.
 */
export function limparFragmento(win: JanelaFragmento | undefined = janelaAtual()): void {
  if (!win) return;

  const hash = String(win.location.hash || '');
  const search = String(win.location.search || '');
  let novaSearch = search;

  if (search) {
    try {
      const params = new URLSearchParams(search.startsWith('?') ? search.slice(1) : search);
      let removeu = false;
      for (const chave of ['token', 'auth_token', 'ad_id']) {
        if (params.has(chave)) {
          params.delete(chave);
          removeu = true;
        }
      }
      if (removeu) {
        const restante = params.toString();
        novaSearch = restante ? `?${restante}` : '';
      }
    } catch {
      // Query malformada não impede a limpeza do fragmento.
    }
  }

  if (!hash && novaSearch === search) return;

  try {
    win.history.replaceState(null, '', win.location.pathname + novaSearch);
  } catch {
    // Navegador com histórico restrito ainda precisa abrir a tela.
  }
}

/**
 * Lê o token e limpa a URL na mesma chamada.
 *
 * A ordem é parte do contrato: limpar ANTES de devolver o token garante que
 * nenhum `await` intermediário deixe a credencial exposta na barra de endereços.
 */
export function consumirTokenDoFragmento(win?: JanelaFragmento): string {
  const token = lerTokenDoFragmento(win);
  limparFragmento(win);
  return token;
}
