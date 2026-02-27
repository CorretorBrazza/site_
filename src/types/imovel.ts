export type TipoTransacao = 'Venda' | 'Locação' | 'Venda e Locação';
export type StatusImovel = 'Ativo' | 'Inativo';

export interface Caracteristicas {
  quartos: number;
  suites: number;
  banheiros: number;
  vagas: number;
  areaUtil: number;
  areaTotal: number;
}

export interface Endereco {
  rua: string;
  numero: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
}

export interface Imovel {
  id: string;
  referencia: string;
  titulo: string;
  descricao: string;
  transacao: TipoTransacao;
  tipoImovel: string;
  endereco: Endereco;
  caracteristicas: Caracteristicas;
  precoVenda?: number;
  precoLocacao?: number;
  fotos: string[];
  videoUrl?: string;
  status: StatusImovel;
  destaque: boolean;
  createdAt: string;
  updatedAt: string;
}
