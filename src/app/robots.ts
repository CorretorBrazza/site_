import { MetadataRoute } from 'next';

export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // Defesa em profundidade: as rotas abaixo já têm `robots: noindex` no
      // metadata, mas o robots.txt evita que o próprio rastreador as visite.
      // Inclui área autenticada, links mágicos e a API (via rewrite).
      disallow: [
        '/api/',
        '/admin',
        '/dashboard',
        '/revisar',
        '/aprovar',
        '/login',
        '/cadastro',
        '/esqueci-senha',
        '/definir-senha',
        '/offline',
        '/exclusao-dados-usuario',
      ],
    },
    sitemap: 'https://imoveistaboao.com.br/sitemap.xml',
  };
}
