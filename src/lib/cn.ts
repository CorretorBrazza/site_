/**
 * Junta classes condicionais sem dependência externa.
 *
 * Uso: cn('base', ativo && 'bg-gold-500', className)
 *
 * Não faz merge de conflito de utilitário (tipo `twMerge`): o projeto não tem
 * essa dependência e as primitivas são escritas para que a classe do chamador
 * venha por último, que é o comportamento esperado aqui.
 */
export function cn(...partes: Array<string | false | null | undefined>): string {
  return partes.filter(Boolean).join(' ');
}
