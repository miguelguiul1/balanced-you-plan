import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

export type FavCategory = "receita" | "alimento" | "artigo" | "ia" | "plano";

export type FavItem = {
  id: string;
  category: FavCategory;
  title: string;
  subtitle?: string;
  to?: string;
  createdAt: string;
};

export const categoryLabels: Record<FavCategory, string> = {
  receita: "Receitas",
  alimento: "Alimentos",
  artigo: "Artigos e guias",
  ia: "Respostas da IA",
  plano: "Planos alimentares",
};

/**
 * Favoritos globais persistidos no Supabase.
 * Interface mantida igual para compatibilidade com componentes existentes.
 */
export const useGlobalFavorites = () => {
  const { user } = useAuth();
  const [items, setItems] = useState<FavItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Carrega favoritos do Supabase ao montar ou ao mudar o usuário.
  useEffect(() => {
    if (!user) {
      setItems([]);
      setLoading(false);
      return;
    }
    let cancelled = false;
    supabase
      .from("global_favorites")
      .select("id, category, item_id, title, subtitle, route, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (cancelled) return;
        if (error) {
          console.error("Erro ao carregar favoritos:", error.message);
          setItems([]);
        } else {
          setItems(
            (data ?? []).map((r) => ({
              id: r.item_id,
              category: r.category as FavCategory,
              title: r.title,
              subtitle: r.subtitle ?? undefined,
              to: r.route ?? undefined,
              createdAt: r.created_at,
            }))
          );
        }
        setLoading(false);
      });
    return () => { cancelled = true; };
  }, [user]);

  const isFavorite = useCallback(
    (category: FavCategory, id: string) => items.some((i) => i.category === category && i.id === id),
    [items]
  );

  const toggleFavorite = useCallback(
    async (item: Omit<FavItem, "createdAt">): Promise<boolean> => {
      if (!user) return false;
      const exists = items.some((i) => i.category === item.category && i.id === item.id);

      if (exists) {
        const { error } = await supabase
          .from("global_favorites")
          .delete()
          .eq("user_id", user.id)
          .eq("category", item.category)
          .eq("item_id", item.id);
        if (error) {
          console.error("Erro ao remover favorito:", error.message);
          return false;
        }
        setItems((prev) => prev.filter((i) => !(i.category === item.category && i.id === item.id)));
        return false;
      }

      const { error } = await supabase.from("global_favorites").insert({
        user_id: user.id,
        category: item.category,
        item_id: item.id,
        title: item.title,
        subtitle: item.subtitle ?? null,
        route: item.to ?? null,
      });
      if (error) {
        console.error("Erro ao adicionar favorito:", error.message);
        return false;
      }
      const now = new Date().toISOString();
      setItems((prev) => [{ ...item, createdAt: now }, ...prev]);
      return true;
    },
    [user, items]
  );

  const removeFavorite = useCallback(
    async (category: FavCategory, id: string) => {
      if (!user) return;
      const { error } = await supabase
        .from("global_favorites")
        .delete()
        .eq("user_id", user.id)
        .eq("category", category)
        .eq("item_id", id);
      if (error) {
        console.error("Erro ao remover favorito:", error.message);
        return;
      }
      setItems((prev) => prev.filter((i) => !(i.category === category && i.id === id)));
    },
    [user]
  );

  return { items, isFavorite, toggleFavorite, removeFavorite, loading };
};
