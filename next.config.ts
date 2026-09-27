import type { NextConfig } from "next";

/**
 * Lê uma lista de origens de uma variável de ambiente, com fallback.
 *
 * Motivo: uma allowlist de CSP escrita à mão quebra em produção silenciosamente sempre que
 * uma origem nova entra no site (foi o que aconteceu com res.cloudinary.com e com o beacon
 * do Cloudflare). Com esta variável, corrigir é mexer no ambiente da Netlify, sem build.
 * Exemplo: CSP_IMG_SRC="https://res.cloudinary.com https://cdn.exemplo.com"
 */
function envSources(name: string, defaults: string[]): string[] {
  const raw = process.env[name];
  if (!raw || !raw.trim()) return defaults;
  const parsed = raw.split(/[\s,]+/).map((s) => s.trim()).filter(Boolean);
  return parsed.length > 0 ? parsed : defaults;
}

const apiOrigin = (() => {
  const raw =
    process.env.NEXT_PUBLIC_API_URL ||
    "https://imoveis-taboao-api-production-4cd9.up.railway.app";
  try {
    return new URL(raw).origin;
  } catch {
    return "https://imoveis-taboao-api-production-4cd9.up.railway.app";
  }
})();

/**
 * Content-Security-Policy
 *
 * Escopo real: esta política é de hardening, não a defesa primária contra XSS.
 *
 * `script-src` e `style-src` mantêm 'unsafe-inline' porque a arquitetura atual depende dele:
 *  - o App Router do Next emite scripts de bootstrap inline em cada página;
 *  - o JSON-LD de SEO é injetado via <script dangerouslySetInnerHTML> em layout.tsx:73;
 *  - componentes usam a prop `style={{...}}` extensivamente, o que exige style-src inline.
 *
 * Ou seja: enquanto o nonce por requisição não for adotado, um payload inline ainda executa.
 * O buraco do simulador foi fechado na origem (escape do dado antes da interpolação em
 * SimuladorClient.tsx), e não pela CSP. O ganho real desta política é bloquear origens
 * externas não previstas, plugin de browser, injeção de <base>, clickjacking e downgrades.
 *
 * Migrar `script-src` para nonce (middleware.ts) é o passo seguinte para remover
 * 'unsafe-inline' — ver README de segurança.
 *
 * As origens abaixo foram conferidas contra o site em produção
 * (imoveistaboao.com.br), não inferidas do código.
 */
const scriptSrc = envSources("CSP_SCRIPT_SRC", [
  "'self'",
  "'unsafe-inline'",
  "https://www.googletagmanager.com",
  "https://pagead2.googlesyndication.com",
  // Cloudflare Web Analytics: o <script> do beacon é injetado pela borda do Cloudflare,
  // depois do header da Next. Sem esta origem o beacon é bloqueado e o analytics para.
  "https://static.cloudflareinsights.com",
]);

const imgSrc = envSources("CSP_IMG_SRC", [
  "'self'",
  "data:",
  "blob:",
  // Fotos dos imóveis são servidas pelo Cloudinary. Sem esta origem TODAS as fotos do
  // portal deixariam de carregar.
  "https://res.cloudinary.com",
  "https://images.unsplash.com",
  "https://abiatar.com",
  "https://i.ytimg.com",
  "https://www.google.com",
  "https://www.googletagmanager.com",
  "https://www.google-analytics.com",
]);

const connectSrc = envSources("CSP_CONNECT_SRC", [
  "'self'",
  apiOrigin,
  "https://api.web3forms.com",
  "https://www.google-analytics.com",
  "https://analytics.google.com",
  "https://region1.google-analytics.com",
  "https://www.googletagmanager.com",
  "https://*.googlesyndication.com",
  "https://*.doubleclick.net",
  "wss://*.googletagmanager.com",
  // Telemetria do Cloudflare.
  "https://cloudflareinsights.com",
  "https://static.cloudflareinsights.com",
]);

const csp = [
  "default-src 'self'",
  // Sem 'unsafe-eval': o Next em produção não precisa de eval para hidratação.
  `script-src ${scriptSrc.join(" ")}`,
  // Style inline é estrutural aqui (prop style={{...}} em diversos componentes).
  "style-src 'self' 'unsafe-inline'",
  `img-src ${imgSrc.join(" ")}`,
  "font-src 'self' data:",
  "media-src 'self' blob:",
  // iframes do site: tour virtual (YouTube), ficha técnica e croqui (abiatar.com) e
  // widget de avaliações do Google. Todos vêm de dados estáticos em empreendimentos.ts.
  "frame-src 'self' https://www.youtube.com https://www.youtube-nocookie.com https://abiatar.com https://www.google.com",
  `connect-src ${connectSrc.join(" ")}`,
  "worker-src 'self' blob:",
  "manifest-src 'self'",
  // Fecha <base> hijacking, embedding por terceiros e submissão de formulários cross-origin.
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  {
    key: "Content-Security-Policy",
    value: csp,
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    // Sem HSTS a primeira visita (ou apos o cache expirar) aceita SSL-strip: o atacante
    // intercepta o HTML, troca https por http e serve a pagina por http. Como o
    // script-src ainda aceita 'unsafe-inline', o script injetado executa e le o
    // auth_token do localStorage. includeSubDomains e preload valem para o dominio
    // inteiro, incluindo os subdominios da Netlify.
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    // Alinhado com frame-ancestors 'none' da CSP. SAMEORIGIN ainda permitia embed da
    // própria origem em um frame de terceiros.
    key: "X-Frame-Options",
    value: "DENY",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
  {
    key: "Cross-Origin-Opener-Policy",
    value: "same-origin-allow-popups",
  },
];

const nextConfig: NextConfig = {
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  /**
   * Proxy same-origin da API.
   *
   * O site roda em imoveistaboao.com.br e a API em *.up.railway.app: origens
   * diferentes. Se o navegador chamasse a API direto, a sessão em cookie só
   * funcionaria com `SameSite=None`, que depende de o usuário não bloquear
   * cookies de terceiros — e Safari/Chrome já bloqueiam por padrão em vários
   * casos. O login passaria a falhar de forma intermitente e difícil de
   * diagnosticar.
   *
   * Rewritando `/api/v1/*` para a Railway, a chamada sai de
   * imoveistaboao.com.br e volta para imoveistaboao.com.br. O cookie de sessão
   * fica first-party, `SameSite=Lax` funciona, e nenhum atributo de terceiros
   * é preciso. A API continua accessible direto para apps e integrações.
   */
  async rewrites() {
    return [
      {
        source: '/api/v1/:path*',
        destination: `${apiOrigin}/api/v1/:path*`,
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
