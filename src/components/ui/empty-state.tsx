import { cn } from '@/lib/cn';

export interface EmptyStateProps {
  icone?: React.ReactNode;
  titulo: string;
  descricao?: string;
  acao?: React.ReactNode;
  className?: string;
}

/** Estado vazio padronizado (havia quatro variações diferentes no site). */
export function EmptyState({ icone, titulo, descricao, acao, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-line bg-surface px-6 py-14 text-center',
        className,
      )}
    >
      {icone && <div className="text-gold-600">{icone}</div>}
      <h3 className="text-lg font-bold text-ink">{titulo}</h3>
      {descricao && <p className="max-w-md text-sm leading-relaxed text-muted">{descricao}</p>}
      {acao && <div className="pt-2">{acao}</div>}
    </div>
  );
}
