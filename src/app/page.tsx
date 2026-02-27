import Link from 'next/link';
import { Search, Home as HomeIcon, Building2, Map, ChevronRight, CheckCircle2 } from 'lucide-react';
import { getImoveis } from '@/app/actions/imovel-server-actions';
import CardImovel from '@/components/CardImovel';

export default async function Home() {
  const allImoveis = await getImoveis();
  const destaques = allImoveis.filter(i => i.destaque && i.status === 'Ativo').slice(0, 3);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[85vh] flex items-center justify-center overflow-hidden">
        {/* Background Overlay com Gradiente Premium */}
        <div className="absolute inset-0 bg-[#0a192f]">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/40 to-black/60 z-10" />
          <img
            src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=2000"
            alt="Real Estate Hero"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="relative z-20 max-w-5xl mx-auto px-4 text-center">
          <span className="inline-block bg-blue-600 text-white text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-widest mb-6 animate-fade-in">
            A melhor imobiliária de Taboão
          </span>
          <h1 className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tighter leading-tight">
            Encontre o lugar onde sua <br />
            <span className="text-blue-500">história continua.</span>
          </h1>
          <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto font-medium">
            Casas e apartamentos em Taboão da Serra com a segurança e transparência que você merece.
          </p>

          <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
            <Link
              href="https://wa.me/5511932785602"
              className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-full font-bold transition-all flex items-center justify-center gap-2 group shadow-2xl"
            >
              Falar com um Corretor
              <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="#"
              className="w-full md:w-auto bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/30 px-10 py-4 rounded-full font-bold transition-all flex items-center justify-center gap-2 group"
            >
              Imóveis na Planta
            </Link>
          </div>
        </div>
      </section>

      {/* Categorias Rápidas */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Link href="#" className="group relative h-64 rounded-3xl overflow-hidden shadow-lg border border-gray-100">
              <img src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=600" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Em Construção" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-8">
                <Building2 className="text-blue-400 mb-2" />
                <h3 className="text-2xl font-bold text-white uppercase tracking-tight">Em Construção</h3>
                <p className="text-gray-300 text-sm">Oportunidades únicas de investimento</p>
              </div>
            </Link>
            <Link href="/venda" className="group relative h-64 rounded-3xl overflow-hidden shadow-lg border border-gray-100">
              <img src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=600" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Imóveis Prontos" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-8">
                <HomeIcon className="text-blue-400 mb-2" />
                <h3 className="text-2xl font-bold text-white uppercase tracking-tight">Imóveis Prontos</h3>
                <p className="text-gray-300 text-sm">Mude-se agora com todo conforto</p>
              </div>
            </Link>
            <Link href="/locacao" className="group relative h-64 rounded-3xl overflow-hidden shadow-lg border border-gray-100">
              <img src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80&w=600" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Locação" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-8">
                <Map className="text-blue-400 mb-2" />
                <h3 className="text-2xl font-bold text-white uppercase tracking-tight">Locação</h3>
                <p className="text-gray-300 text-sm">As melhores opções para alugar</p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Destaques */}
      {destaques.length > 0 && (
        <section className="py-24 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-between items-end mb-12">
              <div>
                <span className="text-blue-600 font-bold uppercase tracking-widest text-xs mb-2 block">Destaques</span>
                <h2 className="text-4xl font-black text-gray-900 tracking-tighter uppercase">Imóveis Selecionados</h2>
              </div>
              <Link href="/venda" className="hidden md:flex items-center gap-2 text-blue-700 font-bold hover:gap-4 transition-all">
                Ver todos os imóveis <ChevronRight size={20} />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {destaques.map(imovel => (
                <CardImovel key={imovel.id} imovel={imovel} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Por que nós? */}
      <section className="py-24 bg-white border-t border-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
            <div className="relative">
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-50 rounded-full -z-10" />
              <img
                src="https://images.unsplash.com/photo-1574362848149-11496d93a7c7?auto=format&fit=crop&q=80&w=800"
                className="rounded-3xl shadow-2xl relative z-10"
                alt="Family"
              />
            </div>
            <div>
              <h2 className="text-4xl font-black text-gray-900 mb-8 tracking-tighter uppercase leading-tight">
                Mais de 10 anos <span className="text-blue-600">transformando vidas</span> em Taboão da Serra.
              </h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="shrink-0 w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                    <CheckCircle2 size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-gray-900 mb-1">Transparência Total</h4>
                    <p className="text-gray-600">Documentação rigorosamente analisada para sua segurança jurídica.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="shrink-0 w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                    <CheckCircle2 size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-gray-900 mb-1">Atendimento Humanizado</h4>
                    <p className="text-gray-600">Corretores especialistas focados na sua necessidade real.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="shrink-0 w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                    <CheckCircle2 size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-gray-900 mb-1">As Melhores Taxas</h4>
                    <p className="text-gray-600">Parcerias com os principais bancos para o seu financiamento.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
