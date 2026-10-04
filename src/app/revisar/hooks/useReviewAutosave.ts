'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { autosaveReview } from '@/lib/api';
import { ControladorAutosave, EstadoSalvar } from '../reviewVersion';

export type SaveState = EstadoSalvar;

interface UseReviewAutosaveProps {
  tokenRef: React.MutableRefObject<string>;
  versionRef: React.MutableRefObject<number>;
  onVersionUpdate?: (newVersion: number) => void;
  debounceMs?: number;
}

/**
 * Hook fino sobre `ControladorAutosave`.
 *
 * Não há lógica de versão, debounce nem conflito aqui — tudo isso mora na classe, que é objeto
 * puro e testável sem renderizador. Este arquivo só traduz entre React e a classe: cria uma
 * instância, mantém `versionRef` espelhando a versão da controladora e liga as notificações aos
 * estados que a tela consome.
 *
 * A versão é mantida em dois lugares por um motivo concreto: `page.tsx` já a lê de `versionRef` ao
 * montar requisições manuais, e a controladora a guarda internamente. Espelhar pela notificação
 * `aoConfirmarVersao` mantém os dois sem que nada precise saber qual é a fonte.
 */
export function useReviewAutosave({
  tokenRef,
  versionRef,
  onVersionUpdate,
  debounceMs = 1000,
}: UseReviewAutosaveProps) {
  const [saveState, setSaveState] = useState<SaveState>('idle');
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // O token entra por `ref` e não por estado de propósito: ele é lido do fragmento da URL e
  // removido do endereço assim que a página monta. Guardá-lo em estado o colocaria no histórico do
  // React DevTools e em qualquer render intermediário.
  const controladorRef = useRef<ControladorAutosave | null>(null);
  const onVersionUpdateRef = useRef(onVersionUpdate);
  onVersionUpdateRef.current = onVersionUpdate;

  if (controladorRef.current === null) {
    controladorRef.current = new ControladorAutosave({
      lerToken: () => tokenRef.current,
      salvar: autosaveReview,
      debounceMs,
      aoMudar: (estado, erro) => {
        setSaveState(estado);
        setErrorMessage(erro);
        if (estado === 'saved') setLastSavedAt(new Date());
      },
      aoConfirmarVersao: (versao) => {
        versionRef.current = versao;
        onVersionUpdateRef.current?.(versao);
      },
    });
  }

  const controlador = controladorRef.current;

  // Debounce novo precisa de controladora nova: o `debounceMs` fica congelado na construção.
  useEffect(() => {
    controladorRef.current = new ControladorAutosave({
      lerToken: () => tokenRef.current,
      salvar: autosaveReview,
      debounceMs,
      aoMudar: (estado, erro) => {
        setSaveState(estado);
        setErrorMessage(erro);
        if (estado === 'saved') setLastSavedAt(new Date());
      },
      aoConfirmarVersao: (versao) => {
        versionRef.current = versao;
        onVersionUpdateRef.current?.(versao);
      },
    });
    return () => {
      controladorRef.current?.destruir();
    };
    // Montagem e desmontagem apenas: trocar o debounce recria a controladora, e recriar durante
    // uma edição perderia a pendência em voo.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounceMs]);

  const triggerAutosave = useCallback(
    (dados: Record<string, unknown>, capaIndex?: number) => {
      // Patch vazio não vai à rede: consome cota de `autosave` (60/90 por janela) e devolve uma
      // versão nova sem ter escrito nada.
      const temDados = Object.keys(dados).length > 0;
      if (!temDados && capaIndex === undefined) return;
      controladorRef.current?.agendar(dados, capaIndex);
    },
    [],
  );

  const forceSaveNow = useCallback(async () => {
    return controladorRef.current?.salvarAgora() ?? 'idle';
  }, []);

  /**
   * Adota a versão que uma resposta fora do autosave devolveu.
   *
   * É o ponto que fecha o deadlock: `answer` incrementa `review_state_version` no servidor, e sem
   * esta chamada o cliente segue com o número antigo e toma 409 na edição seguinte.
   */
  const aplicarVersao = useCallback((versao: number | undefined | null) => {
    controladorRef.current?.aplicarVersaoDoServidor(versao);
  }, []);

  /** Recomeça de uma sessão recarregada: zera pendência e adota a versão do servidor. */
  const reconciliar = useCallback((versao: number) => {
    controladorRef.current?.reconciliar(versao);
  }, []);

  return {
    saveState,
    lastSavedAt,
    errorMessage,
    triggerAutosave,
    forceSaveNow,
    aplicarVersao,
    reconciliar,
    getVersion: () => controlador.getVersion(),
  };
}