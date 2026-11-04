'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Menu,
  Sparkles,
  LayoutDashboard,
  LogOut,
  User,
  MessageCircle,
} from 'lucide-react';
import { logoutBrokerSession } from '@/lib/api';
import { notificarMudancaDeUsuario, useUsuario } from '@/hooks/useUsuario';
import { Logo } from '@/components/brand/Logo';
import { Button, ButtonLink } from '@/components/ui/button';
import { Sheet } from '@/components/ui/sheet';
import { Container } from '@/components/ui/container';

const NUMERO_WHATSAPP = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '5511989161897').replace(/\D/g, '');

const LINKS = [
  { href: '/venda', label: 'Comprar' },
  { href: '/locacao', label: 'Alugar' },
  { href: '/como-funciona', label: 'Como funciona' },
  { href: '/planos', label: 'Planos' },
] as const;

/**
 * Cabeçalho do site.
 *
 * Substitui o `Navbar` antigo (azul/branco) pela identidade navy + ouro.
 * O menu mobile sai do dropdown "empurrando a página" e passa a ser um drawer
 * com foco preso e ESC, via `Sheet`.
 *
 * A leitura de `user_info` continua igual: o cookie httpOnly é a credencial; o
 * localStorage serve só para a UI não piscar "Entrar" para quem já está logado.
 */
export function SiteHeader() {
  const [menuAberto, setMenuAberto] = useState(false);
  const usuario = useUsuario();
  const router = useRouter();

  const sair = async () => {
    await logoutBrokerSession();
    notificarMudancaDeUsuario();
    setMenuAberto(false);
    router.push('/login');
  };

  const primeiroNome = usuario?.nome?.split(' ')[0] || 'Corretor';

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-surface/95 backdrop-blur-md">
      <Container>
        <div className="flex h-16 items-center justify-between gap-4 sm:h-20">
          <Logo tamanho={38} />

          {/* Navegação desktop */}
          <nav aria-label="Navegação principal" className="hidden items-center gap-1 lg:flex">
            {LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-lg px-3 py-2 text-sm font-bold text-ink/80 hover:bg-ink/5 hover:text-brand-900"
              >
                {link.label}
              </Link>
            ))}

            <Link
              href="/demo"
              className="ml-1 inline-flex items-center gap-1.5 rounded-lg border border-gold-500/40 bg-gold-500/10 px-3 py-2 text-xs font-extrabold text-gold-700 hover:bg-gold-500/20"
            >
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              Testar IA
            </Link>
          </nav>

          {/* Ações desktop */}
          <div className="hidden items-center gap-2 lg:flex">
            {usuario ? (
              <>
                <ButtonLink href="/dashboard" variant="secondary" size="sm">
                  <LayoutDashboard className="h-4 w-4" aria-hidden="true" />
                  Meu painel
                </ButtonLink>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={sair}
                  aria-label="Sair da conta"
                  title="Sair da conta"
                >
                  <LogOut className="h-4 w-4" aria-hidden="true" />
                </Button>
              </>
            ) : (
              <>
                <ButtonLink href="/login" variant="ghost" size="sm">
                  Entrar
                </ButtonLink>
                <ButtonLink href="/login" variant="primary" size="sm">
                  Anunciar imóvel
                </ButtonLink>
              </>
            )}
          </div>

          {/* Ações mobile */}
          <div className="flex items-center gap-2 lg:hidden">
            {usuario ? (
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-1.5 rounded-lg bg-brand-900 px-3 py-2 text-xs font-bold text-white"
              >
                <LayoutDashboard className="h-4 w-4" aria-hidden="true" />
                Painel
              </Link>
            ) : (
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 rounded-lg bg-gold-500 px-3 py-2 text-xs font-extrabold text-brand-950"
              >
                <User className="h-4 w-4" aria-hidden="true" />
                Entrar
              </Link>
            )}

            <button
              type="button"
              onClick={() => setMenuAberto(true)}
              aria-label="Abrir menu"
              aria-expanded={menuAberto}
              className="rounded-lg border border-line bg-surface p-2 text-brand-900 hover:bg-paper"
            >
              <Menu className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </Container>

      <Sheet aberto={menuAberto} aoFechar={() => setMenuAberto(false)} titulo="Menu" lado="right">
        <nav aria-label="Navegação principal (mobile)" className="flex flex-col gap-1">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuAberto(false)}
              className="rounded-xl px-3 py-3 text-base font-bold text-ink hover:bg-paper"
            >
              {link.label}
            </Link>
          ))}

          <Link
            href="/demo"
            onClick={() => setMenuAberto(false)}
            className="mt-1 inline-flex items-center justify-between rounded-xl border border-gold-500/40 bg-gold-500/10 px-3 py-3 text-base font-bold text-gold-700"
          >
            <span>Testar IA (demo)</span>
            <Sparkles className="h-4 w-4" aria-hidden="true" />
          </Link>
        </nav>

        <div className="mt-6 space-y-2 border-t border-line pt-5">
          {usuario ? (
            <>
              <p className="px-1 pb-1 text-xs font-bold uppercase tracking-wider text-muted">
                Olá, {primeiroNome}
              </p>
              <ButtonLink
                href="/dashboard"
                variant="primary"
                size="md"
                className="w-full"
                onClick={() => setMenuAberto(false)}
              >
                <LayoutDashboard className="h-4 w-4" aria-hidden="true" />
                Acessar meu painel
              </ButtonLink>
              <Button variant="outline" size="md" className="w-full" onClick={sair}>
                <LogOut className="h-4 w-4" aria-hidden="true" />
                Encerrar sessão
              </Button>
            </>
          ) : (
            <>
              <ButtonLink
                href="/login"
                variant="primary"
                size="md"
                className="w-full"
                onClick={() => setMenuAberto(false)}
              >
                Entrar / Criar conta
              </ButtonLink>
              <ButtonLink
                href={`https://wa.me/${NUMERO_WHATSAPP}?text=${encodeURIComponent('Olá! Quero anunciar um imóvel no portal.')}`}
                variant="whatsapp"
                size="md"
                className="w-full"
                externo
              >
                <MessageCircle className="h-4 w-4" aria-hidden="true" />
                Falar no WhatsApp
              </ButtonLink>
            </>
          )}
        </div>
      </Sheet>
    </header>
  );
}
