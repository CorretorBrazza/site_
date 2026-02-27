import { MapPin, Phone, Mail, Instagram, Facebook } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-950 text-white pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-black mb-6 text-white tracking-tight">
              IMÓVEIS <span className="text-blue-500">TABOÃO</span>
            </h3>
            <p className="text-gray-400 text-base leading-relaxed max-w-sm mb-8">
              Sua imobiliária de confiança em Taboão da Serra e região.
              Comprometimento com a transparência e a realização do seu sonho imobiliário.
            </p>
            <div className="flex gap-4">
              <a href="#" className="p-2 bg-gray-900 rounded-lg hover:bg-blue-600 transition-colors text-gray-400 hover:text-white">
                <Instagram size={20} />
              </a>
              <a href="#" className="p-2 bg-gray-900 rounded-lg hover:bg-blue-600 transition-colors text-gray-400 hover:text-white">
                <Facebook size={20} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest mb-6 text-blue-500">Navegação</h4>
            <ul className="space-y-4 text-gray-400 font-medium">
              <li><Link href="/venda" className="hover:text-white transition-colors">Comprar Imóvel</Link></li>
              <li><Link href="/locacao" className="hover:text-white transition-colors">Alugar Imóvel</Link></li>
              <li><Link href="/institucional" className="hover:text-white transition-colors">Sobre Nós</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest mb-6 text-blue-500">Contato</h4>
            <ul className="space-y-4 text-gray-400 font-medium text-sm">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-blue-500 shrink-0" />
                <span>Taboão da Serra, São Paulo - SP</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-blue-500 shrink-0" />
                <span>(11) 93278-5602</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-blue-500 shrink-0" />
                <span>contato@imoveistaboao.com.br</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-900 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-gray-500 text-xs">
          <p>&copy; {new Date().getFullYear()} Imóveis Taboão da Serra. Todos os direitos reservados.</p>
          <div className="flex gap-6">
            <Link href="/privacidade" className="hover:text-white transition-colors">Privacidade</Link>
            <Link href="/termos" className="hover:text-white transition-colors">Termos de Uso</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
