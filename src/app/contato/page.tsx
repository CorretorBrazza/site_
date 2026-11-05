import { Metadata } from 'next';
import { MapPin, Mail, Clock } from 'lucide-react';
import ContactForm from '@/components/ContactForm';
import ContactButton from '@/components/ContactButton';

export const metadata: Metadata = {
  title: 'Fale Conosco | Imóveis Taboão da Serra e imediações',
  description: 'Entre em contato com o portal Imóveis Taboão da Serra e imediações. Atendimento via e-mail e formulário de mensagem.',
};

export default function ContatoPage() {
  return (
    <div className="bg-[#0b132b] text-white min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-brand-950 via-[#0b132b] to-brand-950 border border-brand-700 rounded-3xl p-8 shadow-2xl text-center space-y-3 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-gold/10 rounded-full blur-3xl pointer-events-none" />
          
          <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gold/10 border border-gold/50/30 text-gold text-xs font-extrabold uppercase tracking-wider">
            <MapPin className="w-4 h-4 text-gold shrink-0" />
            <span>Taboão da Serra e imediações</span>
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Canais de Atendimento
          </h1>
          <p className="text-sm md:text-base text-muted-80 max-w-xl mx-auto font-medium">
            Preencha o formulário abaixo ou envie uma mensagem direta por e-mail. Atendimento ágil e especializado.
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Column 1: Info */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-brand-900 p-6 rounded-3xl border border-brand-700 shadow-xl space-y-6">
              <h3 className="text-lg font-bold text-white">Informações de Contato</h3>
              
              <ul className="space-y-4 text-xs sm:text-sm">
                <li className="flex items-start gap-3">
                  <div className="p-2.5 bg-brand-950 rounded-xl text-gold shrink-0 border border-brand-700">
                    <Mail size={20} />
                  </div>
                  <div>
                    <span className="text-[10px] text-muted font-bold uppercase tracking-wider block">E-mail de Atendimento & Ouvidoria</span>
                    <ContactButton className="font-semibold text-white hover:text-gold transition-colors">
                      Contato
                    </ContactButton>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <div className="p-2.5 bg-brand-950 rounded-xl text-gold shrink-0 border border-brand-700">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <span className="text-[10px] text-muted font-bold uppercase tracking-wider block">Empresa Mantenedora</span>
                    <span className="font-semibold text-white block">Colega Corretor Estratégia Imobiliária</span>
                    <span className="text-[11px] text-muted">CNPJ: 63.188.894/0001-05</span>
                  </div>
                </li>
              </ul>
            </div>

            <div className="bg-brand-900 p-6 rounded-3xl border border-brand-700 shadow-xl space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Clock className="text-gold" size={20} />
                Horário de Atendimento
              </h3>
              <ul className="space-y-2.5 text-xs font-medium text-muted-80">
                <li className="flex justify-between py-1.5 border-b border-brand-700/80">
                  <span>Segunda a Sexta</span>
                  <span className="font-bold text-white">09:00h às 18:00h</span>
                </li>
                <li className="flex justify-between py-1.5 border-b border-brand-700/80">
                  <span>Sábado</span>
                  <span className="font-bold text-white">09:00h às 13:00h</span>
                </li>
                <li className="flex justify-between py-1.5">
                  <span>Domingo e Feriados</span>
                  <span className="text-gold font-bold">Atendimento via E-mail</span>
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
