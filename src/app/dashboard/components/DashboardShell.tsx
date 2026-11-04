'use client';

import { useEffect } from 'react';
import { AppShell, AppShellMobile } from '@/components/app/AppShell';
import { TabId } from './BottomNavMobile';

interface DashboardShellProps {
  children: React.ReactNode;
  activeTab: TabId;
  onTabChange?: (tab: TabId) => void;
  usuario?: { nome?: string; email?: string } | null;
  loading?: boolean;
  /** Páginas internas: a casca completa (sidebar no desktop) envolve o conteúdo. */
  showChildrenOnDesktop?: boolean;
  /** Rota "Voltar" exibida como botão no header mobile. */
  backRoute?: string;
}

/**
 * Compatibilidade: mantém a API usada pelas páginas do painel.
 *
 * - `showChildrenOnDesktop` → casca responsiva completa (`AppShell`), com o
 *   conteúdo montado UMA vez (antes ele era montado duas, mobile e desktop).
 * - sem a flag → casca só-mobile (`AppShellMobile`), usada pelo `/dashboard`,
 *   que ainda mantém a própria árvore de desktop.
 */
export default function DashboardShell({
  children,
  activeTab,
  onTabChange,
  usuario,
  loading = false,
  showChildrenOnDesktop = false,
  backRoute,
}: DashboardShellProps) {
  // Bloqueia o scroll do body apenas no mobile dentro do App Shell do dashboard.
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    const apply = () => {
      if (mq.matches) document.body.classList.add('dashboard-app-shell');
      else document.body.classList.remove('dashboard-app-shell');
    };
    apply();
    if (typeof mq.addEventListener === 'function') {
      mq.addEventListener('change', apply);
      return () => {
        document.body.classList.remove('dashboard-app-shell');
        mq.removeEventListener('change', apply);
      };
    }
    (mq as unknown as { addListener: (cb: () => void) => void }).addListener(apply);
    return () => {
      document.body.classList.remove('dashboard-app-shell');
      (mq as unknown as { removeListener: (cb: () => void) => void }).removeListener(apply);
    };
  }, []);

  const props = { activeTab, onTabChange, usuario, loading, backRoute };

  return showChildrenOnDesktop
    ? <AppShell {...props}>{children}</AppShell>
    : <AppShellMobile {...props}>{children}</AppShellMobile>;
}
