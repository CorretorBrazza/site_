/**
 * CORREÇÃO 3 — o controle de versão otimista, fora do React.
 *
 * O defeito era um deadlock silencioso, e ele morava em duas linhas de `page.tsx`:
 * `answerReviewQuestion` devolve a versão nova no corpo da resposta e a chamada jogava o
 * resultado fora. A pergunta respondida bumpara `review_state_version` no servidor
 * (`review-autosave.service.ts`, `saveAnswer`), o cliente continuava com a versão antiga, e o
 * próximo autosave mandava a versão velha e recebia 409. O 409 não era tratado: o estado virava
 * "conflito", a pendência continuava montada, e a edição seguinte disparava outro autosave com a
 * mesma versão velha. Um 409, depois outro, depois outro — e a edição do corretor parava de
 * salvar sem nenhuma mensagem dizendo por quê.
 *
 * Por que isto é uma classe e não um hook: o comportamento que precisa ser provado é uma
 * sequência de eventos com tempo e efeito colateral — "debounce armado", "resposta chegou com
 * versão nova", "409", "não repetir". Provar isso exige controle do relógio, e um hook só roda
 * dentro de um renderizador. A classe recebe o agendador e o salvador por injeção, o teste entrega
 * um relógio falso, e o hook vira um invólucro de seis linhas. O mesmo caminho de código que roda
 * na tela é o que o teste exercita.
 *
 * As três regras que o código existe para sustentar:
 *
 *   - Quem muda a versão é o servidor. `aplicarVersaoDoServidor` é a única porta de entrada, e
 *     ela recomeça o debounce pendente com a versão nova. Não existe caminho que envie a versão
 *     que o cliente tinha antes de uma resposta.
 *   - Um 409 não vira loop. No máximo uma retentativa automática, e só quando o servidor diz qual
 *     é a versão atual. Sem o número, o cliente não sabe contra o que se reconciliar — inventar
 *     `version + 1` seria chutar o estado do documento, e o único resultado possível de chutar
 *     errado é mais um 409.
 *   - Falha não descarta trabalho. Erro de rede mantém a pendência para a próxima tentativa;
 *     somente o descarte é explícito.
 */

export type EstadoSalvar = 'idle' | 'saving' | 'saved' | 'error' | 'conflict';

export interface ResultadoSalvar {
  success: boolean;
  /** Versão devolta pelo servidor no sucesso. */
  version?: number;
  error?: string;
  isConflict?: boolean;
  /**
   * Versão atual do servidor, quando o 409 a carrega.
   *
   * O `ConflictError` do backend não devolve um campo estruturado: a 409 chega como
   * `{ status: 'error', message: 'Conflito de edição: a versão 12 já está salva...' }` e o número
   * está dentro da frase. Como o backend não pode ser alterado, `extrairVersaoDoConflito` faz a
   * leitura do texto. É parsing de mensagem, que é o que se evita de fazer — e a alternativa
   * seria o corretor recarregar a página por causa de um inteiro.
   */
  serverVersion?: number;
}

export type Salvador = (
  token: string,
  dados: Record<string, unknown>,
  version: number,
  capaIndex?: number,
) => Promise<ResultadoSalvar>;

export type Agendador = (fn: () => void, ms: number) => unknown;
export type Cancelador = (handle: unknown) => void;

export interface OpcoesControlador {
  /** Lê o token no momento do envio. Nunca guarda: o token fica na memória do `ref`. */
  lerToken: () => string;
  salvar: Salvador;
  agendador?: Agendador;
  cancelador?: Cancelador;
  /** Notifica mudança de estado para a tela. */
  aoMudar?: (estado: EstadoSalvar, erro: string | null) => void;
  /** Notifica a nova versão depois que o servidor a confia. */
  aoConfirmarVersao?: (versao: number) => void;
  debounceMs?: number;
  /** Retentativa automática após 409 com versão conhecida. */
  maxRetentativasConflito?: number;
}

/** `caracteristicas` é o único subobjeto do patch, e é comparado por chave interna. */
const CARACTERISTICAS = 'caracteristicas';

