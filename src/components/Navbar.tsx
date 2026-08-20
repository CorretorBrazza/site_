'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Menu, X, Sparkles, Building2, User, LayoutDashboard, LogOut } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [usuario, setUsuario] = useState<{ nome?: string; email?: string } | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    const savedUser = localStorage.getItem('user_info');
    if (token && savedUser) {
      try {
        setUsuario(JSON.parse(savedUser));
      } catch {
        setUsuario({ nome: 'Corretor' });
      }
    } else if (token) {
      setUsuario({ nome: 'Corretor' });
    } else {
      setUsuario(null);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_info');
    document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    setUsuario(null);
    router.push('/login');
  };

  return (
    <nav className="bg-white/95 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50 transition-colors shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">

          {/* Logo Principal */}
          <div className="flex-shrink-0">
            <Link href="/" className="group flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 flex items-center justify-center text-white shadow-md shadow-blue-600/20 group-hover:scale-105 transition-transform">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl md:text-2xl font-black text-slate-900 tracking-tight leading-none group-hover:text-blue-600 transition-colors">
                  Imóveis <span className="text-blue-600">Taboão</span>
                </span>
                <span className="text-[10px] font-bold text-slate-500 tracking-wider leading-none mt-1 uppercase">
                  Taboão da Serra e imediações
                </span>
              </div>
            </Link>
          </div>

          {/* Navegação Desktop */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/venda"
              className="text-slate-700 hover:text-blue-600 font-bold text-sm transition-colors py-2"
            >
              Comprar
            </Link>
            <Link
              href="/locacao"
              className="text-slate-700 hover:text-blue-600 font-bold text-sm transition-colors py-2"
            >
              Alugar
            </Link>
            <Link
              href="/como-funciona"
              className="text-slate-700 hover:text-blue-600 font-bold text-sm transition-colors py-2"
            >
              Como Funciona
            </Link>
            <Link
              href="/demo"
              className="text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg font-bold text-xs transition-colors flex items-center gap-1 border border-blue-200"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Testar IA Demo</span>
            </Link>
            <Link
              href="/planos"
              className="text-slate-700 hover:text-blue-600 font-bold text-sm transition-colors py-2"
            >
              Planos & Preços
            </Link>

            {usuario ? (
              <div className="flex items-center gap-2">
                <Link
                  href="/dashboard"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-extrabold transition-all shadow-md shadow-blue-600/20 flex items-center gap-2"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Meu Painel ({usuario.nome?.split(' ')[0] || 'Corretor'})</span>
                </Link>
                <button
                  onClick={handleLogout}
                  title="Sair da Conta"
                  className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl text-sm font-extrabold transition-all shadow-md shadow-blue-600/20 flex items-center gap-2"
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
                className="bg-blue-600 text-white px-3 py-2 rounded-xl font-bold text-xs flex items-center gap-1 shadow-sm"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Painel</span>
              </Link>
            ) : (
              <Link
                href="/login"
                className="bg-blue-600 text-white px-3.5 py-2 rounded-xl font-bold text-xs flex items-center gap-1 shadow-sm"
              >
                <User className="w-4 h-4" />
                <span>Entrar</span>
              </Link>
            )}

            <button
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Abrir Menu"
              className="p-2 text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl transition-colors"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Drawer Menu Mobile */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 absolute w-full left-0 animate-in fade-in slide-in-from-top-4 duration-300 shadow-2xl z-50">
          <div className="px-4 py-6 space-y-3">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-2 mb-1">
              Imóveis em Taboão da Serra e imediações
            </div>

            <Link
              href="/venda"
              onClick={() => setIsOpen(false)}
              className="block text-base font-bold text-slate-800 hover:text-blue-600 py-3 px-3 rounded-xl hover:bg-slate-50 border-b border-slate-100 transition-colors"
            >
              🏠 Comprar Imóveis
            </Link>

            <Link
              href="/locacao"
              onClick={() => setIsOpen(false)}
              className="block text-base font-bold text-slate-800 hover:text-blue-600 py-3 px-3 rounded-xl hover:bg-slate-50 border-b border-slate-100 transition-colors"
            >
              🔑 Alugar Imóveis
            </Link>

            <Link
              href="/como-funciona"
              onClick={() => setIsOpen(false)}
              className="block text-base font-bold text-slate-800 hover:text-blue-600 py-3 px-3 rounded-xl hover:bg-slate-50 border-b border-slate-100 transition-colors"
            >
              💡 Como Funciona
            </Link>

            <Link
              href="/demo"
              onClick={() => setIsOpen(false)}
              className="block text-base font-bold text-blue-600 bg-blue-50 py-3 px-3 rounded-xl border-b border-blue-100 transition-colors flex items-center justify-between"
            >
              <span>✨ Testar IA Demo (Interativo)</span>
              <Sparkles className="w-4 h-4 text-blue-600" />
            </Link>

            <Link
              href="/planos"
              onClick={() => setIsOpen(false)}
              className="block text-base font-bold text-slate-800 hover:text-blue-600 py-3 px-3 rounded-xl hover:bg-slate-50 border-b border-slate-100 transition-colors"
            >
              🏷️ Planos & Preços
            </Link>

            <div className="pt-4">
              {usuario ? (
                <div className="space-y-2">
                  <Link
                    href="/dashboard"
                    onClick={() => setIsOpen(false)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl font-black text-center block shadow-lg text-sm uppercase tracking-wider flex items-center justify-center gap-2"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    <span>Acessar Meu Painel ({usuario.nome?.split(' ')[0] || 'Corretor'})</span>
                  </Link>
                  <button
                    onClick={() => { setIsOpen(false); handleLogout(); }}
                    className="w-full bg-slate-100 hover:bg-red-50 text-slate-700 hover:text-red-600 py-3 rounded-xl font-bold text-center block text-xs transition-colors"
                  >
                    Encerrar Sessão
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl font-black text-center block shadow-lg text-sm uppercase tracking-wider"
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
