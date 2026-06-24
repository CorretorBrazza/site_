import { MapPin, Phone, Mail } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[#0b0f19] text-[#94a3b8] pt-20 pb-10 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-black mb-6 text-white tracking-tight font-serif italic">
              Imóveis <span className="text-accent">Taboão</span>
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm mb-8">
              Sua imobiliária de confiança em Taboão da Serra e região.
              Comprometimento com a transparência e a realização do seu sonho imobiliário.
            </p>
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest mb-6 text-white">Navegação</h4>
            <ul className="space-y-4 text-slate-400 font-medium text-sm">
              <li><Link href="/#empreendimentos" className="hover:text-accent transition-colors">Imóveis em Construção</Link></li>
              <li><Link href="/venda" className="hover:text-accent transition-colors">Imóveis Prontos</Link></li>
              <li><Link href="/locacao" className="hover:text-accent transition-colors">Locação</Link></li>
              <li><Link href="/sobre-nos" className="hover:text-accent transition-colors">Sobre Nós</Link></li>
            </ul>
          </div>

          <div className="col-span-1 md:col-span-1">
            <h4 className="text-xs font-bold uppercase tracking-widest mb-6 text-white">Contato</h4>
            <ul className="space-y-4 text-slate-400 font-medium text-sm">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-accent shrink-0" />
                <span>Taboão da Serra, São Paulo - SP</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-accent shrink-0" />
                <span>(11) 93278-5602</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-accent shrink-0" />
                <span>contato@imoveistaboao.com.br</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-500 text-xs">
          <p>&copy; {new Date().getFullYear()} Imóveis Taboão da Serra. Todos os direitos reservados.</p>
          <div className="flex gap-6">
            <Link href="/politica-de-privacidade" className="hover:text-accent transition-colors">Privacidade</Link>
            <Link href="/termos-de-uso" className="hover:text-accent transition-colors">Termos de Uso</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
