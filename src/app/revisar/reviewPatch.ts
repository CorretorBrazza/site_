/**
 * CORREÇÃO 2 — adaptador da edição inline para a allowlist estrita do backend.
 *
 * O backend não tem um schema permissivo. `ReviewPatchSchema` (`review.validation.ts`) termina em
 * `.strict()`, e `ReviewAutosaveSchema` roda `ReviewPatchSchema.safeParse(dados)` dentro do
 * `superRefine`: qualquer chave fora da lista vira 400 antes de chegar ao Firestore. O caminho de
 * erro é nomeado de propósito — `campo não editável pelo Link Dinâmico: <chave>` — para
 * diferenciar cliente defasado de ataque, o que significa que o 400 é por design e não um
 * acidente a ser "frouxeado" daqui.
 *
 * Então este arquivo não afrouxa nada: ele para de mandar o que o schema recusa.
 *
 * Os dois 400 que existiam, e por que cada um acontecia:
 *
 *   - Chave no lugar errado. `quartos`, `suites`, `banheiros`, `areaUtil` e `areaTotal` são os
 *     nomes do contrato de revisão (`VINCULOS`, no backend), e o patch de gravação usa outro
 *     vocabulário: dentro de `caracteristicas` as chaves são `quartos`, `suites`, `banheiros`,
 *     `vagas`, `area_util`, `area_total`. `caracteristicas.areaUtil` não existe e o `.strict()`
 *     interno a recusa. Os dois vocabulários estão no mesmo arquivo do backend, a trinta linhas
 *     de distância, e é essa distância que produzia o 400.
 *
 *   - String onde o schema exige número. `precoVenda`, `valorCondominio`, `iptu` e as áreas são
 *     `numeroOuNulo`. O `input` da edição inline é `type="text"` e o valor chegava como
 *     `String`: `"350000"`. `z.number()` não faz coerção, e a resposta é
 *     "expected number, received string" — para o corretor, um erro sem campo apontado.
 *
 * Um ponto onde a especificação original e o schema divergem, e o schema vence, porque a
 * instrução foi não afrouxar o backend:
 *
 *   - `condominio` NÃO é número. Em `ReviewPatchSchema` ele é `textoCurtoOpcional`, e em
 *     `VINCULOS` ele é "Nome do Condomínio / Edifício", lido de `condominio.nome`. O valor em
 *     reais do condomínio é `valorCondominio`. Enviar `condominio: 680` seria 400, e enviar
 *     `condominio: "680"` grava o nome do condomínio como "680". Este adaptador envia o nome
 *     como texto e o valor como `valorCondominio` numérico.
 */

export type TipoPatch =
  | 'contagem'
  | 'decimal'
  | 'moeda'
  | 'texto'
  | 'texto_curto'
  | 'texto_curto_obrigatorio';

export type ContextoPatch = {
  /** Valor atual, para não sobrescrever dado que o corretor não está editando agora. */
  valoresAtuais?: Record<string, unknown>;
};

/** Onde a chave vai no patch e com que tipo ela é validada. */
export interface DestinoPatch {
  /** Caminho no patch. Um elemento = topo de `dados`; dois = dentro de `caracteristicas`. */
  caminho: readonly [string] | readonly [string, string];
  tipo: TipoPatch;
}

/** Techos do backend (`review.validation.ts`). Repetidos aqui para dar erro antes da rede. */
const MAX_CONTAGEM = 50;
const MAX_VAGAS = 100;
const MAX_TEXTO_CURTO = 300;
const MAX_TEXTO_LONGO = 2000;
const MAX_NUMERO = 1e12;

/** Topos de `caracteristicas` aceitos por `caracteristicasSchema`, que também é `.strict()`. */
const CARACTERISTICAS = 'caracteristicas';

