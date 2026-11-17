/* eslint-disable no-undef */
/**
 * Service worker do Portal Imóveis Taboão.
 *
 * Regra de ouro: NUNCA cachear resposta autenticada.
 *  - `/api/*` (sessão, créditos, dashboard, revisão) nunca passa pelo cache;
 *  - páginas autenticadas (`/dashboard`, `/admin`, `/revisar`, `/corretor/*`)
 *    não são guardadas: sem rede, o usuário cai na página /offline;
 *  - só o app shell público (`/`, `/offline`) e arquivos estáticos são cacheados.
 *
 * Assim um segundo usuário em dispositivo compartilhado não recebe os dados do
 * primeiro, e um logout não deixa dados presos no Cache Storage.
 */
const VERSION = 'v1';
const SHELL_CACHE = `it-shell-${VERSION}`;
const STATIC_CACHE = `it-static-${VERSION}`;
const OFFLINE_URL = '/offline/';
const SHELL_URLS = ['/', OFFLINE_URL, '/manifest.webmanifest', '/icon-192.png', '/icon-512.png'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(SHELL_CACHE)
      .then((cache) => Promise.allSettled(
        SHELL_URLS.map((url) => cache.add(new Request(url, { cache: 'reload' }))),
      ))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((chaves) => Promise.all(
        chaves
          .filter((chave) => chave.startsWith('it-') && chave !== SHELL_CACHE && chave !== STATIC_CACHE)
          .map((chave) => caches.delete(chave)),
      ))
      .then(() => self.clients.claim()),
  );
});

function deveCachearEstatico(url) {
  return url.pathname.startsWith('/_next/static/')
    || /\.(?:png|jpe?g|webp|svg|woff2?|ico|txt)$/i.test(url.pathname);
}

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // API é same-origin via rewrite, mas é dinâmica e autenticada: rede sempre.
  if (url.pathname.startsWith('/api/')) return;

  if (request.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        return await fetch(request);
      } catch {
        const pagina = await caches.match(request, { ignoreSearch: true });
        if (pagina) return pagina;
        const offline = await caches.match(OFFLINE_URL);
        if (offline) return offline;
        return new Response('Sem conex\xc3\xa3o.', {
          status: 503,
          headers: { 'Content-Type': 'text/plain; charset=utf-8' },
        });
      }
    })());
    return;
  }

  if (deveCachearEstatico(url)) {
    event.respondWith((async () => {
      const cacheada = await caches.match(request);
      if (cacheada) return cacheada;
      try {
        const resposta = await fetch(request);
        if (resposta && resposta.ok && resposta.type === 'basic') {
          const cache = await caches.open(STATIC_CACHE);
          cache.put(request, resposta.clone());
        }
        return resposta;
      } catch {
        return new Response('', { status: 504 });
      }
    })());
  }
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
