/**
 * Allowlist de destinos internos pós-autenticação.
 * Impede open redirect: nada externo ou arbitrário é aceito.
 */
const ALLOWED: Record<string, string> = {
  onboarding: "/onboarding",
  "/onboarding": "/onboarding",
  dashboard: "/dashboard",
  "/dashboard": "/dashboard",
};

export const resolveNext = (raw?: string | null): string | null => {
  if (!raw) return null;
  const v = raw.trim();
  if (!v || v.startsWith("//") || v.includes(":")) return null;
  return ALLOWED[v] ?? null;
};
