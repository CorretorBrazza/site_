import Link from 'next/link';
import { cn } from '@/lib/cn';

export interface LogoProps {
  /** `escuro` para fundo claro (uso padrão); `claro` para fundo navy. */
  tom?: 'escuro' | 'claro';
  /** Exibe o nome ao lado do monograma. */
  comNome?: boolean;
  /** Tamanho do monograma em px. */
  tamanho?: number;
  className?: string;
  /** Quando falso, renderiza sem link (útil dentro de outro link). */
  linkado?: boolean;
}

/**
 * Monograma + nome.
 *
 * PROVISÓRIO: o arquivo recebido é um JPG de 75×65 px e não tem vetor. Enquanto
 * o SVG oficial não chega, este componente desenha o monograma com as cores
 * amostradas do arquivo (navy #091731, ouro #C9A961, branco). Trocar o SVG é
 * substituir apenas o bloco <svg> abaixo — nada mais no site depende disso.
 */
export function Logo({
  tom = 'escuro',
  comNome = true,
  tamanho = 40,
  className,
  linkado = true,
}: LogoProps) {
  const nomeCor = tom === 'escuro' ? 'text-brand-900' : 'text-white';
  const destaqueCor = tom === 'escuro' ? 'text-gold-600' : 'text-gold-400';
  const subCor = tom === 'escuro' ? 'text-muted' : 'text-white/60';

  const conteudo = (
    <span className={cn('group inline-flex items-center gap-3', className)}>
      <svg
        width={tamanho}
        height={tamanho}
        viewBox="0 0 40 40"
        role="img"
        aria-label="Imóveis Taboão"
        className="shrink-0 transition-transform duration-200 group-hover:scale-105"
      >
        <rect width="40" height="40" rx="10" fill="var(--color-brand-900)" />
        {/* Pilar claro (esquerda) e arco dourado (direita): leitura do ícone atual */}
        <path d="M11 9h6v22h-6z" fill="#ffffff" />
        <path d="M11 24.5 17 18v13h-6z" fill="var(--color-gold-500)" opacity="0.9" />
        <path
          d="M23 9h6v5h-6a3 3 0 0 0-3 3v14h-6V17a8 8 0 0 1 8-8z"
          fill="var(--color-gold-500)"
        />
      </svg>

      {comNome && (
        <span className="flex flex-col">
          <span className={cn('font-display text-xl font-bold leading-none tracking-tight sm:text-2xl', nomeCor)}>
            Imóveis <span className={destaqueCor}>Taboão</span>
          </span>
          <span className={cn('mt-1 text-[10px] font-bold uppercase leading-none tracking-[0.14em]', subCor)}>
            Taboão da Serra e imediações
          </span>
        </span>
      )}
    </span>
  );

  if (!linkado) return conteudo;

  return (
    <Link href="/" aria-label="Imóveis Taboão — página inicial" className="inline-flex">
      {conteudo}
    </Link>
  );
}
