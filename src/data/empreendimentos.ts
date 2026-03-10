export interface Empreendimento {
    slug: string;
    name: string;
    address: string;
    status: 'Lançamento' | 'Em Construção' | 'Pronto para Morar';
    heroImage: string;
    images: string[];
    amenities: string[];
    dormitorios: string;
    vagas?: string;
    area: string;
    deliveryDate: string;
    description: string;
    videoUrl?: string;
}

export const empreendimentos: Empreendimento[] = [
    {
        slug: 'villa-sao-francisco-2',
        name: 'Villa São Francisco II',
        address: 'R. Maria Karachaki Ferras, 199 – Jardim Três Irmãos, Taboão da Serra – SP',
        status: 'Em Construção',
        heroImage: 'https://images.unsplash.com/photo-1541888946425-d81bb19480c5?auto=format&fit=crop&q=80&w=800',
        images: [
            'https://images.unsplash.com/photo-1541888946425-d81bb19480c5?auto=format&fit=crop&q=80&w=800'
        ],
        amenities: ['Piscina', 'Garagem', 'Pet Place', 'Academia', 'Salão de Festas', 'Churrasqueira', 'Playground', 'Espaço Fitness', 'Quadra', 'Brinquedoteca'],
        dormitorios: '2 Dormitórios',
        vagas: '1 Vaga',
        area: '42m² a 48m²',
        deliveryDate: 'Abril 2026',
        description: 'O Villa São Francisco II é o empreendimento perfeito para quem busca conforto, segurança e uma localização privilegiada em Taboão da Serra. Com plantas inteligentes e área de lazer completa, o projeto foi planejado para oferecer o máximo de bem-estar para você e sua família.'
    }
];
