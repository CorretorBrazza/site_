/**
 * Cliente HTTP do fluxo de aprovação. Usado EXCLUSIVAMENTE por `/aprovar`.
 *
 * Não importa `@/lib/api` de propósito: `src/lib/api.ts` é compartilhado por
 * login, painel e páginas públicas, e a regra do projeto é não encostar em
 * arquivo que outro fluxo usa. Aqui a resolução de URL chega por injeção
 * (`resolver`), então este módulo continua testável sem Next nem navegador.
 *
 * Todos os contratos abaixo foram conferidos no backend antes de serem escritos:
 *
 * | operação        | método | caminho               | corpo                                        |
 * |-----------------|--------|-----------------------|----------------------------------------------|
 * | validar         | POST   | /validate-token       | { token, ad_id? }                            |
 * | detalhes        | POST   | /approval/details     | { token, ad_id }                             |
 * | editar          | POST   | /edit                 | { token, ad_id, campos_editados }            |
 * | reordenar fotos | POST   | /reorder-photos       | { token, ad_id, nova_ordem }                 |
 * | aprovar/rejeitar| POST   | /approve              | { token, ad_id, acao, dados_editados?, ... } |
 *
 * Não existe GET equivalente: o backend removeu as rotas que aceitavam token em
 * query string. `/validate-token` e `/approval/details` usam schema `.strict()`,
 * então mandar campo extra é erro — daí os corpos montados à mão, campo a campo.
 */

/**
 * Extensão explícita no import: é o que permite rodar este módulo no runner
 * nativo do Node (`node --test` com type stripping), que não faz resolução
 * extensionless como o bundler do Next. Habilitado por `allowImportingTsExtensions`.
 */
import {
  postAprovacao,
  type DependenciasAprovacao,
  type RespostaAprovacao,
} from './approval-link.ts';

export const ENDPOINT_VALIDAR = 'validate-token';
export const ENDPOINT_DETALHES = 'approval/details';
export const ENDPOINT_EDITAR = 'edit';
export const ENDPOINT_REORDENAR = 'reorder-photos';
export const ENDPOINT_APROVAR = 'approve';

/** Resposta de `POST /validate-token`. Espelha `ValidateTokenResponse` do backend. */
export interface RespostaValidarToken {
  valid: boolean;
  ad_id: string;
  /** Sempre nulo: o link de aprovação não abre sessão do corretor. */
  session_token?: null;
  corretor?: { nome: string; status: string; saldo_disponivel: number } | null;
  anuncio: unknown;
}

/**
 * Campos de `dados_refinados` que a tela realmente lê.
 *
 * Index signature de propósito: o objeto vem do Gemini e ganha campo novo a
 * cada extração, e o formulário só tipa o que usa. Sem ela, qualquer campo novo
 * viraria erro de compilação numa tela que não deveria se importar dele.
 */
export interface DadosRefinados {
  titulo?: string;
  tipoImovel?: string;
  finalidade?: string;
  transacao?: string;
  descricao?: string;
  precoVenda?: number | null;
  precoLocacao?: number | null;
  condominio?: number | null;
  iptu?: number | null;
  bairro?: string;
  endereco?: { bairro?: string; [chave: string]: unknown };
  caracteristicas?: {
    quartos?: number | null;
    suites?: number | null;
    banheiros?: number | null;
    vagas?: number | null;
    areaUtil?: number | null;
    areaTotal?: number | null;
    [chave: string]: unknown;
  };
  [chave: string]: unknown;
}

/** Campos do Media Kit exibidos pelo componente de exibição. */
export interface MediaKit {
  descricao_completa?: string;
  descricao_media?: string;
  legenda_social?: string;
  descricao_mda_social?: string;
  mensagem_whatsapp?: string;
  titulo_seo?: string;
  hashtags?: string[];
  pontos_fortes?: string[];
  [chave: string]: unknown;
}

/**
 * Foto vinda do anúncio. Espelha `PhotoItem` do componente de reordenação —
 * declarado aqui para o módulo do cliente não depender de `components/`, que
 * puxaria React para dentro de um arquivo que precisa rodar sem navegador.
 */
export interface FotoAnuncio {
  public_id?: string;
  url: string;
  url_optimized?: string;
  ordem: number;
  eh_capa: boolean;
  source_index?: number;
}

/** Resposta de `POST /approval/details`. Espelha `ApprovalGetDetailsResponse`. */
export interface DetalhesAnuncio {
  ad_id: string;
  referencia: string;
  corretor_email: string;
  status: string;
  estagio: number;
  dados_refinados: DadosRefinados;
  media_kit: MediaKit;
  fotos: FotoAnuncio[];
  assets_locked?: boolean;
  created_at: string;
}

/** `POST /edit` devolve o anúncio com o Media Kit recalibrado. */
export interface DadosEdicao {
  media_kit?: MediaKit | null;
  [chave: string]: unknown;
}

