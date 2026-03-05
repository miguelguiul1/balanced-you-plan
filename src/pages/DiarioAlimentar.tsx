import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import {
  Plus, Trash2, Zap, TrendingUp, TrendingDown, AlertTriangle,
  CheckCircle, RefreshCw, Apple, Coffee, Sun, Moon, Cookie,
} from "lucide-react";
import MotivationalQuote from "@/components/MotivationalQuote";

interface FoodEntry {
  id: string;
  food_name: string;
  quantity: string;
  meal_type: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  logged_at: string;
}

interface DailyAnalysis {
  resumo: { calorias_total: number; proteina_total: number; carb_total: number; gordura_total: number; fibra_total: number };
  meta_sugerida: { calorias: number; proteina: number; carbs: number; gordura: number; fibra: number };
  pontuacao: number;
  status: string;
  excessos: string[];
  deficiencias: string[];
  sugestoes: string[];
  proximo_passo: string;
}

const mealTypes = [
  { id: "cafe", label: "Café da manhã", icon: Coffee },
  { id: "almoco", label: "Almoço", icon: Sun },
  { id: "lanche", label: "Lanche", icon: Cookie },
  { id: "jantar", label: "Jantar", icon: Moon },
];

const DiarioAlimentar = () => {
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [entries, setEntries] = useState<FoodEntry[]>([]);
  const [foodName, setFoodName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [mealType, setMealType] = useState("almoco");
  const [adding, setAdding] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<DailyAnalysis | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
      return;
    }
    if (user) loadEntries();
  }, [user, authLoading, selectedDate]);

  const loadEntries = async () => {
    const { data } = await supabase
      .from("food_log")
      .select("*")
      .eq("user_id", user!.id)
      .eq("logged_at", selectedDate)
      .order("created_at", { ascending: true });
    if (data) setEntries(data as FoodEntry[]);
  };

  const addFood = async () => {
    if (!foodName.trim() || !quantity.trim()) return;
    setAdding(true);
    try {
      // Get AI estimate for nutritional values
      const { data: estimate, error: estError } = await supabase.functions.invoke("nutrition-tracker", {
        body: { action: "estimate", foodName, quantity },
      });
      if (estError) throw estError;
      if (estimate?.error) throw new Error(estimate.error);

      const { error } = await supabase.from("food_log").insert({
        user_id: user!.id,
        food_name: foodName,
        quantity,
        meal_type: mealType,
        calories: estimate.calories || 0,
        protein: estimate.protein || 0,
        carbs: estimate.carbs || 0,
        fat: estimate.fat || 0,
        fiber: estimate.fiber || 0,
        logged_at: selectedDate,
      });
      if (error) throw error;

      setFoodName("");
      setQuantity("");
      setAnalysis(null);
      await loadEntries();
      toast({ title: `✅ ${foodName} adicionado!` });
    } catch (e: any) {
      toast({ title: "Erro", description: e.message, variant: "destructive" });
    } finally {
      setAdding(false);
    }
  };

  const deleteEntry = async (id: string) => {
    await supabase.from("food_log").delete().eq("id", id);
    setEntries((prev) => prev.filter((e) => e.id !== id));
    setAnalysis(null);
  };

  const analyzeDay = async () => {
    if (entries.length === 0) {
      toast({ title: "Adicione alimentos primeiro" });
      return;
    }
    setAnalyzing(true);
    try {
      let preferences = null;
      const { data: prefs } = await supabase
        .from("user_preferences")
        .select("*")
        .eq("user_id", user!.id)
        .maybeSingle();
      if (prefs) preferences = { objective: prefs.objective };

      const { data, error } = await supabase.functions.invoke("nutrition-tracker", {
        body: {
          action: "analyze",
          dailyLog: entries.map((e) => ({
            alimento: e.food_name,
            quantidade: e.quantity,
            refeicao: e.meal_type,
            calorias: e.calories,
            proteina: e.protein,
            carbs: e.carbs,
            gordura: e.fat,
            fibra: e.fiber,
          })),
          preferences,
        },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setAnalysis(data as DailyAnalysis);
    } catch (e: any) {
      toast({ title: "Erro na análise", description: e.message, variant: "destructive" });
    } finally {
      setAnalyzing(false);
    }
  };

  // Totals
  const totals = entries.reduce(
    (acc, e) => ({
      calories: acc.calories + Number(e.calories),
      protein: acc.protein + Number(e.protein),
      carbs: acc.carbs + Number(e.carbs),
      fat: acc.fat + Number(e.fat),
      fiber: acc.fiber + Number(e.fiber),
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 }
  );

  const statusIcon = (s: string) => {
    if (s === "excelente" || s === "bom") return <CheckCircle className="w-5 h-5 text-primary" />;
    if (s === "regular") return <AlertTriangle className="w-5 h-5 text-accent" />;
    return <TrendingDown className="w-5 h-5 text-destructive" />;
  };

  const statusLabel: Record<string, string> = {
    excelente: "Excelente! 🏆",
    bom: "Bom! 👍",
    regular: "Regular ⚠️",
    precisa_melhorar: "Precisa melhorar 📉",
  };

  if (authLoading) return <div className="min-h-screen bg-background pt-20 flex items-center justify-center"><p className="text-muted-foreground">Carregando...</p></div>;

  return (
    <div className="min-h-screen bg-background pt-20 pb-16">
      <div className="container mx-auto px-6 max-w-3xl">
        <div className="text-center mb-10">
          <span className="inline-block mb-4 px-4 py-1.5 rounded-full bg-primary/10 text-primary font-display text-sm font-medium">
            📊 Acompanhamento diário
          </span>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground">
            Diário <span className="text-primary">Alimentar</span>
          </h1>
          <p className="mt-3 text-muted-foreground max-w-lg mx-auto">
            Registre o que come e a IA analisa sua nutrição, compara com suas metas e sugere melhorias
          </p>
        </div>

        {/* Date selector */}
        <div className="flex justify-center mb-6">
          <Input
            type="date"
            value={selectedDate}
            onChange={(e) => { setSelectedDate(e.target.value); setAnalysis(null); }}
            className="w-auto font-display font-medium"
          />
        </div>

        {/* Add food */}
        <div className="bg-card rounded-2xl shadow-soft p-6 mb-6">
          <h2 className="font-display text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Plus className="w-5 h-5 text-primary" /> Adicionar alimento
          </h2>
          
          {/* Meal type */}
          <div className="flex gap-2 mb-4">
            {mealTypes.map((m) => (
              <button
                key={m.id}
                onClick={() => setMealType(m.id)}
                className={`flex-1 p-2 rounded-xl text-xs font-medium transition-all flex flex-col items-center gap-1 ${
                  mealType === m.id ? "bg-primary/10 text-primary border-2 border-primary" : "bg-secondary text-muted-foreground border-2 border-transparent"
                }`}
              >
                <m.icon className="w-4 h-4" />
                {m.label}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            <Input
              placeholder="Ex: Arroz branco"
              value={foodName}
              onChange={(e) => setFoodName(e.target.value)}
              className="flex-1"
              onKeyDown={(e) => e.key === "Enter" && addFood()}
            />
            <Input
              placeholder="Ex: 200g"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-24"
              onKeyDown={(e) => e.key === "Enter" && addFood()}
            />
            <Button variant="hero" onClick={addFood} disabled={adding || !foodName.trim() || !quantity.trim()}>
              {adding ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">A IA calcula automaticamente as calorias e macros</p>
        </div>

        {/* Daily summary bar */}
        {entries.length > 0 && (
          <div className="bg-card rounded-2xl shadow-soft p-5 mb-6">
            <div className="grid grid-cols-5 gap-3 text-center">
              <div className="bg-secondary/50 rounded-xl p-3">
                <p className="font-display font-bold text-foreground">{Math.round(totals.calories)}</p>
                <p className="text-[10px] text-muted-foreground">kcal</p>
              </div>
              <div className="bg-secondary/50 rounded-xl p-3">
                <p className="font-display font-bold text-primary">{Math.round(totals.protein)}g</p>
                <p className="text-[10px] text-muted-foreground">prot</p>
              </div>
              <div className="bg-secondary/50 rounded-xl p-3">
                <p className="font-display font-bold text-accent">{Math.round(totals.carbs)}g</p>
                <p className="text-[10px] text-muted-foreground">carb</p>
              </div>
              <div className="bg-secondary/50 rounded-xl p-3">
                <p className="font-display font-bold text-foreground">{Math.round(totals.fat)}g</p>
                <p className="text-[10px] text-muted-foreground">gord</p>
              </div>
              <div className="bg-secondary/50 rounded-xl p-3">
                <p className="font-display font-bold text-primary">{Math.round(totals.fiber)}g</p>
                <p className="text-[10px] text-muted-foreground">fibra</p>
              </div>
            </div>
          </div>
        )}

        {/* Food entries by meal */}
        {mealTypes.map((m) => {
          const mealEntries = entries.filter((e) => e.meal_type === m.id);
          if (mealEntries.length === 0) return null;
          return (
            <div key={m.id} className="mb-4">
              <h3 className="font-display text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1">
                <m.icon className="w-4 h-4" /> {m.label}
              </h3>
              <div className="space-y-2">
                {mealEntries.map((entry) => (
                  <div key={entry.id} className="bg-card rounded-xl shadow-soft p-3 flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-foreground text-sm">{entry.food_name}</p>
                      <p className="text-xs text-muted-foreground">
                        {entry.quantity} · {Math.round(Number(entry.calories))} kcal · P:{Math.round(Number(entry.protein))}g · C:{Math.round(Number(entry.carbs))}g · G:{Math.round(Number(entry.fat))}g · F:{Math.round(Number(entry.fiber))}g
                      </p>
                    </div>
                    <button
                      onClick={() => deleteEntry(entry.id)}
                      className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {/* Analyze button */}
        {entries.length > 0 && (
          <div className="text-center my-6">
            <Button variant="hero" size="lg" onClick={analyzeDay} disabled={analyzing} className="gap-2">
              {analyzing ? (
                <><RefreshCw className="w-5 h-5 animate-spin" /> Analisando...</>
              ) : (
                <><Zap className="w-5 h-5" /> Analisar dia com IA</>
              )}
            </Button>
          </div>
        )}

        {/* AI Analysis */}
        {analysis && (
          <div className="space-y-4 animate-fade-in">
            {/* Score */}
            <div className="bg-card rounded-2xl shadow-soft p-6 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                {statusIcon(analysis.status)}
                <h2 className="font-display text-lg font-semibold text-foreground">
                  {statusLabel[analysis.status] || analysis.status}
                </h2>
              </div>
              <div className="w-32 h-32 mx-auto relative mb-4">
                <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="hsl(var(--border))"
                    strokeWidth="3"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="hsl(var(--primary))"
                    strokeWidth="3"
                    strokeDasharray={`${analysis.pontuacao}, 100`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-display text-3xl font-bold text-foreground">{analysis.pontuacao}</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">Pontuação alimentar do dia</p>
            </div>

            {/* Comparison with goals */}
            <div className="bg-card rounded-2xl shadow-soft p-6">
              <h3 className="font-display font-semibold text-foreground mb-4">📊 Consumo vs Meta</h3>
              <div className="space-y-3">
                {[
                  { label: "Calorias", consumed: analysis.resumo.calorias_total, goal: analysis.meta_sugerida.calorias, unit: "kcal" },
                  { label: "Proteína", consumed: analysis.resumo.proteina_total, goal: analysis.meta_sugerida.proteina, unit: "g" },
                  { label: "Carboidratos", consumed: analysis.resumo.carb_total, goal: analysis.meta_sugerida.carbs, unit: "g" },
                  { label: "Gordura", consumed: analysis.resumo.gordura_total, goal: analysis.meta_sugerida.gordura, unit: "g" },
                  { label: "Fibra", consumed: analysis.resumo.fibra_total, goal: analysis.meta_sugerida.fibra, unit: "g" },
                ].map((item) => {
                  const pct = item.goal > 0 ? Math.min((item.consumed / item.goal) * 100, 150) : 0;
                  const over = pct > 110;
                  const under = pct < 80;
                  return (
                    <div key={item.label}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-foreground font-medium">{item.label}</span>
                        <span className={`font-display font-semibold ${over ? "text-destructive" : under ? "text-accent" : "text-primary"}`}>
                          {Math.round(item.consumed)} / {Math.round(item.goal)} {item.unit}
                        </span>
                      </div>
                      <div className="h-2 rounded-full bg-border overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${over ? "bg-destructive" : under ? "bg-accent" : "bg-primary"}`}
                          style={{ width: `${Math.min(pct, 100)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Excesses & deficiencies */}
            <div className="grid grid-cols-2 gap-4">
              {analysis.excessos.length > 0 && (
                <div className="bg-card rounded-2xl shadow-soft p-4">
                  <h3 className="font-display text-sm font-semibold text-destructive mb-2 flex items-center gap-1">
                    <TrendingUp className="w-4 h-4" /> Excessos
                  </h3>
                  <ul className="space-y-1">
                    {analysis.excessos.map((e, i) => (
                      <li key={i} className="text-xs text-muted-foreground">• {e}</li>
                    ))}
                  </ul>
                </div>
              )}
              {analysis.deficiencias.length > 0 && (
                <div className="bg-card rounded-2xl shadow-soft p-4">
                  <h3 className="font-display text-sm font-semibold text-accent mb-2 flex items-center gap-1">
                    <TrendingDown className="w-4 h-4" /> Deficiências
                  </h3>
                  <ul className="space-y-1">
                    {analysis.deficiencias.map((d, i) => (
                      <li key={i} className="text-xs text-muted-foreground">• {d}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Suggestions */}
            <div className="bg-card rounded-2xl shadow-soft p-6">
              <h3 className="font-display font-semibold text-foreground mb-3 flex items-center gap-2">
                💡 Sugestões da IA
              </h3>
              <div className="space-y-2">
                {analysis.sugestoes.map((s, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm">
                    <span className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 font-display font-bold text-[10px]">
                      {i + 1}
                    </span>
                    <p className="text-muted-foreground">{s}</p>
                  </div>
                ))}
              </div>
              {analysis.proximo_passo && (
                <div className="mt-4 p-3 rounded-xl bg-primary/5 border border-primary/10">
                  <p className="text-sm text-foreground">
                    🎯 <strong>Próximo passo:</strong> {analysis.proximo_passo}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {entries.length === 0 && (
          <div className="bg-card rounded-2xl shadow-soft p-12 text-center">
            <Apple className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="font-display font-semibold text-foreground mb-2">Nenhum alimento registrado</p>
            <p className="text-sm text-muted-foreground">Comece adicionando o que você comeu hoje</p>
          </div>
        )}

        <div className="mt-10">
          <MotivationalQuote />
        </div>
      </div>
    </div>
  );
};

export default DiarioAlimentar;
