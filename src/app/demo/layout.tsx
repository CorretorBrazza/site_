import type { Metadata } from 'next';

/**
 * Metadados do segmento `/demo`.
 *
 * Mesmo caso de `/planos`: a página é cliente (simulador de Media Kit), então o
 * `metadata` vive no layout do segmento, que é server component.
 */
export const metadata: Metadata = {
  title: 'Demonstração do Media Kit com IA | Imóveis Taboão',
  description:
    'Veja na prática como a IA do Imóveis Taboão transforma fotos e um texto solto em anúncio pronto para portais, Instagram, WhatsApp e Canva. Demonstração gratuita, sem cadastro.',
  alternates: {
    canonical: 'https://imoveistaboao.com.br/demo/',
  },
  openGraph: {
    title: 'Demonstração do Media Kit com IA | Imóveis Taboão',
    description:
      'Envie fotos e um texto simples: a IA escreve o anúncio completo em 5 canais. Veja a demonstração.',
    url: 'https://imoveistaboao.com.br/demo/',
    siteName: 'Imóveis Taboão',
    locale: 'pt_BR',
    type: 'website',
  },
};

export default function DemoLayout({ children }: { children: React.ReactNode }) {
  return children;
}
