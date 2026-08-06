import { useMemo } from "react";
import {
  FoodEntry, MEAL_TYPES, mealLabel, sumTotals, toISODate, todayISO,
  useFoodLogRange, useGoals, useProgressPhotoCount, useWaterRange, useWeightLog,
} from "./useNutrition";

export const RANGE_DAYS = 90;

export const daysAgoISO = (n: number) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return toISODate(d);
};

export const diffDays = (a: string, b: string) =>
  Math.round((new Date(`${b}T12:00`).getTime() - new Date(`${a}T12:00`).getTime()) / 86400000);

export type ScoreBreakdown = { label: string; points: number; max: number; ok: boolean };

export type Achievement = {
  id: string;
  emoji: string;
  title: string;
  description: string;
  unlocked: boolean;
  progress: number; // 0-1
};

/** Score diário 0-100 — incentivo, nunca julgamento. */
export const computeScore = (opts: {
  totals: ReturnType<typeof sumTotals>;
  meals: number;
  waterMl: number;
  calGoal: number;
  protGoal: number;
  waterGoal: number;
  hasWeightToday: boolean;
}) => {
  const { totals, meals, waterMl, calGoal, protGoal, waterGoal, hasWeightToday } = opts;
  const ratio = (v: number, g: number) => (g > 0 ? v / g : 0);

  // Calorias: melhor pontuação perto da meta (não acima nem muito abaixo)
  const calR = ratio(totals.calories, calGoal);
  const calPts = Math.round(30 * Math.max(0, 1 - Math.abs(1 - Math.min(calR, 1.6)) / 0.6));
  const protPts = Math.round(25 * Math.min(1, ratio(totals.protein, protGoal)));
  const waterPts = Math.round(20 * Math.min(1, ratio(waterMl, waterGoal)));
  const mealPts = Math.round(15 * Math.min(1, meals / 4));
  const fiberPts = Math.round(5 * Math.min(1, totals.fiber / 25));
  const evoPts = hasWeightToday ? 5 : 0;

  const breakdown: ScoreBreakdown[] = [
    { label: "Calorias", points: calPts, max: 30, ok: calPts >= 24 },
    { label: "Proteínas", points: protPts, max: 25, ok: protPts >= 20 },
    { label: "Hidratação", points: waterPts, max: 20, ok: waterPts >= 16 },
    { label: "Refeições registradas", points: mealPts, max: 15, ok: mealPts >= 12 },
    { label: "Fibras", points: fiberPts, max: 5, ok: fiberPts >= 4 },
    { label: "Registro de evolução", points: evoPts, max: 5, ok: evoPts > 0 },
  ];

  const score = Math.min(100, breakdown.reduce((s, b) => s + b.points, 0));

  const good = breakdown.filter((b) => b.ok).map((b) => b.label.toLowerCase());
  const gaps = breakdown.filter((b) => !b.ok && b.max >= 5).map((b) => b.label.toLowerCase());
  let message = "Comece registrando sua primeira refeição do dia — cada registro conta.";
  if (meals > 0 || waterMl > 0) {
    const parts: string[] = [];
    if (good.length) parts.push(`Você foi bem em ${good.slice(0, 3).join(", ")}`);
    if (gaps.length) parts.push(`ainda dá para melhorar ${gaps.slice(0, 2).join(" e ")}`);
    message = parts.join(" e ") + ".";
  }

  return { score, breakdown, message };
};

const startOfDayKeys = (rows: { logged_at: string }[]) =>
  new Set(rows.map((r) => String(r.logged_at).slice(0, 10)));

/** Streak de dias consecutivos com registro alimentar. */
export const computeStreak = (dates: Set<string>) => {
  const today = todayISO();
  let current = 0;
  const cursor = new Date();
  if (!dates.has(today)) cursor.setDate(cursor.getDate() - 1); // dia atual ainda pode ser registrado
  for (let i = 0; i < 400; i++) {
    if (!dates.has(toISODate(cursor))) break;
    current++;
    cursor.setDate(cursor.getDate() - 1);
  }

  const sorted = [...dates].sort();
  let best = 0;
  let run = 0;
  sorted.forEach((d, i) => {
    run = i > 0 && diffDays(sorted[i - 1], d) === 1 ? run + 1 : 1;
    best = Math.max(best, run);
  });

  return { current, best: Math.max(best, current) };
};