/** `POST /approve` devolve o status final e, quando aprovado, o Media Kit. */
export interface DadosAprovacao {
  status?: string;
  media_kit?: MediaKit | null;
  [chave: string]: unknown;
}

/** `POST /reorder-photos` confirma a gravação da nova ordem. */
export interface DadosReordenacao {
  [chave: string]: unknown;
}

/**
 * Guarda a credencial só na memória, e só pelo tempo do fluxo.
 *
 * Um objeto simples em vez de estado do React: o token não vira dependência de
 * render, não entra em comparação de efeito e não é serializado por nada. O
 * caso de uso é uma tela que lê o link uma vez e age — não um formulário onde o
 * valor muda a cada tecla.
 */
export class SegredoDaAprovacao {
  private valor = '';

  guardar(token: string): void {
    this.valor = String(token || '').trim();
  }

  /** Lê e consome: devolve o token uma vez e limpa. */
  usar(): string {
    const atual = this.valor;
    this.valor = '';
    return atual;
  }

  /**
   * Devolve o token sem consumir.
   *
   * Necessário porque `/aprovar` faz várias chamadas com a mesma credencial
   * (validar, carregar detalhes, salvar edição, aprovar). O consumo por
   * `usar()` continua sendo o caminho para o fim do fluxo.
   */
  ler(): string {
    return this.valor;
  }

  limpar(): void {
    this.valor = '';
  }
}

export interface ClienteAprovacao {
  validar(adId?: string): Promise<RespostaAprovacao<RespostaValidarToken>>;
  detalhes(adId: string): Promise<RespostaAprovacao<DetalhesAnuncio>>;
  editar(adId: string, campos: Record<string, unknown>): Promise<RespostaAprovacao<DadosEdicao>>;
  reordenar(adId: string, novaOrdem: number[]): Promise<RespostaAprovacao<DadosReordenacao>>;
  aprovar(
    adId: string,
    dadosEditados: Record<string, unknown> | undefined,
    opcao: { aprovar: true } | { aprovar: false; motivo: string }
  ): Promise<RespostaAprovacao<DadosAprovacao>>;
}

/**
 * Monta o cliente em torno de um `SegredoDaAprovacao`.
 *
 * As funções de rede ficam aqui, mas NENHUMA delas recebe o token como
 * argumento: elas leem do segredo. Isso torna impossível passar o token para
 * um componente filho por engano, que era o risco real de ter o token no estado
 * do componente da página.
 */
export function criarClienteAprovacao(
  deps: DependenciasAprovacao,
  segredo: SegredoDaAprovacao
): ClienteAprovacao {
  const exigirToken = (): string | null => {
    const t = segredo.ler();
    return t ? t : null;
  };

  const semToken = <T>(): RespostaAprovacao<T> => ({ ok: false, falha: 'ausente' });

  return {
    async validar(adId) {
      const token = exigirToken();
      if (!token) return semToken();
      // `ValidateTokenSchema` é `.strict()`: só `token` e `ad_id` são aceitos.
      // `ad_id` é opcional porque o anúncio pode ser resolvido só pelo hash.
      const corpo: Record<string, unknown> = { token };
      if (adId) corpo.ad_id = adId;
      return postAprovacao<RespostaValidarToken>(ENDPOINT_VALIDAR, corpo, deps);
    },

    async detalhes(adId) {
      const token = exigirToken();
      if (!token || !adId) return semToken();
      // `ApprovalDetailsSchema` é `.strict()` e exige os DOIS campos.
      return postAprovacao<DetalhesAnuncio>(
        ENDPOINT_DETALHES,
        { token, ad_id: adId },
        deps
      );
    },

    async editar(adId, campos) {
      const token = exigirToken();
      if (!token || !adId) return semToken();
      return postAprovacao<DadosEdicao>(
        ENDPOINT_EDITAR,
        { token, ad_id: adId, campos_editados: campos },
        deps
      );
    },

    async reordenar(adId, novaOrdem) {
      const token = exigirToken();
      if (!token || !adId) return semToken();
      return postAprovacao<DadosReordenacao>(
        ENDPOINT_REORDENAR,
        { token, ad_id: adId, nova_ordem: novaOrdem },
        deps
      );
    },

    async aprovar(adId, dadosEditados, opcao) {
      const token = exigirToken();
      if (!token || !adId) return semToken();
      const corpo: Record<string, unknown> = {
        token,
        ad_id: adId,
        acao: opcao.aprovar ? 'APROVAR' : 'REJEITAR',
      };
      if (dadosEditados) corpo.dados_editados = dadosEditados;
      if (!opcao.aprovar) corpo.motivo_rejeicao = opcao.motivo;
      return postAprovacao<DadosAprovacao>(ENDPOINT_APROVAR, corpo, deps);
    },
  };
}