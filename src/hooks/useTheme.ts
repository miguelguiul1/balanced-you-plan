import { useCallback, useEffect, useState } from "react";

export type ThemeMode = "light" | "dark" | "system";
const KEY = "evoluaTheme";

const systemDark = () => window.matchMedia("(prefers-color-scheme: dark)").matches;

export const applyTheme = (mode: ThemeMode) => {
  const dark = mode === "dark" || (mode === "system" && systemDark());
  document.documentElement.classList.toggle("dark", dark);
};

export const initTheme = () => {
  const stored = (localStorage.getItem(KEY) as ThemeMode) || "light";
  applyTheme(stored);
};

export const useTheme = () => {
  const [theme, setThemeState] = useState<ThemeMode>(
    () => (localStorage.getItem(KEY) as ThemeMode) || "light"
  );

  useEffect(() => {
    applyTheme(theme);
    localStorage.setItem(KEY, theme);
    if (theme !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => applyTheme("system");
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [theme]);

  const setTheme = useCallback((mode: ThemeMode) => setThemeState(mode), []);
  return { theme, setTheme };
};