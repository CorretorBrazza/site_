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
    <div className="flex flex-col min-h-screen bg-[#0b132b] text-slate-100">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero Section — Mobile First & Identidade Escura de Luxo com Dourado */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden py-12 px-4">
        {/* Imagem de Fundo com Overlay Escuro de Luxo */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=2000"
            alt="Imóveis em Taboão da Serra e imediações"
            className="w-full h-full object-cover opacity-25 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0b132b]/90 via-[#0b132b]/95 to-[#0b132b]" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto w-full text-center space-y-6">

          {/* Badge de Localização Oficial */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs md:text-sm font-extrabold uppercase tracking-wider shadow-md">
            <MapPin className="w-4 h-4 text-amber-500 shrink-0" />
            <span>Imóveis em Taboão da Serra e imediações</span>
          </div>

          {/* Título Principal */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-tight max-w-4xl mx-auto">
            Encontre o Imóvel dos seus Sonhos em <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-500 to-amber-300">Taboão da Serra e imediações</span>
          </h1>

          <p className="text-sm sm:text-lg text-slate-300 max-w-2xl mx-auto font-medium leading-relaxed px-2">
            Casas, apartamentos e sobrados selecionados com transparência, segurança jurídica e publicação via Inteligência Artificial.
          </p>

          {/* Widget de Busca Responsivo — Mobile First */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 md:p-6 shadow-2xl backdrop-blur-md max-w-4xl mx-auto text-left mt-6">
            <form action="/venda" method="GET" className="space-y-4">
              
              {/* Abas Comprar / Alugar */}
              <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800/80 w-full sm:w-fit">
                <a
                  href="/venda"
                  className="flex-1 sm:flex-initial px-6 py-2 text-xs md:text-sm font-extrabold rounded-lg bg-amber-500 text-slate-950 shadow-md text-center flex items-center justify-center gap-1.5"
                >
                  <HomeIcon className="w-4 h-4" />
                  Comprar
                </a>
                <a
                  href="/locacao"
                  className="flex-1 sm:flex-initial px-6 py-2 text-xs md:text-sm font-extrabold rounded-lg text-slate-400 hover:text-white text-center flex items-center justify-center gap-1.5"
                >
                  <Key className="w-4 h-4" />
                  Alugar
                </a>
              </div>

              {/* Grid dos Filtros de Busca */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Localização</label>
                  <input
                    type="text"
                    name="bairro"
                    defaultValue="Taboão da Serra e imediações"
                    placeholder="Bairro ou região"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-3 text-xs md:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Tipo de Imóvel</label>
                  <select
                    name="tipo"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-3 text-xs md:text-sm text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="">Todos os Tipos</option>
                    <option value="Apartamento">Apartamento</option>
                    <option value="Sobrado">Sobrado / Casa</option>
                    <option value="Terreno">Terreno</option>
                    <option value="Comercial">Comercial</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Preço Máximo</label>
                  <select
                    name="precoMax"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-3 text-xs md:text-sm text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="">Sem limite de preço</option>
                    <option value="300000">Até R$ 300 mil</option>
                    <option value="500000">Até R$ 500 mil</option>
                    <option value="800000">Até R$ 800 mil</option>
                    <option value="1200000">Até R$ 1,2 milhão</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Dormitórios</label>
                  <select
                    name="quartos"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-3 text-xs md:text-sm text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="">Qualquer quantidade</option>
                    <option value="1">1+ Quartos</option>
                    <option value="2">2+ Quartos</option>
                    <option value="3">3+ Quartos</option>
                  </select>
                </div>
              </div>

              {/* Botão de Busca Dourado */}
              <button
                type="submit"
                className="w-full py-4 bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-400 hover:to-amber-600 text-slate-950 font-black rounded-xl shadow-xl shadow-amber-600/20 transition-all flex items-center justify-center gap-2 text-sm uppercase tracking-wider"
              >
                <Search className="w-5 h-5" />
                <span>Buscar Imóveis em Taboão da Serra e imediações</span>
              </button>
            </form>
          </div>

        </div>
      </section>

      {/* Vitrine de Imóveis em Destaque */}
      <section className="py-16 bg-[#070b19] border-t border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-amber-500 font-extrabold uppercase tracking-widest text-xs block mb-1">
                Seleção Exclusiva
              </span>
              <h2 className="text-2xl md:text-4xl font-black text-white tracking-tight">
                Novos Anúncios em Taboão da Serra e imediações
              </h2>
            </div>
            <Link
              href="/venda"
              className="inline-flex items-center gap-2 text-amber-400 hover:text-amber-300 font-bold text-sm transition-colors"
            >
              <span>Ver todos os imóveis</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <HomeLiveSection initialImoveis={allImoveis} />
        </div>
      </section>

      {/* Banner de Chamada para Corretores — Publicação Inteligente por IA */}
      <section className="py-16 px-4 bg-gradient-to-b from-[#0b132b] via-slate-900 to-[#070b19] border-t border-slate-800/80">
        <div className="max-w-4xl mx-auto bg-slate-950 border border-amber-500/30 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden text-center sm:text-left">
          
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-8 items-center relative z-10">
            <div className="sm:col-span-8 space-y-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold uppercase tracking-wider border border-amber-500/30">
                <Sparkles className="w-4 h-4 text-amber-400" />
                Tecnologia Exclusiva para Corretores
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Anuncie seus imóveis em Taboão da Serra e imediações com Inteligência Artificial
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
                Envie fotos e descrição bruta por e-mail. Nossa IA cuida do enriquecimento dos dados, fotos em HD e gera o Media Kit completo para publicação em 1 clique.
              </p>

              <div className="flex flex-wrap gap-4 pt-2 text-xs font-bold text-slate-300">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>1 Crédito Grátis ao se cadastrar</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Divulgação por 90 dias</span>
                </div>
              </div>
            </div>

            <div className="sm:col-span-4 text-center">
              <Link
                href="/cadastro"
                className="w-full py-4 px-6 bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-400 hover:to-amber-600 text-slate-950 font-black rounded-2xl shadow-xl transition-all inline-flex items-center justify-center gap-2 text-sm uppercase tracking-wider"
              >
                <span>Criar Conta e Anunciar</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
