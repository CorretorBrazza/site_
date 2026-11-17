import type { Metadata } from 'next';

// A página lê o token da query e o remove em seguida; nunca deve ser indexada.
export const metadata: Metadata = {
  title: 'Definir senha | Imóveis Taboão',
  robots: { index: false, follow: false },
};

export default function DefinirSenhaLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
