import { cn } from '@/lib/cn';

export type BadgeTone = 'neutral' | 'gold' | 'navy' | 'success' | 'danger';

const TONS: Record<BadgeTone, string> = {
  neutral: 'bg-ink/5 text-ink ring-1 ring-inset ring-ink/10',
  gold: 'bg-gold-500/15 text-gold-700 ring-1 ring-inset ring-gold-500/40',
  navy: 'bg-brand-900 text-white ring-1 ring-inset ring-brand-700',
  success: 'bg-success/10 text-success ring-1 ring-inset ring-success/25',
  danger: 'bg-danger/10 text-danger ring-1 ring-inset ring-danger/25',
};

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
}

/** Selo curto: "Venda", "Aluguel", "Destaque", "Novo". */
export function Badge({ tone = 'neutral', className, children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wider',
        TONS[tone],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
