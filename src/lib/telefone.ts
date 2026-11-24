/**
 * Normalização de telefone para links `wa.me`.
 *
 * Espelha `imoveis-taboao-api/src/shared/telefone.ts`: o payload público já vem
 * normalizado, mas este arquivo protege a vitrine contra dados antigos em cache
 * e contra a duplicação do DDI (`555511999999999`).
 */
export function somenteDigitos(valor: unknown): string {
  return String(valor ?? '').replace(/\D/g, '');
}

export function normalizarTelefoneWhatsapp(valor: unknown): string {
  const digitos = somenteDigitos(valor);
  if (!digitos) return '';
  if (digitos.startsWith('55') && (digitos.length === 12 || digitos.length === 13)) {
    return digitos;
  }
  if (digitos.length === 10 || digitos.length === 11) {
    return `55${digitos}`;
  }
  return digitos;
}

export function formatarTelefoneBrasil(valor: unknown): string {
  const normalizado = normalizarTelefoneWhatsapp(valor).replace(/^55/, '');
  if (normalizado.length === 11) {
    return `(${normalizado.slice(0, 2)}) ${normalizado.slice(2, 7)}-${normalizado.slice(7)}`;
  }
  if (normalizado.length === 10) {
    return `(${normalizado.slice(0, 2)}) ${normalizado.slice(2, 6)}-${normalizado.slice(6)}`;
  }
  return String(valor ?? '');
}

export function urlWhatsappCorretor(telefone: unknown, nome: string): string | null {
  const numero = normalizarTelefoneWhatsapp(telefone);
  if (!numero) return null;
  const texto = `Olá ${nome}! Vi sua vitrine no portal Imóveis Taboão e gostaria de mais informações sobre seus imóveis.`;
  return `https://wa.me/${numero}?text=${encodeURIComponent(texto)}`;
}
