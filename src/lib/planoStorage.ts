/**
 * Persistência do plano semanal.
 * Fonte de verdade: Supabase (meal_plans).
 * localStorage: cache temporário para fallback offline e migração de dados antigos.
 */

import { supabase } from "@/integrations/supabase/client";

export type PlanoRefeicao = {
  tipo: string;
  nome: string;
  calorias: number;
  proteina: number;
  carb: number;
  gordura: number;
  ingredientes: string[];
  preparo: string;
};

export type StoredPlano = {
  goal?: string;
  plano: {
    resumo?: Record<string, number | string>;
    lista_compras?: string[];
    dicas?: string[];
    custo_estimado?: string;
    plano: { dia: string; refeicoes: PlanoRefeicao[] }[];
  };
};

const LS_KEY_PREFIX = "evoluaPlano:";

/** Lê do localStorage (usado para migração e fallback). */
const readLocal = (userId: string): StoredPlano | null => {
  try {
    const raw = localStorage.getItem(LS_KEY_PREFIX + userId);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredPlano;
    return parsed?.plano?.plano?.length ? parsed : null;
  } catch {
    return null;
  }
};

/** Remove dado do localStorage após migração bem-sucedida. */
const clearLocal = (userId: string) => {
  try {
    localStorage.removeItem(LS_KEY_PREFIX + userId);
  } catch {
    /* noop */
  }
};

/**
 * Lê o plano do Supabase.
 * Se não existir no Supabase, tenta migrar do localStorage automaticamente.
 */
export const loadStoredPlano = async (userId?: string | null): Promise<StoredPlano | null> => {
  if (!userId) return null;

  const { data, error } = await supabase
    .from("meal_plans")
    .select("plan_data, goal")
    .eq("user_id", userId)
    .maybeSingle();

  if (!error && data) {
    const plano = data.plan_data as unknown as StoredPlano["plano"];
    const result: StoredPlano = { plano, goal: data.goal ?? undefined };
    // Limpa localStorage antigo após leitura bem-sucedida do Supabase.
    clearLocal(userId);
    return result;
  }

  // Fallback: tenta migrar do localStorage.
  const local = readLocal(userId);
  if (local) {
    // Salva no Supabase em background (não bloqueia a UI).
    saveStoredPlano(userId, local).catch(() => {});
    return local;
  }

  return null;
};

/** Leitura leve e síncrona para verificar se existe plano (usado pelo Dashboard). */
export const hasStoredPlan = (userId?: string | null): boolean => {
  if (!userId) return false;
  // Verifica localStorage como indicador rápido (será atualizado async).
  return !!readLocal(userId);
};

/** Salva o plano no Supabase e no localStorage (cache). */
export const saveStoredPlano = async (userId: string, data: StoredPlano): Promise<void> => {
  const { error } = await supabase
    .from("meal_plans")
    .upsert(
      {
        user_id: userId,
        plan_data: data.plano as unknown as Record<string, unknown>,
        goal: data.goal ?? null,
      },
      { onConflict: "user_id" }
    );

  if (error) {
    console.error("Erro ao salvar plano no Supabase:", error.message);
  }

  // Mantém localStorage como cache para leitura síncrona (Dashboard).
  try {
    localStorage.setItem(LS_KEY_PREFIX + userId, JSON.stringify(data));
  } catch {
    /* noop */
  }
};

/** Remove o plano do Supabase e do localStorage. */
export const clearStoredPlano = async (userId?: string | null): Promise<void> => {
  if (!userId) return;
  await supabase.from("meal_plans").delete().eq("user_id", userId);
  clearLocal(userId);
};
