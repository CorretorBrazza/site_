import { getImoveis } from '@/app/actions/imovel-server-actions';
import { notFound } from 'next/navigation';

import ImageCarousel from '@/components/ImageCarousel';
import ShareButton from '@/components/ShareButton';

export default async function ImovelDetalhes({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const imoveis = await getImoveis();
  const imovel = imoveis.find(i => i.id === id);

  if (!imovel) {
    notFound();
  }

  const preco = imovel.transacao === 'Venda' ? imovel.precoVenda : imovel.precoLocacao;
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const whatsappMsg = `Olá, tenho interesse no imóvel de referência [${imovel.referencia}] (${imovel.titulo}) que vi no site.`;
  const whatsappUrl = `https://wa.me/5511932785602?text=${encodeURIComponent(whatsappMsg)}`;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      {/* Header Info */}
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2 text-sm text-gray-500 font-bold uppercase tracking-wider">
            <span className="text-blue-600">{imovel.transacao}</span>
            <span className="text-gray-300">•</span>
            <span>Ref: {imovel.referencia}</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight mb-2 leading-tight">{imovel.titulo}</h1>
          <p className="text-gray-500 font-medium">{imovel.endereco.bairro}, {imovel.endereco.cidade} - {imovel.endereco.estado}</p>
        </div>
        <div className="flex shrink-0">
          <ShareButton />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left Column: Images & Description */}
        <div className="lg:col-span-2 space-y-8">
          {/* Galeria de Fotos com Carrossel */}
          <ImageCarousel images={imovel.fotos} alt={imovel.titulo} />

          <div className="bg-white p-6 rounded-xl border border-gray-100 mb-8 shadow-sm">
            <h2 className="text-xl font-bold mb-4">Descrição</h2>
            <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
              {imovel.descricao}
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-100">
            <h2 className="text-xl font-bold mb-6">Características</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <span className="block text-2xl mb-1">🛏️</span>
                <span className="block font-bold">{imovel.caracteristicas.quartos}</span>
                <span className="text-xs text-gray-500 uppercase">Quartos</span>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <span className="block text-2xl mb-1">🚿</span>
                <span className="block font-bold">{imovel.caracteristicas.suites}</span>
                <span className="text-xs text-gray-500 uppercase">Suítes</span>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <span className="block text-2xl mb-1">🚿</span>
                <span className="block font-bold">{imovel.caracteristicas.banheiros}</span>
                <span className="text-xs text-gray-500 uppercase">Banheiros</span>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <span className="block text-2xl mb-1">📏</span>
                <span className="block font-bold">{imovel.caracteristicas.areaUtil}m²</span>
                <span className="text-xs text-gray-500 uppercase">Área Útil</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Contact & Price */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm sticky top-24">
            <div className="mb-6 pb-6 border-b">
              <span className="text-sm text-gray-500 block mb-1">Valor do Imóvel</span>
              <p className="text-3xl font-bold text-blue-700">
                {preco ? formatCurrency(preco) : 'Consulte'}
                {imovel.transacao === 'Locação' && <span className="text-base font-normal text-gray-500">/mês</span>}
              </p>
            </div>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-green-600 hover:bg-green-700 text-white text-center py-4 rounded-xl font-bold text-lg shadow-md transition-all flex items-center justify-center gap-2"
            >
              <span>Falar com Corretor</span>
            </a>

            <p className="text-[10px] text-gray-400 mt-4 text-center uppercase tracking-wider">
              Código do Imóvel: {imovel.referencia}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
