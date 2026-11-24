import { Metadata } from 'next';
import { notFound, permanentRedirect } from 'next/navigation';
import { API_BASE_URL } from '@/lib/api';
import { safeJsonLd } from '@/lib/jsonld';
import VitrineCorretorClient from './VitrineCorretorClient';

interface Props {
  params: Promise<{ slug: string }>;
}

type StatusVitrine = 'ok' | 'nao_encontrado' | 'indisponivel';

interface ResultadoVitrine {
  status: StatusVitrine;
  data?: any;
}

/**
 * 404 (slug inexistente) e 503 (API fora) são coisas diferentes:
 * a primeira deve sair como 404 de verdade; a segunda não pode apagar uma
 * vitrine indexada só porque a Railway reiniciou.

 * O contrato retornado evita que `generateMetadata` e a página façam dois fetch
 * com semânticas distintas.
 */
async function getVitrineData(slug: string): Promise<ResultadoVitrine> {
  try {
    const clean = encodeURIComponent(String(slug).trim());
    const res = await fetch(`${API_BASE_URL}/corretores/publico/${clean}`, {
      next: { revalidate: 60 },
    });

    if (res.status === 404) return { status: 'nao_encontrado' };
    if (!res.ok) return { status: 'indisponivel' };

    const json = await res.json();
    const data = json?.data;
    if (!data?.corretor) return { status: 'nao_encontrado' };
    return { status: 'ok', data };
  } catch (err) {
    console.error('Erro ao buscar vitrine pública do corretor:', err);
    return { status: 'indisponivel' };
  }
}

function slugCanonicoDe(data: any, slug: string): string {
  return String(data?.corretor?.slug || slug).trim().toLowerCase();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const resultado = await getVitrineData(slug);

  if (resultado.status !== 'ok') {
    return {
      title: resultado.status === 'nao_encontrado'
        ? 'Corretor não encontrado | Imóveis Taboão'
        : 'Vitrine temporariamente indisponível | Imóveis Taboão',
      robots: { index: false, follow: false },
    };
  }

  const { corretor, totais } = resultado.data;
  const totalImoveis = totais?.total || 0;
  const titulo = `${corretor.nome} | Corretor Imóveis Taboão`;
  const descricao = corretor.apresentacao
    ? corretor.apresentacao.slice(0, 160)
    : `Confira os ${totalImoveis} imóveis para venda e locação disponíveis com ${corretor.nome} em Taboão da Serra e região.`;

  // Código do corretor e slug antigo são aliases: o canonical é sempre o slug
  // atual devolvido pela API, nunca o identificador digitado na URL.
  const urlPagina = `/corretor/${encodeURIComponent(slugCanonicoDe(resultado.data, slug))}/`;

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
  const resultado = await getVitrineData(slug);

  if (resultado.status === 'nao_encontrado') {
    notFound();
  }
  if (resultado.status === 'indisponivel') {
    // Sobe para o error.tsx da vitrine: mantém a rota viva e oferece nova tentativa.
    throw new Error('Não foi possível carregar a vitrine do corretor agora.');
  }

  const data = resultado.data;
  const slugCanonico = slugCanonicoDe(data, slug);
  if (slugCanonico !== String(slug).trim().toLowerCase()) {
    // 308 de verdade: meta refresh (comportamento do `redirect` comum em
    // streaming) é sinal fraco para o Google e deixa o alias indexável.
    permanentRedirect(`/corretor/${encodeURIComponent(slugCanonico)}/`);
  }

  const { corretor, totais } = data;
  const urlAbsoluta = `https://imoveistaboao.com.br/corretor/${encodeURIComponent(slugCanonico)}/`;
  const descricao = corretor.apresentacao
    ? corretor.apresentacao.slice(0, 160)
    : `${totais?.total || 0} imóveis para venda e locação com ${corretor.nome} em Taboão da Serra.`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    '@id': `${urlAbsoluta}#perfil`,
    url: urlAbsoluta,
    name: `${corretor.nome} | Corretor Imóveis Taboão`,
    description: descricao,
    mainEntity: {
      '@type': 'Person',
      '@id': `${urlAbsoluta}#corretor`,
      name: corretor.nome,
      url: urlAbsoluta,
      ...(corretor.foto_perfil_url ? { image: corretor.foto_perfil_url } : {}),
      ...(corretor.telefone && corretor.exibir_telefone !== false
        ? { telephone: `+${corretor.telefone}` }
        : {}),
      worksFor: { '@id': 'https://imoveistaboao.com.br/#agente' },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }}
      />
      <VitrineCorretorClient initialData={data} />
    </>
  );
}
