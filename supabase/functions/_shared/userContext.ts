// Carrega o contexto REAL do usuário direto do banco, usando o JWT da requisição.
// O client abaixo atua como o próprio usuário (RLS ativa) — nunca use service_role aqui.
import { createClient } from "npm:@supabase/supabase-js@2";
import { json } from "./guard.ts";

export type UserContext = {
  userId: string;
  profile: {
    age: number | null;
    sex: string | null;
    height_cm: number | null;
    activity_level: string | null;
  } | null;
  latestWeightKg: number | null;
  goals: {
    calories_goal: number | null;
    protein_goal: number | null;
    carbs_goal: number | null;
    fat_goal: number | null;
  } | null;
  preferences: {
    objective: string | null;
    restrictions: string[] | null;
    liked_foods: string[] | null;
    disliked_foods: string[] | null;
  } | null;
};

const MAX_ITEMS = 40;

/** Sanitiza listas vindas do banco antes de entrarem no prompt. */
const cleanList = (value: unknown): string[] =>
  Array.isArray(value)
    ? value
        .filter((v): v is string => typeof v === "string")
        .map((v) => v.replace(/[\x00-\x1F\x7F]/g, " ").trim().slice(0, 60))
        .filter(Boolean)
        .slice(0, MAX_ITEMS)
    : [];

const numOrNull = (v: unknown): number | null => {
  const n = typeof v === "string" ? Number(v) : v;
  return typeof n === "number" && Number.isFinite(n) ? n : null;
};

/**
 * Cria um client Supabase autenticado com o token do chamador e carrega
 * perfil, metas, preferências e último peso. Tudo filtrado por RLS.
 */
export async function loadUserContext(
  req: Request,
  userId: string,
): Promise<UserContext | Response> {
  const authHeader = req.headers.get("Authorization") ?? "";
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_ANON_KEY")!,
    {
      auth: { persistSession: false, autoRefreshToken: false },
      global: { headers: { Authorization: authHeader } },
    },
  );

  try {
    const [{ data: profile }, { data: prefs }, { data: goals }, { data: weight }] = await Promise.all([
      supabase.from("profiles").select("age, sex, height_cm, activity_level").eq("id", userId).maybeSingle(),
      supabase
        .from("user_preferences")
        .select("objective, restrictions, liked_foods, disliked_foods")
        .eq("user_id", userId)
        .maybeSingle(),
      supabase
        .from("user_goals")
        .select("calories_goal, protein_goal, carbs_goal, fat_goal")
        .eq("user_id", userId)
        .maybeSingle(),
      supabase
        .from("weight_log")
        .select("weight_kg")
        .eq("user_id", userId)
        .order("logged_at", { ascending: false })
        .limit(1)
        .maybeSingle(),
    ]);

    if (profile === null && prefs === null && goals === null && weight === null) {
      // Nenhum dado localizado para este user id — não deve acontecer com JWT válido.
      console.error(`Nenhum dado encontrado para o usuário autenticado`);
    }

    return {
      userId,
      profile: profile
        ? {
            age: numOrNull(profile.age),
            sex: typeof profile.sex === "string" ? profile.sex.slice(0, 20) : null,
            height_cm: numOrNull(profile.height_cm),
            activity_level: typeof profile.activity_level === "string" ? profile.activity_level.slice(0, 30) : null,
          }
        : null,
      latestWeightKg: numOrNull(weight?.weight_kg),
      goals: goals
        ? {
            calories_goal: numOrNull(goals.calories_goal),
            protein_goal: numOrNull(goals.protein_goal),
            carbs_goal: numOrNull(goals.carbs_goal),
            fat_goal: numOrNull(goals.fat_goal),
          }
        : null,
      preferences: prefs
        ? {
            objective: typeof prefs.objective === "string" ? prefs.objective.trim().slice(0, 60) || null : null,
            restrictions: cleanList(prefs.restrictions),
            liked_foods: cleanList(prefs.liked_foods),
            disliked_foods: cleanList(prefs.disliked_foods),
          }
        : null,
    };
  } catch (e) {
    console.error("Falha ao carregar contexto do usuário:", e);
    return json({ error: "Não conseguimos carregar seu perfil agora. Tente novamente." }, 500);
  }
}

/** Erro controlado quando faltam dados essenciais para gerar um plano confiável. */
export const insufficientData = () =>
  json(
    {
      error:
        "Seu perfil ainda não tem objetivo ou metas suficientes. Complete o onboarding ou ajuste suas preferências para gerar um plano confiável.",
      code: "insufficient_profile_data",
    },
    400,
  );
