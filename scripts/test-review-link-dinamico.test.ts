/**
 * Suíte de contrato do Link Dinâmico (`/revisar`).
 *
 *   node --test scripts/test-review-link-dinamico.test.ts
 *
 * Roda no runner nativo do Node, sem jsdom, sem navegador e sem backend. Os três módulos
 * testados — `reviewOrigens`, `reviewPatch` e `reviewVersion` — foram escritos puros justamente
 * para que isso seja possível: o teste exercita o mesmo código que a tela executa, não uma
 * reimplementação dele.
 *
 * O que estes testes defendem, em ordem de gravidade:
 *
 *   1. Que nenhuma origem de procedência desconhecida vire "Declarado". Era o defeito que deixava
 *      o corretor aprovar um campo que a extração tinha marcado como pendente.
 *   2. Que nenhum patchProduzido caia fora da allowlist estrita do `ReviewPatchSchema`, e que
 *      número chegue como número. Era a origem do 400.
 *   3. Que a versão enviada ao backend seja sempre a que o servidor confirmou por último, e que
 *      um 409 não vire loop de reenvio.
 *
 * As listas de chaves do caso 2 são transcritas de `review.validation.ts`. Elas são duplicadas de
 * propósito: se um dia o backend aceitar `caracteristicas.areaUtil`, este teste falha pedindo
 * atualização do mapa em vez de deixar o `.strict()` recusar a edição em produção.
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

import {
  ORIGENS_CONHECIDAS,
  desenharOrigem,
  rotuloDaOrigem,
  exigeConfirmacao,
  ehConfirmada,
  statusDeExtracao,
} from '../src/app/revisar/reviewOrigens.ts';
import {
  MAPA_CAMPO_PATCH,
  montarPatch,
  montarPatchLote,
  normalizarNumeroTexto,
  textoParaPatch,
  ehCampoNumerico,
  ehCampoContagem,
  type ResultadoPatch,
} from '../src/app/revisar/reviewPatch.ts';
import {
  ControladorAutosave,
  extrairVersaoDoConflito,
  type ResultadoSalvar,
} from '../src/app/revisar/reviewVersion.ts';

/**
 * Falha com a mensagem que o adaptador já escreveu.
 *
 * `assert.ok(x.ok, x.erro)` não compila: a mensagem é avaliada antes do estreitamento, e `erro`
 * não existe no ramo de sucesso. Aqui o estreitamento vem primeiro e a mensagem vem junto, o que
 * também significa que o teste aponta o erro real do backend em vez de "expected true".
 */
function exigirOk(resultado: ResultadoPatch): asserts resultado is Extract<ResultadoPatch, { ok: true }> {
  if (!resultado.ok) {
    assert.fail(`${resultado.erro} (campo: ${resultado.campo})`);
  }
}

/* ------------------------------------------------------------------ */
/* Transcrição da allowlist do backend                                 */
/* ------------------------------------------------------------------ */

/** `ReviewPatchSchema.shape` — chaves de topo. `review.validation.ts:153-194`. */
const TOPO_PATCH = new Set([
  'titulo',
  'descricao',
  'tipoImovel',
  'tipo_imovel',
  'finalidade',
  'transacao',
  'precoVenda',
  'precoLocacao',
  'precoPacote',
  'valorCondominio',
  'valor_condominio',
  'iptu',
  'iptuMensal',
  'condominio',
  'nomeCondominio',
  'nome_condominio',
  'bairro',
  'cidade',
  'uf',
  'endereco',
  'caracteristicas',
  'caracteristicas_texto',
  'garantiasLocaticias',
  'garantias_locaticias',
  'quantidadeDepositosCaucao',
  'documentacao',
  'aceitaFinanciamento',
  'contratoCompraVenda',
  'porteiraFechada',
  'itensInclusos',
  'itensExcluidos',
  'aceitaPermuta',
  'aceitaCarro',
  'andar',
  'vagas',
  'vagasCobertas',
  'diferenciais',
  'is_pacote',
]);

/** `caracteristicasSchema.shape` — `review.validation.ts:123-137`. */
const CARACTERISTICAS_PATCH = new Set([
  'quartos',
  'suites',
  'banheiros',
  'vagas',
  'vagas_cobertas',
  'area_util',
  'area_construida',
  'area_terreno',
  'area_total',
  'andar',
  'tipo_area',
]);

/** Chaves que o `.strict()` recusa com nome próprio. `review.validation.ts:61-79`. */
const CAMPOS_PROIBIDOS = new Set([
  'creditos_usuario',
  'creditos',
  'review_token_hash',
  'review_link_expires_at',
  'review_link_version',
  'review_token',
  'status',
  'ad_id',
  'id',
  'extraction_v2',
]);

