import { cn } from '@/lib/cn';

/**
 * Superfície base do portal: branco sobre `paper`, borda quente, raio da marca.
 * É o que dá o contraste que faz a foto do imóvel "saltar".
 */
export function Card({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-line bg-surface shadow-[0_1px_2px_rgba(9,23,49,0.04),0_10px_30px_-18px_rgba(9,23,49,0.18)]',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardBody({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('p-5 sm:p-6', className)} {...props}>
      {children}
    </div>
  );
}

/** Rodapé de card com divisor — usado para preço + CTA. */
export function CardFooter({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('flex items-center justify-between gap-3 border-t border-line px-5 py-4', className)} {...props}>
      {children}
    </div>
  );
}
