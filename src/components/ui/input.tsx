import { forwardRef } from 'react';
import { cn } from '@/lib/cn';

const BASE =
  'w-full rounded-xl border border-line bg-surface px-3.5 py-3 text-sm text-ink placeholder:text-muted/70 '
  + 'focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500/25 '
  + 'disabled:cursor-not-allowed disabled:bg-paper disabled:text-muted';

export const Input = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  function Input({ className, ...props }, ref) {
    return <input ref={ref} className={cn(BASE, className)} {...props} />;
  },
);

export const Textarea = forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  function Textarea({ className, rows = 4, ...props }, ref) {
    return <textarea ref={ref} rows={rows} className={cn(BASE, 'leading-relaxed', className)} {...props} />;
  },
);

export const Select = forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(
  function Select({ className, children, ...props }, ref) {
    return (
      <select ref={ref} className={cn(BASE, 'bg-surface', className)} {...props}>
        {children}
      </select>
    );
  },
);
