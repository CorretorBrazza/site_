'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, Phone, MessageCircle } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-[#faf9f6]/95 backdrop-blur-md border-b border-black/5 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <div className="flex-shrink-0">
            <Link href="/" className="group flex flex-col">
              <span className="text-2xl font-black text-primary tracking-tight leading-none group-hover:text-accent transition-colors font-serif italic">
                Imóveis
              </span>
              <span className="text-[10px] font-bold text-slate-400 tracking-[0.25em] leading-none mt-1 uppercase">
                Taboão da Serra
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-4 md:gap-8">
            <div className="hidden md:flex space-x-8">
              <Link href="/#empreendimentos" className="text-slate-600 hover:text-accent font-medium text-sm transition-colors">
                Empreendimentos
              </Link>
              <Link href="/venda" className="text-slate-600 hover:text-accent font-medium text-sm transition-colors">
                Imóveis Prontos
              </Link>
              <Link href="/locacao" className="text-slate-600 hover:text-accent font-medium text-sm transition-colors">
                Locação
              </Link>
              <Link href="/sobre-nos" className="text-slate-600 hover:text-accent font-medium text-sm transition-colors">
                Sobre Nós
              </Link>
            </div>

            <Link
              href="/contato"
              className="bg-accent hover:bg-accent-hover text-white px-5 py-2 md:px-6 md:py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm shadow-accent/15 flex items-center gap-2"
            >
              <MessageCircle size={16} className="md:hidden" />
              <span>Contato</span>
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 text-slate-600 hover:text-accent transition-colors"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="md:hidden bg-[#faf9f6] border-b border-black/5 absolute w-full left-0 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="px-4 py-6 space-y-3">
            <Link
              href="/#empreendimentos"
              onClick={() => setIsOpen(false)}
              className="block text-base font-semibold text-primary hover:text-accent py-2 border-b border-black/5"
            >
              Empreendimentos
            </Link>
            <Link
              href="/venda"
              onClick={() => setIsOpen(false)}
              className="block text-base font-semibold text-primary hover:text-accent py-2 border-b border-black/5"
            >
              Imóveis Prontos
            </Link>
            <Link
              href="/locacao"
              onClick={() => setIsOpen(false)}
              className="block text-base font-semibold text-primary hover:text-accent py-2 border-b border-black/5"
            >
              Locação
            </Link>
            <Link
              href="/sobre-nos"
              onClick={() => setIsOpen(false)}
              className="block text-base font-semibold text-primary hover:text-accent py-2 border-b border-black/5"
            >
              Sobre Nós
            </Link>
            <Link
              href="/contato"
              onClick={() => setIsOpen(false)}
              className="block text-base font-semibold text-primary hover:text-accent py-2"
            >
              Contato
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