export const useEngagement = () => {
  const today = todayISO();
  const from = daysAgoISO(RANGE_DAYS);

  const foodQ = useFoodLogRange(from, today);
  const waterQ = useWaterRange(from, today);
  const weightQ = useWeightLog();
  const goalsQ = useGoals();
  const photosQ = useProgressPhotoCount();

  const entries = useMemo(() => foodQ.data ?? [], [foodQ.data]);
  const waterRows = useMemo(() => waterQ.data ?? [], [waterQ.data]);
  const weights = useMemo(() => weightQ.data ?? [], [weightQ.data]);
  const photoCount = photosQ.data ?? 0;

  return useMemo(() => {
    const calGoal = goalsQ.data?.calories_goal ?? 2000;
    const protGoal = goalsQ.data?.protein_goal ?? 100;
    const waterGoal = goalsQ.data?.water_goal_ml ?? 2500;

    const byDay = new Map<string, FoodEntry[]>();
    entries.forEach((e) => {
      const k = e.logged_at;
      byDay.set(k, [...(byDay.get(k) ?? []), e]);
    });
    const waterByDay = new Map<string, number>();
    waterRows.forEach((w) => {
      const k = String(w.logged_at).slice(0, 10);
      waterByDay.set(k, (waterByDay.get(k) ?? 0) + Number(w.amount_ml || 0));
    });

    const weightDays = startOfDayKeys(weights as { logged_at: string }[]);
    const todayEntries = byDay.get(today) ?? [];

    const scoreOf = (day: string) =>
      computeScore({
        totals: sumTotals(byDay.get(day) ?? []),
        meals: (byDay.get(day) ?? []).length,
        waterMl: waterByDay.get(day) ?? 0,
        calGoal,
        protGoal,
        waterGoal,
        hasWeightToday: weightDays.has(day),
      });

    const todayScore = scoreOf(today);
    const streak = computeStreak(new Set(byDay.keys()));

    // últimos 7 dias
    const last7 = Array.from({ length: 7 }, (_, i) => daysAgoISO(6 - i));
    const week = last7.map((d) => {
      const t = sumTotals(byDay.get(d) ?? []);
      return {
        date: d,
        label: new Date(`${d}T12:00`).toLocaleDateString("pt-BR", { weekday: "short" }).replace(".", ""),
        calories: Math.round(t.calories),
        protein: Math.round(t.protein),
        fiber: Math.round(t.fiber),
        water: waterByDay.get(d) ?? 0,
        score: scoreOf(d).score,
        logged: (byDay.get(d) ?? []).length,
      };
    });

    const loggedDays = week.filter((d) => d.logged > 0);
    const avg = (k: "calories" | "protein" | "fiber" | "water" | "score") =>
      loggedDays.length ? Math.round(loggedDays.reduce((s, d) => s + d[k], 0) / loggedDays.length) : 0;

    // alimentos mais consumidos
    const foodCount = new Map<string, number>();
    entries.forEach((e) => foodCount.set(e.food_name, (foodCount.get(e.food_name) ?? 0) + 1));
    const topFoods = [...foodCount.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8);

    // refeições mais e menos registradas
    const mealCount = MEAL_TYPES.map((m) => ({
      id: m.id,
      label: m.label,
      count: entries.filter((e) => e.meal_type === m.id).length,
    }));
    const mostLoggedMeal = [...mealCount].sort((a, b) => b.count - a.count)[0];
    const forgottenMeal = [...mealCount].filter((m) => m.id !== "outro").sort((a, b) => a.count - b.count)[0];

    const bestDays = week.filter((d) => d.logged > 0).sort((a, b) => b.score - a.score).slice(0, 3);
    const missingDays = week.filter((d) => d.logged === 0).map((d) => d.date);

    // hidratação: dias consecutivos batendo a meta
    let waterStreak = 0;
    for (let i = 0; i < 60; i++) {
      const d = daysAgoISO(i);
      if (i === 0 && (waterByDay.get(d) ?? 0) < waterGoal) continue;
      if ((waterByDay.get(d) ?? 0) >= waterGoal) waterStreak++;
      else break;
    }

    // dias com proteína na meta
    const proteinGoalDays = [...byDay.keys()].filter(
      (d) => sumTotals(byDay.get(d) ?? []).protein >= protGoal
    ).length;

    const firstW = weights[0] ? Number(weights[0].weight_kg) : null;
    const lastW = weights.length ? Number(weights[weights.length - 1].weight_kg) : null;
    const weightDelta = firstW !== null && lastW !== null ? lastW - firstW : 0;

    const fullWeeks = week.filter((d) => d.logged > 0).length >= 7;

    const achievements: Achievement[] = [
      { id: "first_food", emoji: "🥇", title: "Primeiro alimento registrado", description: "Você deu o primeiro passo.", unlocked: entries.length >= 1, progress: Math.min(1, entries.length) },
      { id: "first_week", emoji: "🥗", title: "Primeira semana completa", description: "7 dias seguidos de registro.", unlocked: fullWeeks || streak.best >= 7, progress: Math.min(1, streak.best / 7) },
      { id: "water_7", emoji: "💧", title: "Água em 7 dias seguidos", description: "Meta de hidratação batida por uma semana.", unlocked: waterStreak >= 7, progress: Math.min(1, waterStreak / 7) },
      { id: "first_photo", emoji: "📸", title: "Primeira foto de evolução", description: "Registro visual do seu progresso.", unlocked: photoCount >= 1, progress: Math.min(1, photoCount) },
      { id: "lost_5kg", emoji: "📈", title: "Variação de 5kg", description: "5kg de diferença desde o primeiro registro.", unlocked: Math.abs(weightDelta) >= 5, progress: Math.min(1, Math.abs(weightDelta) / 5) },
      { id: "protein_10", emoji: "💪", title: "Proteína na meta por 10 dias", description: "Consistência que constrói resultado.", unlocked: proteinGoalDays >= 10, progress: Math.min(1, proteinGoalDays / 10) },
      { id: "streak_30", emoji: "🔥", title: "30 dias de sequência", description: "Um mês inteiro de constância.", unlocked: streak.best >= 30, progress: Math.min(1, streak.best / 30) },
      { id: "score_90", emoji: "⭐", title: "Score 90+", description: "Um dia com desempenho excelente.", unlocked: week.some((d) => d.score >= 90), progress: Math.min(1, Math.max(...week.map((d) => d.score), 0) / 90) },
    ];

    // Sugestões proativas — sempre em linguagem positiva
    const proactive: string[] = [];
    if (todayEntries.length === 0 && streak.current > 0)
      proactive.push(`Você está com uma sequência de ${streak.current} dias. Que tal registrar sua primeira refeição de hoje?`);
    if (forgottenMeal && mostLoggedMeal && forgottenMeal.count * 3 < mostLoggedMeal.count)
      proactive.push(`Você registra pouco o ${forgottenMeal.label.toLowerCase()}. Quer ideias práticas para essa refeição?`);
    if (avg("water") > 0 && avg("water") < waterGoal * 0.8)
      proactive.push("Sua hidratação está um pouco abaixo da média da semana. Quer dicas simples para beber mais água?");
    if (loggedDays.length >= 3 && avg("fiber") < 20)
      proactive.push("Você costuma consumir poucas fibras. Posso sugerir alimentos fáceis para aumentar isso.");
    if (avg("score") >= 80 && loggedDays.length >= 3)
      proactive.push("Sua semana está indo muito bem! Quer manter o ritmo com um plano ajustado?");
    if (missingDays.length >= 2)
      proactive.push(`Você teve ${missingDays.length} dias sem registro na semana. Quer retomar hoje com algo simples?`);

    return {
      loading: foodQ.isLoading || waterQ.isLoading || goalsQ.isLoading,
      goals: { calGoal, protGoal, waterGoal },
      today: { ...todayScore, entries: todayEntries, meals: todayEntries.length, water: waterByDay.get(today) ?? 0 },
      streak,
      week,
      averages: {
        calories: avg("calories"), protein: avg("protein"), fiber: avg("fiber"),
        water: avg("water"), score: avg("score"), loggedDays: loggedDays.length,
      },
      topFoods,
      mealCount,
      mostLoggedMeal,
      forgottenMeal,
      bestDays,
      missingDays,
      waterStreak,
      proteinGoalDays,
      weights,
      weightDelta,
      achievements,
      proactive: proactive.slice(0, 4),
      mealLabel,
    };
  }, [entries, waterRows, weights, photoCount, goalsQ.data, today, foodQ.isLoading, waterQ.isLoading, goalsQ.isLoading]);
};