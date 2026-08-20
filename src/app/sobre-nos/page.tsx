import { Metadata } from 'next';
import { Award, Target, Heart, MapPin, Sparkles, MessageSquare, HardDrive, Cpu, ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Sobre Nós | Imóveis Taboão — Inteligência Artificial para o Mercado Imobiliário',
  description: 'Conheça a história do Imóveis Taboão. Criado de corretor para corretor para eliminar cadastros chatos e revolucionar a divulgação imobiliária em Taboão da Serra e região.',
};

export default function SobreNosPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: 'Sobre o Imóveis Taboão',
    description: 'História, tecnologia e missão da plataforma Imóveis Taboão em Taboão da Serra e região.',
    url: 'https://imoveistaboao.com.br/sobre-nos/',
  };

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen py-16 px-4">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="max-w-5xl mx-auto space-y-16">

        {/* Hero Section */}
        <section className="bg-gradient-to-b from-slate-900 via-blue-950/60 to-slate-950 border border-slate-800 rounded-3xl p-8 sm:p-14 shadow-2xl relative overflow-hidden text-center space-y-6">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-4 max-w-3xl mx-auto">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-black uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-amber-400" />
              Nossa História & Propósito
            </span>

            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              Feito de Corretor para Corretor em <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500">Taboão da Serra e Região</span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 font-normal leading-relaxed">
              Criamos o <strong>Imóveis Taboão</strong> porque os corretores perdiam horas preciosas preenchendo formulários cansativos em portais genéricos. Nossa Inteligência Artificial nasceu para devolver esse tempo de prospecção e fechamento.
            </p>
          </div>
        </section>

        {/* A Origem Real da Ferramenta */}
        <section className="bg-slate-900 border border-slate-800 rounded-3xl p-8 sm:p-12 shadow-xl space-y-6">
          <div className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-amber-400 bg-amber-950/60 border border-amber-800 px-3 py-1 rounded-full">
            💡 Como Tudo Começou
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Menos Digitação, Mais Visitas e Vendas Fechadas
          </h2>

          <div className="space-y-4 text-slate-300 text-sm leading-relaxed font-normal">
            <p>
              Quem vive o dia a dia do mercado imobiliário em Taboão da Serra, Embu das Artes e imediações sabe como a rotina é dinâmica: visitas agendadas, trânsito na Régis Bittencourt e Francisco Morato, fotos tiradas às pressas no celular e dezenas de captações para organizar.
            </p>
            <p>
              O problema? Para anunciar um imóvel, o corretor tinha que sentar no computador, subir foto por foto, digitar descrições repetitivas e formatar posts manualmente para o Instagram e WhatsApp. Isso roubava horas de quem deveria estar na rua atendendo clientes.
            </p>
            <p>
              Decidimos mudar essa realidade integrando a <strong>Meta Cloud API oficial do WhatsApp</strong>, os modelos avançados de <strong>Visão Computacional do Google Gemini</strong> e a velocidade do <strong>Cloudflare R2</strong>. Agora, o corretor manda fotos e áudio/texto bruto no WhatsApp e recebe em 15 segundos um <strong>Media Kit de 5 canais</strong> pronto para divulgar.
            </p>
          </div>
        </section>

        {/* 4 Métricas de Impacto */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl text-center space-y-1 shadow-lg">
            <div className="text-3xl font-black text-amber-400">15s</div>
            <span className="text-xs text-slate-300 font-bold block">Tempo de Processamento</span>
            <span className="text-[10px] text-slate-500">da foto ao Media Kit pronto</span>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl text-center space-y-1 shadow-lg">
            <div className="text-3xl font-black text-emerald-400">365 Dias</div>
            <span className="text-xs text-slate-300 font-bold block">Cofre de Fotos na Nuvem</span>
            <span className="text-[10px] text-slate-500">backup em alta resolução</span>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl text-center space-y-1 shadow-lg">
            <div className="text-3xl font-black text-blue-400">5 Canais</div>
            <span className="text-xs text-slate-300 font-bold block">Conteúdos por Imóvel</span>
            <span className="text-[10px] text-slate-500">Insta, Whats, Stories, Portais, SEO</span>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl text-center space-y-1 shadow-lg">
            <div className="text-3xl font-black text-purple-400">100%</div>
            <span className="text-xs text-slate-300 font-bold block">Foco Regional</span>
            <span className="text-[10px] text-slate-500">Taboão da Serra & Região</span>
          </div>
        </section>

        {/* Pilares Institucionais */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">IA com Curadoria Regional (RAG)</h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              Nossa IA não é genérica: ela conhece os condomínios de Taboão da Serra (Pitangueiras, Parque Firenze, Castanheiras, Bosques), as principais vias e as particularidades da nossa região.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">Soberania do Corretor (Hierarquia 1)</h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              Zero alucinações. Nada vai ao ar sem a revisão e o clique de aprovação do corretor responsável. Se você precisar ajustar qualquer detalhe, a IA atualiza instantaneamente com prioridade máxima.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-600/20 border border-purple-500/30 text-purple-400 flex items-center justify-center">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">Leads Diretos no Seu WhatsApp</h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              Não retemos clientes nem cobramos comissões sobre a sua intermediação. Os botões de contato na página do imóvel direcionam o comprador diretamente para o seu WhatsApp pessoal.
            </p>
          </div>
        </section>

        {/* CTA Final */}
        <section className="bg-gradient-to-r from-blue-950 via-indigo-950 to-slate-900 border border-blue-800/60 rounded-3xl p-10 text-center space-y-6 shadow-2xl">
          <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Pronto para Experimentar o Futuro da Corretagem?
          </h3>
          <p className="text-slate-300 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
            Cadastre-se gratuitamente e ganhe 1 crédito cortesia para processar seu primeiro imóvel no WhatsApp.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="https://wa.me/5511989161897?text=Ol%C3%A1%2C%20quero%20testar%20a%20ferramenta%20de%20IA%20do%20Im%C3%B3veis%20Tabo%C3%A3o"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-2xl shadow-xl transition-all text-xs uppercase tracking-wider flex items-center gap-2"
            >
              <MessageSquare className="w-4 h-4 fill-white" />
              <span>Falar no WhatsApp Oficial (11) 98916-1897</span>
            </a>

            <Link
              href="/demo"
              className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-2xl shadow-xl transition-all text-xs uppercase tracking-wider flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Testar Simulador Demo</span>
            </Link>
          </div>
        </section>

      </div>
    </div>
  );
}