/**
 * A armadilha que quase entrou na produção junto com esta correção.
 *
 * Em `caracteristicasSchema`, todas as chaves são `.optional()` — exceto `vagas_cobertas`, que é
 * `textoCurtoObrigatorio` puro: nem `.optional()` nem `.nullable()`. Consequência: **qualquer**
 * objeto `caracteristicas` enviado precisa conter `vagas_cobertas` como string não vazia de até 300
 * caracteres. Um patch de `{ caracteristicas: { quartos: 3 } }` — que parece o exemplo mais
 * inocente do mundo — é recusado com `caracteristicas.vagas_cobertas: Required`.
 *
 * O esquema documenta o porquê: "vagas" é contável e "vagas cobertas" é extenso, e normalizar os
 * dois para o mesmo tipo quebraria os anúncios em produção. Ou seja, a exigência é deliberada.
 *
 * Por isso todo `caracteristicas` produzido aqui nasce com `vagas_cobertas` preenchido. O valor
 * padrão é `'Não informado'`, que é texto não vazio e portanto válido, e o chamador pode passar o
 * valor vigente em `contexto.valoresAtuais` para preservá-lo em vez de sobrescrever.
 */
const VAGAS_COBERTAS_EXIGIDA = 'Não informado';

/**
 * O mapa, e ele é a única fonte da verdade.
 *
 * Cada chave à esquerda é um `campo` de `ReviewField`, isto é, um nome de `VINCULOS` no backend.
 * Cada valor à direita é o caminho que o `ReviewPatchSchema` aceita. Se o backend mudar, este
 * mapa é o único lugar do front que precisa mudar junto — e o teste de contrato falha se algum
 * par virar um 400.
 */
export const MAPA_CAMPO_PATCH: Readonly<Record<string, DestinoPatch>> = {
  // Contagens: `z.number().int()` dentro de `caracteristicas`.
  quartos: { caminho: [CARACTERISTICAS, 'quartos'], tipo: 'contagem' },
  suites: { caminho: [CARACTERISTICAS, 'suites'], tipo: 'contagem' },
  banheiros: { caminho: [CARACTERISTICAS, 'banheiros'], tipo: 'contagem' },
  vagas: { caminho: [CARACTERISTICAS, 'vagas'], tipo: 'contagem' },

  // Áreas: snake_case dentro de `caracteristicas`, `numeroOuNulo`.
  areaUtil: { caminho: [CARACTERISTICAS, 'area_util'], tipo: 'decimal' },
  areaTotal: { caminho: [CARACTERISTICAS, 'area_total'], tipo: 'decimal' },
  areaConstruida: { caminho: [CARACTERISTICAS, 'area_construida'], tipo: 'decimal' },
  areaTerreno: { caminho: [CARACTERISTICAS, 'area_terreno'], tipo: 'decimal' },

  // Texto dentro de `caracteristicas`. `vagas_cobertas` é a única obrigatória e não anulável do
  // subobjeto — ver `VAGAS_COBERTAS_EXIGIDA`.
  vagasCobertas: { caminho: [CARACTERISTICAS, 'vagas_cobertas'], tipo: 'texto_curto_obrigatorio' },
  andar: { caminho: [CARACTERISTICAS, 'andar'], tipo: 'texto_curto' },

  // Dinheiro: topo de `dados`, `numeroOuNulo`.
  precoVenda: { caminho: ['precoVenda'], tipo: 'moeda' },
  precoLocacao: { caminho: ['precoLocacao'], tipo: 'moeda' },
  precoPacote: { caminho: ['precoPacote'], tipo: 'moeda' },
  valorCondominio: { caminho: ['valorCondominio'], tipo: 'moeda' },
  iptu: { caminho: ['iptu'], tipo: 'moeda' },
  iptuMensal: { caminho: ['iptuMensal'], tipo: 'moeda' },

  // Texto no topo. `condominio` e o NOME, e por isso texto — ver o cabeçalho.
  condominio: { caminho: ['condominio'], tipo: 'texto_curto' },
  titulo: { caminho: ['titulo'], tipo: 'texto' },
  descricao: { caminho: ['descricao'], tipo: 'texto' },
  // `tipoImovel` e `transacao` são `textoCurtoObrigatorio`: string de 1 a 300 caracteres, sem
  // `null`. Apagá-los é 400, então o tipo é `_obrigatorio` e o valor vazio vira erro em vez de
  // `null`.
  tipoImovel: { caminho: ['tipoImovel'], tipo: 'texto_curto_obrigatorio' },
  transacao: { caminho: ['transacao'], tipo: 'texto_curto_obrigatorio' },
  bairro: { caminho: ['bairro'], tipo: 'texto_curto' },
  cidade: { caminho: ['cidade'], tipo: 'texto_curto' },
  uf: { caminho: ['uf'], tipo: 'texto_curto' },
  aceitaFinanciamento: { caminho: ['aceitaFinanciamento'], tipo: 'texto_curto' },
  porteiraFechada: { caminho: ['porteiraFechada'], tipo: 'texto_curto' },
  aceitaPermuta: { caminho: ['aceitaPermuta'], tipo: 'texto_curto' },
  aceitaCarro: { caminho: ['aceitaCarro'], tipo: 'texto_curto' },
};

