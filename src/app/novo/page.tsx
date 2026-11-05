import { Metadata } from 'next';
import { getImoveis } from '@/app/actions/imovel-server-actions';
import CardImovel from '@/components/CardImovel';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Imóveis Novos e Lançamentos em Taboão da Serra e imediações — Imóveis Taboão',
  description: 'Confira lançamentos e novos imóveis prontos para morar em Taboão da Serra e imediações.',
  openGraph: {
    title: 'Imóveis Novos e Lançamentos em Taboão da Serra e imediações — Imóveis Taboão',
    description: 'Confira lançamentos e novos imóveis prontos para morar em Taboão da Serra e imediações.',
    url: 'https://imoveistaboao.com.br/novo',
    type: 'website',
  },
};

export default async function HomeNovo() {
  const { imoveis, fallback: catalogoFallback } = await getImoveis();
  const destaques = imoveis.filter(imovel => imovel.destaque && imovel.status === 'Ativo');

  return (
    <div>
      {catalogoFallback && (
        <div className="bg-gold/10 border-b border-gold/30 text-gold text-xs sm:text-sm font-semibold px-4 py-2.5 text-center">
          Estamos com instabilidade no catálogo — os imóveis abaixo podem estar desatualizados. Tente novamente em instantes.
        </div>
      )}
      {/* Hero Section */}
      <section className="relative h-[500px] flex items-center justify-center bg-brand-800 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=1920" 
            alt="Hero Background" 
            className="w-full h-full object-cover opacity-30"
          />
        </div>
        
        <div className="relative z-10 max-w-4xl px-4 text-center text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Encontre o imóvel perfeito em Taboão da Serra
          </h1>
          <p className="text-xl mb-8 text-line">
            Milhares de opções para você morar bem ou investir com segurança.
          </p>
          
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Link 
              href="/venda" 
              className="bg-brand-900 hover:bg-brand-800 text-white px-8 py-3 rounded-lg font-bold transition-all shadow-lg"
            >
              Quero Comprar
            </Link>
            <Link 
              href="/locacao" 
              className="bg-white hover:bg-paper text-brand-800 px-8 py-3 rounded-lg font-bold transition-all shadow-lg"
            >
              Quero Alugar
            </Link>
          </div>
        </div>
      </section>

      {/* Destaques Section */}
      <section className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-bold text-brand-900">Imóveis em Destaque</h2>
            <p className="text-ink mt-2">As melhores oportunidades selecionadas para você.</p>
          </div>
          <Link href="/venda" className="text-brand-800 font-semibold hover:underline hidden md:block">
            Ver todos os imóveis &rarr;
          </Link>
        </div>

        {destaques.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {destaques.map(imovel => (
              <CardImovel key={imovel.id} imovel={imovel} />
            ))}
          </div>
        ) : (
          <div className="text-center py-10 bg-paper rounded-xl border-2 border-dashed border-line">
            <p className="text-muted">Nenhum imóvel em destaque no momento.</p>
          </div>
        )}
        
        <div className="mt-12 text-center md:hidden">
          <Link href="/venda" className="inline-block bg-white border border-brand-700 text-brand-800 px-6 py-2 rounded-lg font-semibold">
            Ver todos os imóveis
          </Link>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-paper py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-brand-900 mb-4">Quer vender ou alugar seu imóvel?</h2>
          <p className="text-lg text-ink mb-8 max-w-2xl mx-auto">
            Anuncie conosco e tenha a melhor visibilidade da região com atendimento personalizado e seguro.
          </p>
          <a 
            href="https://wa.me/5511932785602" 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-success hover:bg-success text-white px-10 py-4 rounded-full font-bold text-lg shadow-md transition-all inline-flex items-center gap-2"
          >
            <span>Falar com um Especialista</span>
          </a>
        </div>
      </section>
    </div>
  );
}
