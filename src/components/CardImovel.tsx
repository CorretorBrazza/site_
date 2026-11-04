'use client';

import { Imovel } from '@/types/imovel';
import Link from 'next/link';
import { BedDouble, ShowerHead, Car, Maximize, MapPin, ArrowRight } from 'lucide-react';
import { trackEvent } from '@/lib/analytics';
import { Badge } from '@/components/ui/badge';
import { Price } from '@/components/ui/price';
import { cn } from '@/lib/cn';

interface CardImovelProps {
  imovel: Imovel;
}

/**
 * Card de imóvel da vitrine e das listagens.
 *
 * Mudanças em relação ao anterior:
 *  - superfície branca sobre `paper` com borda quente (a foto é o destaque);
 *  - preço migrou do selo verde sobre a foto para o rodapé do card, em tinta
 *    forte — legível sobre qualquer foto e comparável entre cards;
 *  - ícones em ouro (papel de destaque), não em azul;
 *  - `Price` centraliza a formatação (antes cada tela repetia `Intl`).
 */
export default function CardImovel({ imovel }: CardImovelProps) {
  const rawTransacao = String(imovel.transacao || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
  const isLocacao = rawTransacao.includes('loca') || rawTransacao.includes('alug');
  const preco = isLocacao
    ? (imovel.precoLocacao || imovel.precoVenda)
    : (imovel.precoVenda || imovel.precoLocacao);

  const capa = imovel.fotos?.[0]
    || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=800';

  const bairro = imovel.endereco?.bairro || imovel.bairro || 'Taboão da Serra';

  return (
    <Link
      href={`/imovel/${encodeURIComponent(imovel.referencia || imovel.id)}`}
      onClick={() => trackEvent('view_property', { transaction: imovel.transacao })}
      className={cn(
        'group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-surface',
        'shadow-[0_1px_2px_rgba(9,23,49,0.04)] transition-all duration-300',
        'hover:-translate-y-0.5 hover:border-gold-500/50 hover:shadow-[0_18px_40px_-24px_rgba(9,23,49,0.45)]',
      )}
    >
      <div className="relative h-52 w-full overflow-hidden bg-paper sm:h-56">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={capa}
          alt={imovel.titulo}
          decoding="async"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />

        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
          <Badge tone="navy" className="shadow-sm">
            {imovel.transacao}
          </Badge>
          {imovel.isNovo && <Badge tone="gold" className="shadow-sm">Novo</Badge>}
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-muted">
          <MapPin className="h-3.5 w-3.5 shrink-0 text-gold-600" aria-hidden="true" />
          <span className="truncate">{bairro}</span>
          <span aria-hidden="true" className="text-muted/40">•</span>
          <span className="shrink-0 font-mono text-[10px] text-muted/80">REF {imovel.referencia}</span>
        </div>

        <h3 className="line-clamp-2 text-[15px] font-bold leading-snug text-ink transition-colors group-hover:text-brand-800">
          {imovel.titulo}
        </h3>

        <div className="mt-auto grid grid-cols-4 gap-1 border-t border-line pt-3 text-center">
          {[
            { icone: BedDouble, valor: imovel.caracteristicas?.quartos, rotulo: 'Qts' },
            { icone: ShowerHead, valor: imovel.caracteristicas?.banheiros, rotulo: 'Ban' },
            { icone: Car, valor: imovel.caracteristicas?.vagas, rotulo: 'Vag' },
            { icone: Maximize, valor: imovel.caracteristicas?.areaUtil, rotulo: 'm²' },
          ].map(({ icone: Icone, valor, rotulo }) => (
            <div key={rotulo} className="flex flex-col items-center gap-0.5" title={rotulo}>
              <Icone className="h-4 w-4 text-gold-600" aria-hidden="true" />
              <span className="text-[11px] font-bold text-ink/80">
                {valor ?? '—'}
                {rotulo !== 'm²' ? ` ${rotulo}` : ' m²'}
              </span>
            </div>
          ))}
        </div>

        <div className="flex items-end justify-between gap-3 pt-1">
          <div className="leading-none">
            <span className="block text-[10px] font-bold uppercase tracking-wider text-muted">
              {isLocacao ? 'Aluguel' : 'Venda'}
            </span>
            <Price
              valor={preco}
              sufixo={isLocacao ? 'mes' : null}
              className="mt-1 block text-lg font-extrabold text-ink"
            />
          </div>
          <span className="inline-flex items-center gap-1 text-xs font-bold text-brand-800 opacity-0 transition-opacity group-hover:opacity-100">
            Ver
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </span>
        </div>
      </div>
    </Link>
  );
}
