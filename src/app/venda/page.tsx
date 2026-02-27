import { getImoveis } from '@/app/actions/imovel-actions';
import CardImovel from '@/components/CardImovel';

export default async function VendaPage() {
  const allImoveis = await getImoveis();
  const imoveis = allImoveis.filter(i => 
    (i.transacao === 'Venda' || i.transacao === 'Venda e Locação') && i.status === 'Ativo'
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <header className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900">Imóveis para Venda</h1>
        <p className="text-gray-600 mt-2">Encontramos {imoveis.length} oportunidades em Taboão da Serra.</p>
      </header>
      
      {imoveis.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {imoveis.map(imovel => (
            <CardImovel key={imovel.id} imovel={imovel} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-gray-500 text-lg">Nenhum imóvel encontrado nesta categoria.</p>
        </div>
      )}
    </div>
  );
}
