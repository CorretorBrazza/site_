'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import {
  getReviewSession,
  ReviewSessionData,
  ReviewSessionResult,
  ReviewField,
  selectReviewCover,
  answerReviewQuestion,
  generateReviewPreview,
  PublishResult,
} from '@/lib/api';
import { useReviewAutosave } from './hooks/useReviewAutosave';
import { montarPatch } from './reviewPatch';
import { exigeConfirmacao } from './reviewOrigens';
import { ReviewHeader } from './components/ReviewHeader';
import { ReviewGallery } from './components/ReviewGallery';
import { ReviewDataSection } from './components/ReviewDataSection';
import { ReviewQuestions } from './components/ReviewQuestions';
import { ReviewPreview } from './components/ReviewPreview';
import { ReviewPublishButton } from './components/ReviewPublishButton';
import {
  AlertTriangle,
  AlertCircle,
  Clock,
  Loader2,
  RefreshCw,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';

type EstadoTela = 'carregando' | 'invalido' | 'indisponivel' | 'pronto' | 'publicado';

/**
 * Lê o token do fragmento (#token=...).
 */
function lerTokenDoFragmento(): string {
  if (typeof window === 'undefined') return '';
  const hash = window.location.hash || '';
  if (!hash) return '';
  try {
    const params = new URLSearchParams(hash.startsWith('#') ? hash.slice(1) : hash);
    return (params.get('token') || '').trim();
  } catch {
    return '';
  }
}

/**
 * Remove o fragmento da URL imediatamente para proteger a credencial contra vazamentos.
 */
function limparFragmento(): void {
  if (typeof window === 'undefined') return;
  if (!window.location.hash) return;
  window.history.replaceState(null, '', window.location.pathname + window.location.search);
}

/**
 * Resumo do que ainda depende do corretor.
 *
 * Três grupos, e a separação é o ponto: o que é obrigatório e está vazio, o que a extração
 * marcou para conferir, e o que está em conflito. A versão anterior mostrava só a contagem que o
 * backend calculou no carregamento — estática, e desatualizada assim que o corretor edita alguma
 * coisa.
 */
function PendenciasConfirmacao({
  campos,
  respondidas,
  totalPerguntas,
}: {
  campos: ReviewField[];
  respondidas: number;
  totalPerguntas: number;
}) {
  // Um campo só sai da lista de "a validar" quando o valor está confirmado E a origem permite
  // apresentação como confirmada. Exigir os dois evita que um `A_VALIDAR` marcado como confirmado
  // por engano no payload desapareça da fila de pendências.
  const aValidar = campos.filter((c) => exigeConfirmacao(c.origem) && !c.confirmado);
  const emConflito = campos.filter((c) => c.origem === 'CONFLITANTE');
  const obrigatoriosVazios = campos.filter(
    (c) => c.obrigatorio && c.valor === null && c.origem !== 'NAO_APLICAVEL',
  );

  const total = aValidar.length + emConflito.length + obrigatoriosVazios.length;
  if (total === 0 && respondidas >= totalPerguntas) return null;

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-4 sm:p-5 shadow-sm space-y-2">
      <h3 className="text-xs font-extrabold text-slate-700">Antes de publicar</h3>
      <ul className="space-y-1.5 text-[11px] text-slate-600">
        {obrigatoriosVazios.length > 0 && (
          <li className="flex items-start gap-2">
            <AlertCircle className="w-3.5 h-3.5 text-amber-500 mt-px shrink-0" />
            <span>
              <strong className="font-extrabold text-slate-800">
                {obrigatoriosVazios.length}
              </strong>{' '}
              campo(s) obrigatório(s) sem valor.
            </span>
          </li>
        )}
        {aValidar.length > 0 && (
          <li className="flex items-start gap-2">
            <AlertCircle className="w-3.5 h-3.5 text-amber-500 mt-px shrink-0" />
            <span>
              <strong className="font-extrabold text-slate-800">{aValidar.length}</strong> campo(s) que a
              extração marcou para você conferir.
            </span>
          </li>
        )}
        {emConflito.length > 0 && (
          <li className="flex items-start gap-2">
            <AlertCircle className="w-3.5 h-3.5 text-rose-500 mt-px shrink-0" />
            <span>
              <strong className="font-extrabold text-slate-800">{emConflito.length}</strong> campo(s) com
              versões divergentes entre as fontes.
            </span>
          </li>
        )}
        {totalPerguntas > respondidas && (
          <li className="flex items-start gap-2">
            <AlertCircle className="w-3.5 h-3.5 text-slate-400 mt-px shrink-0" />
            <span>
              <strong className="font-extrabold text-slate-800">
                {totalPerguntas - respondidas}
              </strong>{' '}
              pergunta(s) ainda sem resposta.
            </span>
          </li>
        )}
      </ul>
    </div>
  );
}

