import type { Metadata } from 'next';

// Link mágico de aprovação: token via fragmento, nunca indexável.
export const metadata: Metadata = {
  title: 'Aprovar imóvel | Imóveis Taboão',
  robots: { index: false, follow: false },
};

export default function AprovarLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
