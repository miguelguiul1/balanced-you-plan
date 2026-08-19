/**
 * Persistência temporária dos dados de onboarding preenchidos ANTES da autenticação.
 * Guarda apenas dados de perfil alimentar (nunca tokens, senhas ou segredos).
 * Usa localStorage porque o fluxo pode passar por confirmação de e-mail em outra aba.
 */
import type { Objective } from "./objectives";

const KEY = "evolua:onboardingDraft:v1";
const MAX_AGE_MS = 1000 * 60 * 60 * 24 * 7; // 7 dias

export type OnboardingDraft = {
  objective: Objective;
  weightKg: number;
  heightCm: number;
  age: number;
  sex: "masculino" | "feminino" | "";
  activity: string;
  sports: string[];
  metrics: { bmr: number; tdee: number; calories: number; protein: number; carbs: number; fat: number };
  savedAt: number;
};

export const saveDraft = (draft: Omit<OnboardingDraft, "savedAt">) => {
  try {
    localStorage.setItem(KEY, JSON.stringify({ ...draft, savedAt: Date.now() }));
  } catch {
    /* storage indisponível — o fluxo continua, apenas sem preservação */
  }
};

export const loadDraft = (): OnboardingDraft | null => {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as OnboardingDraft;
    if (!parsed?.objective || !parsed?.weightKg || !parsed?.heightCm || !parsed?.age) return null;
    if (Date.now() - (parsed.savedAt ?? 0) > MAX_AGE_MS) {
      localStorage.removeItem(KEY);
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
};

/** Só deve ser chamado APÓS confirmação de que os dados foram salvos no backend. */
export const clearDraft = () => {
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* noop */
  }
};
