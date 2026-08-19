/**
 * Fonte ÚNICA de cálculo de estimativas nutricionais (TMB/TDEE/macros).
 * Usada pela calculadora da landing e pelo onboarding — não duplicar esta lógica.
 * Todos os valores são ESTIMATIVAS educacionais, nunca prescrição.
 */
import type { Objective } from "./objectives";

export type ActivityLevel = "sedentario" | "leve" | "moderado" | "intenso" | "muito_intenso";

export const ACTIVITY_LEVELS: { id: ActivityLevel; label: string; desc: string; mult: number }[] = [
  { id: "sedentario", label: "Sedentário", desc: "Trabalho de escritório, pouco exercício", mult: 1.2 },
  { id: "leve", label: "Levemente ativo", desc: "Exercício leve 1-3x por semana", mult: 1.375 },
  { id: "moderado", label: "Moderadamente ativo", desc: "Exercício moderado 3-5x por semana", mult: 1.55 },
  { id: "intenso", label: "Muito ativo", desc: "Exercício intenso 6-7x por semana", mult: 1.725 },
  { id: "muito_intenso", label: "Extremamente ativo", desc: "Treino intenso + trabalho físico", mult: 1.9 },
];

export const activityMultiplier = (id?: string | null) =>
  ACTIVITY_LEVELS.find((a) => a.id === id)?.mult ?? 1.55;

export const activityLabel = (id?: string | null) =>
  ACTIVITY_LEVELS.find((a) => a.id === id)?.label ?? "Não informado";

export type MetricsInput = {
  weightKg: number;
  heightCm: number;
  age: number;
  /** opcional — quando ausente usa uma constante neutra */
  sex?: "masculino" | "feminino" | "" | null;
  activity?: string | null;
  objective: Objective;
};

export type Metrics = {
  bmr: number;
  tdee: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};

/** Mifflin-St Jeor com constante neutra quando o sexo não é informado. */
export const computeMetrics = (input: MetricsInput): Metrics => {
  const { weightKg, heightCm, age, sex, activity, objective } = input;
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
  const bmr = sex === "masculino" ? base + 5 : sex === "feminino" ? base - 161 : base - 78;
  const tdee = bmr * activityMultiplier(activity);

  const calories =
    objective === "weight_loss" ? tdee - 400 : objective === "muscle_gain" ? tdee + 350 : tdee;

  const protein = weightKg * (objective === "muscle_gain" ? 2.0 : 1.6);
  const fat = (calories * 0.25) / 9;
  const carbs = Math.max(0, (calories - protein * 4 - fat * 9) / 4);

  return {
    bmr: Math.round(bmr),
    tdee: Math.round(tdee),
    calories: Math.round(calories),
    protein: Math.round(protein),
    carbs: Math.round(carbs),
    fat: Math.round(fat),
  };
};

/** Textos curtos de ajuda contextual para termos técnicos. */
export const GLOSSARY = {
  tmb: "Estimativa da energia que seu corpo usa em repouso.",
  tdee: "Estimativa do gasto de energia considerando sua atividade física.",
  macros: "Distribuição aproximada de proteínas, carboidratos e gorduras.",
} as const;