export type ResultadoPatch =
  | { ok: true; dados: Record<string, unknown> }
  | { ok: false; erro: string; campo: string };

/** Valores que o corretor digita para dizer "não existe este dado". */
const VAZIOS = new Set(['', 'não informado', 'nao informado', 'n/d', '-', 'null', 'undefined']);

/** O texto do valor é um "não informado" digitado, e não um dado? */
export function ehVazioParaPatch(valor: unknown): boolean {
  if (valor === null || valor === undefined) return true;
  if (typeof valor === 'string') return VAZIOS.has(valor.trim().toLowerCase());
  return false;
}

/**
 * Converte o que o corretor digitou em número, aceitando o que se digita no Brasil.
 *
 * `"R$ 350.000,50"` → `350000.5`; `"1.500"` → `1500`; `"2,5"` → `2.5`.
 *
* A ambiguidade de milhar é real e não tem resposta única: `"1.500"` é mil e quinhentos no
 * pt-BR, e `parseFloat` leria como 1,5. A regra adotada é a do teclado brasileiro, e ela tem
 * três casos:
 *
 *   - Mais de um ponto: todos são separador de milhar. `"1.500.000"` → `1500000`. Só há uma
 *     leitura possível, porque o padrão de milhar exige grupos de três.
 *   - Uma vírgula: ela é o separador decimal, e todo ponto é milhar. `"2.500,00"` → `2500`.
 *   - Um ponto, sem vírgula: é milhar quando tem exatamente três dígitos depois e de um a três
 *     antes. `"1.500"` → `1500`, `"2.5"` → `2.5`, `"78.50"` → `78.5` (dois dígitos depois, então
 *     decimal).
 *
 * A assimetria é deliberada: quando a leitura é ambígua, ela erra para o lado de não multiplicar
 * um metro quadrado por mil. `"1.500"` como 1,5 publicaria 78 m² como 1.500 m²; como 1500, o
 * corretor vê o número no input antes de salvar.
 */
export function normalizarNumeroTexto(entrada: string): number | null {
  const bruto = entrada
    .trim()
    .replace(/[rR]\$/g, '')
    .replace(/\s/g, '')
    .replace(/ /g, '');
  if (bruto === '' || VAZIOS.has(bruto.toLowerCase())) return null;

  // O schema é `nonnegative()`: negativo é erro, não valor. Devolver `null` aqui significaria
  // "não informado", que apaga o dado em vez de recusá-lo.
  if (bruto.startsWith('-')) return null;

  const pontos = (bruto.match(/\./g) || []).length;
  const virgula = bruto.lastIndexOf(',');
  const ponto = bruto.lastIndexOf('.');

  let normalizado: string;

  if (virgula > ponto) {
    // Vírgula é a decimal: separa a parte inteira (sem milhar) da fracionária.
    normalizado =
      bruto.slice(0, virgula).replace(/\./g, '') + '.' + bruto.slice(virgula + 1);
  } else if (pontos > 1) {
    // Vários pontos em padrão de milhar: não há outra leitura.
    normalizado = bruto.replace(/\./g, '');
  } else if (ponto > -1) {
    const depoisDoPonto = bruto.length - ponto - 1;
    const antesDoPonto = bruto.slice(0, ponto);
    const ehMilhar =
      depoisDoPonto === 3 && /^\d{1,3}$/.test(antesDoPonto);
    normalizado = ehMilhar ? bruto.replace(/\./g, '') : bruto;
  } else {
    normalizado = bruto;
  }

  const numero = Number(normalizado);
  if (!Number.isFinite(numero)) return null;
  return numero;
}

