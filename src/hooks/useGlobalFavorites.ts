import { useCallback, useEffect, useState } from "react";

export type FavCategory = "receita" | "alimento" | "artigo" | "ia" | "plano";

export type FavItem = {
  id: string;
  category: FavCategory;
  title: string;
  subtitle?: string;
  to?: string;
  createdAt: string;
};

const KEY = "evoluaFavoritos";

export const categoryLabels: Record<FavCategory, string> = {
  receita: "Receitas",
  alimento: "Alimentos",
  artigo: "Artigos e guias",
  ia: "Respostas da IA",
  plano: "Planos alimentares",
};

const read = (): FavItem[] => {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
};

const EVENT = "evolua-favoritos";

/** Favoritos globais (receitas, alimentos, artigos, respostas da IA e planos). */
export const useGlobalFavorites = () => {
  const [items, setItems] = useState<FavItem[]>(read);

  useEffect(() => {
    const sync = () => setItems(read());
    window.addEventListener(EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const persist = useCallback((next: FavItem[]) => {
    localStorage.setItem(KEY, JSON.stringify(next));
    setItems(next);
    window.dispatchEvent(new Event(EVENT));
  }, []);

  const isFavorite = useCallback(
    (category: FavCategory, id: string) => items.some((i) => i.category === category && i.id === id),
    [items]
  );

  const toggleFavorite = useCallback(
    (item: Omit<FavItem, "createdAt">) => {
      const current = read();
      const exists = current.some((i) => i.category === item.category && i.id === item.id);
      const next = exists
        ? current.filter((i) => !(i.category === item.category && i.id === item.id))
        : [{ ...item, createdAt: new Date().toISOString() }, ...current];
      persist(next);
      return !exists;
    },
    [persist]
  );

  const removeFavorite = useCallback(
    (category: FavCategory, id: string) =>
      persist(read().filter((i) => !(i.category === category && i.id === id))),
    [persist]
  );

  return { items, isFavorite, toggleFavorite, removeFavorite };
};