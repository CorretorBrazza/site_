/**
 * CORREÇÃO 1 — as nove origens de procedência, e o que cada uma obriga a fazer.
 *
 * O defeito que este arquivo existe para impedir: o `switch` de rótulo tinha quatro casos e um
 * `default` que devolvia "Declarado". A união de tipos do front era
 * `'DECLARADO' | 'VISUAL' | 'INFERIDO' | 'CORRETOR'`, e o backend produz nove valores. TypeScript
 * não afirma nada sobre isso em tempo de execução: o JSON chega como `string`, o `switch` não casa
 * com nenhum caso e o `default` — que era "Declarado" — transforma `A_VALIDAR` e `CONFLITANTE`
 * em "o corretor escreveu isso". O corretor aprova sem ver nada, e é a classe de falha em que a
 * tela funciona, o fluxo funciona e o anúncio publica errado.
 *
 * Duas decisões que não são de estilo:
 *
 *   - Não existe `default` para "Declarado" em lugar nenhum. `desenharOrigem` é total: qualquer
 *     entrada que não seja uma das nove origens conhecidas cai em `DESCONHECIDA`, que é
 *     visualmente igual a `A_VALIDAR`. Desconhecido é tratado como pendente, nunca como
 *     confirmado — o custo de errar para o pessimisticista é o corretor confirmar o que já
 *     tinha dito; o custo de errar para o otimista é um endereço falso no título.
 *   - `NAO_APLICAVEL` não bloqueia completude. Um imóvel que não tem suíte não tem suíte
 *     faltando, e um campo que trava a barra de completude por ser inaplicável ensina o
 *     corretor a preencher algo que não existe. `NAO_INFORMADO` bloqueia; `NAO_APLICAVEL` não.
 *
 * Os pesos de `CONFIANCA` reproduzem a ordem do backend (`review-session.service.ts`):
 * CORRETOR 1 > VALIDADO 0.98 > DECLARADO 0.95 > VISUAL 0.6 > INFERIDO 0.5 > A_VALIDAR 0.4 >
 * CONFLITANTE 0.2 > NAO_INFORMADO 0 = NAO_APLICAVEL 0. Nenhuma leitura de foto vale mais que uma
 * declaração do dono, e é por isso que `VISUAL` ainda exige confirmação mesmo com valor.
 */

import type { OrigemDado } from '@/lib/api';

/** As nove origens que o backend pode enviar. Nomes conferidos um a um. */
export const ORIGENS_CONHECIDAS = [
  'DECLARADO',
  'VISUAL',
  'INFERIDO',
  'CORRETOR',
  'VALIDADO',
  'A_VALIDAR',
  'CONFLITANTE',
  'NAO_INFORMADO',
  'NAO_APLICAVEL',
] as const;

export type OrigemConhecida = (typeof ORIGENS_CONHECIDAS)[number];

/**
 * Origem como a tela a exibe.
 *
 * `A_CONFIRMAR` é o décimo valor possível e não vem do backend: é o que uma origem fora da
 * lista vira. Existe como estado de primeira classe justamente para que nenhuma tela precise
 * inventar um rótulo, e para que "não sei" seja visualmente distinto de "sei que não sei".
 */
export type OrigemExibida = OrigemConhecida | 'A_CONFIRMAR';

export interface DesenhoOrigem {
  /** Token exibido no badge. */
  rotulo: string;
  /** Frase que explica o que a origem significa, mostrada sob o valor. */
  descricao: string;
  /** Classes de cor do badge. */
  classe: string;
  /** A origem confirma o valor, ou apenas o relays? */
  confirmado: boolean;
  /** O corretor precisa agir antes de publicar: confirmar, resolver ou preencher. */
  exigeConfirmacao: boolean;
  /** Duas fontes se contradizem sobre este campo. */
  indicaConflito: boolean;
  /** O dado não existe e precisa ser preenchido. */
  dadoAusente: boolean;
  /** Deve entrar na contagem de pendências que barra a completude. */
  bloqueiaCompletude: boolean;
}

const BASE = 'text-[10px] font-bold px-2 py-0.5 rounded';

