import { Metadata } from 'next';
import { Award, Target, Heart, MapPin } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Sobre Nós | Imóveis Taboão da Serra e imediações',
  description: 'Conheça a história dos Imóveis Taboão. Realizando sonhos em Taboão da Serra e imediações com inteligência artificial, transparência e seriedade.',
};

export default function SobreNosPage() {
  return (
    <div className="bg-[#0b132b] text-slate-100 min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-slate-950 via-[#0b132b] to-slate-950 border border-slate-800 rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden text-center space-y-4">
          <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 space-y-4 max-w-3xl mx-auto">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-extrabold uppercase tracking-wider">
              <MapPin className="w-4 h-4 text-amber-500 shrink-0" />
              <span>Taboão da Serra e imediações</span>
            </span>

            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              Mais que imóveis, conectamos você aos seus sonhos em <span className="text-amber-500">Taboão da Serra e imediações</span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 font-medium leading-relaxed">
              O portal Imóveis Taboão nasceu para revolucionar o mercado imobiliário local, combinando atendimento humanizado com o poder da Inteligência Artificial.
            </p>
          </div>
        </section>

        {/* História e Valores */}
        <section className="max-w-4xl mx-auto space-y-8">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-xl space-y-6">
            <h2 className="text-2xl font-black text-white text-center">
              Liderança e Tecnologia no Mercado Imobiliário Local
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-slate-300 text-sm leading-relaxed">
              <p>
                Nos especializamos na geografia e no desenvolvimento de <strong>Taboão da Serra e imediações</strong>. Conhecemos cada bairro e cada empreendimento para entregar a você e ao corretor a melhor experiência de compra, venda e locação.
              </p>
              <p>
                Oferecemos assessoria completa, suporte para financiamentos bancários e ferramentas automatizadas de anúncios com inteligência artificial que poupam tempo e garantem a máxima visibilidade dos imóveis.
              </p>
            </div>
          </div>
        </section>

        {/* Missão, Visão e Valores */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-3 text-center">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-500 flex items-center justify-center mx-auto">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Nossa Missão</h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              Facilitar o acesso à moradia de qualidade em <strong>Taboão da Serra e imediações</strong> através de um portal rápido, desburocratizado e inteligente.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-3 text-center">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-500 flex items-center justify-center mx-auto">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Nossa Visão</h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              Ser o ecossistema imobiliário mais eficiente e respeitado de <strong>Taboão da Serra e imediações</strong>, empoderando compradores e corretores.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-3 text-center">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-500 flex items-center justify-center mx-auto">
              <Heart className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Nossos Valores</h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              Ética, transparência inegociável, inovação contínua e foco total no resultado e satisfação do cliente.
            </p>
          </div>
        </section>

        {/* CTA Final */}
        <section className="text-center space-y-6 pt-4">
          <Link
            href="/venda"
            className="px-8 py-4 bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-400 hover:to-amber-600 text-slate-950 font-black rounded-xl text-xs uppercase tracking-wider shadow-lg inline-block"
          >
            Ver Imóveis em Taboão da Serra e imediações
          </Link>
        </section>

      </div>
    </div>
  );
}
