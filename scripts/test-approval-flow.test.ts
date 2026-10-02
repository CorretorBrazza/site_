/**
 * Suíte do fluxo de aprovação (`/aprovar`).
 *
 * Roda no runner nativo do Node, sem jsdom, sem navegador e sem backend:
 *   node --test scripts/test-approval-flow.test.ts
 *
 * Por que testar os módulos e não a página inteira: a página tem 700 linhas de
 * formulário, e o que pode vazar credencial não está no JSX — está em três
 * decisões: de onde o token vem, para onde ele vai, e o que a tela mostra
 * quando a chamada falha. Essas três decisões moram em `approval-link.ts` e
 * `approval-client.ts`, e são testadas aqui com `window` e `fetch` falsos.
 *
 * O caso 8 fecha a auditoria: ele lê o arquivo da página e falha se alguém
 * reintroduzir `useSearchParams`, query string com token, storage ou log. É o
 * teste que impede a regressão seis meses depois, quando ninguém lembra do porquê.
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

import {
  lerLinkDoFragmento,
  lerLinkDeAprovacao,
  classificarFalha,
  mensagemDaFalha,
  postAprovacao,
  MENSAGEM_LINK_INVALIDO,
  type ApprovalWindow,
} from '../src/lib/approval-link.ts';
import {
  criarClienteAprovacao,
  SegredoDaAprovacao,
  ENDPOINT_VALIDAR,
  ENDPOINT_DETALHES,
  ENDPOINT_APROVAR,
  ENDPOINT_EDITAR,
  ENDPOINT_REORDENAR,
  type ClienteAprovacao,
} from '../src/lib/approval-client.ts';

/* ------------------------------------------------------------------ */
/* Doubles                                                             */
/* ------------------------------------------------------------------ */

interface Chamada {
  url: string;
  init: RequestInit;
}

interface Janela extends ApprovalWindow {
  location: { hash: string; pathname: string; search: string };
  href: string;
  replaceState: string[];
}

/**
 * `window` mínimo e observável.
 *
 * `search` e `href` existem de propósito, mesmo sem serem lidos por
 * `ApprovalWindow`: se algum código passar a ler `location.search`, o teste
 * enxerga porque a propriedade está lá e o valor é o token.
 */
function janelaFake(hash = '', search = ''): Janela {
  const replaceState: string[] = [];
  const win: Janela = {
    location: { hash, pathname: '/aprovar', search },
    href: `/aprovar${search}${hash}`,
    replaceState,
    history: {
      replaceState(_data: unknown, _unused: string, url?: string) {
        if (url === undefined) return;
        replaceState.push(url);
        // O navegador passa a refletir a URL trocada; o fake faz o mesmo para
        // que o teste possa afirmar que o token sumiu da barra de endereços.
        win.location.pathname = url;
        win.location.hash = '';
        win.location.search = '';
        win.href = url;
      },
    },
  };
  return win;
}

