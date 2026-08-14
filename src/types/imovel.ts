export type TipoTransacao = 'Venda' | 'Locação' | 'Venda e Locação';
export type StatusImovel = 'Ativo' | 'Inativo' | 'Expirado' | 'Em Análise' | 'ativo' | 'expirado' | 'em_analise';

export interface Caracteristicas {
  quartos?: number | null;
  suites?: number | null;
  banheiros?: number | null;
  vagas?: number | null;
  areaUtil?: number | null;
  areaTotal?: number | null;
}

export interface Endereco {
  rua: string;
  numero: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
}

export interface Corretor {
  nome: string;
  telefone: string;
}

export interface Imovel {
  id: string;
  referencia: string;
  titulo: string;
  descricao: string;
  transacao: TipoTransacao;
  tipoImovel: string;
  // Aliases legados de leitura; novos fluxos devem usar tipoImovel e endereco.
  tipo?: string;
  bairro?: string;
  cidade?: string;
  endereco: Endereco;
  caracteristicas: Caracteristicas;
  precoVenda?: number;
  precoLocacao?: number;
  fotos: string[];
  videoUrl?: string;
  status: StatusImovel;
  destaque: boolean;
  isNovo?: boolean;
  corretor?: Corretor;
  createdAt: string;
  updatedAt: string;
  // Metadados operacionais do pipeline; preservam o status canônico retornado pela API.
  workflow_status?: string;
  estagio?: number;
  media_kit?: unknown;
  approval_url?: string | null;
}

