/**
 * Escape de HTML para valores não confiáveis.
 *
 * OBJETIVO: qualquer dado vindo do usuário (nome, telefone, texto digitado) que precise
 * aparecer dentro de uma string markupada — como as mensagens do simulador, renderizadas
 * via `dangerouslySetInnerHTML` — deve passar por `escapeHtml` ANTES da interpolação.
 *
 * Sem isso, `nome = '<img src=x onerror=alert(1)>'` executa JavaScript no navegador de
 * quem está usando o simulador (XSS DOM).
 *
 * `&` é escapado primeiro para não duplicar as substituições seguintes.
 */
const HTML_ESCAPES: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '`': '&#96;',
};

export function escapeHtml(value: unknown): string {
    if (value === null || value === undefined) return '';
    return String(value).replace(/[&<>"'`]/g, (char) => HTML_ESCAPES[char]);
}

/**
 * Versão para uso dentro de atributos delimitados por aspas simples.
 * Mantida como alias explícito para deixar a intenção clara na call site.
 */
export function escapeHtmlAttr(value: unknown): string {
    return escapeHtml(value);
}
