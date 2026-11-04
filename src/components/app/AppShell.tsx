'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Building2,
  Home as HomeIcon,
  MapPin,
  User,
  LogOut,
  PlusCircle,
  ExternalLink,
  RefreshCw,
  ArrowLeft,
} from 'lucide-react';
import { Logo } from '@/components/brand/Logo';
import { logoutBrokerSession } from '@/lib/api';
import { cn } from '@/lib/cn';
import { useUsuario } from '@/hooks/useUsuario';
import BottomNavMobile, { TabId } from '@/app/dashboard/components/BottomNavMobile';

const NAV: Array<{ id: TabId; label: string; Icon: typeof HomeIcon }> = [
  { id: 'inicio', label: 'Início', Icon: HomeIcon },
  { id: 'imoveis', label: 'Imóveis', Icon: Building2 },
  { id: 'bairro', label: 'Bairro', Icon: MapPin },
  { id: 'conta', label: 'Minha conta', Icon: User },
];

export interface AppShellProps {
  children: React.ReactNode;
  activeTab: TabId;
  onTabChange?: (tab: TabId) => void;
  usuario?: { nome?: string; email?: string } | null;
  loading?: boolean;
  /** Rota "Voltar" exibida como botão no header mobile. */
  backRoute?: string;
}

function useNavegacao(onTabChange?: (tab: TabId) => void) {
  const router = useRouter();

  return {
    irPara: (tab: TabId) => {
      if (onTabChange) {
        onTabChange(tab);
        return;
      }
      router.push(tab === 'inicio' ? '/dashboard' : `/dashboard?aba=${tab}`);
    },
    sair: async () => {
      await logoutBrokerSession();
      router.push('/login');
    },
  };
}

function useDadosDoShell(usuarioProp: AppShellProps['usuario']) {
  const usuarioStorage = useUsuario();
  const usuario = usuarioProp ?? usuarioStorage;
  return {
    usuario,
    nome: usuario?.nome || 'Corretor',
    inicial: ((usuario?.nome || 'C')[0] || 'C').toUpperCase(),
  };
}

function Sidebar({
  activeTab,
  onTabChange,
  usuario,
}: {
  activeTab: TabId;
  onTabChange?: (tab: TabId) => void;
  usuario: { nome?: string; email?: string } | null;
}) {
  const { irPara, sair } = useNavegacao(onTabChange);
  const nome = usuario?.nome || 'Corretor';
  const inicial = (nome[0] || 'C').toUpperCase();

  return (
    <aside className="hidden w-60 shrink-0 flex-col border-r border-line bg-surface md:flex">
      <div className="border-b border-line px-5 py-5">
        <Logo tamanho={34} />
      </div>

      <nav aria-label="Navegação do painel" className="flex-1 space-y-1 px-3 py-4">
        {NAV.map(({ id, label, Icon }) => {
          const ativo = activeTab === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => irPara(id)}
              aria-current={ativo ? 'page' : undefined}
              className={cn(
                'flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-bold transition-colors',
                ativo ? 'bg-brand-900 text-white' : 'text-ink/70 hover:bg-paper hover:text-brand-900',
              )}
            >
              <Icon className={cn('h-4 w-4', ativo ? 'text-gold-400' : 'text-muted')} aria-hidden="true" />
              {label}
            </button>
          );
        })}

        <div className="pt-3">
          <Link
            href="/dashboard/novo"
            className="flex items-center justify-center gap-2 rounded-xl bg-gold-500 px-3 py-2.5 text-sm font-extrabold text-brand-950 transition-colors hover:bg-gold-400"
          >
            <PlusCircle className="h-4 w-4" aria-hidden="true" />
            Novo anúncio
          </Link>
        </div>
      </nav>

      <div className="space-y-1 border-t border-line px-3 py-4">
        <Link
          href="/"
          className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold text-muted hover:bg-paper hover:text-brand-900"
        >
          <ExternalLink className="h-4 w-4" aria-hidden="true" />
          Ver o site
        </Link>
        <button
          type="button"
          onClick={sair}
          className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold text-muted hover:bg-danger/10 hover:text-danger"
        >
          <LogOut className="h-4 w-4" aria-hidden="true" />
          Sair da conta
        </button>

        <div className="mt-2 flex items-center gap-2.5 rounded-xl bg-paper px-3 py-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-900 text-xs font-black text-gold-400">
            {inicial}
          </span>
          <div className="min-w-0 leading-tight">
            <p className="truncate text-xs font-bold text-ink">{nome}</p>
            <p className="truncate text-[10px] text-muted">{usuario?.email || 'Painel do corretor'}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

