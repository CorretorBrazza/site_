'use client';

import { useMemo, useSyncExternalStore } from 'react';

export interface UsuarioSessao {
  nome?: string;
  email?: string;
}

/** Nome do evento disparado quando o perfil em `localStorage` muda. */
const EVENTO = 'imv:user-info-mudou';

function inscrever(callback: () => void): () => void {
  if (typeof window === 'undefined') return () => {};
  window.addEventListener('storage', callback);
  window.addEventListener(EVENTO, callback);
  return () => {
    window.removeEventListener('storage', callback);
    window.removeEventListener(EVENTO, callback);
  };
}

function lerBruto(): string | null {
  try {
    return window.localStorage.getItem('user_info');
  } catch {
    // Storage bloqueado (modo privado / política de terceiros).
    return null;
  }
}

/**
 * Perfil do corretor para a UI do header.
 *
 * `useSyncExternalStore` em vez de `useEffect` + `setState`: a leitura do
 * localStorage é uma fonte externa, e o snapshot do servidor é `null` — assim
 * não há render em cascata nem divergência de hidratação (o servidor sempre
 * pinta "Entrar"; o cliente corrige no primeiro commit).
 *
 * O cookie httpOnly continua sendo a credencial; isto é só exibição.
 */
export function useUsuario(): UsuarioSessao | null {
  const bruto = useSyncExternalStore(inscrever, lerBruto, () => null);

  return useMemo(() => {
    if (!bruto) return null;
    try {
      return JSON.parse(bruto) as UsuarioSessao;
    } catch {
      return null;
    }
  }, [bruto]);
}

/** Avisa os componentes inscritos de que `user_info` mudou. */
export function notificarMudancaDeUsuario(): void {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new Event(EVENTO));
}