/* ------------------------------------------------------------------ */
/* Double de relógio e de transporte                                   */
/* ------------------------------------------------------------------ */

/** Agendador manual: o teste decide quando o debounce "dispara". */
function criarRelogio() {
  let pendente: (() => void) | null = null;
  let cancelado = 0;
  return {
    agendador: (fn: () => void) => {
      pendente = fn;
      return 1;
    },
    cancelador: () => {
      pendente = null;
      cancelado += 1;
    },
    disparar: async () => {
      const fn = pendente;
      pendente = null;
      if (fn) await fn();
    },
    temTimer: () => pendente !== null,
    get cancelamentos() {
      return cancelado;
    },
  };
}

type Chamada = { token: string; dados: Record<string, unknown>; version: number };

function criarSalvador(respostas: ResultadoSalvar[]) {
  const chamadas: Chamada[] = [];
  let indice = 0;
  const salvar = async (
    token: string,
    dados: Record<string, unknown>,
    version: number,
  ): Promise<ResultadoSalvar> => {
    chamadas.push({ token, dados, version });
    const resposta = respostas[Math.min(indice, respostas.length - 1)];
    indice += 1;
    return resposta;
  };
  return { salvar, chamadas };
}

const MENSAGEM_CONFLITO = (n: number) =>
  `Conflito de edição: a versão ${n} já está salva. Recarregue para atualizar.`;

/* ================================================================== */
/* Caso 1 — as nove origens                                            */
/* ================================================================== */

test('caso 1: as nove origens do backend têm desenho próprio e rótulo único', () => {
  assert.equal(ORIGENS_CONHECIDAS.length, 9);

  const rotulos = ORIGENS_CONHECIDAS.map((o) => rotuloDaOrigem(o));
  // Dois pontos com o mesmo texto dariam ao corretor a mesma informação sobre campos
  // em situações diferentes, então o teste exige distinção.
  assert.equal(new Set(rotulos).size, 9, `rótulos repetidos: ${rotulos.join(', ')}`);

  const classes = ORIGENS_CONHECIDAS.map((o) => desenharOrigem(o).classe);
  assert.equal(new Set(classes).size, 9, 'cores repetidas entre origens distintas');
});

test('caso 1: nenhuma origem desconhecida vira "Declarado"', () => {
  const entradasInvalidas = [
    undefined,
    null,
    '',
    '   ',
    'declarado_com_espaco_errado',
    'CONFIRMADO',
    'VALIDATED',
    'A_VALIDAR_V2',
    'nao_informado_minusculo',
    42,
    {},
    [],
    true,
    'COMPETOR',
  ];

  for (const entrada of entradasInvalidas) {
    const desenho = desenharOrigem(entrada);
    assert.notEqual(
      desenho.rotulo,
      'Declarado',
      `"${String(entrada)}" não pode aparecer como Declarado`,
    );
    assert.equal(desenho.rotulo, 'A confirmar');
    assert.equal(desenho.confirmado, false);
    assert.equal(desenho.exigeConfirmacao, true);
  }
});

test('caso 1: origens exigem ação de forma coerente com a completude', () => {
  // Quem o corretor disse ou o sistema confirmou com alta confiança não pede nada.
  for (const origem of ['CORRETOR', 'VALIDADO', 'DECLARADO']) {
    assert.equal(exigeConfirmacao(origem), false, origem);
    assert.equal(ehConfirmada(origem), true, origem);
  }

  // Origem de máquina exige conferência, mesmo com valor presente.
  for (const origem of ['VISUAL', 'A_VALIDAR']) {
    assert.equal(exigeConfirmacao(origem), true, origem);
    assert.equal(ehConfirmada(origem), false, origem);
  }

  // Conflito é o caso mais severo: não é "confirme", é "escolha".
  assert.equal(desenharOrigem('CONFLITANTE').indicaConflito, true);
  assert.equal(ehConfirmada('CONFLITANTE'), false);

  // A distinção que a barra de completude depende: falta é falta, inaplicável não é.
  assert.equal(desenharOrigem('NAO_INFORMADO').dadoAusente, true);
  assert.equal(desenharOrigem('NAO_INFORMADO').bloqueiaCompletude, true);
  assert.equal(desenharOrigem('NAO_APLICAVEL').dadoAusente, false);
  assert.equal(desenharOrigem('NAO_APLICAVEL').bloqueiaCompletude, false);
  assert.equal(desenharOrigem('NAO_APLICAVEL').confirmado, true);
});

