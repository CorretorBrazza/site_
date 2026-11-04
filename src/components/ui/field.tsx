import { cn } from '@/lib/cn';

export interface FieldProps {
  /** Precisa ser igual ao `id` do controle para o rótulo focar o campo. */
  htmlFor: string;
  label: string;
  hint?: string;
  error?: string;
  obrigatorio?: boolean;
  className?: string;
  children: React.ReactNode;
}

/**
 * Rótulo + controle + mensagens.
 *
 * Existe para que `htmlFor`/`id`, `aria-invalid` e `aria-describedby` não sejam
 * esquecidos campo a campo — foi exatamente o que deixou ~20 campos do
 * formulário de edição sem nome acessível.
 */
export function Field({
  htmlFor,
  label,
  hint,
  error,
  obrigatorio = false,
  className,
  children,
}: FieldProps) {
  const idErro = `${htmlFor}-erro`;
  const idDica = `${htmlFor}-dica`;

  return (
    <div className={cn('space-y-1.5', className)}>
      <label
        htmlFor={htmlFor}
        className="block text-[11px] font-extrabold uppercase tracking-wider text-muted"
      >
        {label}
        {obrigatorio && <span className="ml-0.5 text-danger">*</span>}
      </label>

      {children}

      {hint && !error && (
        <p id={idDica} className="text-[11px] text-muted">
          {hint}
        </p>
      )}
      {error && (
        <p id={idErro} role="alert" className="text-[11px] font-bold text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
