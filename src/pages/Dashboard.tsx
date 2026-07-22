import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Flame, Beef, Target, TrendingUp, BookOpen, Camera, Utensils, Settings2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import WaterTracker from "@/components/WaterTracker";
import MotivationalQuote from "@/components/MotivationalQuote";

const Dashboard = () => {
  const { user } = useAuth();
  const [cal, setCal] = useState(0);
  const [protein, setProtein] = useState(0);
  const [goals, setGoals] = useState({ calories: 2000, protein: 100 });
  const [name, setName] = useState("");
  const today = new Date().toISOString().slice(0, 10);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const [{ data: logs }, { data: g }, { data: p }] = await Promise.all([
        supabase.from("food_log").select("calories, protein").eq("user_id", user.id).eq("logged_at", today),
        supabase.from("user_goals").select("calories_goal, protein_goal").eq("user_id", user.id).maybeSingle(),
        supabase.from("profiles").select("full_name").eq("id", user.id).maybeSingle(),
      ]);
      setCal((logs || []).reduce((s, r: any) => s + Number(r.calories || 0), 0));
      setProtein((logs || []).reduce((s, r: any) => s + Number(r.protein || 0), 0));
      if (g) setGoals({ calories: g.calories_goal, protein: g.protein_goal });
      if (p?.full_name) setName(p.full_name.split(" ")[0]);
    })();
  }, [user, today]);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Bom dia";
    if (h < 18) return "Boa tarde";
    return "Boa noite";
  };

  const calPct = Math.min(100, Math.round((cal / goals.calories) * 100));
  const protPct = Math.min(100, Math.round((protein / goals.protein) * 100));

  const shortcuts = [
    { to: "/diario", label: "Diário", icon: Utensils, color: "text-primary bg-primary/10" },
    { to: "/scanner", label: "Scanner", icon: Camera, color: "text-accent bg-accent/10" },
    { to: "/plano-semanal", label: "Plano", icon: BookOpen, color: "text-blue-500 bg-blue-500/10" },
    { to: "/preferencias", label: "Perfil", icon: Settings2, color: "text-purple-500 bg-purple-500/10" },
  ];

  return (
    <div className="min-h-screen bg-background pt-20 pb-16">
      <div className="container mx-auto px-6 max-w-5xl">
        <header className="mb-8">
          <p className="text-sm text-muted-foreground">{greeting()},</p>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground">
            {name ? `${name}` : "Bem-vindo"} <span className="text-primary">👋</span>
          </h1>
          <p className="mt-2 text-muted-foreground">Aqui está o resumo do seu dia.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Calories */}
          <div className="bg-card rounded-2xl shadow-soft border border-border/50 p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-lg bg-orange-500/10 flex items-center justify-center">
                  <Flame className="w-5 h-5 text-orange-500" />
                </div>
                <div>
                  <h3 className="font-display font-semibold text-sm">Calorias</h3>
                  <p className="text-xs text-muted-foreground">{Math.round(cal)} / {goals.calories} kcal</p>
                </div>
              </div>
              <span className="text-2xl font-bold text-orange-500">{calPct}%</span>
            </div>
            <div className="h-3 bg-secondary rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-orange-400 to-orange-600 transition-all duration-500" style={{ width: `${calPct}%` }} />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Restam {Math.max(0, goals.calories - Math.round(cal))} kcal hoje.
            </p>
          </div>

          {/* Protein */}
          <div className="bg-card rounded-2xl shadow-soft border border-border/50 p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-lg bg-red-500/10 flex items-center justify-center">
                  <Beef className="w-5 h-5 text-red-500" />
                </div>
                <div>
                  <h3 className="font-display font-semibold text-sm">Proteína</h3>
                  <p className="text-xs text-muted-foreground">{Math.round(protein)}g / {goals.protein}g</p>
                </div>
              </div>
              <span className="text-2xl font-bold text-red-500">{protPct}%</span>
            </div>
            <div className="h-3 bg-secondary rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-red-400 to-red-600 transition-all duration-500" style={{ width: `${protPct}%` }} />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Faltam {Math.max(0, goals.protein - Math.round(protein))}g de proteína.
            </p>
          </div>

          {/* Water */}
          <WaterTracker compact />
        </div>

        {/* Goals card */}
        <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl border border-primary/20 p-5 mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-primary/20 flex items-center justify-center">
              <Target className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-display font-semibold text-foreground">Metas diárias</h3>
              <p className="text-xs text-muted-foreground">
                {goals.calories} kcal · {goals.protein}g proteína · {(2500 / 1000).toFixed(1)}L água
              </p>
            </div>
          </div>
          <Link to="/preferencias" className="text-sm font-medium text-primary hover:underline">
            Ajustar
          </Link>
        </div>

        <MotivationalQuote />

        <h2 className="font-display text-xl font-semibold text-foreground mt-8 mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" /> Acesso rápido
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {shortcuts.map(({ to, label, icon: Icon, color }) => (
            <Link
              key={to}
              to={to}
              className="bg-card rounded-xl border border-border/50 p-4 hover:shadow-soft hover:border-primary/30 transition-all group"
            >
              <div className={`w-10 h-10 rounded-lg ${color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                <Icon className="w-5 h-5" />
              </div>
              <p className="font-display font-semibold text-sm text-foreground">{label}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;