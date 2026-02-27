import { Imovel } from '@/types/imovel';
import Link from 'next/link';
import { BedDouble, ShowerHead, Car, Maximize } from 'lucide-react';

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
      <div className="bg-white rounded-2xl shadow-sm hover:shadow-2xl hover:shadow-blue-900/10 overflow-hidden transition-all duration-500 border border-gray-100 h-full flex flex-col">
        <div className="relative h-64 w-full overflow-hidden">
          <img
            src={imovel.fotos[0]}
            alt={imovel.titulo}
            className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700"
          />
          <div className="absolute top-4 left-4 flex gap-2">
            <div className="bg-blue-600 text-white text-[10px] uppercase tracking-wider font-black px-3 py-1.5 rounded-full shadow-lg">
              {imovel.transacao}
            </div>
            {imovel.destaque && (
              <div className="bg-white/90 backdrop-blur-sm text-blue-900 text-[10px] uppercase tracking-wider font-black px-3 py-1.5 rounded-full shadow-lg">
                Destaque
              </div>
            )}
          </div>
        </div>

        <div className="p-6 flex flex-col flex-grow">
          <div className="mb-4">
            <p className="text-2xl font-black text-blue-700 leading-none">
              {preco ? formatCurrency(preco) : 'Consulte'}
              {imovel.transacao === 'Locação' && <span className="text-sm font-bold text-gray-400"> /mês</span>}
            </p>
          </div>

          <h3 className="text-gray-900 font-bold text-xl line-clamp-2 mb-2 group-hover:text-blue-700 transition-colors leading-tight">
            {imovel.titulo}
          </h3>

          <p className="text-gray-500 text-sm font-medium mb-6">
            {imovel.endereco.bairro}, {imovel.endereco.cidade}
          </p>

          <div className="mt-auto grid grid-cols-4 gap-2 text-gray-600 border-t border-gray-50 pt-6">
            <div className="flex flex-col items-center gap-1" title="Quartos">
              <BedDouble size={18} className="text-blue-500" />
              <span className="text-[10px] font-bold uppercase text-gray-400">{imovel.caracteristicas.quartos} Qts</span>
            </div>
            <div className="flex flex-col items-center gap-1" title="Banheiros">
              <ShowerHead size={18} className="text-blue-500" />
              <span className="text-[10px] font-bold uppercase text-gray-400">{imovel.caracteristicas.banheiros} Ban</span>
            </div>
            <div className="flex flex-col items-center gap-1" title="Vagas">
              <Car size={18} className="text-blue-500" />
              <span className="text-[10px] font-bold uppercase text-gray-400">{imovel.caracteristicas.vagas} Vag</span>
            </div>
            <div className="flex flex-col items-center gap-1" title="Área Útil">
              <Maximize size={18} className="text-blue-500" />
              <span className="text-[10px] font-bold uppercase text-gray-400">{imovel.caracteristicas.areaUtil}m²</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
