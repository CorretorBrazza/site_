import Link from 'next/link';
import { Building2, Search, Sparkles, MapPin, CheckCircle2, ArrowRight, Home as HomeIcon, Key, ShieldCheck, Zap } from 'lucide-react';
import { getImoveis } from '@/app/actions/imovel-server-actions';
import CardImovel from '@/components/CardImovel';
import { processarEOrdenarImoveis } from '@/utils/imovelSorting';
import HomeLiveSection from '@/components/HomeLiveSection';

export default async function Home() {
  const allImoveis = await getImoveis();
  const imoveisAtivos = allImoveis.filter(i => i.status === 'Ativo');
  const destaques = processarEOrdenarImoveis(imoveisAtivos).slice(0, 6);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateAgent',
    'name': 'Imóveis Taboão da Serra e imediações',
    'image': 'https://imoveistaboao.com.br/favicon.ico',
    '@id': 'https://imoveistaboao.com.br',
    'url': 'https://imoveistaboao.com.br',
    'telephone': '+5511932785602',
    'address': {
      '@type': 'PostalAddress',
      'streetAddress': 'Taboão da Serra e imediações',
      'addressLocality': 'Taboão da Serra',
      'addressRegion': 'SP',
      'postalCode': '06750-000',
      'addressCountry': 'BR'
    },
    'geo': {
      '@type': 'GeoCoordinates',
      'latitude': -23.6247,
      'longitude': -46.7885
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero Section — Clean Light Real Estate */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden py-16 px-4 bg-gradient-to-b from-blue-50/50 via-slate-50 to-slate-50">
        
        <div className="relative z-10 max-w-5xl mx-auto w-full text-center space-y-6">

          {/* Badge de Localização Oficial */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs md:text-sm font-extrabold uppercase tracking-wider shadow-xs">
            <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
            <span>Imóveis em Taboão da Serra e imediações</span>
          </div>

          {/* Título Principal */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight max-w-4xl mx-auto">
            Encontre o Imóvel dos seus Sonhos em <span className="text-blue-600">Taboão da Serra e imediações</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto font-medium leading-relaxed px-2">
            Casas, apartamentos e sobrados selecionados com transparência, segurança jurídica e publicação rápida com Inteligência Artificial.
          </p>

          {/* Widget de Busca Responsivo — Clean White Card */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 md:p-8 shadow-xl max-w-4xl mx-auto text-left mt-8">
            <form action="/venda" method="GET" className="space-y-5">
              
              {/* Abas Comprar / Alugar */}
              <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200 w-full sm:w-fit">
                <a
                  href="/venda"
                  className="flex-1 sm:flex-initial px-6 py-2.5 text-xs md:text-sm font-extrabold rounded-xl bg-blue-600 text-white shadow-sm text-center flex items-center justify-center gap-2"
                >
                  <HomeIcon className="w-4 h-4" />
                  Comprar
                </a>
                <a
                  href="/locacao"
                  className="flex-1 sm:flex-initial px-6 py-2.5 text-xs md:text-sm font-bold rounded-xl text-slate-600 hover:text-slate-900 text-center flex items-center justify-center gap-2 transition-colors"
                >
                  <Key className="w-4 h-4" />
                  Alugar
                </a>
              </div>

              {/* Grid dos Filtros de Busca */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3.5">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">Localização</label>
                  <input
                    type="text"
                    name="bairro"
                    defaultValue="Taboão da Serra e imediações"
                    placeholder="Bairro ou região"
                    className="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-300 rounded-xl px-3.5 py-3 text-xs md:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">Tipo de Imóvel</label>
                  <select
                    name="tipo"
                    className="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-300 rounded-xl px-3.5 py-3 text-xs md:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  >
                    <option value="">Todos os Tipos</option>
                    <option value="Apartamento">Apartamento</option>
                    <option value="Sobrado">Sobrado / Casa</option>
                    <option value="Terreno">Terreno</option>
                    <option value="Comercial">Comercial</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">Preço Máximo</label>
                  <select
                    name="precoMax"
                    className="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-300 rounded-xl px-3.5 py-3 text-xs md:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  >
                    <option value="">Sem limite de preço</option>
                    <option value="300000">Até R$ 300 mil</option>
                    <option value="500000">Até R$ 500 mil</option>
                    <option value="800000">Até R$ 800 mil</option>
                    <option value="1200000">Até R$ 1,2 milhão</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">Dormitórios</label>
                  <select
                    name="quartos"
                    className="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-300 rounded-xl px-3.5 py-3 text-xs md:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  >
                    <option value="">Qualquer quantidade</option>
                    <option value="1">1+ Quartos</option>
                    <option value="2">2+ Quartos</option>
                    <option value="3">3+ Quartos</option>
                  </select>
                </div>
              </div>

              {/* Botão de Busca Azul Royal */}
              <button
                type="submit"
                className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-xl shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2 text-sm uppercase tracking-wider"
              >
                <Search className="w-5 h-5" />
                <span>Buscar Imóveis em Taboão da Serra e imediações</span>
              </button>
            </form>
          </div>

        </div>
      </section>

      {/* Vitrine de Imóveis em Destaque */}
      <section className="py-16 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-blue-600 font-extrabold uppercase tracking-widest text-xs block mb-1">
                Seleção Exclusiva
              </span>
              <h2 className="text-2xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
                Novos Anúncios em Taboão da Serra e imediações
              </h2>
            </div>
            <Link
              href="/venda"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-bold text-sm transition-colors"
            >
              <span>Ver todos os imóveis</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <HomeLiveSection initialImoveis={allImoveis} />
        </div>
      </section>

      {/* Flagship Section Para Corretores — Alto Impacto SaaS */}
      <section className="py-20 px-4 bg-gradient-to-b from-slate-950 via-blue-950/60 to-slate-950 text-white border-t border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto space-y-12 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-black uppercase tracking-wider border border-blue-400/30">
              <Sparkles className="w-4 h-4 text-amber-400" />
              Tecnologia de Inteligência Artificial para Corretores
            </span>

            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              Publique Imóveis em 3 Minutos Sem Digitar Nada. <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500">Nossa IA Analisa suas Fotos e Escreve o Anúncio.</span>
            </h2>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
              <strong>1 crédito grátis para testar.</strong> Envie fotos e descrição solta pelo WhatsApp oficial. A IA gera seu Media Kit completo para 5 canais e faz o backup de fotos em alta na nuvem por 1 ano.
            </p>
          </div>

          {/* 3 Pilares Visuais */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-3 hover:border-slate-700 transition-all shadow-xl">
              <div className="w-12 h-12 rounded-2xl bg-emerald-950 border border-emerald-800 text-emerald-400 flex items-center justify-center font-black">
                📸
              </div>
              <h3 className="text-lg font-black text-white">Envio Direto pelo WhatsApp</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Esqueça formulários lentos. Mande até 20 fotos e o texto bruto no número oficial <strong>(11) 98916-1897</strong>.
              </p>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-3 hover:border-slate-700 transition-all shadow-xl">
              <div className="w-12 h-12 rounded-2xl bg-purple-950 border border-purple-800 text-purple-400 flex items-center justify-center font-black">
                🤖
              </div>
              <h3 className="text-lg font-black text-white">Visão Computacional & RAG</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                A IA identifica acabamentos, armários, sacadas e reconhece condomínios de Taboão e Embu sem alucinações.
              </p>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-3 hover:border-slate-700 transition-all shadow-xl">
              <div className="w-12 h-12 rounded-2xl bg-amber-950 border border-amber-800 text-amber-400 flex items-center justify-center font-black">
                ☁️
              </div>
              <h3 className="text-lg font-black text-white">Cofre de Fotos por 365 Dias</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Libere memória no celular! Baixe suas fotos em alta resolução no seu acervo seguro a qualquer momento.
              </p>
            </div>
          </div>

          {/* Ações e Social Proof */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center space-y-6 shadow-2xl">
            <div className="flex flex-wrap justify-center items-center gap-4">
              <a
                href="https://wa.me/5511989161897?text=Ol%C3%A1%2C%20quero%20ativar%20meu%20cr%C3%A9dito%20gr%C3%A1tis%20de%20Media%20Kit"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-2xl shadow-xl transition-all text-xs uppercase tracking-wider flex items-center gap-2"
              >
                <span>🚀 Quero Meu Crédito Grátis no WhatsApp</span>
              </a>

              <Link
                href="/demo"
                className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-2xl shadow-xl transition-all text-xs uppercase tracking-wider flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Testar Simulador Demo</span>
              </Link>

              <Link
                href="/como-funciona"
                className="px-8 py-4 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-2xl border border-slate-700 transition-all text-xs flex items-center gap-2"
              >
                <span>Ver Como Funciona</span>
                <ArrowRight className="w-4 h-4 text-amber-400" />
              </Link>
            </div>

            <div className="text-xs text-slate-400 flex items-center justify-center gap-2 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Ferramenta oficial criada sob medida para corretores e imobiliárias de Taboão da Serra e região.</span>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
