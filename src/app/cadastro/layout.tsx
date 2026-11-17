import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Criar conta de corretor | Imóveis Taboão',
  robots: { index: false, follow: false },
};

export default function CadastroLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
