import type { Metadata } from 'next';

// Área administrativa: nunca pode competir com a home nem aparecer em busca.
export const metadata: Metadata = {
  title: 'Administração | Imóveis Taboão',
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
