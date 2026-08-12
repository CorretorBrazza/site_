import { MapPin, Phone, Mail, Building2, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[#070b19] text-[#94a3b8] pt-16 pb-10 border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          
          <div className="col-span-1 md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-slate-950 font-black shadow-md">
                <Building2 className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-black text-white tracking-tight">
                Imóveis <span className="text-amber-500">Taboão</span>
              </h3>
            </div>
            
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              O portal de referência para quem busca comprar, alugar ou anunciar imóveis em <strong>Taboão da Serra e imediações</strong>. Inteligência artificial a serviço do mercado imobiliário.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-extrabold uppercase tracking-widest mb-4 text-amber-500">Navegação</h4>
            <ul className="space-y-3 text-slate-300 font-semibold text-sm">
              <li>
                <Link href="/venda" className="hover:text-amber-400 transition-colors">
                  Comprar Imóveis
                </Link>
              </li>
              <li>
                <Link href="/locacao" className="hover:text-amber-400 transition-colors">
                  Alugar Imóveis
                </Link>
              </li>
              <li>
                <Link href="/cadastro" className="hover:text-amber-400 transition-colors flex items-center gap-1.5 text-amber-400">
                  <Sparkles className="w-4 h-4" />
                  <span>Anunciar Imóvel com IA</span>
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-amber-400 transition-colors">
                  Área do Corretor (Login)
                </Link>
              </li>
            </ul>
          </div>

          <div className="col-span-1 md:col-span-1">
            <h4 className="text-xs font-extrabold uppercase tracking-widest mb-4 text-amber-500">Atendimento & Região</h4>
            <ul className="space-y-3 text-slate-300 font-medium text-sm">
              <li className="flex items-start gap-2.5">
                <MapPin size={18} className="text-amber-500 shrink-0 mt-0.5" />
                <span>Taboão da Serra e imediações - SP</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail size={18} className="text-amber-500 shrink-0" />
                <span>contato@imoveistaboao.com.br</span>
              </li>
            </ul>
          </div>

        </div>

        <div className="border-t border-slate-800/80 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-500 text-xs text-center md:text-left">
          <p>&copy; {new Date().getFullYear()} Imóveis Taboão — Taboão da Serra e imediações. Todos os direitos reservados.</p>
          <div className="flex gap-6">
            <Link href="/politica-de-privacidade" className="hover:text-amber-400 transition-colors">Política de Privacidade</Link>
            <Link href="/termos-de-uso" className="hover:text-amber-400 transition-colors">Termos de Uso</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
