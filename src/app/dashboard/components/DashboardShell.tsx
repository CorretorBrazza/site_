'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Building2, LogOut, RefreshCw, ArrowLeft } from 'lucide-react';
import BottomNavMobile, { TabId } from './BottomNavMobile';

interface DashboardShellProps {
  children: React.ReactNode;
  activeTab: TabId;
  onTabChange?: (tab: TabId) => void;
  usuario?: { nome?: string; email?: string } | null;
  loading?: boolean;
  /** Mostra os children também no desktop (páginas internas). Default: false. */
  showChildrenOnDesktop?: boolean;
  /** Rota "Voltar" exibida como botão no header mobile. */
  backRoute?: string;
}

export default function DashboardShell({
  children,
  activeTab,
  onTabChange,
  usuario,
  loading = false,
  showChildrenOnDesktop = false,
  backRoute,
}: DashboardShellProps) {
  const router = useRouter();
  const [shellUsuario, setShellUsuario] = useState(usuario ?? null);

  useEffect(() => {
    if (!usuario) {
      const saved = localStorage.getItem('user_info');
      if (saved) {
        try {
          setShellUsuario(JSON.parse(saved));
        } catch {
          setShellUsuario(null);
        }
      }
    }
  }, [usuario]);

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

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_info');
    document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    router.push('/login');
  };

  const handleTab = (tab: TabId) => {
    if (onTabChange) {
      onTabChange(tab);
      return;
    }
    if (tab === 'inicio') router.push('/dashboard');
    else router.push(`/dashboard?aba=${tab}`);
  };

  const nome = shellUsuario?.nome || 'Corretor';
  const inicial = (nome?.[0] || 'C').toUpperCase();

  return (
    <>
      {/* Mobile App Shell */}
      <div className="md:hidden fixed inset-0 z-40 flex flex-col bg-slate-50" style={{ height: '100dvh' }}>
        {/* Header Fixo Mobile */}
        <header className="flex-shrink-0 bg-white border-b border-slate-200 px-3" style={{ height: 60 }}>
          <div className="h-full flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              {backRoute && (
                <button
                  onClick={() => router.push(backRoute)}
                  title="Voltar"
                  className="p-2 bg-slate-50 border border-slate-200 text-slate-600 hover:text-blue-600 hover:border-blue-300 rounded-xl transition-all shadow-xs shrink-0"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
              )}
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shrink-0">
                <Building2 className="w-4 h-4" />
              </div>
              <div className="min-w-0 leading-tight">
                <p className="text-sm font-black text-slate-900 truncate">Imóveis Taboão</p>
                <p className="text-[9px] uppercase tracking-wider font-bold text-blue-600">Painel do Corretor</p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={() => window.location.reload()}
                title="Atualizar Dados"
                className="p-2 bg-slate-50 border border-slate-200 text-slate-600 hover:text-blue-600 hover:border-blue-300 rounded-xl transition-all shadow-xs"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-blue-600' : ''}`} />
              </button>

              {shellUsuario && (
                <>
                  <span
                    title={`${nome}${shellUsuario.email ? ` (${shellUsuario.email})` : ''}`}
                    className="w-8 h-8 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700 font-black text-xs"
                  >
                    {inicial}
                  </span>
                  <button
                    onClick={handleLogout}
                    title="Encerrar Sessão Segura"
                    className="p-2 bg-slate-50 border border-slate-200 text-slate-500 hover:text-red-600 hover:border-red-300 rounded-xl transition-all shadow-xs"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Conteúdo Central Rolável */}
        <div className="flex-1 overflow-y-auto bg-slate-50 overscroll-contain">
          {children}
        </div>

        {/* Bottom Navigation Bar */}
        <BottomNavMobile activeTab={activeTab} onTabChange={handleTab} />
      </div>

      {/* Desktop: conteúdo direto (páginas internas) */}
      {showChildrenOnDesktop && (
        <div className="hidden md:block">
          {children}
        </div>
      )}
    </>
  );
}