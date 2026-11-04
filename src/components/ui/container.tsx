import { cn } from '@/lib/cn';

/** Largura máxima única do site (1240px) com respiro consistente. */
export function Container({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('mx-auto w-full max-w-[1240px] px-4 sm:px-6 lg:px-8', className)} {...props}>
      {children}
    </div>
  );
}

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  /** Faixa escura (navy) para hero e blocos institucionais. */
  tone?: 'paper' | 'surface' | 'navy';
  /** Espaçamento vertical; `compact` para blocos de apoio. */
  spacing?: 'compact' | 'normal' | 'wide';
}

const TONS: Record<NonNullable<SectionProps['tone']>, string> = {
  paper: 'bg-paper text-ink',
  surface: 'bg-surface text-ink',
  navy: 'bg-brand-900 text-white',
};

const ESPACOS: Record<NonNullable<SectionProps['spacing']>, string> = {
  compact: 'py-10 sm:py-12',
  normal: 'py-14 sm:py-20',
  wide: 'py-20 sm:py-28',
};

export function Section({
  tone = 'paper',
  spacing = 'normal',
  className,
  children,
  ...props
}: SectionProps) {
  return (
    <section className={cn(TONS[tone], ESPACOS[spacing], className)} {...props}>
      {children}
    </section>
  );
}

/** Título de seção com sobretítulo opcional. */
export function SectionTitle({
  sobre,
  titulo,
  descricao,
  alinhamento = 'left',
  className,
}: {
  sobre?: string;
  titulo: React.ReactNode;
  descricao?: React.ReactNode;
  alinhamento?: 'left' | 'center';
  className?: string;
}) {
  return (
    <div
      className={cn(
        'space-y-2',
        alinhamento === 'center' && 'mx-auto max-w-2xl text-center',
        className,
      )}
    >
      {sobre && (
        <span className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-gold-600">
          {sobre}
        </span>
      )}
      <h2 className="text-2xl font-bold leading-tight tracking-tight sm:text-3xl">{titulo}</h2>
      {descricao && <p className="text-sm leading-relaxed text-muted sm:text-base">{descricao}</p>}
    </div>
  );
}