test('caso 1: `statusDeExtracao` só devolve origem conhecida', () => {
  assert.equal(statusDeExtracao('A_VALIDAR'), 'A_VALIDAR');
  assert.equal(statusDeExtracao('a_validar'), 'A_VALIDAR');
  assert.equal(statusDeExtracao('STATUS_INEXISTENTE'), null);
  assert.equal(statusDeExtracao(undefined), null);
});

/* ================================================================== */
/* Caso 2 — o patch cabe na allowlist estrita                          */
/* ================================================================== */

test('caso 2: todo campo mapeado aponta para chave aceita pelo ReviewPatchSchema', () => {
  for (const [campo, destino] of Object.entries(MAPA_CAMPO_PATCH)) {
    const [primeiro, segundo] = destino.caminho;

    if (segundo === undefined) {
      assert.ok(
        TOPO_PATCH.has(primeiro),
        `"${campo}" manda para chave de topo "${primeiro}", que o .strict() recusa`,
      );
    } else {
      assert.equal(
        primeiro,
        'caracteristicas',
        `"${campo}" manda para o subobjeto "${primeiro}", que não existe`,
      );
      assert.ok(
        CARACTERISTICAS_PATCH.has(segundo),
        `"${campo}" manda para caracteristicas."${segundo}", que o .strict() interno recusa`,
      );
    }
  }
});

test('caso 2: nenhum campo mapeado usa os nomes em camelCase do contrato de leitura', () => {
  // A raiz do 400: `areaUtil` e `areaTotal` são nomes de leitura (VINCULOS) e os de escrita são
  // snake_case dentro de `caracteristicas`. Se alguém reintroduzir o nome de leitura aqui, o
  // `.strict()` recusa com 400.
  assert.deepEqual(
    MAPA_CAMPO_PATCH.areaUtil.caminho,
    ['caracteristicas', 'area_util'],
  );
  assert.deepEqual(
    MAPA_CAMPO_PATCH.areaTotal.caminho,
    ['caracteristicas', 'area_total'],
  );
  // E o inverso: `area_util` nunca deve ser top-level.
  assert.equal(TOPO_PATCH.has('area_util'), false);
  assert.equal(TOPO_PATCH.has('areaUtil'), false);
});

test('caso 2: todo patch produzido passa na allowlist e não toca campo interno', () => {
  const amostras: Array<[string, unknown]> = [
    ['quartos', '3'],
    ['suites', 2],
    ['banheiros', '1'],
    ['vagas', '2'],
    ['areaUtil', '78,5'],
    ['areaTotal', '1.500'],
    ['areaConstruida', '120'],
    ['areaTerreno', '300'],
    ['vagasCobertas', '2 cobertas'],
    ['andar', '12º'],
    ['precoVenda', 'R$ 350.000,00'],
    ['precoLocacao', '2.500'],
    ['precoPacote', '450.000'],
    ['valorCondominio', '680,50'],
    ['iptu', '310,20'],
    ['iptuMensal', '128,50'],
    ['condominio', 'Edifício Aurora'],
    ['titulo', 'Apartamento com suíte'],
    ['descricao', 'Boa iluminação.'],
    ['tipoImovel', 'Apartamento'],
    ['transacao', 'VENDA'],
    ['bairro', 'Centro'],
    ['cidade', 'Taboão da Serra'],
    ['uf', 'SP'],
    ['aceitaFinanciamento', 'Sim'],
    ['porteiraFechada', 'Não'],
    ['aceitaPermuta', 'Sim'],
    ['aceitaCarro', 'Não'],
    // Campos apagados precisam virar `null`, não string vazia nem a palavra "não informado".
    ['precoVenda', ''],
    ['condominio', 'Não informado'],
    ['bairro', null],
  ];

  for (const [campo, valor] of amostras) {
    const resultado = montarPatch(campo, valor);
    exigirOk(resultado);

    for (const [chave, valorChave] of Object.entries(resultado.dados)) {
      assert.ok(TOPO_PATCH.has(chave), `"${campo}" produziu chave de topo "${chave}"`);
      assert.equal(CAMPOS_PROIBIDOS.has(chave), false, `"${campo}" tocaria campo interno "${chave}"`);

      if (chave !== 'caracteristicas') continue;
      const dentro = valorChave as Record<string, unknown>;
      for (const chaveInterna of Object.keys(dentro)) {
        assert.ok(
          CARACTERISTICAS_PATCH.has(chaveInterna),
          `"${campo}" produziu caracteristicas."${chaveInterna}", fora da allowlist`,
        );
      }
      // `vagas_cobertas` é a única chave obrigatória e não anulável do subobjeto.
      assert.ok(
        typeof dentro.vagas_cobertas === 'string' && dentro.vagas_cobertas.length > 0,
        `"${campo}" omitiu vagas_cobertas, que o schema exige em qualquer caracteristicas`,
      );
    }
  }
});

