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
      <div className="bg-white rounded-2xl shadow-sm hover:shadow-md hover:shadow-black/5 overflow-hidden transition-all duration-500 border border-black/5 h-full flex flex-col">
        <div className="relative h-64 w-full overflow-hidden">
          <img
            src={imovel.fotos[0]}
            alt={imovel.titulo}
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute top-4 left-4 flex gap-2">
            <div className="bg-primary/90 backdrop-blur-sm text-white text-[10px] uppercase tracking-wider font-semibold px-3 py-1.5 rounded-lg shadow-sm">
              {imovel.transacao}
            </div>
            {imovel.destaque && (
              <div className="bg-accent text-white text-[10px] uppercase tracking-wider font-semibold px-3 py-1.5 rounded-lg shadow-sm">
                Destaque
              </div>
            )}
          </div>
        </div>

        <div className="p-5 flex flex-col flex-grow">
          <div className="mb-2">
            <p className="text-xl font-bold text-primary leading-none">
              {preco ? formatCurrency(preco) : 'Consulte'}
              {imovel.transacao === 'Locação' && <span className="text-xs font-semibold text-slate-400"> /mês</span>}
            </p>
          </div>

          <h3 className="font-serif text-lg font-semibold text-primary line-clamp-2 mb-2 group-hover:text-accent transition-colors leading-tight">
            {imovel.titulo}
          </h3>

          <p className="text-slate-400 text-xs font-medium mb-6">
            {imovel.endereco.bairro}, {imovel.endereco.cidade}
          </p>

          <div className="mt-auto grid grid-cols-4 gap-2 text-slate-600 border-t border-black/5 pt-4">
            <div className="flex flex-col items-center gap-1" title="Quartos">
              <BedDouble size={18} className="text-accent" />
              <span className="text-[10px] font-semibold uppercase text-slate-400">{imovel.caracteristicas.quartos} Qts</span>
            </div>
            <div className="flex flex-col items-center gap-1" title="Banheiros">
              <ShowerHead size={18} className="text-accent" />
              <span className="text-[10px] font-semibold uppercase text-slate-400">{imovel.caracteristicas.banheiros} Ban</span>
            </div>
            <div className="flex flex-col items-center gap-1" title="Vagas">
              <Car size={18} className="text-accent" />
              <span className="text-[10px] font-semibold uppercase text-slate-400">{imovel.caracteristicas.vagas} Vag</span>
            </div>
            <div className="flex flex-col items-center gap-1" title="Área Útil">
              <Maximize size={18} className="text-accent" />
              <span className="text-[10px] font-semibold uppercase text-slate-400">{imovel.caracteristicas.areaUtil}m²</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