export default function RevisarPage() {
  const tokenRef = useRef<string>('');
  const versionRef = useRef<number>(0);

  const [estado, setEstado] = useState<EstadoTela>('carregando');
  const [session, setSession] = useState<ReviewSessionData | null>(null);
  const [publishResult, setPublishResult] = useState<PublishResult | null>(null);
  const [isRefreshingPreview, setIsRefreshingPreview] = useState(false);
  const [erroPorCampo, setErroPorCampo] = useState<Record<string, string>>({});

  // Hook de Autosave
  const {
    saveState,
    lastSavedAt,
    errorMessage: autosaveError,
    triggerAutosave,
    forceSaveNow,
    aplicarVersao,
    reconciliar,
  } = useReviewAutosave({
    tokenRef,
    versionRef,
    onVersionUpdate: (v) => {
      if (session) {
        setSession((prev) => (prev ? { ...prev, review_state_version: v } : null));
      }
    },
  });

  const carregarSessao = useCallback(async (token: string) => {
    setEstado('carregando');
    const res: ReviewSessionResult = await getReviewSession(token);

    if (res.kind === 'ok' && res.session) {
      setSession(res.session);
      versionRef.current = res.session.review_state_version;
      setEstado('pronto');
    } else if (res.kind === 'invalid') {
      setEstado('invalido');
    } else {
      setEstado('indisponivel');
    }
  }, []);

  useEffect(() => {
    const token = tokenRef.current || lerTokenDoFragmento();
    tokenRef.current = token;
    limparFragmento();

    let ativo = true;

    if (!token) {
      setEstado('invalido');
      return;
    }

    (async () => {
      const res = await getReviewSession(token);
      if (!ativo) return;

      if (res.kind === 'ok' && res.session) {
        setSession(res.session);
        versionRef.current = res.session.review_state_version;
        setEstado('pronto');
      } else if (res.kind === 'invalid') {
        setEstado('invalido');
      } else {
        setEstado('indisponivel');
      }
    })();

    return () => {
      ativo = false;
    };
  }, []);

  const tentarNovamente = () => {
    const token = tokenRef.current;
    if (!token) {
      setEstado('invalido');
      return;
    }
    carregarSessao(token);
  };

  /**
   * Handler de Seleção de Capa
   *
   * Não passa pelo autosave, e essa é a parte que importa. A rota `/review/cover` grava o
   * `capa_index` ela mesma e não incrementa `review_state_version`; mandá-la também no autosave
   * duplicava a escrita e, pior, exigia um número de versão para uma operação que não consome
   * versão nenhuma. O risco real era o inverso: tratar a capa como se tivesse bumpado a versão,
   * avançando o contador local e fazendo o próximo autosave enviar um número que o servidor nunca
   * gravou — um 409 em cadeia.
   */
  const handleSelectCover = async (photoIndex: number) => {
    if (!session) return;
    setSession({ ...session, capa_index: photoIndex });

    const token = tokenRef.current;
    if (!token) return;

    const capaRes = await selectReviewCover(token, photoIndex);
    if (!capaRes.success) {
      // A capa não foi gravada; o avatar local mentiria. Volta ao que o servidor tem.
      setSession((prev) => (prev ? { ...prev, capa_index: capaRes.capa_index ?? prev.capa_index } : null));
    }
    // Nada a agendar: `setCover` já persistiu, e não houve bump de versão para incorporar.
  };

  /**
   * Handler de Edição de Campo
   *
   * Este é o ponto onde nascia o 400. A versão anterior montava o patch como `{ [campo]: valor }`,
   * com `campo` no vocabulário de leitura (`areaUtil`) e `valor` ainda como string do `input`. O
   * `ReviewPatchSchema` é estrito e usa o vocabulário de escrita (`caracteristicas.area_util`,
   * `numeroOuNulo`), então toda edição de área, preço ou condomínio era recusada com
   * "campo não editável pelo Link Dinâmico".
   *
   * A leitura local e a escrita usam mapas diferentes de propósito: `session.dados` é o objeto já
   * normalizado para exibição (`VINCULOS`), e o patch é o formato de gravação. Confundir os dois é
   * a origem do bug, então a conversão acontece aqui, num lugar só, e não em cada handler.
   */
  const handleUpdateField = (item: ReviewField, valor: unknown) => {
    if (!session) return;

    // `valoresAtuais` alimenta a seed de `vagas_cobertas`: o schema exige a chave em qualquer
    // objeto `caracteristicas`, e sem o valor vigente uma edição de `quartos` sobrescreveria a
    // descrição de cobertura com o padrão "Não informado".
    const resultado = montarPatch(item.campo, valor, item.rotulo, { valoresAtuais: session.dados });
    if (!resultado.ok) {
      setErroPorCampo((prev) => ({ ...prev, [item.campo]: resultado.erro }));
      return;
    }
    setErroPorCampo((prev) => {
      if (!(item.campo in prev)) return prev;
      const copia = { ...prev };
      delete copia[item.campo];
      return copia;
    });

    // Espelho local no vocabulário de leitura, com o valor já normalizado: se o corretor digitou
    // "350.000", o card passa a mostrar 350000 (formatado em pt-BR), e não a string digitada.
    const valorCanonico =
      Object.values(resultado.dados).find((v) => typeof v === 'object' && v !== null) ??
      Object.values(resultado.dados)[0];
    const paraExibir = valorCanonico === null || valorCanonico === undefined ? '' : valorCanonico;

    setSession({
      ...session,
      dados: { ...session.dados, [item.campo]: paraExibir },
    });

    // O patch já vem no formato aceito: o autosave não sabe nada sobre nomes de campo.
    triggerAutosave(resultado.dados);
  };

  /**
   * Handler de Resposta de Pergunta Dinâmica
   *
   * `answerReviewQuestion` incrementa `review_state_version` no servidor e devolve a versão nova.
   * A versão anterior ignorava esse retorno, e daí vinha o deadlock: o cliente seguia com o número
   * antigo, o autosave seguinte tomava 409, e cada edição nova repetia o 409 com a mesma versão
   * velha. Aplicar o `version` aqui é o que fecha o circuito.
   */
  const handleAnswerQuestion = async (questionId: string, resposta: unknown) => {
    if (!session) return;

    const pergunta = session.perguntas_dinamicas.find((q) => q.id === questionId);

    const updatedPerguntas = session.perguntas_dinamicas.map((q) =>
      q.id === questionId ? { ...q, respondida: true, resposta_atual: resposta } : q,
    );

    const updatedSession = {
      ...session,
      perguntas_dinamicas: updatedPerguntas,
    };

    setSession(updatedSession);

    const token = tokenRef.current;
    if (!token) return;

    const respostaRes = await answerReviewQuestion(token, questionId, resposta);

    // O servidor é a autoridade da versão, mesmo quando a resposta foi recusada: se ele bumpou,
    // o número novo precisa ser adotado antes da próxima escrita.
    if (typeof respostaRes.version === 'number') {
      aplicarVersao(respostaRes.version);
    }

    if (!respostaRes.success) {
      // Desfaz o "respondida" otimista: a tela mentiria sobre uma resposta que não foi gravada.
      setSession((prev) =>
        prev
          ? {
              ...prev,
              perguntas_dinamicas: prev.perguntas_dinamicas.map((q) =>
                q.id === questionId ? { ...q, respondida: false, resposta_atual: pergunta?.resposta_atual } : q,
              ),
            }
          : null,
      );
      return;
    }

    // Recarregar prévia silenciosamente após responder pergunta
    const previewRes = await generateReviewPreview(token);
    if (previewRes.success && previewRes.preview) {
      setSession((prev) => (prev ? { ...prev, preview: previewRes.preview! } : null));
    }
  };

  // Handler de Atualização Manual de Prévia
  const handleRefreshPreview = async () => {
    const token = tokenRef.current;
    if (!token) return;

    setIsRefreshingPreview(true);
    await forceSaveNow();

    const res = await generateReviewPreview(token);
    setIsRefreshingPreview(false);

    if (res.success && res.preview) {
      setSession((prev) => (prev ? { ...prev, preview: res.preview! } : null));
    }
  };

  /**
   * Recarrega a sessão e reconcilia a pendência, em vez de descartar a edição em curso.
   *
   * Descartar seria mais simples: `reiniciar` zera a fila e o corretor perde o que acabou de
   * digitar. Reconciliar adota a versão nova e reenvia. Se a sessão recarregada já tiver o mesmo
   * valor que o corretor digitou — porque outra pessoa salvou exatamente isso — não há o que
   * reenviar, e o painel pode fechar honestamente.
   */
  const handleResolverConflito = async () => {
    const token = tokenRef.current;
    if (!token) return;

    setEstado('carregando');
    const res = await getReviewSession(token);

    if (res.kind !== 'ok' || !res.session) {
      setEstado('indisponivel');
      return;
    }

    setSession(res.session);
    versionRef.current = res.session.review_state_version;
    reconciliar(res.session.review_state_version);
    setEstado('pronto');
  };

  // Handler de Sucesso na Publicação
  const handlePublishSuccess = (result: PublishResult) => {
    setPublishResult(result);
    setEstado('publicado');
  };

  // ==========================================
  // ESTADO: CARREGANDO
  // ==========================================
  if (estado === 'carregando') {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-800 flex items-center justify-center p-6">
        <div className="text-center space-y-4 max-w-xs">
          <div className="w-16 h-16 bg-blue-50 border border-blue-200 rounded-3xl flex items-center justify-center mx-auto text-blue-600 shadow-sm">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
          <div className="space-y-1">
            <h2 className="text-base font-extrabold text-slate-900">Abrindo seu anúncio...</h2>
            <p className="text-xs text-slate-500 font-medium">Carregando dados, fotos e perguntas inteligentes.</p>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // ESTADO: LINK INVÁLIDO
  // ==========================================
  if (estado === 'invalido') {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-800 flex items-center justify-center p-6">
        <div className="bg-white border border-red-200 rounded-3xl p-8 text-center shadow-xl space-y-5 max-w-md w-full">
          <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto text-red-600 border border-red-200">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h1 className="text-xl font-black text-slate-900">Link indisponível ou expirado</h1>
            <p className="text-xs text-slate-600 leading-relaxed">
              Este Link Dinâmico não está mais ativo. Ele pode ter sido publicado, ter expirado ou sido substituído por uma versão mais recente.
            </p>
          </div>
          <div className="pt-2">
            <Link
              href="/"
              className="w-full inline-flex items-center justify-center px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-xs font-black uppercase tracking-wider shadow-md transition-colors"
            >
              Ir para a Página Inicial
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // ESTADO: INDISPONÍVEL / RETRY
  // ==========================================
  if (estado === 'indisponivel') {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-800 flex items-center justify-center p-6">
        <div className="bg-white border border-amber-200 rounded-3xl p-8 text-center shadow-xl space-y-5 max-w-md w-full">
          <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto text-amber-600 border border-amber-200">
            <Clock className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h1 className="text-xl font-black text-slate-900">Instabilidade temporária</h1>
            <p className="text-xs text-slate-600 leading-relaxed">
              Não conseguimos conectar com o servidor neste instante. Seu link continua 100% válido.
            </p>
          </div>
          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={tentarNovamente}
              className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-xs font-black uppercase tracking-wider shadow-md transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Tentar novamente</span>
            </button>
            <Link
              href="/"
              className="inline-flex items-center justify-center px-6 py-3.5 border border-slate-300 text-slate-700 rounded-2xl text-xs font-black uppercase tracking-wider hover:bg-slate-50 transition-colors"
            >
              Voltar
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // ESTADO: PUBLICADO COM SUCESSO
  // ==========================================
  if (estado === 'publicado' && publishResult) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-800 flex items-center justify-center p-4 sm:p-6">
        <div className="bg-white border border-emerald-200 rounded-3xl p-6 sm:p-8 text-center shadow-2xl space-y-6 max-w-lg w-full animate-in fade-in zoom-in-95 duration-300">
          <div className="w-20 h-20 bg-emerald-50 rounded-3xl flex items-center justify-center mx-auto text-emerald-600 border border-emerald-200 shadow-inner">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <span className="bg-emerald-100 text-emerald-800 text-xs font-black px-3 py-1 rounded-xl uppercase tracking-wider">
              REF: {publishResult.referencia}
            </span>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Anúncio Publicado com Sucesso!
            </h1>
            <p className="text-xs text-slate-600 leading-relaxed max-w-sm mx-auto">
              Seu imóvel já está ativo no portal e o Media Kit completo foi gerado. 1 crédito foi debitado.
            </p>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-left space-y-2 text-xs">
            <div className="flex justify-between items-center text-slate-600">
              <span className="font-semibold">Saldo restante:</span>
              <span className="font-extrabold text-slate-900">{publishResult.saldo_restante} crédito(s)</span>
            </div>
            <div className="flex justify-between items-center text-slate-600">
              <span className="font-semibold">Status:</span>
              <span className="font-bold text-emerald-700">ATIVO NO PORTAL</span>
            </div>
          </div>

          <div className="flex flex-col gap-3 pt-2">
            <Link
              href="/dashboard"
              className="w-full inline-flex items-center justify-center gap-2 py-4 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-sm font-extrabold shadow-lg shadow-blue-600/30 transition-all active:scale-98"
            >
              <span>Acessar Painel do Corretor</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/"
              className="w-full inline-flex items-center justify-center py-3 px-6 border border-slate-200 text-slate-600 hover:text-slate-900 rounded-2xl text-xs font-bold transition-colors"
            >
              Ir para a Página Inicial
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // ESTADO: PRONTO (EXPERIÊNCIA COMPLETA)
  // ==========================================
  if (!session) return null;

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 py-6 px-3 sm:px-6">
      <main className="max-w-2xl mx-auto space-y-5 pb-16">
        {/* Painel de conflito. Aparece acima de tudo e não some sozinho: a retentativa automática
            é no máximo uma, e se ela falhar o caminho é o corretor recarregar. Um 409 silencioso
            deixaria a tela "salvando" para sempre. */}
        {saveState === 'conflict' && (
          <div className="bg-amber-50 border border-amber-300 rounded-3xl p-4 sm:p-5 shadow-sm space-y-3">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="space-y-1 flex-1">
                <h2 className="text-sm font-extrabold text-amber-900">
                  Este anúncio mudou em outro lugar
                </h2>
                <p className="text-[11px] text-amber-800 leading-relaxed">
                  {autosaveError ||
                    'Outra pessoa editou este anúncio enquanto você trabalhava. Recarregue para pegar a versão mais recente — o que você já digitou será reenviado automaticamente.'}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleResolverConflito}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-2xl text-[11px] font-black uppercase tracking-wider shadow-sm transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Recarregar e reaplicar</span>
            </button>
          </div>
        )}

        {/* 1. CABEÇALHO */}
        <ReviewHeader
          referencia={session.referencia}
          status={session.status}
          completude={session.completude}
          camposPendentes={session.campos_pendentes}
          saveState={saveState}
          lastSavedAt={lastSavedAt}
          errorMessage={autosaveError}
        />

        {/* 2. GALERIA DE FOTOS */}
        <ReviewGallery
          fotos={session.fotos}
          capaIndex={session.capa_index}
          capaSugeridaIa={session.capa_sugerida_ia}
          onSelectCover={handleSelectCover}
        />

        {/* 3. PERGUNTAS DINÂMICAS INTELIGENTES */}
        <ReviewQuestions
          perguntas={session.perguntas_dinamicas}
          onAnswerQuestion={handleAnswerQuestion}
        />

        {/* 4. DADOS IDENTIFICADOS E EDITOR COMPLETO */}
        <ReviewDataSection
          campos={session.campos_identificados}
          dados={session.dados}
          onUpdateField={handleUpdateField}
          erroPorCampo={erroPorCampo}
        />

        {/* Aviso de pendências reais. A lista de origem vinha pronta do backend e nunca era
            recalculada: responder uma pergunta marcava "respondida" na tela, mas o contador de
            pendências continuava mostrando o mesmo número, e o corretor não tinha como saber que
            já tinha resolvido. `ehConfirmada` e `exigeConfirmacao` são o mesmo julgamento que o
            selo de procedência usa, então a lista e o badge nunca discordam. */}
        <PendenciasConfirmacao
          campos={session.campos_identificados}
          respondidas={session.perguntas_dinamicas.filter((q) => q.respondida).length}
          totalPerguntas={session.perguntas_dinamicas.length}
        />

        {/* 5. PRÉVIA VIVA DO MEDIA KIT */}
        <ReviewPreview
          preview={session.preview}
          onRefreshPreview={handleRefreshPreview}
          isRefreshing={isRefreshingPreview}
        />

        {/* 6. BOTÃO DE AÇÃO FINAL: APROVAR E PUBLICAR */}
        <ReviewPublishButton
          tokenRef={tokenRef}
          referencia={session.referencia}
          onSuccess={handlePublishSuccess}
        />
      </main>
    </div>
  );
}