const DESENHOS: Record<OrigemExibida, DesenhoOrigem> = {
  CORRETOR: {
    rotulo: 'Corretor',
    descricao: 'Você escreveu isso na revisão.',
    classe: `${BASE} bg-blue-100 text-blue-800`,
    confirmado: true,
    exigeConfirmacao: false,
    indicaConflito: false,
    dadoAusente: false,
    bloqueiaCompletude: false,
  },
  VALIDADO: {
    rotulo: 'Validado',
    descricao: 'Confirmado por uma fonte externa confiável.',
    classe: `${BASE} bg-teal-100 text-teal-800`,
    confirmado: true,
    exigeConfirmacao: false,
    indicaConflito: false,
    dadoAusente: false,
    bloqueiaCompletude: false,
  },
  DECLARADO: {
    rotulo: 'Declarado',
    descricao: 'Saiu do texto que você enviou.',
    classe: `${BASE} bg-emerald-100 text-emerald-800`,
    confirmado: true,
    exigeConfirmacao: false,
    indicaConflito: false,
    dadoAusente: false,
    bloqueiaCompletude: false,
  },
  VISUAL: {
    rotulo: 'Foto',
    descricao: 'Visto na foto, sem menção no seu texto. Confirme se é esse o imóvel.',
    classe: `${BASE} bg-purple-100 text-purple-800`,
    confirmado: false,
    exigeConfirmacao: true,
    indicaConflito: false,
    dadoAusente: false,
    bloqueiaCompletude: false,
  },
  INFERIDO: {
    rotulo: 'Inferido',
    descricao: 'Deduzido por uma regra do sistema, não escrito por você.',
    classe: `${BASE} bg-amber-100 text-amber-800`,
    confirmado: false,
    exigeConfirmacao: false,
    indicaConflito: false,
    dadoAusente: false,
    bloqueiaCompletude: false,
  },
  A_VALIDAR: {
    rotulo: 'A confirmar',
    descricao: 'A extração não achou respaldo para este valor. Confirme ou corrija.',
    classe: `${BASE} bg-orange-100 text-orange-900 ring-1 ring-orange-300`,
    confirmado: false,
    exigeConfirmacao: true,
    indicaConflito: false,
    dadoAusente: false,
    bloqueiaCompletude: false,
  },
  CONFLITANTE: {
    rotulo: 'Conflito',
    descricao: 'Duas informações do anúncio se contradizem. Escolha o valor correto.',
    classe: `${BASE} bg-red-100 text-red-800 ring-1 ring-red-300`,
    confirmado: false,
    exigeConfirmacao: true,
    indicaConflito: true,
    dadoAusente: false,
    bloqueiaCompletude: false,
  },
  NAO_INFORMADO: {
    rotulo: 'Não informado',
    descricao: 'Este dado não apareceu no texto nem nas fotos.',
    classe: `${BASE} bg-slate-100 text-slate-600 border border-dashed border-slate-300`,
    confirmado: false,
    exigeConfirmacao: true,
    indicaConflito: false,
    dadoAusente: true,
    bloqueiaCompletude: true,
  },
  NAO_APLICAVEL: {
    rotulo: 'Não se aplica',
    descricao: 'Este campo não vale para este tipo de imóvel.',
    classe: `${BASE} bg-slate-50 text-slate-400 border border-slate-200`,
    confirmado: true,
    exigeConfirmacao: false,
    indicaConflito: false,
    dadoAusente: false,
    // Não conta como pendência: inaplicável não é falta.
    bloqueiaCompletude: false,
  },
  A_CONFIRMAR: {
    rotulo: 'A confirmar',
    descricao: 'Procedência não reconhecida pelo sistema. Confira antes de publicar.',
    classe: `${BASE} bg-orange-50 text-orange-900 ring-1 ring-orange-200`,
    confirmado: false,
    exigeConfirmacao: true,
    indicaConflito: false,
    dadoAusente: false,
    bloqueiaCompletude: false,
  },
};

function eConhecida(valor: string): valor is OrigemConhecida {
  return (ORIGENS_CONHECIDAS as readonly string[]).includes(valor);
}

/**
 * Traduz a origem do contrato no desenho de tela. Total, e sem caminho para "Declarado".
 *
 * Aceita `unknown` de propósito: o valor chega de `JSON.parse` e a assinatura não pode obrigar o
 * chamador a narrowing que o dado não sustenta. `null` e `undefined` são origem desconhecida, e
 * origem desconhecida é "A confirmar".
 */
export function desenharOrigem(origem: unknown): DesenhoOrigem {
  const texto = typeof origem === 'string' ? origem.trim().toUpperCase() : '';
  return DESENHOS[eConhecida(texto) ? texto : 'A_CONFIRMAR'];
}

/** Rótulo de uma origem, para os casos em que só o texto importa. */
export function rotuloDaOrigem(origem: unknown): string {
  return desenharOrigem(origem).rotulo;
}

/**
 * Uma origem pode ser apresentada como confirmada?
 *
 * Existe como função para que nenhuma tela precise desenvolver o teste por conta própria com um
 * `origem === 'DECLARADO'`, que é a versão com lista branca incompleta do defeito original.
 */
export function ehConfirmada(origem: unknown): boolean {
  return desenharOrigem(origem).confirmado;
}

/** A origem exige alguma ação do corretor antes de publicar? */
export function exigeConfirmacao(origem: unknown): boolean {
  return desenharOrigem(origem).exigeConfirmacao;
}

/** O status da Extraction V2 que a origem representa, quando é um dos do schema. */
export function statusDeExtracao(origem: unknown): OrigemDado | null {
  const texto = typeof origem === 'string' ? origem.trim().toUpperCase() : '';
  return eConhecida(texto) ? texto : null;
}