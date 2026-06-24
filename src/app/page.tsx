import Link from 'next/link';
import { Home as HomeIcon, Building2, Map, ChevronRight, CheckCircle2 } from 'lucide-react';
import { getImoveis } from '@/app/actions/imovel-server-actions';
import CardImovel from '@/components/CardImovel';
import EmpreendimentoCard from '@/components/EmpreendimentoCard';
import { empreendimentos } from '@/data/empreendimentos';

export default async function Home() {
  const allImoveis = await getImoveis();
  const destaques = allImoveis.filter(i => i.destaque && i.status === 'Ativo').slice(0, 3);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateAgent',
    'name': 'Imóveis Taboão',
    'image': 'https://imoveistaboao.com.br/favicon.ico',
    '@id': 'https://imoveistaboao.com.br',
    'url': 'https://imoveistaboao.com.br',
    'telephone': '+5511932785602',
    'address': {
      '@type': 'PostalAddress',
      'streetAddress': 'Taboão da Serra',
      'addressLocality': 'Taboão da Serra',
      'addressRegion': 'SP',
      'postalCode': '06750-000',
      'addressCountry': 'BR'
    },
    'geo': {
      '@type': 'GeoCoordinates',
      'latitude': -23.6247,
      'longitude': -46.7885
    },
    'openingHoursSpecification': {
      '@type': 'OpeningHoursSpecification',
      'dayOfWeek': [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday'
      ],
      'opens': '09:00',
      'closes': '18:00'
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#faf9f6]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        {/* Background Overlay com Gradiente Premium */}
        <div className="absolute inset-0 bg-[#0f172a]">
          <div className="absolute inset-0 bg-gradient-to-r from-[#0f172a]/70 to-black/80 z-10" />
          <img
            src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=2000"
            alt="Imóveis de Luxo"
            className="w-full h-full object-cover opacity-85"
          />
        </div>

        <div className="relative z-20 max-w-5xl mx-auto px-4 text-center">
          <span className="inline-block bg-accent text-white text-[11px] font-semibold px-4 py-1.5 rounded-lg uppercase tracking-wider mb-6">
            Consultoria Imobiliária em Taboão da Serra
          </span>
          <h1 className="text-4xl md:text-6xl font-light text-white mb-6 tracking-tight leading-tight">
            Encontre o lar onde sua <br />
            <span className="font-serif italic font-semibold text-accent">história continua.</span>
          </h1>
          <p className="text-lg text-slate-300 mb-10 max-w-2xl mx-auto font-medium leading-relaxed">
            Casas e apartamentos selecionados em Taboão da Serra, construídos com a segurança jurídica e transparência que seu futuro exige.
          </p>

          <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
            <Link
              href="https://wa.me/5511932785602"
              className="w-full md:w-auto bg-accent hover:bg-accent-hover text-white px-8 py-3.5 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 group shadow-md shadow-accent/15"
            >
              Falar com um Consultor
              <ChevronRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Categorias Rápidas */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Link href="#empreendimentos" className="group relative h-64 rounded-2xl overflow-hidden shadow-sm border border-black/5">
              <img src="https://images.unsplash.com/photo-1541888946425-d81bb19480c5?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Imóveis em Construção" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent flex flex-col justify-end p-8">
                <Building2 className="text-accent mb-2" size={24} />
                <h3 className="text-xl font-serif font-semibold text-white tracking-wide">Em Construção</h3>
                <p className="text-slate-350 text-xs mt-1">Lançamentos residenciais exclusivos</p>
              </div>
            </Link>
            <Link href="/venda" className="group relative h-64 rounded-2xl overflow-hidden shadow-sm border border-black/5">
              <img src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=600" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Imóveis Prontos" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent flex flex-col justify-end p-8">
                <HomeIcon className="text-accent mb-2" size={24} />
                <h3 className="text-xl font-serif font-semibold text-white tracking-wide">Prontos para Morar</h3>
                <p className="text-slate-350 text-xs mt-1">Conforto imediato com alta valorização</p>
              </div>
            </Link>
            <Link href="/locacao" className="group relative h-64 rounded-2xl overflow-hidden shadow-sm border border-black/5">
              <img src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80&w=600" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Locação" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent flex flex-col justify-end p-8">
                <Map className="text-accent mb-2" size={24} />
                <h3 className="text-xl font-serif font-semibold text-white tracking-wide">Locação</h3>
                <p className="text-slate-350 text-xs mt-1">Excelentes oportunidades residenciais</p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Empreendimentos em Construção */}
      <section id="empreendimentos" className="py-24 bg-[#fcfbf9] border-y border-black/5">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-accent font-bold uppercase tracking-widest text-[11px] mb-2 block">
              Novos Lançamentos
            </span>
            <h2 className="text-3xl md:text-4xl font-serif text-primary tracking-tight mb-4">
              Empreendimentos em Destaque
            </h2>
            <p className="text-slate-500 max-w-2xl mx-auto text-sm font-medium">
              Conheça os projetos arquitetônicos que estão redefinindo a sofisticação urbana em Taboão da Serra e região.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-6xl mx-auto">
            {empreendimentos.map((emp) => (
              <EmpreendimentoCard
                key={emp.slug}
                slug={emp.slug}
                name={emp.name}
                address={emp.address}
                status={emp.status}
                image={emp.heroImage}
                amenities={emp.amenities}
                dormitorios={emp.dormitorios}
                deliveryDate={emp.deliveryDate}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Destaques */}
      {destaques.length > 0 && (
        <section className="py-24 bg-[#faf9f6]">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-between items-end mb-12">
              <div>
                <span className="text-accent font-bold uppercase tracking-widest text-[11px] mb-2 block">Selecção Especial</span>
                <h2 className="text-3xl font-serif text-primary tracking-tight">Imóveis Prontos</h2>
              </div>
              <Link href="/venda" className="hidden md:flex items-center gap-1 text-accent font-semibold hover:text-accent-hover text-sm transition-all">
                Ver todos os imóveis <ChevronRight size={16} />
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
      <section className="py-24 bg-white border-t border-black/5">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
            <div className="relative">
              <div className="absolute -top-6 -left-6 w-32 h-32 bg-accent/5 rounded-full -z-10 animate-pulse" />
              <img
                src="https://images.unsplash.com/photo-1574362848149-11496d93a7c7?auto=format&fit=crop&q=80&w=800"
                className="rounded-2xl shadow-lg relative z-10"
                alt="Consultoria Imobiliária"
              />
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-serif text-primary mb-8 tracking-tight leading-snug">
                Mais de 10 anos <span className="font-serif italic font-semibold text-accent">transformando vidas</span> em Taboão da Serra.
              </h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="shrink-0 w-12 h-12 bg-accent/5 rounded-xl flex items-center justify-center text-accent">
                    <CheckCircle2 size={22} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg text-primary mb-1">Transparência Total</h4>
                    <p className="text-slate-500 text-sm">Documentação rigorosamente analisada para assegurar total tranquilidade jurídica aos compradores.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="shrink-0 w-12 h-12 bg-accent/5 rounded-xl flex items-center justify-center text-accent">
                    <CheckCircle2 size={22} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg text-primary mb-1">Atendimento Exclusivo</h4>
                    <p className="text-slate-500 text-sm">Consultores altamente qualificados e dedicados a encontrar a melhor oportunidade para o seu momento de vida.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="shrink-0 w-12 h-12 bg-accent/5 rounded-xl flex items-center justify-center text-accent">
                    <CheckCircle2 size={22} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg text-primary mb-1">Engenharia de Crédito</h4>
                    <p className="text-slate-500 text-sm">Parcerias diretas com os maiores bancos públicos e privados para viabilizar as menores taxas e melhores opções de crédito do mercado.</p>
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
