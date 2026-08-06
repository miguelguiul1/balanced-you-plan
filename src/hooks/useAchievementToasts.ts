import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { Achievement } from "./useEngagement";

const KEY = "evolua:achievements";

/** Mostra uma animação discreta quando uma conquista é desbloqueada. */
export const useAchievementToasts = (achievements: Achievement[]) => {
  const shown = useRef(false);
  useEffect(() => {
    if (!achievements.length || shown.current) return;
    let seen: string[] = [];
    try {
      seen = JSON.parse(localStorage.getItem(KEY) ?? "[]");
    } catch { seen = []; }

    const unlocked = achievements.filter((a) => a.unlocked).map((a) => a.id);
    const fresh = achievements.filter((a) => a.unlocked && !seen.includes(a.id));

    if (seen.length || unlocked.length) localStorage.setItem(KEY, JSON.stringify(unlocked));
    if (!seen.length) { shown.current = true; return; } // primeira visita: não spammar

    fresh.slice(0, 3).forEach((a, i) =>
      setTimeout(() => toast.success(`${a.emoji} Conquista desbloqueada!`, { description: a.title }), i * 600)
    );
    shown.current = true;
  }, [achievements]);
};