import { Metadata } from 'next';
import { Building2, Award, Users2, Target, Heart, ShieldCheck, Mail, Phone, MapPin } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Sobre Nós | Imóveis Taboão',
  description: 'Conheça a história dos Imóveis Taboão. Há mais de 8 anos realizando o sonho da casa própria em Taboão da Serra e região com transparência e seriedade.',
};

export default function SobreNosPage() {
  return (
    <div className="bg-[#F9FAFB] min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-900 to-indigo-950 text-white py-24 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(59,130,246,0.2),transparent)] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <span className="text-blue-400 font-bold uppercase tracking-widest text-sm bg-blue-500/10 px-4 py-1.5 rounded-full border border-blue-500/20 mb-4 inline-block">
            Nossa História
          </span>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-6 leading-tight">
            Mais que imóveis, conectamos <br />
            <span className="text-blue-400">pessoas aos seus sonhos</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto font-light leading-relaxed">
            Fundada em Taboão da Serra, a Imóveis Taboão nasceu do desejo de trazer transparência, tecnologia e proximidade para as negociações imobiliárias locais.
          </p>
        </div>
      </section>

      {/* Main Content & History */}
      <section className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="space-y-8 text-center md:text-left">
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight text-center">
            Uma trajetória de seriedade e liderança no mercado local
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-gray-600 leading-relaxed text-base text-left">
            <p>
              Desde a nossa fundação em 2018, nos especializamos em entender o comportamento e o desenvolvimento urbano de Taboão da Serra e região adjacente. Identificamos as melhores oportunidades em lançamentos imobiliários de alto padrão, projetos Minha Casa Minha Vida e imóveis prontos.
            </p>
            <p>
              Trabalhamos lado a lado com as principais construtoras do mercado e proprietários independentes, oferecendo assessoria completa desde a primeira visita até a assinatura do contrato e assessoria de financiamento bancário.
            </p>
          </div>
          <div className="border-t border-gray-100 pt-8 flex justify-center gap-16">
            <div className="text-center">
              <p className="text-4xl md:text-5xl font-black text-blue-600">8+ Anos</p>
              <p className="text-sm font-semibold text-gray-500 mt-2">De atuação em Taboão</p>
            </div>
            <div className="text-center">
              <p className="text-4xl md:text-5xl font-black text-blue-600">1.000+</p>
              <p className="text-sm font-semibold text-gray-500 mt-2">Famílias atendidas</p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission, Vision, Values */}
      <section className="bg-gray-100/50 border-y border-gray-200/50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm text-center space-y-4 hover:shadow-md transition-shadow">
              <div className="inline-flex p-3 bg-blue-50 rounded-xl text-blue-600 mb-2">
                <Target size={24} />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Nossa Missão</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Facilitar o acesso à moradia de qualidade por meio de uma assessoria imobiliária honesta, desburocratizada e focada na real necessidade de cada cliente.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm text-center space-y-4 hover:shadow-md transition-shadow">
              <div className="inline-flex p-3 bg-blue-50 rounded-xl text-blue-600 mb-2">
                <Award size={24} />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Nossa Visão</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Ser reconhecida como a imobiliária digital mais recomendada e confiável de Taboão da Serra, inovando em tecnologia sem perder o atendimento humanizado.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm text-center space-y-4 hover:shadow-md transition-shadow">
              <div className="inline-flex p-3 bg-blue-50 rounded-xl text-blue-600 mb-2">
                <Heart size={24} />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Nossos Valores</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Ética inegociável, transparência total em todas as etapas, responsabilidade social e compromisso inabalável com a satisfação do cliente.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team / Call to action */}
      <section className="max-w-7xl mx-auto px-4 py-20 sm:px-6 lg:px-8 text-center space-y-8">
        <div className="max-w-xl mx-auto space-y-4">
          <h2 className="text-3xl font-black text-gray-900">Pronto para encontrar seu imóvel?</h2>
          <p className="text-gray-500">
            Nossa equipe de consultores credenciados pelo CRECI está à disposição para guiar você nessa jornada com total segurança.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/contato"
            className="bg-blue-600 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
          >
            Fale Conosco
          </Link>
          <Link
            href="/venda"
            className="bg-white text-gray-700 border border-gray-200 px-8 py-3.5 rounded-xl font-bold hover:bg-gray-50 transition-colors"
          >
            Ver Imóveis
          </Link>
        </div>
      </section>
    </div>
  );
}
