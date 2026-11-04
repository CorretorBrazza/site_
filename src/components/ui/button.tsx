'use client';

import { forwardRef } from 'react';
import Link, { type LinkProps } from 'next/link';
import { cn } from '@/lib/cn';

/**
 * Botão do design system.
 *
 * Cores seguem os papéis definidos em globals.css (Opção A):
 *  - `primary`  → ouro com texto navy (ação de produto: buscar, anunciar, comprar)
 *  - `whatsapp` → verde, reservado ao contato por WhatsApp
 *  - `secondary`/`outline`/`ghost` → navegação e ações de menor peso
 *
 * O ouro nunca recebe texto branco (contraste ~2:1). O texto do botão primário é
 * sempre `brand-950`.
 */
export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'whatsapp' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

const BASE =
  'inline-flex items-center justify-center gap-2 rounded-xl font-bold whitespace-nowrap '
  + 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2 '
  + 'disabled:pointer-events-none disabled:opacity-60';

const VARIANTES: Record<ButtonVariant, string> = {
  primary: 'bg-gold-500 text-brand-950 shadow-sm hover:bg-gold-400 active:bg-gold-600',
  secondary: 'bg-brand-900 text-white hover:bg-brand-800 active:bg-brand-950',
  outline: 'border border-brand-900/25 bg-transparent text-brand-900 hover:border-brand-900/60 hover:bg-brand-900/5',
  ghost: 'text-ink hover:bg-ink/5',
  whatsapp: 'bg-whatsapp text-white shadow-sm hover:brightness-95 active:brightness-90',
  danger: 'bg-danger text-white hover:brightness-95',
};

const TAMANHOS: Record<ButtonSize, string> = {
  sm: 'h-9 px-3 text-xs',
  md: 'h-11 px-4 text-sm',
  lg: 'h-12 px-6 text-base',
};

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant = 'primary', size = 'md', type = 'button', ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={cn(BASE, VARIANTES[variant], TAMANHOS[size], className)}
      {...props}
    />
  );
});

export interface ButtonLinkProps extends LinkProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children: React.ReactNode;
  /** Abre em nova aba com `rel` seguro. */
  externo?: boolean;
}

/** Mesmo visual do botão, mas navegando (o CTA principal do site é link). */
export function ButtonLink({
  className,
  variant = 'primary',
  size = 'md',
  externo = false,
  children,
  ...props
}: ButtonLinkProps) {
  return (
    <Link
      className={cn(BASE, VARIANTES[variant], TAMANHOS[size], className)}
      {...(externo ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      {...props}
    >
      {children}
    </Link>
  );
}
