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
        heroImage: '/images/empreendimentos/vsf2-fachada.webp',
        images: [
            '/images/empreendimentos/vsf2-fachada.webp',
            '/images/empreendimentos/vsf2-piscina.webp'
        ],
        amenities: ['Piscina', 'Garagem', 'Pet Place', 'Academia', 'Salão de Festas', 'Churrasqueira', 'Playground', 'Espaço Fitness', 'Quadra', 'Brinquedoteca'],
        dormitorios: '2 Dormitórios',
        vagas: '1 Vaga',
        area: '42m² a 48m²',
        deliveryDate: 'Abril 2026',
        description: 'O Villa São Francisco II é o empreendimento perfeito para quem busca conforto, segurança e uma localização privilegiada em Taboão da Serra. Com plantas inteligentes e área de lazer completa, o projeto foi planejado para oferecer o máximo de bem-estar para você e sua família.'
    },
    {
        slug: 'villa-sao-francisco-3',
        name: 'Villa São Francisco III',
        address: 'R. Maria Karachaki Ferras, 199 – Jardim Três Irmãos, Taboão da Serra – SP',
        status: 'Em Construção',
        heroImage: '/images/empreendimentos/vsf3-fachada.webp',
        images: [
            '/images/empreendimentos/vsf3-fachada.webp',
            '/images/empreendimentos/vsf3-piscina.webp'
        ],
        amenities: ['Piscina', 'Garagem', 'Pet Place', 'Academia', 'Salão de Festas', 'Churrasqueira', 'Playground', 'Espaço Fitness', 'Quadra', 'Brinquedoteca'],
        dormitorios: '2 Dormitórios',
        vagas: '1 Vaga',
        area: '42m² a 48m²',
        deliveryDate: 'Em breve',
        description: 'Continuação do sucesso Villa São Francisco, a fase III traz ainda mais modernidade e conforto para sua família.'
    },
    {
        slug: 'villa-sao-francisco-4',
        name: 'Villa São Francisco IV',
        address: 'R. Maria Karachaki Ferras, 199 – Jardim Três Irmãos, Taboão da Serra – SP',
        status: 'Lançamento',
        heroImage: '/images/empreendimentos/vsf4-fachada.webp',
        images: [
            '/images/empreendimentos/vsf4-fachada.webp',
            '/images/empreendimentos/vsf4-piscina.webp'
        ],
        amenities: ['Piscina', 'Garagem', 'Pet Place', 'Academia', 'Salão de Festas', 'Churrasqueira', 'Playground', 'Espaço Fitness', 'Quadra', 'Brinquedoteca'],
        dormitorios: '2 Dormitórios',
        vagas: '1 Vaga',
        area: '42m² a 48m²',
        deliveryDate: 'Lançamento',
        description: 'O mais novo lançamento da família Villa São Francisco. Qualidade Abiatar que você já conhece.'
    },
    {
        slug: 'griffe-jasmins',
        name: 'Residencial Griffe Jasmins',
        address: 'Rua dos Jasmins, 274 - Parque Assunção, Taboão da Serra - SP',
        status: 'Em Construção',
        heroImage: '/images/empreendimentos/fachada-noite-jasmins.webp',
        images: [
            '/images/empreendimentos/fachada-noite-jasmins.webp',
            '/images/empreendimentos/academia-jasmins.webp',
            '/images/empreendimentos/brinquedoteca-jasmins.webp',
            '/images/empreendimentos/coworking-jasmins.webp',
            '/images/empreendimentos/hall-jasmins.webp',
            '/images/empreendimentos/lounge-jasmins.webp',
            '/images/empreendimentos/petplace-jasmins.webp',
            '/images/empreendimentos/praca-fogo-jasmins.webp',
            '/images/empreendimentos/redario-jasmins.webp',
            '/images/empreendimentos/salao-festas-jasmins.webp',
            '/images/empreendimentos/varanda-jasmins.webp'
        ],
        amenities: ['Academia', 'Brinquedoteca', 'Coworking', 'Lounge', 'Pet Place', 'Salão de Festas', 'Churrasqueira', 'Praça do Fogo', 'Redário'],
        dormitorios: '2 Dormitórios',
        vagas: '1 Vaga',
        area: '42m²',
        deliveryDate: 'Em Construção',
        description: 'O Griffe Jasmins oferece sofisticação e lazer completo em uma localização estratégica. Um projeto feito para quem não abre mão de qualidade.'
    },
    {
        slug: 'griffe-jasmins-2',
        name: 'Residencial Griffe Jasmins 2',
        address: 'Rua dos Jasmins, 304 - Parque Assunção, Taboão da Serra - SP',
        status: 'Em Construção',
        heroImage: '/images/empreendimentos/jasmins2-fachada.webp',
        images: [
            '/images/empreendimentos/jasmins2-fachada.webp',
            '/images/empreendimentos/jasmins2-rooftop.webp'
        ],
        amenities: ['Rooftop', 'Piscina', 'Academia', 'Salão de Festas', 'Churrasqueira', 'Espaço Gourmet'],
        dormitorios: '2 Dormitórios',
        vagas: '1 Vaga',
        area: '42m²',
        deliveryDate: 'Em Construção',
        description: 'A segunda fase do Griffe Jasmins traz o diferencial do rooftop com vista panorâmica e lazer sofisticado.'
    },
    {
        slug: 'aurea-sky',
        name: 'Áurea Sky',
        address: 'Taboão da Serra - SP',
        status: 'Lançamento',
        heroImage: '/images/empreendimentos/aurea-sky-fachada.jpg',
        images: [
            '/images/empreendimentos/aurea-sky-fachada.jpg',
            '/images/empreendimentos/aurea-sky-piscina.jpg'
        ],
        amenities: ['Piscina Sky', 'Academia', 'Salão de Festas', 'Churrasqueira', 'Lazer Completo'],
        dormitorios: '2 Dormitórios',
        vagas: '1 Vaga',
        area: '42m²',
        deliveryDate: '2025',
        description: 'Viva no topo com o Áurea Sky. Um empreendimento moderno com lazer diferenciado e localização privilegiada.'
    },
    {
        slug: 'residencial-clube-laguna',
        name: 'Residencial Clube Laguna',
        address: 'Parque Industrial das Oliveiras, Taboão da Serra - SP',
        status: 'Em Construção',
        heroImage: '/images/empreendimentos/laguna-fachada.webp',
        images: [
            '/images/empreendimentos/laguna-fachada.webp',
            '/images/empreendimentos/laguna-academia.webp'
        ],
        amenities: ['Clube Completo', 'Piscina', 'Academia', 'Quadra', 'Churrasqueira', 'Salão de Festas'],
        dormitorios: '2 Dormitórios',
        vagas: '1 Vaga',
        area: '41m² a 47m²',
        deliveryDate: 'Em Construção',
        description: 'Um verdadeiro clube para sua família. O Residencial Clube Laguna oferece lazer de resort e segurança 24 horas.'
    },
    {
        slug: 'abiatar-residence-tower',
        name: 'Abiatar Residence Tower',
        address: 'Rua João Slavieiro, 31 - Centro, Taboão da Serra - SP',
        status: 'Lançamento',
        heroImage: '/images/empreendimentos/tower-fachada.jpg',
        images: [
            '/images/empreendimentos/tower-fachada.jpg',
            '/images/empreendimentos/tower-piscina.jpg'
        ],
        amenities: ['Piscina Climatizada', 'Academia', 'Churrasqueira', 'Salão de Festas', 'Espaço Gourmet', 'Playground'],
        dormitorios: '2 Dormitórios',
        vagas: '1 Vaga',
        area: '40m² a 46m²',
        deliveryDate: 'Lançamento',
        description: 'VIVA NO CENTRO DE TUDO. Alvenaria convencional com flexibilidade de plantas e localização estratégica ao lado da futura estação de metrô.'
    },
    {
        slug: 'innovare-morumbi',
        name: 'Innovare Morumbi',
        address: 'Morumbi/Taboão da Serra',
        status: 'Lançamento',
        heroImage: '/images/empreendimentos/innovare-morumbi-fachada.jpg',
        images: [
            '/images/empreendimentos/innovare-morumbi-fachada.jpg',
            '/images/empreendimentos/innovare-morumbi-piscina.jpg'
        ],
        amenities: ['Piscina', 'Academia', 'Salão de Festas', 'Churrasqueira', 'Playground'],
        dormitorios: '2 Dormitórios',
        vagas: '1 Vaga',
        area: 'A partir de 40m²',
        deliveryDate: 'Lançamento',
        description: 'Inovação e modernidade no Portal do Morumbi. Um projeto pensado para o seu estilo de vida.'
    },
    {
        slug: 'portal-morumbi',
        name: 'Portal Morumbi',
        address: 'Portal do Morumbi',
        status: 'Pronto para Morar',
        heroImage: '/images/empreendimentos/portal-morumbi-fachada.jpg',
        images: [
            '/images/empreendimentos/portal-morumbi-fachada.jpg',
            '/images/empreendimentos/portal-morumbi-churras.jpg'
        ],
        amenities: ['Churrasqueira', 'Salão de Festas', 'Playground', 'Portaria 24h'],
        dormitorios: '2 Dormitórios',
        vagas: '1 Vaga',
        area: 'A partir de 45m²',
        deliveryDate: 'Pronto',
        description: 'Conforto e praticidade no Portal do Morumbi. Pronto para você se mudar e viver bem.'
    },
    {
        slug: 'chacara-jockey',
        name: 'Chácara Jockey',
        address: 'Próximo ao Shopping Taboão',
        status: 'Em Construção',
        heroImage: '/images/empreendimentos/chacara-joquey-fachada.webp',
        images: [
            '/images/empreendimentos/chacara-joquey-fachada.webp',
            '/images/empreendimentos/chacara-joquey-piscina.webp'
        ],
        amenities: ['Piscina', 'Salão de Festas', 'Academia', 'Brinquedoteca', 'Churrasqueira'],
        dormitorios: '2 Dormitórios',
        vagas: '1 Vaga',
        area: 'A partir de 42m²',
        deliveryDate: 'Em Construção',
        description: 'Localização privilegiada próxima ao Shopping Taboão, com lazer completo para toda a família.'
    },
    {
        slug: 'vista-plaza',
        name: 'Vista Plaza',
        address: 'Taboão da Serra - SP',
        status: 'Em Construção',
        heroImage: '/images/empreendimentos/vista-plaza-fachada.jpg',
        images: [
            '/images/empreendimentos/vista-plaza-fachada.jpg',
            '/images/empreendimentos/vista-plaza-img1.jpg'
        ],
        amenities: ['Piscina', 'Academia', 'Salão de Festas', 'Churrasqueira', 'Playground'],
        dormitorios: '2 Dormitórios',
        vagas: '1 Vaga',
        area: '42m²',
        deliveryDate: 'Em Construção',
        description: 'Um novo conceito de viver bem em Taboão da Serra, com vista privilegiada e lazer completo.'
    },
    {
        slug: 'vila-parque-central-2',
        name: 'Vila Parque Central 2',
        address: 'Centro, Taboão da Serra - SP',
        status: 'Em Construção',
        heroImage: '/images/empreendimentos/vpc2-fachada.jpg',
        images: [
            '/images/empreendimentos/vpc2-fachada.jpg',
            '/images/empreendimentos/vpc2-piscina.jpg'
        ],
        amenities: ['Piscina', 'Academia', 'Salão de Festas', 'Churrasqueira', 'Mini Quadra'],
        dormitorios: '2 Dormitórios',
        vagas: '1 Vaga',
        area: '42m²',
        deliveryDate: 'Em Construção',
        description: 'A segunda fase do sucesso Vila Parque Central. Localização central e lazer para todos os momentos.'
    }
];