/**
 * Lê a versão do corpo de um 409.
 *
 * A mensagem é `Conflito de edição: a versão ${currentVersion} já está salva. Recarregue para
 * atualizar.` e o número é a única informação de reconciliação que existe. Devolve `null` quando
 * não há número — e `null` é a resposta honesta, porque um palpite errado aqui produz um 409
 * seguinte, que é exatamente o loop que este arquivo conserta.
 */
export function extrairVersaoDoConflito(mensagem: string | undefined | null): number | null {
  if (typeof mensagem !== 'string') return null;
  const achado = mensagem.match(/vers[aã]o\s+(\d+)/i);
  if (!achado) return null;
  const numero = Number(achado[1]);
  return Number.isInteger(numero) && numero >= 0 ? numero : null;
}

export class ControladorAutosave {
  private versao: number;
  private estado: EstadoSalvar = 'idle';
  private erro: string | null = null;

  private pendente: Record<string, unknown> | null = null;
  private capaPendente: number | undefined;
  private timer: unknown = null;

  private emVoo = false;
  private retentativasConflito = 0;

  private readonly lerToken: () => string;
  private readonly salvar: Salvador;
  private readonly agendador: Agendador;
  private readonly cancelador: Cancelador;
  private readonly aoMudar?: (estado: EstadoSalvar, erro: string | null) => void;
  private readonly aoConfirmarVersao?: (versao: number) => void;
  private readonly debounceMs: number;
  private readonly maxRetentativas: number;

  constructor(opcoes: OpcoesControlador) {
    this.lerToken = opcoes.lerToken;
    this.salvar = opcoes.salvar;
    this.agendador = opcoes.agendador || ((fn, ms) => setTimeout(fn, ms));
    this.cancelador =
      opcoes.cancelador ||
      ((handle) => {
        clearTimeout(handle as ReturnType<typeof setTimeout>);
      });
    this.aoMudar = opcoes.aoMudar;
    this.aoConfirmarVersao = opcoes.aoConfirmarVersao;
    this.debounceMs = opcoes.debounceMs ?? 1000;
    this.maxRetentativas = opcoes.maxRetentativasConflito ?? 1;
    this.versao = 0;
  }

  /* ------------------------------- leitura ------------------------------ */

  getVersion(): number {
    return this.versao;
  }

  getEstado(): EstadoSalvar {
    return this.estado;
  }

  getErro(): string | null {
    return this.erro;
  }

  getPendente(): Record<string, unknown> | null {
    return this.pendente ? { ...this.pendente } : null;
  }

  temPendencia(): boolean {
    return this.pendente !== null || this.capaPendente !== undefined;
  }

  private mudar(estado: EstadoSalvar, erro: string | null = null): void {
    this.estado = estado;
    this.erro = erro;
    this.aoMudar?.(estado, erro);
  }

  private armar(): void {
    this.cancelarTimer();
    this.timer = this.agendador(() => {
      void this.salvarPendente();
    }, this.debounceMs);
  }

  private cancelarTimer(): void {
    if (this.timer !== null) {
      this.cancelador(this.timer);
      this.timer = null;
    }
  }

  /* ------------------------------ entrada ------------------------------- */

  /**
   * Junta uma edição à pendência e rearma o debounce.
   *
   * `dados` já vem no formato do patch (ver `reviewPatch.ts`); este método não sabe nada de
   * campos, e é por isso que ele não tem como inventar uma chave que o schema recusa.
   */
  agendar(dados: Record<string, unknown>, capaIndex?: number): void {
    if (Object.keys(dados).length > 0) {
      this.pendente = { ...(this.pendente || {}), ...dados };
    }
    if (capaIndex !== undefined) {
      this.capaPendente = capaIndex;
    }
    this.mudar('saving');
    this.armar();
  }

  /** Envia agora, pulando o debounce. */
  async salvarAgora(): Promise<EstadoSalvar> {
    this.cancelarTimer();
    return this.salvarPendente();
  }

