import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { API_BASE_URL } from '@/lib/api';
import VitrineCorretorClient from './VitrineCorretorClient';

interface Props {
  params: Promise<{ slug: string }>;
}

async function getVitrineData(slug: string) {
  try {
    const clean = encodeURIComponent(String(slug).trim());
    const res = await fetch(`${API_BASE_URL}/corretores/publico/${clean}`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      return null;
    }

    const json = await res.json();
    return json?.data || null;
  } catch (err) {
    console.error('Erro ao buscar vitrine pública do corretor:', err);
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const data = await getVitrineData(slug);

  if (!data?.corretor) {
    return {
      title: 'Corretor não encontrado | Imóveis Taboão',
    };
  }

  const { corretor, totais } = data;
  const totalImoveis = totais?.total || 0;
  const titulo = `${corretor.nome} | Corretor Imóveis Taboão`;
  const descricao = corretor.apresentacao
    ? corretor.apresentacao.slice(0, 160)
    : `Confira os ${totalImoveis} imóveis para venda e locação disponíveis com ${corretor.nome} em Taboão da Serra e região.`;

  const urlPagina = `/corretor/${encodeURIComponent(slug)}/`;

  return {
    title: titulo,
    description: descricao,
    alternates: {
      canonical: urlPagina,
    },
    openGraph: {
      title: titulo,
      description: descricao,
      url: urlPagina,
      siteName: 'Imóveis Taboão',
      locale: 'pt_BR',
      images: corretor.foto_perfil_url ? [corretor.foto_perfil_url] : [],
      type: 'profile',
    },
    twitter: {
      card: 'summary_large_image',
      title: titulo,
      description: descricao,
      images: corretor.foto_perfil_url ? [corretor.foto_perfil_url] : [],
    },
  };
}

export default async function VitrineCorretorPage({ params }: Props) {
  const { slug } = await params;
  const data = await getVitrineData(slug);

  if (!data || !data.corretor) {
    notFound();
  }

  return <VitrineCorretorClient initialData={data} />;
}