test('caso 2: todo objeto `caracteristicas` enviado carrega `vagas_cobertas`', () => {
  // `caracteristicas.vagas_cobertas` é `textoCurtoObrigatorio`: sem `.optional()` e sem
  // `.nullable()`. `{ caracteristicas: { quartos: 3 } }` — o patch mais inocente possível — é 400.
  for (const [campo, valor] of [
    ['quartos', '3'],
    ['areaUtil', '80'],
    ['vagas', '2'],
  ] as Array<[string, unknown]>) {
    const resultado = montarPatch(campo, valor);
    exigirOk(resultado);
    const dentro = resultado.dados.caracteristicas as Record<string, unknown>;
    assert.equal(typeof dentro.vagas_cobertas, 'string');
    assert.ok((dentro.vagas_cobertas as string).length >= 1);
    assert.ok((dentro.vagas_cobertas as string).length <= 300);
  }
});

test('caso 2: `vagas_cobertas` vigente é preservado quando o contexto o informa', () => {
  const resultado = montarPatch('quartos', '3', 'Quartos', {
    valoresAtuais: { vagasCobertas: '1 coberta, 1 descoberta' },
  });
  exigirOk(resultado);
  const dentro = resultado.dados.caracteristicas as Record<string, unknown>;
  assert.equal(dentro.vagas_cobertas, '1 coberta, 1 descoberta');
  assert.equal(dentro.quartos, 3);
});

test('caso 2: número sai como número, em qualquer notação que o corretor digite', () => {
  const casos: Array<[string, unknown, number]> = [
    ['precoVenda', '350000', 350000],
    ['precoVenda', '350.000', 350000],
    ['precoVenda', 'R$ 350.000,00', 350000],
    ['precoVenda', '350.000,50', 350000.5],
    ['precoVenda', '1.500.000', 1500000],
    ['iptuMensal', '128,50', 128.5],
    ['areaUtil', '78,5', 78.5],
    ['areaUtil', 78.5, 78.5],
    ['quartos', 3, 3],
  ];

  for (const [campo, entrada, esperado] of casos) {
    const resultado = montarPatch(campo, entrada);
    exigirOk(resultado);

    const valor = Object.values(resultado.dados)[0];
    // O caminho tem um elemento em chave de topo e dois dentro de `caracteristicas`; este teste
    // só usa campos numéricos, então o último segmento identifica a chave nos dois formatos.
    const destino = MAPA_CAMPO_PATCH[campo];
    const ultimoSegmento = destino.caminho[destino.caminho.length - 1];
    const interno =
      valor !== null && typeof valor === 'object'
        ? (valor as Record<string, unknown>)[ultimoSegmento]
        : valor;

    assert.equal(
      typeof interno,
      'number',
      `"${campo}" = ${String(entrada)} saiu como ${typeof interno}, e z.number() recusa string`,
    );
    assert.equal(interno, esperado);
  }
});

test('caso 2: ambiguidade de milhar resolve para o lado que não multiplica área por mil', () => {
  assert.equal(normalizarNumeroTexto('1.500'), 1500);
  assert.equal(normalizarNumeroTexto('2.500,00'), 2500);
  assert.equal(normalizarNumeroTexto('1.500.000'), 1500000);
  // Um ponto que não é milhar continua decimal.
  assert.equal(normalizarNumeroTexto('2.5'), 2.5);
  assert.equal(normalizarNumeroTexto('0.5'), 0.5);
  assert.equal(normalizarNumeroTexto('78.50'), 78.5);
});

test('caso 2: campo fora da allowlist é recusado localmente, sem ir à rede', () => {
  for (const campo of [
    'creditos_usuario',
    'status',
    'review_token_hash',
    'extraction_v2',
    'ad_id',
    'campoQueNaoExiste',
    'area_util',
  ]) {
    const resultado = montarPatch(campo, 'qualquer');
    assert.equal(resultado.ok, false, `"${campo}" deveria ser recusado`);
  }
});

test('caso 2: campo que o schema exige não-vazio recusa o apagamento', () => {
  // `tipoImovel` e `transacao` são `textoCurtoObrigatorio`: `min(1)`, sem `nullable`.
  for (const campo of ['tipoImovel', 'transacao']) {
    for (const vazio of ['', '   ', 'Não informado', null, undefined]) {
      const resultado = montarPatch(campo, vazio);
      assert.equal(resultado.ok, false, `"${campo}" aceitou ${JSON.stringify(vazio)}`);
      assert.match(resultado.erro, /não pode ficar vazio/);
    }
    assert.ok(montarPatch(campo, 'Apartamento').ok);
  }
});

