import type { Metadata } from 'next';

/**
 * Metadados do segmento `/planos`.
 *
 * A página é `'use client'` (tem calculadora interativa), e componente cliente
 * não pode exportar `metadata`. O `layout.tsx` do segmento é server component e
 * resolve isso sem transformar a página inteira.
 *
 * Antes, `/planos` herdava o título genérico da home apesar de estar no sitemap
 * com prioridade 0.8 — a página comercial mais importante do funil aparecia no
 * Google como "Imóveis Taboão | Sua casa em Taboão da Serra".
 */
export const metadata: Metadata = {
  title: 'Créditos e Planos | Publique seu imóvel por R$ 12,90',
  description:
    'Compre créditos para publicar imóveis no Imóveis Taboão: 1 crédito por anúncio, Media Kit com IA e 90 dias no ar. Pacotes de 1, 3 e 10 créditos com desconto progressivo.',
  alternates: {
    canonical: 'https://imoveistaboao.com.br/planos/',
  },
  openGraph: {
    title: 'Créditos e Planos | Imóveis Taboão',
    description:
      'Publique seu imóvel com Media Kit gerado por IA por R$ 12,90. Pacotes com desconto de até 30%.',
    url: 'https://imoveistaboao.com.br/planos/',
    siteName: 'Imóveis Taboão',
    locale: 'pt_BR',
    type: 'website',
  },
};

export default function PlanosLayout({ children }: { children: React.ReactNode }) {
  return children;
}
