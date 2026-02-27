import { Imovel } from '@/types/imovel';
import Link from 'next/link';

interface CardImovelProps {
  imovel: Imovel;
}

export default function CardImovel({ imovel }: CardImovelProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const preco = imovel.transacao === 'Venda' ? imovel.precoVenda : imovel.precoLocacao;

  return (
    <Link href={`/imovel/${imovel.id}`} className="block group">
      <div className="bg-white rounded-lg shadow-md overflow-hidden group-hover:shadow-xl transition-shadow duration-300 border border-gray-100 h-full">
        <div className="relative h-48 w-full">
          <img
            src={imovel.fotos[0]}
            alt={imovel.titulo}
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded">
            {imovel.transacao}
          </div>
          {imovel.destaque && (
            <div className="absolute top-2 right-2 bg-yellow-400 text-gray-900 text-[10px] font-bold px-2 py-1 rounded uppercase">
              Destaque
            </div>
          )}
        </div>
        
        <div className="p-4">
          <p className="text-blue-700 font-bold text-xl mb-1">
            {preco ? formatCurrency(preco) : 'Consulte'}
            {imovel.transacao === 'Locação' && <span className="text-sm font-normal text-gray-500"> /mês</span>}
          </p>
          <h3 className="text-gray-800 font-semibold text-lg line-clamp-1 mb-1 group-hover:text-blue-700 transition-colors">
            {imovel.titulo}
          </h3>
          <p className="text-gray-500 text-sm mb-4">
            {imovel.endereco.bairro}, {imovel.endereco.cidade}
          </p>
          
          <div className="flex justify-between items-center text-gray-600 text-sm border-t pt-3">
            <div className="flex items-center gap-1" title="Quartos">
              <span>🛏️</span>
              <span>{imovel.caracteristicas.quartos}</span>
            </div>
            <div className="flex items-center gap-1" title="Banheiros">
              <span>🚿</span>
              <span>{imovel.caracteristicas.banheiros}</span>
            </div>
            <div className="flex items-center gap-1" title="Vagas">
              <span>🚗</span>
              <span>{imovel.caracteristicas.vagas}</span>
            </div>
            <div className="flex items-center gap-1" title="Área Útil">
              <span>📏</span>
              <span>{imovel.caracteristicas.areaUtil}m²</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