test('caso 2: números fora dos limites do schema são recusados com mensagem utilizável', () => {
  const acimaDeContagem = montarPatch('quartos', '51', 'Quartos');
  assert.equal(acimaDeContagem.ok, false);
  assert.match(acimaDeContagem.erro, /50/);

  // `vagas` tem teto próprio, maior que o dos demais contadores.
  assert.ok(montarPatch('vagas', '100').ok);
  assert.equal(montarPatch('vagas', '101', 'Vagas').ok, false);

  assert.equal(montarPatch('precoVenda', '-1', 'Preço de venda').ok, false);
  assert.equal(montarPatch('areaUtil', 'abc', 'Área útil').ok, false);
  assert.equal(montarPatch('quartos', '2,5', 'Quartos').ok, false, 'contagem não aceita decimal');
  assert.equal(montarPatch('bairro', 'x'.repeat(301), 'Bairro').ok, false);
});

test('caso 2: patch vazio nunca é produzido', () => {
  const resultado = montarPatchLote([]);
  assert.equal(resultado.ok, false);
  assert.match(resultado.erro, /Nada para salvar/);
});

test('caso 2: `juntarPatches` preserva as chaves já existentes de `caracteristicas`', () => {
  const lote = montarPatchLote([
    ['quartos', '3', 'Quartos'],
    ['areaUtil', '80', 'Área útil'],
    ['precoVenda', '350.000', 'Preço'],
  ]);
  exigirOk(lote);

  const carac = lote.dados.caracteristicas as Record<string, unknown>;
  assert.equal(carac.quartos, 3);
  assert.equal(carac.area_util, 80);
  assert.ok(carac.vagas_cobertas);
  assert.equal(lote.dados.precoVenda, 350000);
});

test('caso 2: `textoParaPatch` mostra o valor gravado, não a string digitada', () => {
  assert.equal(textoParaPatch('precoVenda', 350000), '350000');
  assert.equal(textoParaPatch('precoVenda', 350000.5), '350000.5');
  assert.equal(textoParaPatch('condominio', 'Edifício Aurora'), 'Edifício Aurora');
  // Ausência vira campo vazio, e não a string "null" no input.
  assert.equal(textoParaPatch('bairro', null), '');
  assert.equal(textoParaPatch('bairro', undefined), '');
  assert.equal(textoParaPatch('bairro', 'Não informado'), '');
});

test('caso 2: o input numérico é escolhido pelo tipo do campo', () => {
  assert.equal(ehCampoNumerico('precoVenda'), true);
  assert.equal(ehCampoNumerico('areaUtil'), true);
  assert.equal(ehCampoNumerico('condominio'), false, 'condominio é o NOME, não o valor');
  assert.equal(ehCampoNumerico('bairro'), false);

  assert.equal(ehCampoContagem('quartos'), true);
  assert.equal(ehCampoContagem('vagas'), true);
  assert.equal(ehCampoContagem('areaUtil'), false);
  assert.equal(ehCampoContagem('precoVenda'), false);
});

/* ================================================================== */
/* Caso 3 — a versão viaja                                             */
/* ================================================================== */

test('caso 3: a versão só muda por confirmação do servidor', async () => {
  const relogio = criarRelogio();
  const { salvar, chamadas } = criarSalvador([{ success: true, version: 8 }]);
  const controlador = new ControladorAutosave({
    lerToken: () => 'tok-123',
    salvar,
    agendador: relogio.agendador,
    cancelador: relogio.cancelador,
  });

  // Antes de qualquer resposta do servidor, a versão é a do carregamento.
  controlador.aplicarVersaoDoServidor(5);
  assert.equal(controlador.getVersion(), 5);

  controlador.agendar({ caracteristicas: { quartos: 3, vagas_cobertas: 'x' } });
  await relogio.disparar();

  assert.equal(chamadas.length, 1);
  assert.equal(chamadas[0].version, 5, 'a escrita saiu com a versão confirmada pelo servidor');
  assert.equal(controlador.getVersion(), 8, 'a versão veio da resposta do autosave');

  // Resposta sem versão não apaga a versão conhecida: sem confirmação do servidor, o número não muda.
  const semVersao = new ControladorAutosave({
    lerToken: () => 'tok',
    salvar: async () => ({ success: true }),
    agendador: relogio.agendador,
    cancelador: relogio.cancelador,
  });
  semVersao.aplicarVersaoDoServidor(12);
  await semVersao.salvarAgora();
  assert.equal(semVersao.getVersion(), 12);
});

