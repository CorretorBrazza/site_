import { MetadataRoute } from 'next';
import { empreendimentos } from '@/data/empreendimentos';
import { getImoveis } from '@/app/actions/imovel-server-actions';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://imoveistaboao.com.br';

    // Páginas estáticas
    const routes = ['', '/venda', '/locacao'].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: route === '' ? 1 : 0.8,
    }));

    // Empreendimentos dinâmicos
    const empreendimentoRoutes = empreendimentos.map((emp) => ({
        url: `${baseUrl}/empreendimento/${emp.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
    }));

    // Imóveis dinâmicos
    const imoveis = await getImoveis();
    const imovelRoutes = imoveis.map((imovel) => ({
        url: `${baseUrl}/imovel/${imovel.id}`,
        lastModified: new Date(imovel.updatedAt || new Date()),
        changeFrequency: 'weekly' as const,
        priority: 0.6,
    }));

    return [...routes, ...empreendimentoRoutes, ...imovelRoutes];
}
