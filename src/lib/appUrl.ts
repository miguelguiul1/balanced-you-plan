/** Resolve a URL pública a usar nos redirects de e-mail do Supabase.
 *
 * Prioridade:
 *  1. VITE_APP_URL (configurado no .env) — usado pelo app Capacitor, onde
 *     window.location.origin apontaria para o WebView local (inválido no Supabase).
 *  2. window.location.origin — comportamento web atual (inalterado).
 */
export const resolveAppUrl = (): string => {
  const configured = import.meta.env.VITE_APP_URL as string | undefined;
  if (configured && configured.trim() && /^https?:\/\//.test(configured.trim())) {
    return configured.trim().replace(/\/+$/, "");
  }
  if (typeof window !== "undefined" && window.location?.origin) {
    return window.location.origin;
  }
  return "";
};