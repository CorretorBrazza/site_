'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Menu, X, Sparkles, Building2, User, LayoutDashboard, LogOut } from 'lucide-react';
import { logoutBrokerSession } from '@/lib/api';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [usuario, setUsuario] = useState<{ nome?: string; email?: string } | null>(null);
  const router = useRouter();

  useEffect(() => {
      const savedUser = localStorage.getItem('user_info');
      if (savedUser) {
      try {
          setUsuario(JSON.parse(savedUser));
        } catch {
          setUsuario({ nome: 'Corretor' });
        }
      } else {
        setUsuario(null);
      }
  }, []);

    const handleLogout = async () => {
      await logoutBrokerSession();
      setUsuario(null);
      router.push('/login');
    };

  return (
    <nav className="bg-white/95 backdrop-blur-md border-b border-line sticky top-0 z-50 transition-colors shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">

          {/* Logo Principal */}
          <div className="flex-shrink-0">
            <Link href="/" className="group flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-900 via-brand-800 to-brand-800 flex items-center justify-center text-white shadow-md shadow-brand-900/20/20 group-hover:scale-105 transition-transform">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl md:text-2xl font-black text-brand-900 tracking-tight leading-none group-hover:text-brand-800 transition-colors">
                  Imóveis <span className="text-brand-800">Taboão</span>
                </span>
                <span className="text-[10px] font-bold text-muted tracking-wider leading-none mt-1 uppercase">
                  Taboão da Serra e imediações
                </span>
              </div>
            </Link>
          </div>

          {/* Navegação Desktop */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/venda"
              className="text-ink hover:text-brand-800 font-bold text-sm transition-colors py-2"
            >
              Comprar
            </Link>
            <Link
              href="/locacao"
              className="text-ink hover:text-brand-800 font-bold text-sm transition-colors py-2"
            >
              Alugar
            </Link>
            <Link
              href="/como-funciona"
              className="text-ink hover:text-brand-800 font-bold text-sm transition-colors py-2"
            >
              Como Funciona
            </Link>
            <Link
              href="/demo"
              className="text-brand-800 hover:text-brand-800 bg-brand-900/5 hover:bg-brand-900/5 px-3 py-1.5 rounded-lg font-bold text-xs transition-colors flex items-center gap-1 border border-brand-700/30"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Testar IA Demo</span>
            </Link>
            <Link
              href="/planos"
              className="text-ink hover:text-brand-800 font-bold text-sm transition-colors py-2"
            >
              Planos & Preços
            </Link>

            {usuario ? (
              <div className="flex items-center gap-2">
                <Link
                  href="/dashboard"
                  className="bg-brand-900 hover:bg-brand-800 text-white px-5 py-2.5 rounded-xl text-sm font-extrabold transition-all shadow-md shadow-brand-900/20/20 flex items-center gap-2"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Meu Painel ({usuario.nome?.split(' ')[0] || 'Corretor'})</span>
                </Link>
                <button
                  onClick={handleLogout}
                  title="Sair da Conta"
                  className="p-2.5 text-muted hover:text-danger hover:bg-paper rounded-xl transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="bg-brand-900 hover:bg-brand-800 text-white px-6 py-2.5 rounded-xl text-sm font-extrabold transition-all shadow-md shadow-brand-900/20/20 flex items-center gap-2"
              >
                <User className="w-4 h-4" />
                <span>Entrar / Cadastrar-se</span>
              </Link>
            )}
          </div>

          {/* Botão do Menu Mobile */}
          <div className="flex items-center gap-2 md:hidden">
            {usuario ? (
              <Link
                href="/dashboard"
                className="bg-brand-900 text-white px-3 py-2 rounded-xl font-bold text-xs flex items-center gap-1 shadow-sm"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Painel</span>
              </Link>
            ) : (
              <Link
                href="/login"
                className="bg-brand-900 text-white px-3.5 py-2 rounded-xl font-bold text-xs flex items-center gap-1 shadow-sm"
              >
                <User className="w-4 h-4" />
                <span>Entrar</span>
              </Link>
            )}

            <button
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Abrir Menu"
              className="p-2 text-ink hover:text-brand-900 bg-paper hover:bg-line border border-line rounded-xl transition-colors"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Drawer Menu Mobile */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-line absolute w-full left-0 animate-in fade-in slide-in-from-top-4 duration-300 shadow-2xl z-50">
          <div className="px-4 py-6 space-y-3">
            <div className="text-[11px] font-bold text-muted uppercase tracking-widest px-2 mb-1">
              Imóveis em Taboão da Serra e imediações
            </div>

            <Link
              href="/venda"
              onClick={() => setIsOpen(false)}
              className="block text-base font-bold text-ink hover:text-brand-800 py-3 px-3 rounded-xl hover:bg-paper border-b border-line transition-colors"
            >
              🏠 Comprar Imóveis
            </Link>

            <Link
              href="/locacao"
              onClick={() => setIsOpen(false)}
              className="block text-base font-bold text-ink hover:text-brand-800 py-3 px-3 rounded-xl hover:bg-paper border-b border-line transition-colors"
            >
              🔑 Alugar Imóveis
            </Link>

            <Link
              href="/como-funciona"
              onClick={() => setIsOpen(false)}
              className="block text-base font-bold text-ink hover:text-brand-800 py-3 px-3 rounded-xl hover:bg-paper border-b border-line transition-colors"
            >
              💡 Como Funciona
            </Link>

            <Link
              href="/demo"
              onClick={() => setIsOpen(false)}
              className="block text-base font-bold text-brand-800 bg-brand-900/5 py-3 px-3 rounded-xl border-b border-brand-700/30 transition-colors flex items-center justify-between"
            >
              <span>✨ Testar IA Demo (Interativo)</span>
              <Sparkles className="w-4 h-4 text-brand-800" />
            </Link>

            <Link
              href="/planos"
              onClick={() => setIsOpen(false)}
              className="block text-base font-bold text-ink hover:text-brand-800 py-3 px-3 rounded-xl hover:bg-paper border-b border-line transition-colors"
            >
              🏷️ Planos & Preços
            </Link>

            <div className="pt-4">
              {usuario ? (
                <div className="space-y-2">
                  <Link
                    href="/dashboard"
                    onClick={() => setIsOpen(false)}
                    className="w-full bg-brand-900 hover:bg-brand-800 text-white py-3.5 rounded-xl font-black text-center block shadow-lg text-sm uppercase tracking-wider flex items-center justify-center gap-2"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    <span>Acessar Meu Painel ({usuario.nome?.split(' ')[0] || 'Corretor'})</span>
                  </Link>
                  <button
                    onClick={() => { setIsOpen(false); handleLogout(); }}
                    className="w-full bg-paper hover:bg-danger/10 text-ink hover:text-danger py-3 rounded-xl font-bold text-center block text-xs transition-colors"
                  >
                    Encerrar Sessão
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className="w-full bg-brand-900 hover:bg-brand-800 text-white py-3.5 rounded-xl font-black text-center block shadow-lg text-sm uppercase tracking-wider"
                >
                  Entrar / Criar Minha Conta
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
