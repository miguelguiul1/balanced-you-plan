export type PlanKey = "mensal" | "semestral" | "anual";

export interface Plan {
  key: PlanKey;
  label: { pt: string; en: string };
  priceBRL: number;
  priceUSD: number;
  period: { pt: string; en: string };
  badge: { pt: string | null; en: string | null };
  highlight: boolean;
  savings: { pt: string; en: string } | null;
}

export const PLANS: Record<PlanKey, Plan> = {
  mensal: {
    key: "mensal",
    label: { pt: "Mensal", en: "Monthly" },
    priceBRL: 29.9,
    priceUSD: 5.9,
    period: { pt: "/mês", en: "/month" },
    badge: { pt: null, en: null },
    highlight: false,
    savings: null,
  },
  semestral: {
    key: "semestral",
    label: { pt: "Semestral", en: "6 months" },
    priceBRL: 129.9,
    priceUSD: 24.9,
    period: { pt: "/6 meses", en: "/6 months" },
    badge: { pt: "Mais popular", en: "Best value" },
    highlight: true,
    savings: { pt: "Economize 28%", en: "Save 28%" },
  },
  anual: {
    key: "anual",
    label: { pt: "Anual", en: "Annual" },
    priceBRL: 249.9,
    priceUSD: 49.9,
    period: { pt: "/ano", en: "/year" },
    badge: { pt: "Melhor custo-benefício", en: "Best value" },
    highlight: false,
    savings: { pt: "Economize 30%", en: "Save 30%" },
  },
};

export const PLAN_KEYS: PlanKey[] = ["mensal", "semestral", "anual"];

export function formatPrice(value: number, lang: "pt" | "en"): string {
  const formatted = value.toFixed(2);
  if (lang === "pt") {
    return formatted.replace(".", ",");
  }
  return formatted;
}

export function currencySymbol(lang: "pt" | "en"): string {
  return lang === "pt" ? "R$" : "$";
}

export function planPrice(plan: Plan, lang: "pt" | "en"): number {
  return lang === "pt" ? plan.priceBRL : plan.priceUSD;
}
