export interface BlocoInfo {
    nome: string;
    andares: string;
    gardensPortAndar: number;
    aptosPortAndar: number;
    totalUnidades: number;
    area: string;
    elevadores: number;
}

export interface VagasDetalhadas {
    automoveis: number;
    pne: number;
    motos: number;
    bicicletas: number;
}

export interface Proximidade {
    referencia: string;
    distancia: string;
}

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
    logoUrl?: string;
    plantImages?: string[];
    virtualTourUrl?: string;
    fichaUrl?: string;
    croquiUrl?: string;
    progressPercentage?: number;
    lastUpdateDate?: string;
    dormitorioOptions?: Array<{ dormitorios: string; area: string; vagas: string }>;
    programaHabitacional?: string;
    blocos?: number;
    totalUnidades?: number;
    blocosInfo?: BlocoInfo[];
    vagasDetalhadas?: VagasDetalhadas;
    proximidades?: Proximidade[];
    seoTitle?: string;
    seoDescription?: string;
}

export const empreendimentos: Empreendimento[] = [
    {
        slug: '360-home-club',
        name: '360 Home Club',
        address: 'R. Áurea Tavares, 440 – Loteamento Pq. Industrial das Oliveiras, Taboão da Serra – SP',
        status: 'Lançamento',
        heroImage: '/images/empreendimentos/360-home-club/fachada.jpg',
        logoUrl: '/images/empreendimentos/360-home-club/logo.png',
        images: [
            '/images/empreendimentos/360-home-club/fachada.jpg',
        ],
        programaHabitacional: 'Minha Casa Minha Vida',
        blocos: 2,
        totalUnidades: 427,
        blocosInfo: [
            {
                nome: 'Bloco 1',
                andares: 'Térreo + 20 andares',
                gardensPortAndar: 4,
                aptosPortAndar: 10,
                totalUnidades: 204,
                area: '41m² a 61m²',
                elevadores: 4,
            },
            {
                nome: 'Bloco 2',
                andares: 'Térreo + 18 andares',
                gardensPortAndar: 7,
                aptosPortAndar: 12,
                totalUnidades: 223,
                area: '41m² a 71m²',
                elevadores: 4,
            },
        ],
        amenities: [
            'Brinquedoteca',
            'Cinema',
            'Coworking',
            'Espaço Beleza',
            'Espaço Connect',
            'Espaço Gourmet',
            'Espaço Gourmet com Churrasqueira na Cobertura',
            'Fitness',
            'Insta Spot',
            'Market',
            'Oficina / Ateliê',
            'Pet Care',
            'Pet Place',
            'Piscina Adulto',
            'Piscina Infantil',
            'Playground Infantil',
            'Quadra de Beach Tennis',
            'Quadra de Streetball',
            'Salão de Festas',
            'Salão de Jogos',
        ],
        dormitorios: '2 Dormitórios',
        vagas: '427 automóveis + 13 PNE + 36 motos + 186 bicicletas',
        vagasDetalhadas: {
            automoveis: 427,
            pne: 13,
            motos: 36,
            bicicletas: 186,
        },
        area: '41m² a 71m²',
        deliveryDate: 'A confirmar',
        description: 'Um novo jeito de viver bem em Taboão da Serra. O 360 Home Club é um empreendimento com 2 blocos e 427 unidades, pensado para oferecer conforto, lazer e qualidade de vida em um dos pontos mais estratégicos da cidade. Com apartamentos de 2 dormitórios e varandas, plantas inteligentes de 41 a 71 m², o projeto alia funcionalidade e bem-estar no dia a dia. Com conceito de home club, o condomínio conta com 20 itens de lazer. Próximo ao Shopping Taboão, com fácil acesso à Rodovia Régis Bittencourt e às futuras estações da Linha 4-Amarela do metrô. Enquadrado no programa Minha Casa Minha Vida, com entrada facilitada e parcelas acessíveis.',
        dormitorioOptions: [
            { dormitorios: '2 Dorms. com Varanda – Bloco 1', area: '41m² a 61m²', vagas: 'Opcional' },
            { dormitorios: '2 Dorms. com Varanda – Bloco 2', area: '41m² a 71m²', vagas: 'Opcional' },
            { dormitorios: 'Garden – Bloco 1 (Térreo)', area: '50m² a 61m²', vagas: 'Opcional' },
            { dormitorios: 'Garden – Bloco 2 (Térreo)', area: '50m² a 71m²', vagas: 'Opcional' },
        ],
        proximidades: [
            { referencia: 'Shopping Taboão', distancia: '600 metros' },
            { referencia: 'Rodovia Régis Bittencourt', distancia: '800 metros' },
            { referencia: 'Futuras estações Linha 4-Amarela do Metrô', distancia: 'Acesso facilitado' },
        ],
        seoTitle: 'LANÇAMENTO AO LADO DO SHOPPING | Aptos até 71m² | 360 Home Club – Taboão da Serra',
        seoDescription: 'Lançamento MCMV em Taboão da Serra! 360 Home Club: apts de 2 dorms com varanda e gardens até 71m², 20 itens de lazer, a 600m do Shopping Taboão. Parcelas acessíveis. Fale agora!',
    },
    {
        slug: 'villa-sao-francisco-2',
        name: 'Villa São Francisco II',
        address: 'R. Maria Francisca de Jesus, 199 – Jardim Três Irmãos, Taboão da Serra – SP',
        status: 'Em Construção',
        heroImage: '/images/empreendimentos/vsf2-fachada.webp',
        images: [
            '/images/empreendimentos/vsf2-fachada.webp',
            '/images/empreendimentos/vsf2-piscina.webp',
            '/images/empreendimentos/vsf2-planta1.webp',
            '/images/empreendimentos/vsf2-planta2.webp'
        ],
        amenities: ['Piscina', 'Garagem', 'Academia', 'Salão de Festas', 'Home Office', 'Bicicletário', 'Playground', 'Churrasqueira', 'Brinquedoteca'],
        dormitorios: '1 e 2 Dormitórios',
        vagas: '1 Vaga',
        area: '42m² a 48m²',
        deliveryDate: 'Abril 2026',
        description: 'O Villa São Francisco II é o empreendimento perfeito para quem busca conforto, segurança e uma localização privilegiada em Taboão da Serra. Com plantas inteligentes e área de lazer completa, o projeto foi planejado para oferecer o máximo de bem-estar para você e sua família.',
        videoUrl: 'https://www.youtube.com/watch?v=m0sHuARH4IM'
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
        deliveryDate: 'Abril 2026',
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
        deliveryDate: 'Maio 2027',
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
        deliveryDate: 'Agosto 2026',
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
        deliveryDate: 'Agosto 2028',
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
        deliveryDate: 'Janeiro 2029',
        description: 'Viva no topo com o Áurea Sky. Um empreendimento moderno com lazer diferenciado e localização privilegiada.'
    },
    {
        slug: 'residencial-clube-laguna',
        name: 'Residencial Clube Laguna',
        address: 'R. José de Souza Costa, 221 - Parque Laguna, Taboão da Serra - SP',
        status: 'Em Construção',
        heroImage: '/images/empreendimentos/laguna-fachada.webp',
        logoUrl: '/images/empreendimentos/laguna-logo.webp',
        videoUrl: 'https://www.youtube.com/watch?v=XHauCjjHIzo',
        images: [
            '/images/empreendimentos/laguna-fachada.webp',
            '/images/empreendimentos/laguna-academia.webp',
            '/images/empreendimentos/laguna-apto-living.webp',
            '/images/empreendimentos/laguna-bicicletario.webp',
            '/images/empreendimentos/laguna-brinquedoteca.webp',
            '/images/empreendimentos/laguna-car-wash.webp',
            '/images/empreendimentos/laguna-churrasqueira.webp',
            '/images/empreendimentos/laguna-cinema.webp',
            '/images/empreendimentos/laguna-coworking.webp',
            '/images/empreendimentos/laguna-ferramentaria.webp',
            '/images/empreendimentos/laguna-fitness-externo.webp',
            '/images/empreendimentos/laguna-garage-band.webp',
            '/images/empreendimentos/laguna-massagem.webp',
            '/images/empreendimentos/laguna-pet-care.webp',
            '/images/empreendimentos/laguna-piscina-aerea.webp',
            '/images/empreendimentos/laguna-pub.webp',
            '/images/empreendimentos/laguna-salao-beleza.webp',
            '/images/empreendimentos/laguna-salao-festas.webp',
            '/images/empreendimentos/laguna-zen-spa.webp',
            '/images/empreendimentos/laguna-planta-1pav.webp',
            '/images/empreendimentos/laguna-planta-2pav.webp',
            '/images/empreendimentos/laguna-planta-3pav.webp',
            '/images/empreendimentos/laguna-implantacao.webp'
        ],
        plantImages: [
            '/images/empreendimentos/laguna-planta-1pav.webp',
            '/images/empreendimentos/laguna-planta-2pav.webp',
            '/images/empreendimentos/laguna-planta-3pav.webp',
            '/images/empreendimentos/laguna-implantacao.webp'
        ],
        virtualTourUrl: 'https://www.youtube.com/embed/XHauCjjHIzo',
        fichaUrl: 'https://abiatar.com/wp-content/uploads/2025/06/Ficha-tecnica_Residencial-Clube-Laguna.pdf',
        croquiUrl: 'https://abiatar.com/wp-content/uploads/2025/06/Croqui-R.Clube-Laguna.html',
        amenities: [
            'Piscina', 'Garagem', 'Pet Place', 'Academia', 'Salão de Festas', 'Home Office',
            'Bicicletário', 'Playground', 'Cinema', 'Churrasqueira', 'Fitness Externo',
            'Sala de Jogos', 'Pizza Lounge', 'Brinquedoteca', 'Car Wash', 'Ferramentaria',
            'Pub', 'Sala de Massagem', 'Zen Spa', 'Garage Band', 'Salão de Beleza', 'Coworking'
        ],
        dormitorios: '1 e 2 Dormitórios',
        vagas: '1 Vaga',
        area: '41m² a 47m²',
        deliveryDate: 'Dez/27 (A e B) - Jun/28 (C e D)',
        description: 'O Residencial Clube Laguna é um verdadeiro clube residencial localizado no Parque Laguna, oferecendo uma experiência de lazer completa com mais de 20 opções de entretenimento. Com apartamentos de 1 e 2 dormitórios, o empreendimento conta com piscina, academia, salão de festas, cinema, brinquedoteca, espaço pet, coworking e muito mais. Uma localização privilegiada com segurança 24 horas e infraestrutura completa para você e sua família viverem momentos inesquecíveis.',
        progressPercentage: 21,
        lastUpdateDate: '08/04/2026',
        dormitorioOptions: [
            { dormitorios: '1 Dormitório', area: '41m² a 45m²', vagas: '1 Vaga' },
            { dormitorios: '2 Dormitórios', area: '45m² a 47m²', vagas: '1 Vaga' }
        ]
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
        deliveryDate: 'Maio 2029',
        description: 'VIVA NO CENTRO DE TUDO. Alvenaria convencional com flexibilidade de plantas e localização estratégica ao lado da futura estação de metrô.'
    },
    {
        slug: 'innovare-morumbi',
        name: 'Innovare Morumbi',
        address: 'Av. Guilherme Dumont Villares, 622 - Portal do Morumbi, São Paulo - SP',
        status: 'Lançamento',
        heroImage: '/images/empreendimentos/innovare-morumbi-fachada.jpg',
        images: [
            '/images/empreendimentos/innovare-morumbi-fachada.jpg',
            '/images/empreendimentos/innovare-morumbi-piscina.jpg'
        ],
        amenities: ['Piscina', 'Garagem', 'Academia', 'Salão de Festas', 'Bicicletário', 'Playground', 'Deck Solar', 'Churrasqueira'],
        dormitorios: '2 Dormitórios',
        vagas: '1 Vaga',
        area: 'A partir de 40m²',
        deliveryDate: 'Novembro 2027',
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
        deliveryDate: 'Agosto 2028',
        description: 'Localização privilegiada próxima ao Shopping Taboão, com lazer completo para toda a família.'
    },
    {
        slug: 'vista-plaza',
        name: 'Vista Plaza',
        address: 'Taboão da Serra - SP',
        status: 'Em Construção',
        heroImage: '/images/empreendimentos/vista-plaza/fachada-noturna.png',
        images: [
            '/images/empreendimentos/vista-plaza/fachada-noturna.png',
            '/images/empreendimentos/vista-plaza/fachada.png',
            '/images/empreendimentos/vista-plaza/academia.png',
            '/images/empreendimentos/vista-plaza/churrasqueira.png',
            '/images/empreendimentos/vista-plaza/espaco-coworking.png',
            '/images/empreendimentos/vista-plaza/espaco-pizza-gourmet.png',
            '/images/empreendimentos/vista-plaza/funcional.png',
            '/images/empreendimentos/vista-plaza/lazer-terceiro-pavimento.png',
            '/images/empreendimentos/vista-plaza/piscina-adulto.png',
            '/images/empreendimentos/vista-plaza/piscina-com-deck.png',
            '/images/empreendimentos/vista-plaza/playground-infanto.png',
            '/images/empreendimentos/vista-plaza/playground-kids.png',
            '/images/empreendimentos/vista-plaza/praca-apoio-churrasqueira.png',
            '/images/empreendimentos/vista-plaza/praca-do-fogo.png',
            '/images/empreendimentos/vista-plaza/praca-jogos.png',
            '/images/empreendimentos/vista-plaza/sala-multimidia.png',
            '/images/empreendimentos/vista-plaza/salao-de-festas-gourmet.png'
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
        deliveryDate: 'Outubro 2026',
        description: 'A segunda fase do sucesso Vila Parque Central. Localização central e lazer para todos os momentos.'
    }
];