function json(status: number, corpo: unknown): Response {
  return new Response(JSON.stringify(corpo), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

function envelope(dados: unknown): Response {
  return json(200, { success: true, data: dados });
}

const ERRO_PADRAO = { status: 'error', message: 'Magic Link inválido ou expirado. Solicite um novo link.' };

/**
 * `fetch` falso que responde por endpoint e registra tudo que foi chamado.
 *
 * O casamento é por SUFIXO do caminho, não pelo último segmento: `details` sozinho
 * seria ambíguo entre rotas diferentes, e o que importa aqui é o caminho real
 * que o cliente monta (`approval/details`, não `details`).
 */
function fetchFalso(respostas: Record<string, Response>) {
  const chamadas: Chamada[] = [];
  const impl = (async (input: string | URL | Request, init?: RequestInit) => {
    const url = String(input);
    chamadas.push({ url, init: init || {} });
    const caminho = url.split('?')[0].replace(/\/+$/, '');
    const chave = Object.keys(respostas).find((k) => caminho === k || caminho.endsWith(`/${k}`));
    const resposta = chave ? respostas[chave] : undefined;
    if (!resposta) throw new Error(`Endpoint não mapeado no teste: ${url}`);
    // Corpo consumido aqui: cada Response só pode ser lida uma vez, e o
    // `postAprovacao` faz `res.text()` exatamente uma vez por chamada.
    return resposta.clone();
  }) as unknown as typeof fetch;
  return { impl, chamadas };
}

function montarCliente(fetchImpl: typeof fetch) {
  const segredo = new SegredoDaAprovacao();
  const cliente = criarClienteAprovacao(
    { resolver: (caminho: string) => `/api/v1/${caminho}/`, fetchImpl },
    segredo
  );
  return { segredo, cliente };
}

function corpoDe(chamada: Chamada): Record<string, unknown> {
  return JSON.parse(String(chamada.init.body || '{}'));
}

/** Rede de segurança: nenhum token pode aparecer em URL. */
function afirmarTokenForaDaUrl(chamadas: Chamada[], token: string) {
  for (const chamada of chamadas) {
    assert.equal(
      chamada.url.includes(token),
      false,
      `token apareceu na URL: ${chamada.url}`
    );
    assert.equal(chamada.init.method, 'POST', `chamada não foi POST: ${chamada.url}`);
  }
}

/* ------------------------------------------------------------------ */
/* 1. Link no fragmento: token lido, POST realizado, URL limpa         */
/* ------------------------------------------------------------------ */

test('1. link no fragmento: lê o token, limpa a URL na hora e faz POST só no corpo', async () => {
  const token = 'eyJhbGciOiJIUzI1NiJ9.SECRETO_DO_CORRETOR';
  const win = janelaFake(`#token=${token}&ad_id=ad-42`);

  const link = lerLinkDeAprovacao(win);
  assert.equal(link.token, token);
  assert.equal(link.adId, 'ad-42');

  // Limpou ANTES de qualquer requisição: a única URL escrita é o pathname.
  assert.deepEqual(win.replaceState, ['/aprovar']);
  assert.equal(win.location.hash, '');
  assert.equal(win.href, '/aprovar');

  const { impl, chamadas } = fetchFalso({
    [ENDPOINT_VALIDAR]: envelope({ valid: true, ad_id: 'ad-42', corretor: null, anuncio: {} }),
  });
  const { segredo, cliente } = montarCliente(impl);
  segredo.guardar(link.token);

  const validado = await cliente.validar(link.adId || undefined);
  assert.equal(validado.ok, true);

  assert.equal(chamadas.length, 1);
  assert.equal(chamadas[0].url, '/api/v1/validate-token/');
  assert.deepEqual(corpoDe(chamadas[0]), { token, ad_id: 'ad-42' });
  afirmarTokenForaDaUrl(chamadas, token);
});

test('1b. fragmento sem "#" e com URLSearchParams completo também é lido', () => {
  assert.deepEqual(lerLinkDoFragmento('token=abc&ad_id=xyz'), { token: 'abc', adId: 'xyz' });
  assert.deepEqual(lerLinkDoFragmento(''), { token: '', adId: '' });
  assert.deepEqual(lerLinkDoFragmento('#'), { token: '', adId: '' });
  // `adId` é grafia equivalente e também só checagem de consistência.
  assert.deepEqual(lerLinkDoFragmento('#token=abc&adId=xyz'), { token: 'abc', adId: 'xyz' });
});

/* ------------------------------------------------------------------ */
/* 2. Token na query string: nenhuma chamada ao backend               */
/* ------------------------------------------------------------------ */

test('2. link com token só na query string é recusado sem tocar a rede', () => {
  const token = 'TOKEN_VINDO_DA_QUERY';
  const win = janelaFake('', `?token=${token}&ad_id=ad-42`);
  const { impl, chamadas } = fetchFalso({});

  const link = lerLinkDeAprovacao(win);

  assert.equal(link.token, '', 'a query string não pode ser fonte do token');
  assert.equal(link.adId, '');
  assert.equal(chamadas.length, 0);
  // A limpeza ainda acontece: o `?token=` também não fica na barra de endereços.
  assert.deepEqual(win.replaceState, ['/aprovar']);
  assert.equal(win.href, '/aprovar');
});

test('2b. query e fragmento juntos: só o fragmento vale', () => {
  const win = janelaFake('#token=DO_FRAGMENTO', '?token=DA_QUERY');
  const link = lerLinkDeAprovacao(win);
  assert.equal(link.token, 'DO_FRAGMENTO');
  assert.equal(win.replaceState.length, 1);
});

/* ------------------------------------------------------------------ */
/* 3. Fragmento sem token: nenhuma chamada                            */
/* ------------------------------------------------------------------ */

test('3. fragmento sem token cai no estado ausente, sem chamada ao backend', async () => {
  const win = janelaFake('#ad_id=ad-42');
  const { impl, chamadas } = fetchFalso({});

  const link = lerLinkDeAprovacao(win);
  assert.equal(link.token, '');
  assert.equal(link.adId, 'ad-42');
  assert.equal(chamadas.length, 0);
  assert.deepEqual(win.replaceState, ['/aprovar']);

  const { segredo, cliente } = montarCliente(impl);
  segredo.guardar(link.token);
  const resultado = await cliente.validar(link.adId || undefined);
  assert.equal(resultado.ok, false);
  assert.equal(resultado.falha, 'ausente');
  assert.equal(mensagemDaFalha(resultado.falha!), MENSAGEM_LINK_INVALIDO);
  assert.equal(chamadas.length, 0);
});

/* ------------------------------------------------------------------ */
/* 4. Token válido: sequência correta de POSTs                        */
/* ------------------------------------------------------------------ */

test('4. token válido: valida e busca detalhes por POST, com os corpos do contrato', async () => {
  const token = 'TOKEN_VALIDO';
  const { impl, chamadas } = fetchFalso({
    [ENDPOINT_VALIDAR]: envelope({
      valid: true,
      ad_id: 'ad-42',
      session_token: null,
      corretor: { nome: 'Corretor', status: 'ATIVO', saldo_disponivel: 3 },
      anuncio: {},
    }),
    [ENDPOINT_DETALHES]: envelope({
      ad_id: 'ad-42',
      referencia: 'REF-1',
      corretor_email: 'corretor@exemplo.com',
      status: 'PENDING_REVIEW',
      estagio: 2,
      dados_refinados: { titulo: 'Casa' },
      media_kit: {},
      fotos: [],
    }),
  });

  const { segredo, cliente } = montarCliente(impl);
  segredo.guardar(token);

  const validado = await cliente.validar('ad-42');
  assert.equal(validado.ok, true);
  assert.equal(validado.data?.ad_id, 'ad-42');
  // O link de aprovação nunca abre sessão do corretor.
  assert.equal(validado.data?.session_token, null);

  const detalhes = await cliente.detalhes('ad-42');
  assert.equal(detalhes.ok, true);
  assert.equal(detalhes.data?.referencia, 'REF-1');

  assert.equal(chamadas.length, 2);
  assert.deepEqual(corpoDe(chamadas[0]), { token, ad_id: 'ad-42' });
  assert.deepEqual(corpoDe(chamadas[1]), { token, ad_id: 'ad-42' });
  afirmarTokenForaDaUrl(chamadas, token);
});

test('4b. corpo de edição e de reordenação seguem o schema estrito do backend', async () => {
  const token = 'TOKEN_VALIDO';
  const { impl, chamadas } = fetchFalso({
    [ENDPOINT_EDITAR]: envelope({ media_kit: { ok: true } }),
    [ENDPOINT_REORDENAR]: envelope({ ok: true }),
  });
  const { segredo, cliente } = montarCliente(impl);
  segredo.guardar(token);

  await cliente.editar('ad-42', { titulo: 'Casa', caracteristicas: { quartos: 2 } });
  await cliente.reordenar('ad-42', [2, 0, 1]);

  assert.deepEqual(corpoDe(chamadas[0]), {
    token,
    ad_id: 'ad-42',
    campos_editados: { titulo: 'Casa', caracteristicas: { quartos: 2 } },
  });
  assert.deepEqual(corpoDe(chamadas[1]), { token, ad_id: 'ad-42', nova_ordem: [2, 0, 1] });
  afirmarTokenForaDaUrl(chamadas, token);
});

test('4c. caminho de endpoint com query ou fragmento é erro, não requisição', async () => {
  const deps = { resolver: (c: string) => c, fetchImpl: (async () => new Response('')) as unknown as typeof fetch };
  await assert.rejects(
    () => postAprovacao('approval?token=x', {}, deps),
    /não pode carregar query string/
  );
  await assert.rejects(
    () => postAprovacao('approval#token=x', {}, deps),
    /não pode carregar query string/
  );
});

/* ------------------------------------------------------------------ */
/* 5. Token inválido ou expirado: mensagem genérica                   */
/* ------------------------------------------------------------------ */

test('5. 401/403/404 viram a mesma mensagem genérica, sem distinguir a causa', async () => {
  for (const status of [401, 403, 404]) {
    assert.equal(classificarFalha(status), 'invalido');
    assert.equal(mensagemDaFalha(classificarFalha(status)), MENSAGEM_LINK_INVALIDO);
  }
  // A mensagem do backend ("expirado", "revogado") NUNCA chega à tela.
  assert.notEqual(mensagemDaFalha('invalido'), ERRO_PADRAO.message);

  const token = 'TOKEN_MORTO';
  const { impl, chamadas } = fetchFalso({ [ENDPOINT_VALIDAR]: json(401, ERRO_PADRAO) });
  const { segredo, cliente } = montarCliente(impl);
  segredo.guardar(token);

  const resultado = await cliente.validar();
  assert.equal(resultado.ok, false);
  assert.equal(resultado.falha, 'invalido');
  assert.equal(mensagemDaFalha(resultado.falha!), MENSAGEM_LINK_INVALIDO);
  assert.equal(chamadas.length, 1);
});

test('5b. falha de rede e 5xx são indisponibilidade, não "link inválido"', async () => {
  assert.equal(mensagemDaFalha(classificarFalha(503)), 'Não foi possível falar com o servidor agora. Tente novamente em instantes.');

  const impl = (async () => {
    throw new TypeError('Failed to fetch https://api/validate-token?token=SEGREDO');
  }) as unknown as typeof fetch;
  const { segredo, cliente } = montarCliente(impl);
  segredo.guardar('SEGREDO');

  const resultado = await cliente.validar();
  assert.equal(resultado.ok, false);
  assert.equal(resultado.falha, 'indisponivel');
});

test('5c. 200 com corpo não-JSON é indisponibilidade, não autorização', async () => {
  const impl = (async () => new Response('<html>proxy</html>', { status: 200 })) as unknown as typeof fetch;
  const { segredo, cliente } = montarCliente(impl);
  segredo.guardar('TOKEN');
  const resultado = await cliente.validar();
  assert.equal(resultado.ok, false);
  assert.equal(resultado.falha, 'indisponivel');
});

/* ------------------------------------------------------------------ */
/* 6. Divergência entre ad_id do link e anúncio do token              */
/* ------------------------------------------------------------------ */

test('6. ad_id divergente falha na validação com mensagem genérica e sem segunda busca', async () => {
  const token = 'TOKEN_DO_OUTRO_ANUNCIO';
  const { impl, chamadas } = fetchFalso({
    [ENDPOINT_VALIDAR]: json(401, { status: 'error', message: 'Token não pertence ao corretor deste anúncio.' }),
  });
  const { segredo, cliente } = montarCliente(impl);
  segredo.guardar(token);

  const validado = await cliente.validar('ad-999');
  assert.equal(validado.ok, false);
  assert.equal(mensagemDaFalha(validado.falha!), MENSAGEM_LINK_INVALIDO);
  assert.equal(chamadas.length, 1, 'a tela não pode tentar outro anúncio para "achar" o id certo');
  assert.deepEqual(corpoDe(chamadas[0]), { token, ad_id: 'ad-999' });
});

test('6b. token válido sem ad_id no fragmento: o backend resolve o anúncio', async () => {
  const { impl, chamadas } = fetchFalso({
    [ENDPOINT_VALIDAR]: envelope({ valid: true, ad_id: 'ad-resolvido', corretor: null, anuncio: {} }),
  });
  const { segredo, cliente } = montarCliente(impl);
  segredo.guardar('TOKEN');

  await cliente.validar(undefined);
  // `ValidateTokenSchema` é strict: sem ad_id, o corpo leva só o token.
  assert.deepEqual(corpoDe(chamadas[0]), { token: 'TOKEN' });
});

/* ------------------------------------------------------------------ */
/* 7. Aprovação: POST seguro, sem token na URL                        */
/* ------------------------------------------------------------------ */

test('7. aprovar envia token no corpo e devolve o estado de conclusão', async () => {
  const token = 'TOKEN_DE_APROVACAO';
  const win = janelaFake(`#token=${token}&ad_id=ad-42`);
  const link = lerLinkDeAprovacao(win);

  const { impl, chamadas } = fetchFalso({
    [ENDPOINT_APROVAR]: envelope({ status: 'DELIVERED', media_kit: { ok: true } }),
  });
  const { segredo, cliente } = montarCliente(impl);
  segredo.guardar(link.token);

  const resultado = await cliente.aprovar('ad-42', { titulo: 'Casa' }, { aprovar: true });

  assert.equal(resultado.ok, true);
  assert.deepEqual(corpoDe(chamadas[0]), {
    token,
    ad_id: 'ad-42',
    acao: 'APROVAR',
    dados_editados: { titulo: 'Casa' },
  });
  afirmarTokenForaDaUrl(chamadas, token);
  assert.equal(win.href, '/aprovar');

  // Fim do fluxo: a credencial é descartada da memória.
  segredo.limpar();
  assert.equal(segredo.ler(), '');
  const depois = await cliente.aprovar('ad-42', undefined, { aprovar: true });
  assert.equal(depois.ok, false);
  assert.equal(depois.falha, 'ausente');
  assert.equal(chamadas.length, 1);
});

test('7b. 402 e 409 ganham mensagem própria, sem virar "link inválido"', async () => {
  assert.equal(mensagemDaFalha('sem-credito'), 'Você não possui créditos disponíveis para publicar este anúncio.');
  assert.equal(mensagemDaFalha('ja-utilizado'), 'Este link já foi utilizado.');

  const token = 'TOKEN_USADO';
  const { impl } = fetchFalso({ [ENDPOINT_APROVAR]: json(409, { status: 'error', message: 'já processado' }) });
  const { segredo, cliente } = montarCliente(impl);
  segredo.guardar(token);

  const resultado = await cliente.aprovar('ad-42', undefined, { aprovar: false, motivo: 'x' });
  assert.equal(resultado.falha, 'ja-utilizado');
  assert.equal(mensagemDaFalha(resultado.falha!), 'Este link já foi utilizado.');
});

test('7c. o segredo só entrega o token via closure do cliente, não como argumento', async () => {
  const { impl, chamadas } = fetchFalso({ [ENDPOINT_VALIDAR]: envelope({ valid: true, ad_id: 'a', anuncio: {} }) });
  const { segredo, cliente } = montarCliente(impl);
  segredo.guardar('TOKEN');

  const assinatura = Object.keys(cliente as ClienteAprovacao);
  assert.deepEqual(assinatura.sort(), ['aprovar', 'detalhes', 'editar', 'reordenar', 'validar']);

  await (cliente as ClienteAprovacao).validar();
  assert.equal(chamadas.length, 1);
  assert.equal(String(corpoDe(chamadas[0]).token), 'TOKEN');
});

/* ------------------------------------------------------------------ */
/* 8. Auditoria estática da página                                     */
/* ------------------------------------------------------------------ */

const PAGINA = fileURLToPath(new URL('../src/app/aprovar/page.tsx', import.meta.url));
const CLIENTE = fileURLToPath(new URL('../src/lib/approval-client.ts', import.meta.url));
const NUCLEO = fileURLToPath(new URL('../src/lib/approval-link.ts', import.meta.url));

test('8. a página não lê token de query string, não persiste e não loga', () => {
  const codigo = readFileSync(PAGINA, 'utf8');

  assert.equal(/useSearchParams/.test(codigo), false, 'a página não deve usar useSearchParams');
  assert.equal(/searchParams\s*\.\s*get/.test(codigo), false, 'nada de ler searchParams.get');
  assert.equal(/location\s*\.\s*search/.test(codigo), false, 'nada de ler location.search');
  assert.equal(/localStorage|sessionStorage|document\.cookie/.test(codigo), false, 'sem storage nem cookie via JS');
  assert.equal(/console\.(log|info|warn|error|debug)/.test(codigo), false, 'sem console no fluxo de aprovação');
  assert.equal(/analytics|gtag|sentry/i.test(codigo), false, 'sem analytics/Sentry');

  // Importa o cliente dedicado e NÃO as funções de aprovação do cliente
  // compartilhado (que ainda existiam para o fluxo antigo por query string).
  assert.match(codigo, /from '@\/lib\/approval-client'/);
  assert.equal(/getApprovalDetails|validateMagicToken/.test(codigo), false, 'nada das funções antigas por query');

  // O segredo e o cliente vivem em ref, não em estado de render.
  assert.match(codigo, /useRef<SegredoDaAprovacao \| null>/);
  assert.match(codigo, /useRef<ClienteAprovacao \| null>/);
  assert.equal(/useState[^;]*token/i.test(codigo), false, 'token não pode ser estado de render');
});

test('8b. os módulos do fluxo também não imprimem o token', () => {
  for (const arquivo of [CLIENTE, NUCLEO]) {
    const codigo = readFileSync(arquivo, 'utf8');
    assert.equal(/console\.(log|info|warn|error|debug)/.test(codigo), false, `${arquivo} não deve logar`);
    assert.equal(/localStorage|sessionStorage|document\.cookie/.test(codigo), false, `${arquivo} não deve persistir`);
  }
  // O núcleo só monta POST; não existe GET com token no caminho.
  const nucleo = readFileSync(NUCLEO, 'utf8');
  assert.match(nucleo, /method:\s*'POST'/);
  assert.equal(/GET/.test(nucleo), false, 'nenhum GET neste fluxo');
});