  /**
   * Adota a versão que o servidor devolveu em `answer`, `cover` ou `autosave`.
   *
   * Rearma o debounce pendente de propósito. Se havia edição à espera quando a resposta chegou,
   * o timer anterior dispararia com a versão que acabou de ficar velha; rearmer com a nova é o que
   * garante que a próxima ida ao servidor já carregue o número certo.
   */
  aplicarVersaoDoServidor(versao: number | undefined | null): void {
    if (typeof versao !== 'number' || !Number.isInteger(versao) || versao < 0) return;
    if (versao === this.versao) return;
    this.versao = versao;
    this.retentativasConflito = 0;
    this.aoConfirmarVersao?.(versao);
    if (this.pendente !== null || this.capaPendente !== undefined) {
      this.armar();
    }
  }

  /**
   * Recomeça a partir de uma sessão recarregada.
   *
   * Usado no carregamento inicial e no "recarregar" do painel de conflito: zera pendência,
   * zera contador de retentativa e adota a versão que a sessão trouxe.
   */
  reiniciar(versao: number): void {
    this.cancelarTimer();
    this.pendente = null;
    this.capaPendente = undefined;
    this.emVoo = false;
    this.retentativasConflito = 0;
    this.versao = Number.isInteger(versao) && versao >= 0 ? versao : 0;
    this.mudar('idle');
  }

  /**
   * Reconciliação manual de conflito: o corretor recarregou e a sessão trouxe a versão.
   *
   * Rearma a pendência em vez de descartá-la. Descartar seria mais simples e perderia a edição
   * que o corretor acabou de fazer para não ter escolhido "recarregar".
   */
  reconciliar(versaoDoServidor: number): void {
    this.versao = Number.isInteger(versaoDoServidor) && versaoDoServidor >= 0 ? versaoDoServidor : 0;
    this.retentativasConflito = 0;
    this.aoConfirmarVersao?.(this.versao);
    if (this.pendente !== null || this.capaPendente !== undefined) {
      this.mudar('saving');
      this.armar();
    } else {
      this.mudar('idle');
    }
  }

  /** Abandona a pendência. Só é chamado por ação explícita. */
  descartarPendente(): void {
    this.cancelarTimer();
    this.pendente = null;
    this.capaPendente = undefined;
    this.retentativasConflito = 0;
    this.mudar('idle');
  }

  /** Libera o timer. Usado no desmontar do componente. */
  destruir(): void {
    this.cancelarTimer();
  }

  /* ------------------------------ execução ------------------------------ */

  private async salvarPendente(): Promise<EstadoSalvar> {
    if (this.emVoo) return this.estado;
    if (this.pendente === null && this.capaPendente === undefined) return this.estado;

    const token = this.lerToken();
    if (!token) {
      this.mudar('error', 'Link expirado. Reabra o link para continuar editando.');
      return this.estado;
    }

    // Cópia do que vai nesta ida. O que chega durante o voo pertence à próxima rodada: limpar a
    // pendência inteira ao final da requisição bem-sucedida apagaria uma edição feita depois do
    // clique, e o corretor perderia o que acabou de digitar.
    const dadosDoVoo = this.pendente ? { ...this.pendente } : null;
    const capaDoVoo = this.capaPendente;
    const versaoDoVoo = this.versao;

    this.emVoo = true;
    this.mudar('saving');

    let resultado: ResultadoSalvar;
    try {
      resultado = await this.salvar(token, dadosDoVoo || {}, versaoDoVoo, capaDoVoo);
    } catch (erro: unknown) {
      this.emVoo = false;
      const mensagem = erro instanceof Error ? erro.message : 'Falha na conexão';
      this.mudar('error', mensagem);
      return this.estado;
    }
    this.emVoo = false;

    if (resultado.success) {
      if (typeof resultado.version === 'number') {
        this.versao = resultado.version;
        this.aoConfirmarVersao?.(resultado.version);
      }
      this.retentativasConflito = 0;
      this.limparSePendente(dadosDoVoo, capaDoVoo);
      this.mudar(this.temPendencia() ? 'saving' : 'saved', null);
      // Sobrou edição feita durante o voo: ela vai com a versão que acabou de ser confirmada.
      if (this.pendente !== null || this.capaPendente !== undefined) {
        this.armar();
      }
      return this.estado;
    }

    if (resultado.isConflict) {
      return this.tratarConflito(resultado, dadosDoVoo, capaDoVoo);
    }

    // Erru de transporte ou de validação: a pendência fica para a próxima tentativa.
    this.mudar('error', resultado.error || 'Erro ao salvar alterações');
    return this.estado;
  }

