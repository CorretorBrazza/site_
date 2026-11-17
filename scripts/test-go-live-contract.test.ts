/**
 * Contrato E2E do site nos fluxos de go-live.
 *
 *   node --import tsx --test scripts/test-go-live-contract.test.ts
 *
 * Roda sem navegador, sem backend e sem rede. Cobre três frentes que só falham
 * em produção quando ninguém olha:
 *
 *   1. `/revisar#token=` — o token vem SÓ do fragmento, a URL é limpa antes de
 *      qualquer chamada, e a query string nunca é fonte de credencial;
 *   2. cliente autenticado — rewritten same-origin, `credentials: same-origin`,
 *      header de CSRF lido do cookie httpOnly parceiro e nenhum `Authorization`;
 *   3. contrato da API — os POSTs de revisão levam o token no corpo, e os
 *      códigos 402/409/401 são traduzidos para o estado que a tela mostra.
 *
 * Os fluxos `/aprovar` e o PWA já têm suítes próprias (`test:approval`,
 * `test:pwa`); este arquivo não os duplica, apenas completa o caminho que faltava.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

import {
  lerTokenDoFragmento,
  limparFragmento,
  consumirTokenDoFragmento,
  type JanelaFragmento,
} from '../src/app/revisar/reviewToken.ts';
import {
  fetchBrokerApi,
  fetchAdminApi,
  resolveApiUrl,
  getReviewSession,
  autosaveReview,
  publishReview,
} from '../src/lib/api.ts';

/* ------------------------------------------------------------------ */
/* Doubles de janela, cookie e transporte                              */
/* ------------------------------------------------------------------ */

interface Chamada { url: string; init: RequestInit }

function janelaFake(hash = '', search = '', pathname = '/revisar'): JanelaFragmento & {
  href: string;
  substituicoes: string[];
} {
  const substituicoes: string[] = [];
  const win: JanelaFragmento & { href: string; substituicoes: string[] } = {
    location: { hash, search, pathname },
    href: `${pathname}${search}${hash}`,
    substituicoes,
    history: {
      replaceState(_data: unknown, _unused: string, url?: string) {
        if (url === undefined) return;
        substituicoes.push(url);
        win.location.pathname = url.split('?')[0].split('#')[0];
        win.location.search = url.includes('?') ? `?${url.split('?')[1].split('#')[0]}` : '';
        win.location.hash = '';
        win.href = url;
      },
    },
  };
  return win;
}