/**
 * Texto pronto para o `input` de edição inline.
 *
 * O inverso de `normalizarNumeroTexto` não é exato — o valor canônico é `350000` e o input
 * precisa mostrar `350000`, não `350.000,00`, senão o corretor edita um número que não é o
 * gravado. O que importa aqui é que `null` e "não informado" virem campo vazio, e não a
 * string `"null"`.
 */
export function textoParaPatch(campo: string, valor: unknown): string {
  if (ehVazioParaPatch(valor)) return '';
  if (typeof valor === 'number' && Number.isFinite(valor)) return String(valor);
  return String(valor).trim();
}

function aplicarDestino(
  destino: readonly [string] | readonly [string, string],
  valor: unknown,
  contexto?: ContextoPatch,
): Record<string, unknown> {
  if (destino.length === 1) return { [destino[0]]: valor };

  // `vagas_cobertas` é exigida pelo schema em qualquer objeto `caracteristicas`, então ela entra
  // desde a construção. O valor vigente vem do contexto para não ser apagada por uma edição de
  // `quartos`; sem contexto, cai no padrão válido.
  const exigido =
    typeof contexto?.valoresAtuais?.vagasCobertas === 'string' &&
    contexto.valoresAtuais.vagasCobertas.trim() !== ''
      ? contexto.valoresAtuais.vagasCobertas.trim()
      : VAGAS_COBERTAS_EXIGIDA;

  return { [destino[0]]: { vagas_cobertas: exigido, [destino[1]]: valor } };
}

/** Junta dois patches preservando as chaves já existentes de `caracteristicas`. */
export function juntarPatches(
  base: Record<string, unknown>,
  extra: Record<string, unknown>,
): Record<string, unknown> {
  const juntado: Record<string, unknown> = { ...base };
  for (const [chave, valor] of Object.entries(extra)) {
    if (chave === CARACTERISTICAS) {
      juntado[CARACTERISTICAS] = {
        ...((juntado[CARACTERISTICAS] as Record<string, unknown> | undefined) || {}),
        ...(valor as Record<string, unknown>),
      };
    } else {
      juntado[chave] = valor;
    }
  }
  return juntado;
}

function validarNumero(
  numero: number | null,
  tipo: TipoPatch,
  campo: string,
  rotulo: string,
): ResultadoPatch | { valor: unknown } {
  if (numero === null) return { valor: null };

  if (numero < 0) {
    return { ok: false, campo, erro: `${rotulo} não pode ser negativo.` };
  }
  if (numero > MAX_NUMERO) {
    return { ok: false, campo, erro: `${rotulo} está fora do limite aceito.` };
  }
  if (tipo === 'contagem') {
    if (!Number.isInteger(numero)) {
      return { ok: false, campo, erro: `${rotulo} precisa ser um número inteiro.` };
    }
    const teto = campo === 'vagas' ? MAX_VAGAS : MAX_CONTAGEM;
    if (numero > teto) {
      return { ok: false, campo, erro: `${rotulo} não pode passar de ${teto}.` };
    }
  }
  return { valor: numero };
}

/**
 * Converte UMA edição de campo em um patch que o backend aceita.
 *
 * Devolve `{ ok: false, erro }` em vez de lançar: o erro é de digitação, e a digitação erra. Um
 * throw aqui viraria tela branca no clique de "Salvar". O texto do erro é o que o corretor lê,
 * então ele diz o que está errado com o campo que ele acabou de editar.
 */