  private limparSePendente(
    dadosDoVoo: Record<string, unknown> | null,
    capaDoVoo: number | undefined,
  ): void {
    if (dadosDoVoo && this.pendente) {
      const restante: Record<string, unknown> = { ...this.pendente };
      for (const chave of Object.keys(dadosDoVoo)) {
        if (
          JSON.stringify(restante[chave]) === JSON.stringify(dadosDoVoo[chave]) &&
          chave !== CARACTERISTICAS
        ) {
          delete restante[chave];
        }
      }
      // `caracteristicas` chega como subobjeto: compara por chave interna, senão uma edição de
      // `quartos` durante o voo conviveria com o `quartos` já enviado e o objeto inteiro
      // pareceria "mudou".
      const enviado = dadosDoVoo[CARACTERISTICAS] as Record<string, unknown> | undefined;
      const atual = this.pendente[CARACTERISTICAS] as Record<string, unknown> | undefined;
      if (enviado && atual) {
        const dentro: Record<string, unknown> = { ...atual };
        for (const chave of Object.keys(enviado)) {
          if (JSON.stringify(dentro[chave]) === JSON.stringify(enviado[chave])) {
            delete dentro[chave];
          }
        }
        if (Object.keys(dentro).length === 0) delete restante[CARACTERISTICAS];
        else restante[CARACTERISTICAS] = dentro;
      } else if (enviado && !atual) {
        delete restante[CARACTERISTICAS];
      }
      this.pendente = Object.keys(restante).length > 0 ? restante : null;
    }
    if (capaDoVoo !== undefined && this.capaPendente === capaDoVoo) {
      this.capaPendente = undefined;
    }
  }

  private tratarConflito(
    resultado: ResultadoSalvar,
    dadosDoVoo: Record<string, unknown> | null,
    capaDoVoo: number | undefined,
  ): EstadoSalvar {
    this.cancelarTimer();

    const versaoDoServidor =
      typeof resultado.serverVersion === 'number'
        ? resultado.serverVersion
        : extrairVersaoDoConflito(resultado.error);

    if (versaoDoServidor === null) {
      // Sem número para reconciliar, não há retentativa segura. Fica parado esperando o
      // corretor: é o oposto do loop que existed.
      this.mudar(
        'conflict',
        'Este anúncio mudou em outro lugar. Recarregue a página para continuar editando.',
      );
      return this.estado;
    }

    if (this.retentativasConflito >= this.maxRetentativas) {
      this.mudar(
        'conflict',
        `Conflito de edição: a versão ${versaoDoServidor} já está salva. Recarregue para continuar.`,
      );
      return this.estado;
    }

    // Uma única retentativa, agora com o número que o servidor disse. A pendência que motivou o
    // 409 volta à fila: ela é trabalho do corretor, não lixo.
    this.versao = versaoDoServidor;
    this.retentativasConflito += 1;
    this.aoConfirmarVersao?.(versaoDoServidor);

    const aindaVale = dadosDoVoo !== null || capaDoVoo !== undefined;
    if (aindaVale) {
      // Garante que a pendência volte mesmo que ela tenha sido consumida no caminho.
      if (dadosDoVoo) {
        this.pendente = { ...(this.pendente || {}), ...dadosDoVoo };
      }
      if (capaDoVoo !== undefined) {
        this.capaPendente = capaDoVoo;
      }
    }

    this.mudar(this.temPendencia() ? 'saving' : 'conflict', null);
    if (this.temPendencia()) {
      this.armar();
    }
    return this.estado;
  }
}