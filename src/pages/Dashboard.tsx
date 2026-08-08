import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Flame, Beef, Wheat, Droplets, Target, TrendingUp, BookOpen, Camera,
  Utensils, Bot, Clock, CalendarClock, Lightbulb, Scale, BarChart3,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import WaterTracker from "@/components/WaterTracker";
import MotivationalQuote from "@/components/MotivationalQuote";
import { MEAL_TYPES, mealLabel, sumTotals, todayISO, useFoodLog, useGoals, useWater } from "@/hooks/useNutrition";
import { useEngagement } from "@/hooks/useEngagement";
import { useAchievementToasts } from "@/hooks/useAchievementToasts";
import ScoreCard from "@/components/engajamento/ScoreCard";
import StreakCard from "@/components/engajamento/StreakCard";
import WeekSummaryCards from "@/components/dashboard/WeekSummaryCards";
import { PageSkeleton } from "@/components/ds/Skeletons";

const Dashboard = () => {
  const { user } = useAuth();
  const [name, setName] = useState("");
  const today = todayISO();

  const { data: entries = [] } = useFoodLog(today);
  const { data: goals } = useGoals();
  const { data: waterMl = 0 } = useWater(today);
  const engagement = useEngagement();
  useAchievementToasts(engagement.achievements);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("profiles").select("full_name").eq("id", user.id).maybeSingle()
      .then(({ data }) => { if (data?.full_name) setName(data.full_name.split(" ")[0]); });
  }, [user]);

  const totals = sumTotals(entries);
  const calGoal = goals?.calories_goal ?? 2000;
  const protGoal = goals?.protein_goal ?? 100;
  const waterGoal = goals?.water_goal_ml ?? 2500;
  // Distribuição de referência: 50% carbo, 25% gordura das calorias-meta
  const carbGoal = Math.round((calGoal * 0.5) / 4);
  const fatGoal = Math.round((calGoal * 0.25) / 9);

  const lastMeal = entries.length ? entries[entries.length - 1] : null;

  const nextMeal = useMemo(() => {
    const hour = new Date().getHours();
    const logged = new Set(entries.map((e) => e.meal_type));
    return (
      MEAL_TYPES.find((m) => m.id !== "outro" && m.hour >= hour && !logged.has(m.id)) ??
      MEAL_TYPES.find((m) => m.id !== "outro" && !logged.has(m.id)) ??
      null
    );
  }, [entries]);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Bom dia";
    if (h < 18) return "Boa tarde";
    return "Boa noite";
  };

  const pct = (v: number, g: number) => Math.min(100, Math.round((v / (g || 1)) * 100));

  const macros = [
    { label: "Calorias", icon: Flame, value: Math.round(totals.calories), goal: calGoal, unit: "kcal", ring: "bg-primary", tint: "bg-primary/10 text-primary" },
    { label: "Proteína", icon: Beef, value: Math.round(totals.protein), goal: protGoal, unit: "g", ring: "bg-primary", tint: "bg-primary/10 text-primary" },
    { label: "Carboidratos", icon: Wheat, value: Math.round(totals.carbs), goal: carbGoal, unit: "g", ring: "bg-accent", tint: "bg-accent/10 text-accent" },
    { label: "Gorduras", icon: Droplets, value: Math.round(totals.fat), goal: fatGoal, unit: "g", ring: "bg-primary/60", tint: "bg-secondary text-foreground" },
  ];

  const shortcuts = [
    { to: "/scanner", label: "Scanner", icon: Camera },
    { to: "/diario", label: "Diário", icon: Utensils },
    { to: "/insights", label: "Insights", icon: BarChart3 },
    { to: "/assistente", label: "IA", icon: Bot },
  ];

  const lastWeight = engagement.weights.length ? engagement.weights[engagement.weights.length - 1] : null;
  const insightOfDay =
    engagement.proactive[0] ??
    (protGoal > 0 && totals.protein > 0
      ? `Hoje você já consumiu ${pct(totals.protein, protGoal)}% da sua meta de proteínas.`
      : "Registre sua primeira refeição para receber insights personalizados.");

  if (engagement.loading) return <PageSkeleton />;

  return (
    <div className="min-h-screen bg-background pt-20 pb-24 md:pb-16">
      <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
        <header className="mb-6">
          <p className="text-sm text-muted-foreground">{greeting()},</p>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground">
            {name || "Bem-vindo"} <span className="text-primary">👋</span>
          </h1>
          <p className="mt-2 text-muted-foreground text-sm">Aqui está o resumo do seu dia.</p>
        </header>

        {/* Atalhos */}
        <div className="grid grid-cols-4 gap-2 sm:gap-3 mb-6">
          {shortcuts.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className="bg-card rounded-xl border border-border/50 p-3 sm:p-4 flex flex-col items-center gap-2 hover:shadow-soft hover:border-primary/30 transition-all group"
            >
              <span className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                <Icon className="w-5 h-5" />
              </span>
              <span className="font-display font-semibold text-xs sm:text-sm text-foreground">{label}</span>
            </Link>
          ))}
        </div>

        {/* Score e sequência */}
        <div className="grid lg:grid-cols-2 gap-4 mb-4">
          <ScoreCard score={engagement.today.score} message={engagement.today.message} compact />
          <div className="space-y-4">
            <StreakCard current={engagement.streak.current} best={engagement.streak.best} />
            <div className="bg-card rounded-2xl shadow-soft border border-border/50 p-5 flex items-start gap-3">
              <span className="w-9 h-9 rounded-lg bg-accent/10 text-accent flex items-center justify-center shrink-0">
                <Lightbulb className="w-4 h-4" />
              </span>
              <div className="min-w-0">
                <p className="font-display font-semibold text-sm text-foreground">Insight do dia</p>
                <p className="text-xs text-muted-foreground mt-0.5">{insightOfDay}</p>
                <Link to="/insights" className="text-xs font-medium text-primary hover:underline mt-1 inline-block">
                  Ver central de insights
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Macros do dia */}
        <WeekSummaryCards />

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4">
          {macros.map((m) => (
            <div key={m.label} className="bg-card rounded-2xl shadow-soft border border-border/50 p-4">
              <div className="flex items-center justify-between mb-3">
                <span className={`w-9 h-9 rounded-lg flex items-center justify-center ${m.tint}`}>
                  <m.icon className="w-4 h-4" />
                </span>
                <span className="font-display text-xl font-bold text-foreground">{pct(m.value, m.goal)}%</span>
              </div>
              <p className="font-display font-semibold text-sm text-foreground">{m.label}</p>
              <p className="text-xs text-muted-foreground mb-2">{m.value} / {m.goal} {m.unit}</p>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div className={`h-full ${m.ring} rounded-full transition-all duration-500`} style={{ width: `${pct(m.value, m.goal)}%` }} />
              </div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-4 mb-4">
          <WaterTracker compact />

          {/* Refeições */}
          <div className="bg-card rounded-2xl shadow-soft border border-border/50 p-5 space-y-4">
            <div className="flex items-start gap-3">
              <span className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <Clock className="w-4 h-4" />
              </span>
              <div className="min-w-0">
                <p className="font-display font-semibold text-sm text-foreground">Última refeição</p>
                <p className="text-xs text-muted-foreground truncate">
                  {lastMeal
                    ? `${lastMeal.food_name} · ${mealLabel(lastMeal.meal_type)} · ${Math.round(Number(lastMeal.calories))} kcal`
                    : "Nenhuma refeição registrada hoje."}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="w-9 h-9 rounded-lg bg-accent/10 text-accent flex items-center justify-center shrink-0">
                <CalendarClock className="w-4 h-4" />
              </span>
              <div className="min-w-0">
                <p className="font-display font-semibold text-sm text-foreground">Próxima refeição planejada</p>
                <p className="text-xs text-muted-foreground">
                  {nextMeal ? `${nextMeal.label} · por volta das ${nextMeal.hour}h` : "Todas as refeições do dia já foram registradas 🎉"}
                </p>
              </div>
            </div>
            <Link to="/diario" className="block text-sm font-medium text-primary hover:underline">
              Abrir diário alimentar
            </Link>
            <div className="flex items-start gap-3 border-t border-border/60 pt-4">
              <span className="w-9 h-9 rounded-lg bg-secondary text-foreground flex items-center justify-center shrink-0">
                <Scale className="w-4 h-4" />
              </span>
              <div className="min-w-0">
                <p className="font-display font-semibold text-sm text-foreground">Último registro de evolução</p>
                <p className="text-xs text-muted-foreground">
                  {lastWeight
                    ? `${Number(lastWeight.weight_kg)} kg em ${new Date(String(lastWeight.logged_at)).toLocaleDateString("pt-BR")}`
                    : "Nenhum registro de evolução ainda."}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Metas */}
        <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl border border-primary/20 p-5 mb-8 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-primary/20 flex items-center justify-center">
              <Target className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-display font-semibold text-foreground">Metas diárias</h3>
              <p className="text-xs text-muted-foreground">
                {calGoal} kcal · {protGoal}g proteína · {(waterGoal / 1000).toFixed(1)}L água
                {" "}· hoje: {(waterMl / 1000).toFixed(2)}L bebidos
              </p>
            </div>
          </div>
          <Link to="/preferencias" className="text-sm font-medium text-primary hover:underline">Ajustar</Link>
        </div>

        <MotivationalQuote />

        <h2 className="font-display text-xl font-semibold text-foreground mt-8 mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" /> Continue evoluindo
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { to: "/evolucao", label: "Evolução" },
            { to: "/receitas", label: "Receitas" },
            { to: "/biblioteca", label: "Biblioteca" },
            { to: "/preferencias", label: "Meu perfil" },
          ].map((s) => (
            <Link
              key={s.to}
              to={s.to}
              className="bg-card rounded-xl border border-border/50 p-4 text-sm font-display font-semibold text-foreground hover:border-primary/30 hover:shadow-soft transition-all"
            >
              {s.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;