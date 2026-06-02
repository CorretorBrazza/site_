import { Metadata } from 'next';
import { MapPin, Phone, Mail, Clock, MessageCircle } from 'lucide-react';
import ContactForm from '@/components/ContactForm';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Fale Conosco | Imóveis Taboão',
  description: 'Entre em contato com a Imóveis Taboão. Atendimento especializado via formulário, WhatsApp (11) 93278-5602, e-mail ou visite nossa sede.',
};

export default function ContatoPage() {
  const whatsappUrl = 'https://wa.me/5511932785602?text=Ol%C3%A1!%20Gostaria%20de%20tirar%20algumas%20d%C3%BAvidas%20sobre%20os%20im%C3%B3veis.';

  return (
    <div className="bg-[#F9FAFB] min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-blue-600 font-bold uppercase tracking-widest text-xs bg-blue-50 px-4 py-1.5 rounded-full border border-blue-100 mb-4 inline-block">
            Canais de Atendimento
          </span>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-4">
            Estamos prontos para atender você
          </h1>
          <p className="text-gray-500 max-w-xl mx-auto font-medium">
            Escolha o canal de sua preferência ou preencha o formulário abaixo. Retornaremos em minutos.
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {/* Column 1: Info */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
              <h3 className="text-lg font-bold text-gray-900">Informações de Contato</h3>
              
              <ul className="space-y-4">
                <li className="flex items-start gap-4">
                  <div className="p-2.5 bg-blue-50 rounded-xl text-blue-600 shrink-0 border border-blue-100">
                    <Phone size={20} />
                  </div>
                  <div>
                    <span className="text-xs text-gray-400 font-bold uppercase tracking-wider block">Telefone</span>
                    <span className="font-semibold text-gray-900">(11) 93278-5602</span>
                  </div>
                </li>

                <li className="flex items-start gap-4">
                  <div className="p-2.5 bg-blue-50 rounded-xl text-blue-600 shrink-0 border border-blue-100">
                    <Mail size={20} />
                  </div>
                  <div>
                    <span className="text-xs text-gray-400 font-bold uppercase tracking-wider block">E-mail</span>
                    <span className="font-semibold text-gray-900">contato@imoveistaboao.com.br</span>
                  </div>
                </li>

                <li className="flex items-start gap-4">
                  <div className="p-2.5 bg-blue-50 rounded-xl text-blue-600 shrink-0 border border-blue-100">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <span className="text-xs text-gray-400 font-bold uppercase tracking-wider block">Endereço</span>
                    <span className="font-semibold text-gray-900 text-sm">Taboão da Serra, São Paulo - SP</span>
                  </div>
                </li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Clock className="text-blue-600" size={20} />
                Horário de Funcionamento
              </h3>
              <ul className="space-y-2.5 text-sm font-medium text-gray-600">
                <li className="flex justify-between py-1.5 border-b border-gray-50">
                  <span>Segunda a Sexta</span>
                  <span className="font-bold text-gray-900">09:00h às 18:00h</span>
                </li>
                <li className="flex justify-between py-1.5 border-b border-gray-50">
                  <span>Sábado</span>
                  <span className="font-bold text-gray-900">09:00h às 13:00h</span>
                </li>
                <li className="flex justify-between py-1.5">
                  <span>Domingo e Feriados</span>
                  <span className="text-blue-600 font-bold">Apenas Plantão Online</span>
                </li>
              </ul>
            </div>

            <div className="bg-green-600 text-white p-6 rounded-2xl shadow-xl shadow-green-100 space-y-4">
              <h3 className="text-lg font-bold">Atendimento via WhatsApp</h3>
              <p className="text-green-100 text-sm leading-relaxed">
                Quer falar direto com um corretor agora mesmo? Clique abaixo para iniciar uma conversa.
              </p>
              <Link
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-white text-green-700 py-3 rounded-xl font-bold transition-all hover:bg-green-50 flex items-center justify-center gap-2"
              >
                <MessageCircle size={18} />
                Iniciar Conversa
              </Link>
            </div>
          </div>

          {/* Column 2: Form */}
          <div className="lg:col-span-2">
            <ContactForm />
          </div>
        </div>

        {/* Map Section */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden p-3">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3655.0747444141695!2d-46.7915569!3d-23.6375084!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce542bbf06294b%3A0x6b6c00d436cfba2!2sShopping%20Tabo%C3%A3o!5e0!3m2!1spt-BR!2sbr!4v1700000000000!5m2!1spt-BR!2sbr"
            width="100%"
            height="450"
            style={{ border: 0, borderRadius: '1.25rem' }}
            allowFullScreen={true}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Localização do Shopping Taboão - Ponto de Referência"
          ></iframe>
        </div>
      </div>
    </div>
  );
}
