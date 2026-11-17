import type { Metadata } from 'next';

// Formulário de acesso: sem valor de indexação e com link mágico na query.
export const metadata: Metadata = {
  title: 'Acessar minha conta | Imóveis Taboão',
  robots: { index: false, follow: false },
};

export default function LoginLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
