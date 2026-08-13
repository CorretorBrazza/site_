'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, Sparkles, Building2, User } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-[#0b132b]/95 backdrop-blur-md border-b border-slate-800/80 sticky top-0 z-50 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">

          {/* Logo Principal com Monograma Dourado */}
          <div className="flex-shrink-0">
            <Link href="/" className="group flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700 flex items-center justify-center text-white shadow-lg shadow-amber-600/20 group-hover:scale-105 transition-transform">
                <Building2 className="w-6 h-6 text-slate-950" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl md:text-2xl font-black text-white tracking-tight leading-none group-hover:text-amber-400 transition-colors">
                  Imóveis <span className="text-amber-500">Taboão</span>
                </span>
                <span className="text-[10px] font-bold text-amber-500/90 tracking-wider leading-none mt-1 uppercase">
                  Taboão da Serra e imediações
                </span>
              </div>
            </Link>
          </div>

          {/* Navegação Desktop (Sem Empreendimentos e Sem Blog) */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/venda"
              className="text-slate-300 hover:text-amber-400 font-semibold text-sm transition-colors py-2"
            >
              Comprar
            </Link>
            <Link
              href="/locacao"
              className="text-slate-300 hover:text-amber-400 font-semibold text-sm transition-colors py-2"
            >
              Alugar
            </Link>
            <Link
              href="/planos"
              className="text-slate-300 hover:text-amber-400 font-semibold text-sm transition-colors py-2"
            >
              Planos & Preços
            </Link>
            <Link
              href="/cadastro"
              className="text-slate-300 hover:text-amber-400 font-semibold text-sm transition-colors py-2 flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Anunciar Imóvel</span>
            </Link>
            <Link
              href="/login"
              className="bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-400 hover:to-amber-600 text-slate-950 px-6 py-2.5 rounded-xl text-sm font-extrabold transition-all shadow-md shadow-amber-600/20 flex items-center gap-2"
            >
              <User className="w-4 h-4" />
              <span>Entrar / Cadastrar-se</span>
            </Link>
          </div>

          {/* Botão do Menu Mobile (Mobile First) */}
          <div className="flex items-center gap-2 md:hidden">
            <Link
              href="/login"
              className="bg-amber-500 text-slate-950 p-2.5 rounded-xl font-bold text-xs flex items-center gap-1"
            >
              <User className="w-4 h-4" />
              <span>Entrar</span>
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Abrir Menu"
              className="p-2.5 text-slate-300 hover:text-white bg-slate-900 border border-slate-800 rounded-xl transition-colors"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Drawer Menu Mobile Completo */}
      {isOpen && (
        <div className="md:hidden bg-slate-950 border-b border-slate-800 absolute w-full left-0 animate-in fade-in slide-in-from-top-4 duration-300 shadow-2xl z-50">
          <div className="px-4 py-6 space-y-3">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-widest px-2 mb-1">
              Imóveis em Taboão da Serra e imediações
            </div>

            <Link
              href="/venda"
              onClick={() => setIsOpen(false)}
              className="block text-base font-bold text-slate-200 hover:text-amber-400 py-3 px-3 rounded-xl hover:bg-slate-900 border-b border-slate-900 transition-colors"
            >
              🏠 Comprar Imóveis
            </Link>

            <Link
              href="/locacao"
              onClick={() => setIsOpen(false)}
              className="block text-base font-bold text-slate-200 hover:text-amber-400 py-3 px-3 rounded-xl hover:bg-slate-900 border-b border-slate-900 transition-colors"
            >
              🔑 Alugar Imóveis
            </Link>

            <Link
              href="/planos"
              onClick={() => setIsOpen(false)}
              className="block text-base font-bold text-slate-200 hover:text-amber-400 py-3 px-3 rounded-xl hover:bg-slate-900 border-b border-slate-900 transition-colors"
            >
              🏷️ Planos & Preços
            </Link>

            <Link
              href="/cadastro"
              onClick={() => setIsOpen(false)}
              className="block text-base font-bold text-slate-200 hover:text-amber-400 py-3 px-3 rounded-xl hover:bg-slate-900 border-b border-slate-900 transition-colors flex items-center justify-between"
            >
              <span>✨ Anunciar Imóvel com IA</span>
              <span className="bg-amber-500/20 text-amber-400 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-amber-500/30">
                1 Crédito Grátis
              </span>
            </Link>

            <div className="pt-4">
              <Link
                href="/login"
                onClick={() => setIsOpen(false)}
                className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 py-3.5 rounded-xl font-black text-center block shadow-lg text-sm uppercase tracking-wider"
              >
                Entrar / Criar Minha Conta
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
