/**
 * Serializa dados para script JSON-LD de forma segura contra XSS injetado,
 * escapando caracteres de controle HTML (<, >, &) usando sequências unicode JSON válidas.
 */
export function safeJsonLd(data: unknown): string {
  return JSON.stringify(data)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026');
}
