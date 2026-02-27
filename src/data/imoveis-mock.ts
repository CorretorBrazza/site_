import { Imovel } from '../types/imovel';

export const imoveisMock: Imovel[] = [
  {
    id: '1',
    referencia: 'IMV001',
    titulo: 'Casa Contemporânea no Centro',
    descricao: 'Linda casa com acabamento de alto padrão, amplas salas e área gourmet completa.',
    transacao: 'Venda',
    tipoImovel: 'Casa',
    endereco: {
      rua: 'Rua das Flores',
      numero: '123',
      bairro: 'Centro',
      cidade: 'Taboão da Serra',
      estado: 'SP',
      cep: '06763-000'
    },
    caracteristicas: {
      quartos: 3,
      suites: 1,
      banheiros: 3,
      vagas: 2,
      areaUtil: 150,
      areaTotal: 250
    },
    precoVenda: 750000,
    fotos: ['https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&q=80&w=800'],
    status: 'Ativo',
    destaque: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    referencia: 'IMV002',
    titulo: 'Apartamento aconchegante próximo ao metrô',
    descricao: 'Excelente oportunidade para locação. Apartamento todo mobiliado e reformado.',
    transacao: 'Locação',
    tipoImovel: 'Apartamento',
    endereco: {
      rua: 'Av. Brasil',
      numero: '500',
      bairro: 'Parque Pinheiros',
      cidade: 'Taboão da Serra',
      estado: 'SP',
      cep: '06767-000'
    },
    caracteristicas: {
      quartos: 2,
      suites: 0,
      banheiros: 1,
      vagas: 1,
      areaUtil: 65,
      areaTotal: 65
    },
    precoLocacao: 2500,
    fotos: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=800'],
    status: 'Ativo',
    destaque: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];
