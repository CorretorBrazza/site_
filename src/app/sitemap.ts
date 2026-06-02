import { MetadataRoute } from 'next';
import { empreendimentos } from '@/data/empreendimentos';
import { getImoveis } from '@/app/actions/imovel-server-actions';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://imoveistaboao.com.br';

    // Páginas estáticas
    const staticRoutes = [
        { path: '', priority: 1.0, changeFrequency: 'daily' as const },
        { path: '/venda', priority: 0.8, changeFrequency: 'daily' as const },
        { path: '/locacao', priority: 0.8, changeFrequency: 'daily' as const },
        { path: '/sobre-nos', priority: 0.6, changeFrequency: 'monthly' as const },
        { path: '/contato', priority: 0.6, changeFrequency: 'monthly' as const },
        { path: '/politica-de-privacidade', priority: 0.4, changeFrequency: 'monthly' as const },
        { path: '/termos-de-uso', priority: 0.4, changeFrequency: 'monthly' as const },
    ];

    const routes = staticRoutes.map((route) => ({
        url: `${baseUrl}${route.path}`,
        lastModified: new Date(),
        changeFrequency: route.changeFrequency,
        priority: route.priority,
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
