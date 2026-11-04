import { MetadataRoute } from 'next';
import { empreendimentos } from '@/data/empreendimentos';
import { getImoveis } from '@/app/actions/imovel-server-actions';

export const revalidate = 3600; // Revalidar sitemap a cada hora

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://imoveistaboao.com.br';

    // Páginas estáticas
    const staticRoutes = [
        { path: '', priority: 1.0, changeFrequency: 'daily' as const },
        { path: '/venda', priority: 0.8, changeFrequency: 'daily' as const },
        { path: '/locacao', priority: 0.8, changeFrequency: 'daily' as const },
        { path: '/como-funciona', priority: 0.8, changeFrequency: 'weekly' as const },
        { path: '/demo', priority: 0.8, changeFrequency: 'weekly' as const },
        { path: '/planos', priority: 0.8, changeFrequency: 'weekly' as const },
        { path: '/sobre-nos', priority: 0.6, changeFrequency: 'monthly' as const },
        { path: '/contato', priority: 0.6, changeFrequency: 'monthly' as const },
        { path: '/politica-de-privacidade', priority: 0.4, changeFrequency: 'monthly' as const },
        { path: '/termos-de-uso', priority: 0.4, changeFrequency: 'monthly' as const },
    ];

    const routes = staticRoutes.map((route) => ({
        url: route.path ? `${baseUrl}${route.path}/` : `${baseUrl}`,
        // Sem `lastModified: new Date()` em toda entrada. O sitemap é regerado a
        // cada hora, e anunciar que TODAS as páginas mudaram a cada geração é um
        // sinal falso para o buscador (ele passa a ignorar a data).
        changeFrequency: route.changeFrequency,
        priority: route.priority,
    }));

    // Empreendimentos dinâmicos
    const empreendimentoRoutes = empreendimentos.map((emp) => ({
        url: `${baseUrl}/empreendimento/${emp.slug}/`,
        changeFrequency: 'weekly' as const,
        priority: 0.7,
    }));

    // Imóveis dinâmicos
    const { imoveis } = await getImoveis();
    const imovelRoutes = imoveis.map((imovel) => {
        // A URL pública é a REFERÊNCIA (é o canonical de `/imovel/[id]`). Antes o
        // sitemap listava `/imovel/<ad_id>`, cujo canonical aponta para
        // `/imovel/<referencia>` — duas URLs para a mesma página, com o sitemap
        // apontando justamente para a que o canonical desautoriza.
        const identificador = imovel.referencia || imovel.id;
        const atualizado = imovel.updatedAt ? new Date(imovel.updatedAt) : undefined;
        return {
            url: `${baseUrl}/imovel/${encodeURIComponent(identificador)}/`,
            lastModified: atualizado && !Number.isNaN(atualizado.getTime()) ? atualizado : undefined,
            changeFrequency: 'weekly' as const,
            priority: 0.6,
        };
    });

    return [...routes, ...empreendimentoRoutes, ...imovelRoutes];
}
