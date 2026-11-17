/**
 * Contrato da PWA instalável e do modo offline.
 *
 * Roda sem navegador e sem build:
 *   node --import tsx --test scripts/test-pwa.test.ts
 *
 * O que trava aqui e o que costuma quebrar silenciosamente em producao:
 *  - manifesto sem icones PNG nas medidas exigidas (Android recusa instalar);
 *  - icone maskable ausente (a mascara do Android corta o conteudo);
 *  - service worker cacheando /api/* e vazando sessao entre usuarios;
 *  - service worker sem pagina /offline;
 *  - registro ausente no layout ou desligado em producao.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const raiz = process.cwd();
const ler = (arquivo: string) => readFileSync(join(raiz, arquivo), 'utf8');

function tamanhoPng(arquivo: string): { largura: number; altura: number } {
  const buffer = readFileSync(join(raiz, arquivo));
  assert.equal(buffer.subarray(1, 4).toString('ascii'), 'PNG', `${arquivo} deve ser PNG real`);
  return { largura: buffer.readUInt32BE(16), altura: buffer.readUInt32BE(20) };
}

test('manifesto declara instalacao, escopo e icones PNG nas medidas exigidas', () => {
  const manifesto = JSON.parse(ler('public/manifest.webmanifest'));

  assert.equal(manifesto.scope, '/');
  assert.equal(manifesto.display, 'standalone');
  assert.equal(manifesto.start_url, '/', 'instalar pelo site abre a vitrine, nao area autenticada');
  assert.equal(manifesto.id, '/');
  assert.equal(manifesto.lang, 'pt-BR');

  const any = manifesto.icons.filter((i: any) => String(i.purpose).includes('any'));
  const maskable = manifesto.icons.filter((i: any) => String(i.purpose).includes('maskable'));

  for (const icone of any.filter((i: any) => i.type === 'image/png')) {
    assert.ok(existsSync(join(raiz, 'public', icone.src.replace(/^\//, ''))), `${icone.src} existe`);
  }
  assert.deepEqual(
    any.filter((i: any) => i.type === 'image/png').map((i: any) => i.sizes).sort(),
    ['192x192', '512x512'],
  );
  assert.deepEqual(
    maskable.map((i: any) => i.sizes).sort(),
    ['192x192', '512x512'],
    'maskable e obrigatorio nas duas medidas',
  );

  assert.deepEqual(tamanhoPng('public/icon-192.png'), { largura: 192, altura: 192 });
  assert.deepEqual(tamanhoPng('public/icon-512.png'), { largura: 512, altura: 512 });
  assert.deepEqual(tamanhoPng('public/icon-maskable-192.png'), { largura: 192, altura: 192 });
  assert.deepEqual(tamanhoPng('public/icon-maskable-512.png'), { largura: 512, altura: 512 });
  assert.deepEqual(tamanhoPng('public/apple-touch-icon.png'), { largura: 180, altura: 180 });
});

test('service worker nunca guarda API nem pagina autenticada', () => {
  const sw = ler('public/sw.js');

  assert.match(sw, /addEventListener\(['"]fetch['"]/, 'deve interceptar fetch');
  assert.match(sw, /pathname\.startsWith\(['"]\/api\/['"]\)/, 'deve ignorar /api/*');
  assert.match(sw, /OFFLINE_URL\s*=\s*['"]\/offline\//, 'deve ter fallback offline');
  assert.match(sw, /caches\.match\(OFFLINE_URL\)/, 'deve servir a pagina offline');
  assert.match(sw, /request\.mode\s*===\s*['"]navigate['"]/, 'deve tratar navegacoes');
  assert.match(sw, /clients\.claim\(\)/, 'deve assumir o controle apos ativar');

  // Nao pode haver cache generico de HTML: isso guardaria /dashboard e /revisar.
  assert.doesNotMatch(sw, /cache\.put\(request[^)]*\)\s*;[\s\S]*navigate/, 'nao cachear HTML de navegacao');
  assert.doesNotMatch(sw, /localStorage|sessionStorage|Authorization/, 'SW nao lida com credenciais');
});

test('layout registra o service worker e declara os icones', () => {
  const layout = ler('src/app/layout.tsx');
  const registro = ler('src/components/PwaRegister.tsx');

  assert.match(layout, /<PwaRegister\s*\/>/, 'registro montado no layout raiz');
  assert.match(layout, /apple-touch-icon\.png/, 'apple touch icon declarado');
  assert.match(layout, /manifest\.webmanifest/);
  assert.match(registro, /process\.env\.NODE_ENV\s*!==\s*['"]production['"]/, 'nao registrar em dev');
  assert.match(registro, /navigator\.serviceWorker\.register\(['"]\/sw\.js['"]/, 'registra /sw.js');
});

test('offline existe e o servidor permite o escopo do service worker', () => {
  assert.ok(existsSync(join(raiz, 'src/app/offline/page.tsx')), 'pagina /offline existe');
  assert.match(ler('src/app/offline/page.tsx'), /Sem conex/);
  assert.match(ler('next.config.ts'), /Service-Worker-Allowed/, 'header de escopo do SW');
  assert.match(ler('next.config.ts'), /worker-src 'self'/, 'CSP permite o worker');
});
