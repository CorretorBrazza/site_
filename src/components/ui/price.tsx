import { cn } from '@/lib/cn';

const FORMATADOR = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  maximumFractionDigits: 0,
});

const FORMATADOR_CENTAVOS = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

export interface PriceProps {
  valor: number | null | undefined;
  /** `mes` acrescenta "/mês" (locação). */
  sufixo?: 'mes' | null;
  /** `true` mantém centavos (usado em créditos, não em imóveis). */
  centavos?: boolean;
  /** Texto quando não há valor. */
  vazio?: string;
  className?: string;
}

/**
 * Preço formatado de forma única.
 *
 * Antes cada tela repetia `toLocaleString`/`toFixed().replace('.', ',')`, o que
 * produzia "R$ 350000" em um lugar e "R$ 350.000,00" em outro.
 */
export function Price({
  valor,
  sufixo = null,
  centavos = false,
  vazio = 'Consulte',
  className,
}: PriceProps) {
  if (valor === null || valor === undefined || !Number.isFinite(valor)) {
    return <span className={cn('tabular text-muted', className)}>{vazio}</span>;
  }

  const formatador = centavos ? FORMATADOR_CENTAVOS : FORMATADOR;

  return (
    <span className={cn('tabular', className)}>
      {formatador.format(valor)}
      {sufixo === 'mes' && <span className="text-[0.7em] font-semibold text-muted"> /mês</span>}
    </span>
  );
}

/** Formata sem JSX, para textos e metadados. */
export function formatarPreco(valor: number | null | undefined, centavos = false): string {
  if (valor === null || valor === undefined || !Number.isFinite(valor)) return 'Consulte';
  return (centavos ? FORMATADOR_CENTAVOS : FORMATADOR).format(valor);
}