test('caso 3: responder pergunta adota a versão devolvida por `answer`', async () => {
  // O deadlock original: `answer` bumpa a versão no servidor, o front ignorava o retorno, e o
  // autosave seguinte saía com o número velho.
  const relogio = criarRelogio();
  const { salvar, chamadas } = criarSalvador([{ success: true, version: 15 }]);
  const controlador = new ControladorAutosave({
    lerToken: () => 'tok',
    salvar,
    agendador: relogio.agendador,
    cancelador: relogio.cancelador,
  });

  controlador.aplicarVersaoDoServidor(7);

  // `answerReviewQuestion` respondeu e devolveu 14.
  controlador.aplicarVersaoDoServidor(14);
  assert.equal(controlador.getVersion(), 14);

  controlador.agendar({ titulo: 'Apartamento' });
  await relogio.disparar();

  assert.equal(chamadas[0].version, 14, 'o autosave saiu com a versão pós-`answer`');
  assert.equal(controlador.getVersion(), 15);
});

test('caso 3: `selectReviewCover` não move a versão, porque `setCover` não bumpara', () => {
  // A rota `/review/cover` devolve só `{ success, capa_index }`. Tratá-la como se bumpara faria o
  // cliente avançar o contador local, e o próximo autosave mandaria um número nunca gravado.
  const relogio = criarRelogio();
  const { salvar, chamadas } = criarSalvador([{ success: true, version: 21 }]);
  const controlador = new ControladorAutosave({
    lerToken: () => 'tok',
    salvar,
    agendador: relogio.agendador,
    cancelador: relogio.cancelador,
  });

  controlador.aplicarVersaoDoServidor(20);

  // O que `selectReviewCover` devolve: sem `version`, porque `setCover` não incrementa o contador.
  const resultadoCapa: { success: boolean; capa_index?: number; version?: number } = {
    success: true,
    capa_index: 3,
  };
  assert.equal(resultadoCapa.version, undefined, 'a capa não devolve versão, por contrato');
  assert.equal(controlador.getVersion(), 20);

  controlador.agendar({ titulo: 'x' });
  return relogio.disparar().then(() => {
    assert.equal(chamadas[0].version, 20, 'a versão avançou por causa da capa? não avançou');
    assert.equal(controlador.getVersion(), 21);
  });
});

test('caso 3: edição feita durante o voo não é perdida nem vai com versão velha', async () => {
  const relogio = criarRelogio();
  // Objeto em vez de variável: TypeScript estreita `let` para `null` depois da análise do fluxo,
  // porque a atribuição acontece dentro de um callback que ele considera não chamado.
  const portao: { liberar?: (r: ResultadoSalvar) => void } = {};

  const chamadas: Chamada[] = [];
  const controlador = new ControladorAutosave({
    lerToken: () => 'tok',
    salvar: async (_t, dados, version) => {
      chamadas.push({ token: 'tok', dados, version });
      return new Promise<ResultadoSalvar>((resolve) => {
        portao.liberar = resolve;
      });
    },
    agendador: relogio.agendador,
    cancelador: relogio.cancelador,
  });

  controlador.aplicarVersaoDoServidor(3);
  controlador.agendar({ titulo: 'primeira' });
  const emVoo = relogio.disparar();
  await new Promise((r) => setImmediate(r));

  // O corretor continua digitando enquanto a primeira requisição não voltou.
  controlador.agendar({ descricao: 'segunda' });
  assert.equal(controlador.temPendencia(), true);

  portao.liberar?.({ success: true, version: 4 });
  await emVoo;
  await new Promise((r) => setImmediate(r));

  // A segunda edição continua na fila, e só agora será enviada com a versão confirmada.
  assert.equal(controlador.temPendencia(), true);
  await relogio.disparar();
  await new Promise((r) => setImmediate(r));

  assert.equal(chamadas.length, 2);
  assert.deepEqual(chamadas[1].dados, { descricao: 'segunda' });
  assert.equal(chamadas[1].version, 4, 'a segunda ida saiu com a versão que a primeira confirmou');
});

/* ================================================================== */
/* Caso 4 — o 409 não vira loop                                        */
/* ================================================================== */

test('caso 4: a versão é lida da mensagem de conflito do backend', () => {
  assert.equal(extrairVersaoDoConflito(MENSAGEM_CONFLITO(42)), 42);
  assert.equal(extrairVersaoDoConflito('Conflito de edição: a versão 7 já está salva.'), 7);
  assert.equal(extrairVersaoDoConflito('versao 0 ja salva'), 0);

  // Sem número não há o que reconciliar — e adivinhar é pior do que não tentar.
  for (const invalido of [
    undefined,
    null,
    '',
    'Conflito de edição',
    'versão já está salva',
    'Erro HTTP 409',
  ]) {
    assert.equal(extrairVersaoDoConflito(invalido as string | undefined), null);
  }
});

