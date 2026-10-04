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
  precoVenda?: number | null;
  precoLocacao?: number | null;
  precoPacote?: number | null;
  valorCondominio?: number | null;
  iptuMensal?: number | null;
  condominio?: string | null;
  fotos: string[];
  videoUrl?: string;
  status: StatusImovel;
  destaque: boolean;
  isNovo?: boolean;
  corretor?: Corretor;
  createdAt?: string;
  updatedAt?: string;
  created_at?: string;
  updated_at?: string;
  // Metadados operacionais do pipeline; preservam o status canônico retornado pela API.
  workflow_status?: string;
  estagio?: number;
  media_kit?: unknown;
  approval_url?: string | null;
  /**
   * Validade calculada pela API. Vem preenchida apenas quando a regra de
   * 90 dias está ativa; `null` significa "não expira", e nesse caso
   * `pode_renovar` também é `false`.
   */
  expires_at?: string | null;
  dias_restantes?: number | null;
  expirado?: boolean;
  pode_renovar?: boolean;
  /**
   * Índice da foto marcada como capa no Link Dinâmico. Gravado pela publicação
   * na raiz de `dados_refinados`; o Dashboard o respeita ao escolher a miniatura.
   * Sempre um inteiro dentro da lista de fotos: o mapper normaliza ausentes,
   * negativos, fracionários e fora de faixa para 0.
   */
  capa_index?: number;
}

