/**
 * Taxonomia única de objetivos do Evolua Plus (Pré-Beta 04).
 * Todos os módulos (calculadora, onboarding, preferências, plano, IA)
 * devem usar EXCLUSIVAMENTE estes valores internos.
 */

export type Objective = "weight_loss" | "muscle_gain" | "maintenance";

export const OBJECTIVES: {
  id: Objective;
  label: string;
  desc: string;
  emoji: string;
}[] = [
  { id: "weight_loss", label: "Emagrecer", desc: "Perder gordura de forma saudável", emoji: "🔥" },
  { id: "muscle_gain", label: "Ganhar massa muscular", desc: "Construir músculos com nutrição adequada", emoji: "💪" },
  { id: "maintenance", label: "Manter e equilibrar", desc: "Mais energia e uma rotina alimentar organizada", emoji: "🍃" },
];

/** Mapeia valores legados (emagrecer, emagrecimento, massa, energia...) para a taxonomia atual. */
export const normalizeObjective = (raw?: string | null): Objective | null => {
  if (!raw) return null;
  const v = raw.trim().toLowerCase();
  if (!v) return null;
  if (v === "weight_loss" || v === "muscle_gain" || v === "maintenance") return v;
  if (/(emagrec|perder|weight|gordura|cut)/.test(v)) return "weight_loss";
  if (/(massa|muscul|hipertrof|bulk|muscle)/.test(v)) return "muscle_gain";
  return "maintenance";
};

export const objectiveLabel = (raw?: string | null): string => {
  const id = normalizeObjective(raw);
  return OBJECTIVES.find((o) => o.id === id)?.label ?? "Não definido";
};

export const objectiveOption = (raw?: string | null) => {
  const id = normalizeObjective(raw);
  return OBJECTIVES.find((o) => o.id === id) ?? null;
};
