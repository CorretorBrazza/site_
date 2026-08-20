import { Metadata } from 'next';
import { MapPin, Mail, Clock } from 'lucide-react';
import ContactForm from '@/components/ContactForm';

export const metadata: Metadata = {
  title: 'Fale Conosco | Imóveis Taboão da Serra e imediações',
  description: 'Entre em contato com o portal Imóveis Taboão da Serra e imediações. Atendimento via e-mail e formulário de mensagem.',
};

export default function ContatoPage() {
  return (
    <div className="bg-[#0b132b] text-slate-100 min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-950 via-[#0b132b] to-slate-950 border border-slate-800 rounded-3xl p-8 shadow-2xl text-center space-y-3 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-extrabold uppercase tracking-wider">
            <MapPin className="w-4 h-4 text-amber-500 shrink-0" />
            <span>Taboão da Serra e imediações</span>
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Canais de Atendimento
          </h1>
          <p className="text-sm md:text-base text-slate-300 max-w-xl mx-auto font-medium">
            Preencha o formulário abaixo ou envie uma mensagem direta por e-mail. Atendimento ágil e especializado.
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Column 1: Info */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-xl space-y-6">
              <h3 className="text-lg font-bold text-white">Informações de Contato</h3>
              
              <ul className="space-y-4 text-xs sm:text-sm">
                <li className="flex items-start gap-3">
                  <div className="p-2.5 bg-slate-950 rounded-xl text-amber-500 shrink-0 border border-slate-800">
                    <Mail size={20} />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">E-mail de Atendimento & Ouvidoria</span>
                    <a href="mailto:contato@colegacorretor.com.br" className="font-semibold text-white hover:text-amber-400 transition-colors">
                      contato@colegacorretor.com.br
                    </a>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <div className="p-2.5 bg-slate-950 rounded-xl text-amber-500 shrink-0 border border-slate-800">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Empresa Mantenedora</span>
                    <span className="font-semibold text-white block">Colega Corretor Estratégia Imobiliária</span>
                    <span className="text-[11px] text-slate-400">CNPJ: 63.188.894/0001-05</span>
                  </div>
                </li>
              </ul>
            </div>

            <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-xl space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Clock className="text-amber-500" size={20} />
                Horário de Atendimento
              </h3>
              <ul className="space-y-2.5 text-xs font-medium text-slate-300">
                <li className="flex justify-between py-1.5 border-b border-slate-800/80">
                  <span>Segunda a Sexta</span>
                  <span className="font-bold text-white">09:00h às 18:00h</span>
                </li>
                <li className="flex justify-between py-1.5 border-b border-slate-800/80">
                  <span>Sábado</span>
                  <span className="font-bold text-white">09:00h às 13:00h</span>
                </li>
                <li className="flex justify-between py-1.5">
                  <span>Domingo e Feriados</span>
                  <span className="text-amber-400 font-bold">Atendimento via E-mail</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Column 2: Form */}
          <div className="lg:col-span-8">
            <ContactForm />
          </div>
        </div>

      </div>
    </div>
  );
}
