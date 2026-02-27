'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, Phone } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <div className="flex-shrink-0">
            <Link href="/" className="group flex flex-col">
              <span className="text-2xl font-black text-blue-700 tracking-tight leading-none group-hover:text-blue-800 transition-colors">
                IMÓVEIS
              </span>
              <span className="text-xs font-bold text-gray-500 tracking-[0.2em] leading-none mt-1">
                TABOÃO DA SERRA
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-4 md:gap-8">
            <div className="hidden md:flex space-x-8">
              <Link href="/venda" className="text-gray-600 hover:text-blue-700 font-semibold transition-colors">
                Comprar
              </Link>
              <Link href="/locacao" className="text-gray-600 hover:text-blue-700 font-semibold transition-colors">
                Alugar
              </Link>
            </div>

            <Link
              href="https://wa.me/5511932785602"
              className="bg-blue-600 text-white px-5 py-2 md:px-6 md:py-2.5 rounded-full text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 flex items-center gap-2"
            >
              <Phone size={16} className="md:hidden" />
              <span className="hidden md:inline">Contato</span>
              <span className="md:hidden">Ligar</span>
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-blue-700 transition-colors"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="md:hidden bg-white border-b absolute w-full left-0 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="px-4 py-6 space-y-4">
            <Link
              href="/venda"
              onClick={() => setIsOpen(false)}
              className="block text-lg font-bold text-gray-900 hover:text-blue-700 py-2 border-b border-gray-50"
            >
              Comprar Imóvel
            </Link>
            <Link
              href="/locacao"
              onClick={() => setIsOpen(false)}
              className="block text-lg font-bold text-gray-900 hover:text-blue-700 py-2 border-b border-gray-50"
            >
              Alugar Imóvel
            </Link>
            <Link
              href="/institucional"
              onClick={() => setIsOpen(false)}
              className="block text-lg font-bold text-gray-900 hover:text-blue-700 py-2"
            >
              Sobre Nós
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