/** Instala `window`/`document`/`fetch` falsos e devolve o que foi chamado. */
function ambienteBrowser(corpo: unknown = { success: true, data: {} }) {
  const chamadas: Chamada[] = [];
  const g = globalThis as any;
  const original = { fetch: g.fetch, window: g.window, document: g.document };

  g.window = { location: { href: 'https://imoveistaboao.com.br/dashboard' } };
  g.document = { cookie: '' };
  g.fetch = (async (input: string | URL | Request, init?: RequestInit) => {
    chamadas.push({ url: String(input), init: init || {} });
    return new Response(JSON.stringify(corpo), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }) as typeof fetch;

  const cookie = (valor: string) => { g.document.cookie = valor; };

  const responder = (status: number, payload: unknown) => {
    g.fetch = (async (input: string | URL | Request, init?: RequestInit) => {
      chamadas.push({ url: String(input), init: init || {} });
      return new Response(JSON.stringify(payload), {
        status,
        headers: { 'Content-Type': 'application/json' },
      });
    }) as typeof fetch;
  };

  const restaurar = () => {
    g.fetch = original.fetch;
    if (original.window === undefined) delete g.window;
    else g.window = original.window;
    if (original.document === undefined) delete g.document;
    else g.document = original.document;
  };

  return { chamadas, cookie, responder, restaurar };
}

function headers(chamada: Chamada): Record<string, string> {
  return chamada.init.headers as Record<string, string>;
}

/* ================================================================== */
/* 1. Fragmento do /revisar                                            */
/* ================================================================== */

test('1. /revisar lê o token do fragmento e limpa a URL antes de qualquer chamada', () => {
  const win = janelaFake('#token=TOKEN_DA_REVISAO', '?utm=whatsapp');

  const token = consumirTokenDoFragmento(win);

  assert.equal(token, 'TOKEN_DA_REVISAO');
  assert.deepEqual(win.substituicoes, ['/revisar?utm=whatsapp']);
  assert.equal(win.location.hash, '', 'o fragmento não pode ficar na barra de endereços');
  assert.equal(win.location.search, '?utm=whatsapp', 'query de campanha não é credencial');
});

test('1b. token na query string NUNCA é aceito como credencial', () => {
  const win = janelaFake('', '?token=DA_QUERY&ad_id=ad-1');

  assert.equal(lerTokenDoFragmento(win), '', 'query string não pode autorizar a revisão');
  const token = consumirTokenDoFragmento(win);
  assert.equal(token, '');
  assert.deepEqual(win.substituicoes, ['/revisar']);
});

test('1c. fragmentos degenerados caem no estado inválido sem quebrar a tela', () => {
  for (const hash of ['', '#', '#ad_id=ad-1', '#token=', '#token=%20%20', '#token=abc%20']) {
    const win = janelaFake(hash);
    const token = lerTokenDoFragmento(win);
    assert.equal(typeof token, 'string');
    assert.equal(token.trim(), token, 'o token chega sem espaços');
  }
  assert.equal(lerTokenDoFragmento(janelaFake('#token=%20%20')), '');
  assert.equal(lerTokenDoFragmento(janelaFake('#token=abc%20')), 'abc');

  // Sem fragmento, nada de replaceState: não vamos reescrever a URL à toa.
  const semFragmento = janelaFake('');
  limparFragmento(semFragmento);
  assert.deepEqual(semFragmento.substituicoes, []);
});

test('1d. auditoria estática: a página não lê search, não persiste e não loga token', () => {
  const pagina = readFileSync(
    fileURLToPath(new URL('../src/app/revisar/page.tsx', import.meta.url)),
    'utf8',
  );
  const nucleo = readFileSync(
    fileURLToPath(new URL('../src/app/revisar/reviewToken.ts', import.meta.url)),
    'utf8',
  );

  assert.match(pagina, /consumirTokenDoFragmento\(\)/, 'a página usa o ponto único de leitura');
  assert.equal(/lerTokenDoFragmento|limparFragmento/.test(pagina), false, 'as partes foram centralizadas');
  assert.equal(/location\s*\.\s*search/.test(pagina), false);
  assert.equal(/location\s*\.\s*hash/.test(pagina), false, 'a página não lê hash diretamente');
  assert.equal(/localStorage|sessionStorage|document\.cookie/.test(pagina), false);
  assert.equal(/console\.(log|info|warn|error|debug)/.test(pagina), false);

  assert.equal(/localStorage|sessionStorage|document\.cookie|console\./.test(nucleo), false);
  assert.match(nucleo, /replaceState/, 'o fragmento é removido com replaceState');
});

/* ================================================================== */
/* 2. Cliente autenticado: same-origin + CSRF                          */
/* ================================================================== */

test('2. fetchBrokerApi usa o rewrite same-origin e manda CSRF só em escrita', async () => {
  const env = ambienteBrowser();
  try {
    env.cookie('outro=1; imv_csrf=csrf-ABC; imv_admin_csrf=admin-XYZ');

    const escrita = await fetchBrokerApi('/me/anuncios', {
      method: 'POST',
      body: JSON.stringify({ ok: true }),
    });
    assert.equal(escrita.success, true);

    const chamada = env.chamadas[0];
    assert.match(chamada.url, /^\/api\/v1\/me\/anuncios\/?$/, 'no browser a base é relativa (rewrite)');
    assert.equal(chamada.init.credentials, 'same-origin');
    assert.equal(headers(chamada)['x-csrf-token'], 'csrf-ABC');
    assert.equal(headers(chamada).authorization, undefined, 'nunca manda Bearer: a credencial é o cookie');

    await fetchBrokerApi('/me/anuncios', { method: 'GET' });
    const leitura = env.chamadas[1];
    assert.equal(headers(leitura)['x-csrf-token'], undefined, 'GET não precisa de CSRF');
    assert.equal(leitura.init.credentials, 'same-origin');
  } finally {
    env.restaurar();
  }
});

test('2b. cada método que muda estado leva o cookie de CSRF correspondente', async () => {
  const env = ambienteBrowser();
  try {
    env.cookie('imv_csrf=csrf-ABC; imv_admin_csrf=admin-XYZ');

    for (const metodo of ['POST', 'PUT', 'PATCH', 'DELETE']) {
      await fetchBrokerApi('/me/anuncios/ad-1', { method: metodo, body: '{}' });
    }
    assert.equal(env.chamadas.length, 4);
    for (const chamada of env.chamadas) {
      assert.equal(headers(chamada)['x-csrf-token'], 'csrf-ABC', chamada.init.method);
    }

    await fetchAdminApi('/admin/creditos', { method: 'POST', body: '{}' });
    const admin = env.chamadas[4];
    assert.equal(headers(admin)['x-csrf-token'], 'admin-XYZ', 'admin tem cookie de CSRF próprio');
    assert.equal(admin.init.credentials, 'same-origin');
    assert.equal(headers(admin).authorization, undefined);
  } finally {
    env.restaurar();
  }
});

test('2c. sem cookie de CSRF o cliente não inventa token', async () => {
  const env = ambienteBrowser();
  try {
    await fetchBrokerApi('/me/anuncios', { method: 'POST', body: '{}' });
    assert.equal(headers(env.chamadas[0])['x-csrf-token'], undefined);
  } finally {
    env.restaurar();
  }
});

test('2d. no servidor a URL é absoluta; no navegador é relativa', async () => {
  const env = ambienteBrowser();
  try {
    assert.equal(resolveApiUrl('/review/session'), '/api/v1/review/session/');
    delete (globalThis as any).window;
    const absoluta = resolveApiUrl('/review/session');
    assert.match(absoluta, /^https?:\/\//);
    assert.match(absoluta, /\/api\/v1\/review\/session\/$/);
  } finally {
    env.restaurar();
  }
});

/* ================================================================== */
/* 3. Contrato da API consumido pelo /revisar                          */
/* ================================================================== */

test('3. getReviewSession manda o token no corpo e distingue inválido de indisponível', async () => {
  const env = ambienteBrowser({
    success: true,
    data: { session: { ad_id: 'ad-1', review_state_version: 7 } },
  });
  try {
    const ok = await getReviewSession('TOKEN');
    assert.equal(ok.kind, 'ok');
    assert.equal(env.chamadas[0].url, '/api/v1/review/session/');
    assert.equal(env.chamadas[0].init.method, 'POST');
    assert.deepEqual(JSON.parse(String(env.chamadas[0].init.body)), { token: 'TOKEN' });
    assert.equal(env.chamadas[0].url.includes('TOKEN'), false, 'token nunca vai na URL');

    env.responder(404, { success: false, message: 'não encontrado' });
    assert.equal((await getReviewSession('TOKEN')).kind, 'invalid');

    env.responder(503, { success: false, message: 'fora do ar' });
    assert.equal((await getReviewSession('TOKEN')).kind, 'unavailable');

    assert.equal((await getReviewSession('')).kind, 'invalid');
    assert.equal(env.chamadas.length, 3, 'token vazio não gera chamada');
  } finally {
    env.restaurar();
  }
});

test('3b. autosave devolve a versão do servidor e lê a versão do conflito', async () => {
  const env = ambienteBrowser({ success: true, data: { version: 12 } });
  try {
    const salvo = await autosaveReview('TOKEN', { titulo: 'Casa' }, 11);
    assert.equal(salvo.success, true);
    assert.equal(salvo.version, 12);
    assert.deepEqual(JSON.parse(String(env.chamadas[0].init.body)), {
      token: 'TOKEN',
      dados: { titulo: 'Casa' },
      version: 11,
    });

    env.responder(409, { success: false, message: 'Conflito de edição: a versão 15 já está salva.' });
    const conflito = await autosaveReview('TOKEN', { titulo: 'Casa' }, 11);
    assert.equal(conflito.isConflict, true);
    assert.equal(conflito.serverVersion, 15, 'o controlador de versão precisa do número do 409');
  } finally {
    env.restaurar();
  }
});

test('3c. publish traduz 402 e 401/404 nos códigos que a tela exibe', async () => {
  const env = ambienteBrowser({ success: true, data: { result: { status: 'PUBLISHED' } } });
  try {
    const ok = await publishReview('TOKEN', 'chave-idempotencia');
    assert.equal(ok.success, true);
    assert.deepEqual(JSON.parse(String(env.chamadas[0].init.body)), {
      token: 'TOKEN',
      idempotency_key: 'chave-idempotencia',
    });

    env.responder(402, { success: false, message: 'Sem créditos' });
    const semCredito = await publishReview('TOKEN');
    assert.equal(semCredito.code, 'SALDO_INSUFICIENTE');

    env.responder(404, { success: false, message: 'não encontrado' });
    assert.equal((await publishReview('TOKEN')).code, 'TOKEN_INVALIDO');
  } finally {
    env.restaurar();
  }
});

test('3d. contrato do /aprovar continua POST com token no corpo e same-origin', async () => {
  const { postAprovacao } = await import('../src/lib/approval-link.ts');
  const chamadas: Chamada[] = [];
  const fetchImpl = (async (input: string | URL | Request, init?: RequestInit) => {
    chamadas.push({ url: String(input), init: init || {} });
    return new Response(JSON.stringify({ success: true, data: { status: 'DELIVERED' } }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }) as unknown as typeof fetch;

  const resultado = await postAprovacao('approve', {
    token: 'TOKEN_APROVACAO',
    ad_id: 'ad-1',
    acao: 'APROVAR',
  }, {
    resolver: (caminho: string) => `/api/v1/${caminho}/`,
    fetchImpl,
  });

  assert.equal(resultado.ok, true);
  assert.equal(chamadas.length, 1);
  assert.equal(chamadas[0].url, '/api/v1/approve/');
  assert.equal(chamadas[0].init.method, 'POST');
  assert.equal(chamadas[0].init.credentials, 'same-origin');
  assert.equal(chamadas[0].url.includes('TOKEN_APROVACAO'), false);
  assert.deepEqual(JSON.parse(String(chamadas[0].init.body)), {
    token: 'TOKEN_APROVACAO',
    ad_id: 'ad-1',
    acao: 'APROVAR',
  });
});
