import type { Metadata } from 'next';

// O acesso é feito por token no fragmento (#token=...). Nada disso pode ser
// indexado ou perseguido por robô de busca.
export const metadata: Metadata = {
  title: 'Revisar imóvel | Imóveis Taboão',
  robots: { index: false, follow: false },
};

export default function RevisarLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