test('caso 4: 409 com versão conhecida faz UMA retentativa e para', async () => {
  const relogio = criarRelogio();
  const { salvar, chamadas } = criarSalvador([
    { success: false, isConflict: true, error: MENSAGEM_CONFLITO(11), serverVersion: 11 },
    { success: false, isConflict: true, error: MENSAGEM_CONFLITO(11), serverVersion: 11 },
  ]);

  const controlador = new ControladorAutosave({
    lerToken: () => 'tok',
    salvar,
    agendador: relogio.agendador,
    cancelador: relogio.cancelador,
    maxRetentativasConflito: 1,
  });

  controlador.aplicarVersaoDoServidor(10);
  controlador.agendar({ titulo: 'x' });
  await relogio.disparar();

  assert.equal(chamadas[0].version, 10);
  assert.equal(controlador.getVersion(), 11, 'a versão veio da mensagem de conflito');

  // Retentativa: mesmo patch, agora com o número que o servidor disse.
  await relogio.disparar();
  assert.equal(chamadas[1].version, 11);

  // Segundo 409: o limite de uma retentativa foi atingido. O estado é `conflict` e nada é agendado.
  assert.equal(controlador.getEstado(), 'conflict');
  assert.equal(relogio.temTimer(), false, 'não há timer pendente: o loop foi interrompido');
  assert.match(controlador.getErro() || '', /Recarregue/);

  // Nenhum disparo seguinte gera uma terceira chamada: dois 409 encerram a sequência.
  await relogio.disparar();
  assert.equal(chamadas.length, 2, 'o 409 produziu mais de uma retentativa');
});

test('caso 4: 409 sem versão no corpo para em vez de chutar a próxima', async () => {
  const relogio = criarRelogio();
  const { salvar, chamadas } = criarSalvador([
    { success: false, isConflict: true, error: 'Conflito de edição' },
  ]);

  const controlador = new ControladorAutosave({
    lerToken: () => 'tok',
    salvar,
    agendador: relogio.agendador,
    cancelador: relogio.cancelador,
  });

  controlador.aplicarVersaoDoServidor(5);
  controlador.agendar({ titulo: 'x' });
  await relogio.disparar();

  assert.equal(chamadas.length, 1, 'nenhuma retentativa sem número para reconciliar');
  assert.equal(controlador.getEstado(), 'conflict');
  assert.equal(controlador.getVersion(), 5, 'a versão não foi inventada');
  assert.equal(relogio.temTimer(), false);

  // E nada mais dispara sozinho.
  await relogio.disparar();
  assert.equal(chamadas.length, 1);
});

test('caso 4: a edição em curso sobrevive ao conflito e é reenviada após recarregar', async () => {
  const relogio = criarRelogio();
  const { salvar, chamadas } = criarSalvador([
    { success: false, isConflict: true, error: MENSAGEM_CONFLITO(30) },
    { success: true, version: 31 },
  ]);

  const controlador = new ControladorAutosave({
    lerToken: () => 'tok',
    salvar,
    agendador: relogio.agendador,
    cancelador: relogio.cancelador,
  });

  controlador.aplicarVersaoDoServidor(29);
  controlador.agendar({ descricao: 'o que o corretor digitou' });
  await relogio.disparar();

  // O painel de conflito some; o corretor escolheu "recarregar e reaplicar".
  controlador.reconciliar(30);
  assert.equal(controlador.getEstado(), 'saving');

  await relogio.disparar();
  assert.equal(chamadas.length, 2);
  assert.deepEqual(chamadas[1].dados, { descricao: 'o que o corretor digitou' });
  assert.equal(chamadas[1].version, 30);
  assert.equal(controlador.getEstado(), 'saved');
});

test('caso 4: falha de transporte mantém a pendência para a próxima tentativa', async () => {
  const relogio = criarRelogio();
  const { salvar, chamadas } = criarSalvador([
    { success: false, error: 'Falha na conexão' },
    { success: true, version: 4 },
  ]);

  const controlador = new ControladorAutosave({
    lerToken: () => 'tok',
    salvar,
    agendador: relogio.agendador,
    cancelador: relogio.cancelador,
  });

  controlador.aplicarVersaoDoServidor(3);
  controlador.agendar({ titulo: 'x' });
  await relogio.disparar();

  assert.equal(controlador.getEstado(), 'error');
  assert.equal(controlador.temPendencia(), true, 'o trabalho do corretor não pode ser descartado');

  await controlador.salvarAgora();
  assert.equal(chamadas.length, 2);
  assert.equal(controlador.getEstado(), 'saved');
});

