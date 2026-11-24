/**
 * Contrato SEO de go-live.
 *
 *   node --import tsx --test scripts/test-seo.test.ts
 *
 * Roda sem rede e sem navegador: lê os fontes e valida as decisões que só
 * aparecem quando o Google visita o site — noindex de área privada, canonical
 * de página pública, sitemap completo e um único RealEstateAgent no HTML.
 *
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

function ler(caminhoRelativo: string): string {
  return readFileSync(fileURLToPath(new URL(`../${caminhoRelativo}`, import.meta.url)), 'utf8');
}

const ROTAS_PRIVADAS = [
  'admin',
  'login',
  'cadastro',
  'revisar',
  'aprovar',
  'esqueci-senha',
  'definir-senha',
];

test('1. areas privadas tem layout servidor com noindex e titulo proprio', () => {
  for (const rota of ROTAS_PRIVADAS) {
    const arquivo = `src/app/${rota}/layout.tsx`;
    assert.ok(existsSync(fileURLToPath(new URL(`../${arquivo}`, import.meta.url))), `${arquivo} existe`);
    const fonte = ler(arquivo);
    assert.match(fonte, /robots:\s*\{\s*index:\s*false,\s*follow:\s*false\s*\}/, `${rota}: noindex`);
    assert.match(fonte, /title:/, `${rota}: titulo proprio (nao herda o da home)`);
  }

  const dashboard = ler('src/app/dashboard/layout.tsx');
  assert.match(dashboard, /robots:\s*\{\s*index:\s*false/);

  const offline = ler('src/app/offline/page.tsx');
  assert.match(offline, /robots:\s*\{\s*index:\s*false/, 'offline: noindex na propria pagina');
});

test('2. robots.txt bloqueia as mesmas rotas e aponta o sitemap', () => {
  const robots = ler('src/app/robots.ts');
  for (const rota of ['/api/', '/admin', '/dashboard', '/revisar', '/aprovar', '/login', '/cadastro']) {
    assert.match(robots, new RegExp(`'${rota.replace('/', '\\/')}'`), `robots disallow ${rota}`);
  }
  assert.match(robots, /sitemap:\s*'https:\/\/imoveistaboao\.com\.br\/sitemap\.xml'/);
});

test('3. paginas publicas indexaveis declaram canonical', () => {
  const paginas = [
    ['src/app/page.tsx', '/'],
    ['src/app/venda/page.tsx', '/venda/'],
    ['src/app/locacao/page.tsx', '/locacao/'],
    ['src/app/novo/page.tsx', '/novo/'],
    ['src/app/como-funciona/page.tsx', '/como-funciona/'],
    ['src/app/sobre-nos/page.tsx', '/sobre-nos/'],
    ['src/app/contato/page.tsx', '/contato/'],
    ['src/app/simulado/page.tsx', '/simulado/'],
    ['src/app/politica-de-privacidade/page.tsx', '/politica-de-privacidade/'],
    ['src/app/termos-de-uso/page.tsx', '/termos-de-uso/'],
    ['src/app/exclusao-de-dados/page.tsx', '/exclusao-de-dados'],
  ];
  for (const [arquivo, canonical] of paginas) {
    assert.match(ler(arquivo), /alternates:\s*\{[\s\S]*?canonical:/, `${arquivo}: canonical`);
    assert.match(ler(arquivo), new RegExp(canonical.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')), `${arquivo}: ${canonical}`);
  }

  const layouts = ['demo', 'planos'];
  for (const rota of layouts) {
    assert.match(ler(`src/app/${rota}/layout.tsx`), /canonical:/, `/${rota}: canonical no layout`);
  }

  const corretor = ler('src/app/corretor/[slug]/page.tsx');
  assert.match(corretor, /canonical: urlPagina/, 'vitrine do corretor tem canonical dinamico');
  assert.match(corretor, /siteName:/);
  assert.match(corretor, /locale:\s*'pt_BR'/);
});

test('4. sitemap cobre as rotas publicas antes ausentes', () => {
  const sitemap = ler('src/app/sitemap.ts');
  for (const rota of ['/novo', '/simulado', '/exclusao-de-dados']) {
    assert.match(sitemap, new RegExp(`path:\\s*'${rota}'`), `sitemap: ${rota}`);
  }
  assert.doesNotMatch(sitemap, /\/exclusao-dados-usuario/, 'duplicata nao entra no sitemap');

  const config = ler('next.config.ts');
  assert.match(config, /source:\s*'\/exclusao-dados-usuario'/);
  assert.match(config, /destination:\s*'\/exclusao-de-dados'/);
  assert.match(config, /permanent:\s*true/, 'redirecionamento 301');
});

test('5. um unico RealEstateAgent no HTML (global no root layout)', () => {
  const layout = ler('src/app/layout.tsx');
  assert.match(layout, /'@type':\s*'RealEstateAgent'/);
  assert.match(layout, /'@id':\s*'https:\/\/imoveistaboao\.com\.br\/#agente'/);
  assert.match(layout, /icon-512\.png/, 'imagem estruturada e PNG, nao ICO');

  const home = ler('src/app/page.tsx');
  assert.doesNotMatch(home, /'@type':\s*'RealEstateAgent'/, 'home nao repete o agente');
  assert.doesNotMatch(home, /5511932785602/, 'telefone conflitante removido');
});

test('6. structured data de imovel usa cidade/estado reais e nao fixos', () => {
  const pagina = ler('src/app/imovel/[id]/page.tsx');
  assert.match(pagina, /'@id':\s*`\$\{urlPagina\}#anuncio`/);
  assert.match(pagina, /endereco\?\.cidade\s*\|\|\s*imovel\.cidade/);
  assert.match(pagina, /endereco\?\.estado/, 'regiao vem do imovel');

  const simulado = ler('src/app/simulado/page.tsx');
  assert.doesNotMatch(simulado, /'@type':\s*'FinancialService'/, 'tipo de acao invalido removido');
});

test('7. PWA abre na vitrine publica, nao no painel autenticado', () => {
  const manifesto = JSON.parse(ler('public/manifest.webmanifest'));
  assert.equal(manifesto.start_url, '/');
  assert.equal(manifesto.id, '/');
  assert.equal(manifesto.scope, '/');
});

test('8. vitrine usa o slug canonico e redireciona alias', () => {
  const pagina = ler('src/app/corretor/[slug]/page.tsx');
  assert.match(pagina, /slugCanonicoDe\(resultado\.data, slug\)/, 'canonical vem da API');
  assert.match(pagina, /redirect\(/, 'alias redireciona');
  assert.match(pagina, /'replace'/, 'redirect e permanente para o mesmo destino');
  assert.match(pagina, /nao_encontrado/, '404 distinto de indisponivel');
  assert.match(pagina, /indisponivel/, 'erro temporario nao apaga a vitrine');
});

test('9. vitrine tem ProfilePage/Person sem repetir o agente global', () => {
  const pagina = ler('src/app/corretor/[slug]/page.tsx');
  assert.match(pagina, /'@type':\s*'ProfilePage'/);
  assert.match(pagina, /'@type':\s*'Person'/);
  assert.match(pagina, /mainEntity:/);
  assert.doesNotMatch(pagina, /'@type':\s*'RealEstateAgent'/, 'agente so existe no layout');
  assert.match(pagina, /safeJsonLd\(jsonLd\)/, 'JSON-LD escapado');
  const telefone = ler('src/lib/telefone.ts');
  assert.match(telefone, /digitos\.startsWith\('55'\)/, 'DDI nao duplicado');
});

test('10. link canonico da vitrine fica visivel e copiavel', () => {
  const cliente = ler('src/app/corretor/[slug]/VitrineCorretorClient.tsx');
  assert.match(cliente, /Link oficial da vitrine/);
  assert.match(cliente, /aria-label="Link da vitrine do corretor"/);
  assert.match(cliente, /copiarTexto\(linkVitrine\)/, 'botao copia o link canonico');
  assert.match(cliente, /window\.location\.origin/, 'URL absoluta no navegador');
  assert.match(cliente, /urlWhatsappCorretor\(/, 'WhatsApp passa pela normalizacao');
  assert.doesNotMatch(cliente, /wa\.me\/55\$\{/, 'sem DDI duplicado');
  assert.doesNotMatch(cliente, /Verificado/, 'selo fixo removido');
  const modal = ler('src/app/dashboard/components/ModalPerfilVitrine.tsx');
  assert.match(modal, /copiarTexto\(vitrineUrl\)/, 'painel tambem copia o link');
  assert.match(modal, /exibir_telefone: exibirTelefone/, 'opt-out de telefone salvo');
  assert.match(modal, /slug: slugCorretor/, 'slug editavel salvo');
});

test('11. sitemap inclui as vitrines publicas dos corretores', () => {
  const sitemap = ler('src/app/sitemap.ts');
  assert.match(sitemap, /buscarSlugsPublicosCorretores/, 'slugs vem da API publica');
  assert.match(sitemap, /\/corretor\/\$\{encodeURIComponent\(slug\)\}\//, 'url canonica da vitrine');
  const api = ler('src/lib/api.ts');
  assert.match(api, /\/corretores\/publico\/slugs/, 'endpoint de slugs');
  assert.doesNotMatch(api, /buscarVitrinePublicaCorretor/, 'helper morto removido');
});

test('12. vitrine tem loading e error boundary', () => {
  const loading = ler('src/app/corretor/[slug]/loading.tsx');
  const error = ler('src/app/corretor/[slug]/error.tsx');
  assert.match(loading, /animate-pulse/, 'feedback de carregamento');
  assert.match(error, /'use client'/, 'error boundary e cliente');
  assert.match(error, /onClick=\{reset\}/, 'nova tentativa');
});
