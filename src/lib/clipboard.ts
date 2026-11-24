/**
 * Cópia de texto com fallback para navegadores sem Clipboard API segura.
 *
 * O botão da vitrine precisa funcionar também quando o site é aberto por HTTP
 * ou em WebView — `navigator.clipboard` simplesmente não existe nesses casos.
 */
export async function copiarTexto(texto: string): Promise<boolean> {
  if (typeof window === 'undefined') return false;

  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(texto);
      return true;
    }
  } catch {
    // Permissão negada: tenta o caminho legado abaixo.
  }

  try {
    const textarea = document.createElement('textarea');
    textarea.value = texto;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(textarea);
    return ok;
  } catch {
    return false;
  }
}