function MobileHeader({
  usuario,
  loading,
  backRoute,
}: {
  usuario: { nome?: string; email?: string } | null;
  loading: boolean;
  backRoute?: string;
}) {
  const router = useRouter();
  const { sair } = useNavegacao();
  const nome = usuario?.nome || 'Corretor';
  const inicial = (nome[0] || 'C').toUpperCase();

  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b border-line bg-surface px-3 md:hidden">
      <div className="flex min-w-0 items-center gap-2">
        {backRoute && (
          <button
            type="button"
            onClick={() => router.push(backRoute)}
            aria-label="Voltar"
            className="shrink-0 rounded-lg border border-line bg-surface p-2 text-muted hover:text-brand-900"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          </button>
        )}
        <Logo tamanho={30} comNome={false} />
        <div className="min-w-0 leading-tight">
          <p className="truncate text-sm font-extrabold text-ink">Imóveis Taboão</p>
          <p className="text-[9px] font-bold uppercase tracking-wider text-gold-600">Painel do corretor</p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-1.5">
        <button
          type="button"
          onClick={() => window.location.reload()}
          title="Atualizar dados"
          aria-label="Atualizar dados"
          className="rounded-lg border border-line bg-surface p-2 text-muted hover:text-brand-900"
        >
          <RefreshCw className={cn('h-4 w-4', loading && 'animate-spin text-gold-600')} aria-hidden="true" />
        </button>

        <span
          title={`${nome}${usuario?.email ? ` (${usuario.email})` : ''}`}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-900 text-xs font-black text-gold-400"
        >
          {inicial}
        </span>

        <button
          type="button"
          onClick={sair}
          title="Encerrar sessão"
          aria-label="Encerrar sessão"
          className="rounded-lg border border-line bg-surface p-2 text-muted hover:text-danger"
        >
          <LogOut className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </header>
  );
}

/**
 * Casca da área logada — UMA árvore responsiva.
 *
 * Antes, `DashboardShell` montava os children duas vezes (mobile e desktop) e as
 * páginas internas `/dashboard/novo` e `/editar` abriam sem navegação nenhuma no
 * desktop. Aqui o conteúdo é montado uma única vez e o layout responde por CSS:
 * sidebar a partir de `md`, header + bottom nav abaixo disso.
 */
export function AppShell({
  children,
  activeTab,
  onTabChange,
  usuario: usuarioProp,
  loading = false,
  backRoute,
}: AppShellProps) {
  const { usuario } = useDadosDoShell(usuarioProp);
  const { irPara } = useNavegacao(onTabChange);

  return (
    <div className="flex min-h-[100dvh] flex-col bg-paper md:flex-row">
      <Sidebar activeTab={activeTab} onTabChange={onTabChange} usuario={usuario} />

      <div className="flex min-h-0 flex-1 flex-col">
        <MobileHeader usuario={usuario} loading={loading} backRoute={backRoute} />

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain md:overflow-visible">
          {children}
        </div>

        <div className="md:hidden">
          <BottomNavMobile activeTab={activeTab} onTabChange={irPara} />
        </div>
      </div>
    </div>
  );
}

/**
 * Casca só-mobile, para telas que já montam a própria árvore de desktop
 * (`/dashboard` mantém um layout desktop próprio enquanto a Fase 5 não unifica).
 */
export function AppShellMobile({
  children,
  activeTab,
  onTabChange,
  usuario: usuarioProp,
  loading = false,
  backRoute,
}: AppShellProps) {
  const { usuario } = useDadosDoShell(usuarioProp);
  const { irPara } = useNavegacao(onTabChange);

  return (
    <div className="fixed inset-0 z-40 flex flex-col bg-paper md:hidden" style={{ height: '100dvh' }}>
      <MobileHeader usuario={usuario} loading={loading} backRoute={backRoute} />
      <div className="flex-1 overflow-y-auto overscroll-contain">{children}</div>
      <BottomNavMobile activeTab={activeTab} onTabChange={irPara} />
    </div>
  );
}

/** Sidebar + conteúdo, só no desktop, para a árvore desktop do `/dashboard`. */
export function AppShellDesktop({
  children,
  activeTab,
  onTabChange,
  usuario: usuarioProp,
}: Omit<AppShellProps, 'backRoute' | 'loading'>) {
  const { usuario } = useDadosDoShell(usuarioProp);

  return (
    <div className="hidden min-h-[calc(100dvh-5rem)] md:flex">
      <Sidebar activeTab={activeTab} onTabChange={onTabChange} usuario={usuario} />
      <main className="min-w-0 flex-1">{children}</main>
    </div>
  );
}