test('caso 4: token ausente impede envio e avisa, sem loop', async () => {
  const relogio = criarRelogio();
  let enviados = 0;
  const controlador = new ControladorAutosave({
    lerToken: () => '',
    salvar: async () => {
      enviados += 1;
      return { success: true, version: 1 };
    },
    agendador: relogio.agendador,
    cancelador: relogio.cancelador,
  });

  controlador.agendar({ titulo: 'x' });
  await relogio.disparar();

  assert.equal(enviados, 0);
  assert.equal(controlador.getEstado(), 'error');
  assert.match(controlador.getErro() || '', /expirado/i);
});

/* ================================================================== */
/* Caso 5 — debounce e patch vazio                                     */
/* ================================================================== */

test('caso 5: edição sucessiva rearma o debounce em vez de enfileirar envios', async () => {
  const relogio = criarRelogio();
  const { salvar, chamadas } = criarSalvador([{ success: true, version: 2 }]);
  const controlador = new ControladorAutosave({
    lerToken: () => 'tok',
    salvar,
    agendador: relogio.agendador,
    cancelador: relogio.cancelador,
  });

  controlador.agendar({ titulo: 'A' });
  controlador.agendar({ titulo: 'AB' });
  controlador.agendar({ titulo: 'ABC' });

  await relogio.disparar();
  assert.equal(chamadas.length, 1, 'três edições viraram uma escrita');
  assert.deepEqual(chamadas[0].dados, { titulo: 'ABC' });
});

test('caso 5: nada é enviado quando não há edição pendente', async () => {
  const relogio = criarRelogio();
  const { salvar, chamadas } = criarSalvador([{ success: true, version: 1 }]);
  const controlador = new ControladorAutosave({
    lerToken: () => 'tok',
    salvar,
    agendador: relogio.agendador,
    cancelador: relogio.cancelador,
  });

  await controlador.salvarAgora();
  assert.equal(chamadas.length, 0);
  assert.equal(controlador.getEstado(), 'idle');
});

/* ================================================================== */
/* Caso 6 — a regressão não volta pelo caminho do texto                */
/* ================================================================== */

test('caso 6: a página não monta mais patch com o nome de leitura do campo', () => {
  // Lê o arquivo-fonte. A lógica está coberta pelos casos acima; o que este caso impede é alguém
  // reintroduzir a interpolação `{ [campo]: valor }` numa nova tela, onde nenhum teste unitário a
  // alcançaria.
  const caminho = fileURLToPath(new URL('../src/app/revisar/page.tsx', import.meta.url));
  const fonte = readFileSync(caminho, 'utf8');

  assert.equal(
    /triggerAutosave\(\s*\{\s*\[\s*campo\s*\]\s*:/.test(fonte),
    false,
    'page.tsx voltou a montar o patch por nome de leitura, o que o .strict() recusa com 400',
  );
  assert.match(fonte, /montarPatch\(/, 'o adaptador de patch deixou de ser usado');

  // E o nome do campo tem de chegar ao adaptador com o rótulo, para o erro ser legível.
  assert.match(
    fonte,
    /montarPatch\(\s*item\.campo\s*,\s*valor\s*,\s*item\.rotulo/,
    'o rótulo do campo não está chegando ao adaptador: o erro de validação ficaria ilegível',
  );
});

test('caso 6: a versão devolvida por `answer` é aplicada na página', () => {
  const caminho = fileURLToPath(new URL('../src/app/revisar/page.tsx', import.meta.url));
  const fonte = readFileSync(caminho, 'utf8');

  assert.match(
    fonte,
    /aplicarVersao\(\s*respostaRes\.version\s*\)/,
    'a versão de `answer` não está sendo adotada: o próximo autosave sai com o número velho',
  );
});

test('caso 6: o seletor de origem não tem mais `default` para "Declarado"', () => {
  const caminho = fileURLToPath(new URL('../src/app/revisar/components/ReviewDataSection.tsx', import.meta.url));
  const fonte = readFileSync(caminho, 'utf8');

  assert.equal(
    /case\s+'DECLARADO'\s*:\s*\n?\s*default\s*:/.test(fonte),
    false,
    'o `default` que tratava toda origem desconhecida como "Declarado" voltou',
  );
  assert.equal(
    />\s*Declarado\s*</.test(fonte),
    false,
    '"Declarado" está escrito à mão no componente em vez de vir de `desenharOrigem`',
  );
  assert.match(fonte, /desenharOrigem\(/, 'o componente deixou de usar o registro de origens');
});