export function montarPatch(
  campo: string,
  valor: unknown,
  rotulo?: string,
  contexto?: ContextoPatch,
): ResultadoPatch {
  const destino = MAPA_CAMPO_PATCH[campo];
  if (!destino) {
    return {
      ok: false,
      campo,
      erro: `"${campo}" não pode ser editado por aqui.`,
    };
  }

  const nome = rotulo || campo;

  // `textoCurtoObrigatorio` (`min(1)`, sem `nullable`) recusa tanto `null` quanto string vazia.
  // Tratar o campo apagado como `null` aqui produziria um 400 cuja mensagem é "Required" num campo
  // que o corretor não está nem tocando agora.
  if (destino.tipo === 'texto_curto_obrigatorio') {
    if (ehVazioParaPatch(valor)) {
      return { ok: false, campo, erro: `${nome} não pode ficar vazio.` };
    }
    const texto = String(valor).trim();
    if (texto.length > MAX_TEXTO_CURTO) {
      return { ok: false, campo, erro: `${nome} passou de ${MAX_TEXTO_CURTO} caracteres.` };
    }
    return { ok: true, dados: aplicarDestino(destino.caminho, texto, contexto) };
  }

  if (destino.tipo === 'texto' || destino.tipo === 'texto_curto') {
    const teto = destino.tipo === 'texto' ? MAX_TEXTO_LONGO : MAX_TEXTO_CURTO;
    // Campo apagado é `null`, e `null` é o que o schema aceita para "o corretor removeu isto".
    if (ehVazioParaPatch(valor)) {
      return { ok: true, dados: aplicarDestino(destino.caminho, null, contexto) };
    }
    const texto = String(valor).trim();
    if (texto.length > teto) {
      return { ok: false, campo, erro: `${nome} passou de ${teto} caracteres.` };
    }
    return { ok: true, dados: aplicarDestino(destino.caminho, texto, contexto) };
  }

  const numero =
    typeof valor === 'number'
      ? Number.isFinite(valor)
        ? valor
        : null
      : normalizarNumeroTexto(String(valor ?? ''));

  if (numero === null && !ehVazioParaPatch(valor)) {
    return { ok: false, campo, erro: `${nome} precisa ser um número.` };
  }

  const conferido = validarNumero(numero, destino.tipo, campo, nome);
  if ('ok' in conferido) return conferido;

  return { ok: true, dados: aplicarDestino(destino.caminho, conferido.valor, contexto) };
}

/**
 * Monta o patch de várias edições de uma vez.
 *
 * `dados: {}` é recusado aqui, antes da rede. Um autosave com corpo vazio é uma escrita que não
 * muda nada, gasta cota da rota (`autosave` tem 60/90 por janela) e devolve uma versão nova que
 * só serve para desempatar a seguinte. A tela decide a partir de `ok`.
 */
export function montarPatchLote(
  entradas: ReadonlyArray<readonly [string, unknown, string?]>,
  contexto?: ContextoPatch,
): ResultadoPatch {
  let acumulado: Record<string, unknown> = {};

  for (const [campo, valor, rotulo] of entradas) {
    const pedaco = montarPatch(campo, valor, rotulo, contexto);
    if (!pedaco.ok) return pedaco;
    acumulado = juntarPatches(acumulado, pedaco.dados);
  }

  if (Object.keys(acumulado).length === 0) {
    return { ok: false, campo: '', erro: 'Nada para salvar.' };
  }
  return { ok: true, dados: acumulado };
}

/** O campo aceita edição numérica? Decide o `type` do `input` e o teclado do celular. */
export function ehCampoNumerico(campo: string): boolean {
  const tipo = MAPA_CAMPO_PATCH[campo]?.tipo;
  return tipo === 'contagem' || tipo === 'decimal' || tipo === 'moeda';
}

/** O campo é uma contagem inteira, e o input deve bloquear decimal e `step`. */
export function ehCampoContagem(campo: string): boolean {
  return MAPA_CAMPO_PATCH[campo]?.tipo === 'contagem';
}