import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Calendar, ShoppingCart, Lightbulb, RefreshCw, ChevronDown, ChevronUp, Flame } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import MotivationalQuote from "@/components/MotivationalQuote";

interface Refeicao {
  tipo: string;
  nome: string;
  calorias: number;
  proteina: number;
  carb: number;
  gordura: number;
  ingredientes: string[];
  preparo: string;
}

interface DiaPlano {
  dia: string;
  refeicoes: Refeicao[];
}

interface PlanoSemanal {
  plano: DiaPlano[];
  resumo: { calorias_media: number; proteina_media: number; carb_media: number; gordura_media: number };
  lista_compras: string[];
  custo_estimado: string;
  dicas: string[];
}

const PlanoSemanal = () => {
  const [plano, setPlano] = useState<PlanoSemanal | null>(null);
  const [generating, setGenerating] = useState(false);
  const [expandedDay, setExpandedDay] = useState<string | null>(null);
  const [expandedMeal, setExpandedMeal] = useState<string | null>(null);
  const [showList, setShowList] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const generatePlan = async () => {
    setGenerating(true);
    try {
      // Load user preferences if logged in
      let preferences = null;
      if (user) {
        const { data } = await supabase
          .from("user_preferences")
          .select("*")
          .eq("user_id", user.id)
          .maybeSingle();
        if (data) {
          preferences = {
            objective: data.objective,
            restrictions: data.restrictions,
            liked_foods: data.liked_foods,
            disliked_foods: data.disliked_foods,
          };
        }
      }

      const { data, error } = await supabase.functions.invoke("meal-plan", {
        body: { preferences },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      setPlano(data as PlanoSemanal);
      if (data.plano?.length) setExpandedDay(data.plano[0].dia);
    } catch (e: any) {
      console.error("Erro ao gerar plano:", e);
      toast({
        title: "Erro ao gerar plano",
        description: e.message || "Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setGenerating(false);
    }
  };

  const mealKey = (dia: string, tipo: string) => `${dia}-${tipo}`;

  return (
    <div className="min-h-screen bg-background pt-20 pb-16">
      <div className="container mx-auto px-6 max-w-3xl">
        <div className="text-center mb-10">
          <span className="inline-block mb-4 px-4 py-1.5 rounded-full bg-primary/10 text-primary font-display text-sm font-medium">
            📅 Planejamento inteligente
          </span>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground">
            Plano <span className="text-primary">Semanal</span>
          </h1>
          <p className="mt-3 text-muted-foreground max-w-lg mx-auto">
            A IA gera um plano completo de refeições personalizado, econômico e saudável para sua semana
          </p>
        </div>

        {!plano && (
          <div className="bg-card rounded-2xl shadow-soft p-8 text-center">
            <Calendar className="w-12 h-12 text-primary mx-auto mb-4" />
            <p className="font-display font-semibold text-foreground mb-2">
              Gere seu plano semanal
            </p>
            <p className="text-sm text-muted-foreground mb-6">
              {user
                ? "A IA vai considerar suas preferências e restrições alimentares"
                : "Faça login para um plano personalizado com suas preferências"}
            </p>
            <Button variant="hero" size="lg" onClick={generatePlan} disabled={generating} className="gap-2">
              {generating ? (
                <><RefreshCw className="w-5 h-5 animate-spin" /> Gerando plano...</>
              ) : (
                <><Calendar className="w-5 h-5" /> Gerar plano com IA</>
              )}
            </Button>
            {generating && (
              <div className="mt-6">
                <div className="h-2 rounded-full bg-border overflow-hidden">
                  <div className="h-full bg-primary rounded-full animate-pulse" style={{ width: "70%" }} />
                </div>
                <p className="text-sm text-muted-foreground mt-2">Criando refeições personalizadas para 7 dias...</p>
              </div>
            )}
          </div>
        )}

        {plano && (
          <div className="space-y-6 animate-fade-in">
            {/* Summary */}
            <div className="bg-card rounded-2xl shadow-soft p-6">
              <h2 className="font-display text-lg font-semibold text-foreground mb-4">📊 Resumo semanal</h2>
              <div className="grid grid-cols-4 gap-3 text-center">
                <div className="bg-secondary/50 rounded-xl p-3">
                  <p className="font-display font-bold text-foreground">{plano.resumo.calorias_media}</p>
                  <p className="text-xs text-muted-foreground">kcal/dia</p>
                </div>
                <div className="bg-secondary/50 rounded-xl p-3">
                  <p className="font-display font-bold text-primary">{plano.resumo.proteina_media}g</p>
                  <p className="text-xs text-muted-foreground">prot/dia</p>
                </div>
                <div className="bg-secondary/50 rounded-xl p-3">
                  <p className="font-display font-bold text-accent">{plano.resumo.carb_media}g</p>
                  <p className="text-xs text-muted-foreground">carb/dia</p>
                </div>
                <div className="bg-secondary/50 rounded-xl p-3">
                  <p className="font-display font-bold text-foreground">{plano.resumo.gordura_media}g</p>
                  <p className="text-xs text-muted-foreground">gord/dia</p>
                </div>
              </div>
              {plano.custo_estimado && (
                <p className="text-sm text-center text-muted-foreground mt-3">
                  💰 Custo estimado: <strong className="text-primary">{plano.custo_estimado}</strong>
                </p>
              )}
            </div>

            {/* Days */}
            {plano.plano.map((dia) => (
              <div key={dia.dia} className="bg-card rounded-2xl shadow-soft overflow-hidden">
                <button
                  onClick={() => setExpandedDay(expandedDay === dia.dia ? null : dia.dia)}
                  className="w-full p-5 flex items-center justify-between text-left"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-display font-bold text-sm">
                      {dia.dia.slice(0, 3)}
                    </span>
                    <div>
                      <p className="font-display font-semibold text-foreground">{dia.dia}</p>
                      <p className="text-xs text-muted-foreground">
                        {dia.refeicoes.reduce((sum, r) => sum + (r.calorias || 0), 0)} kcal total
                      </p>
                    </div>
                  </div>
                  {expandedDay === dia.dia ? <ChevronUp className="w-5 h-5 text-muted-foreground" /> : <ChevronDown className="w-5 h-5 text-muted-foreground" />}
                </button>

                {expandedDay === dia.dia && (
                  <div className="px-5 pb-5 space-y-3 border-t border-border pt-4">
                    {dia.refeicoes.map((ref) => {
                      const key = mealKey(dia.dia, ref.tipo);
                      const isExpanded = expandedMeal === key;
                      return (
                        <div key={key} className="border border-border rounded-xl overflow-hidden">
                          <button
                            onClick={() => setExpandedMeal(isExpanded ? null : key)}
                            className="w-full p-3 flex items-center justify-between text-left"
                          >
                            <div>
                              <p className="text-xs text-muted-foreground font-medium">{ref.tipo}</p>
                              <p className="font-display font-semibold text-foreground text-sm">{ref.nome}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-primary font-semibold">{ref.calorias} kcal</span>
                              {isExpanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                            </div>
                          </button>
                          {isExpanded && (
                            <div className="px-3 pb-3 space-y-2 border-t border-border pt-2">
                              <div className="grid grid-cols-4 gap-2 text-center">
                                <div className="bg-secondary/50 rounded-lg p-1.5">
                                  <p className="font-display font-bold text-foreground text-xs">{ref.calorias}</p>
                                  <p className="text-[10px] text-muted-foreground">kcal</p>
                                </div>
                                <div className="bg-secondary/50 rounded-lg p-1.5">
                                  <p className="font-display font-bold text-primary text-xs">{ref.proteina}g</p>
                                  <p className="text-[10px] text-muted-foreground">prot</p>
                                </div>
                                <div className="bg-secondary/50 rounded-lg p-1.5">
                                  <p className="font-display font-bold text-accent text-xs">{ref.carb}g</p>
                                  <p className="text-[10px] text-muted-foreground">carb</p>
                                </div>
                                <div className="bg-secondary/50 rounded-lg p-1.5">
                                  <p className="font-display font-bold text-foreground text-xs">{ref.gordura}g</p>
                                  <p className="text-[10px] text-muted-foreground">gord</p>
                                </div>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground"><strong>Ingredientes:</strong> {ref.ingredientes.join(", ")}</p>
                              </div>
                              {ref.preparo && (
                                <div>
                                  <p className="text-xs text-muted-foreground"><strong>Preparo:</strong> {ref.preparo}</p>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}

            {/* Shopping list */}
            <div className="bg-card rounded-2xl shadow-soft overflow-hidden">
              <button
                onClick={() => setShowList(!showList)}
                className="w-full p-5 flex items-center justify-between text-left"
              >
                <h2 className="font-display text-lg font-semibold text-foreground flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5 text-primary" /> Lista de compras
                </h2>
                {showList ? <ChevronUp className="w-5 h-5 text-muted-foreground" /> : <ChevronDown className="w-5 h-5 text-muted-foreground" />}
              </button>
              {showList && (
                <div className="px-5 pb-5 border-t border-border pt-4">
                  <div className="grid grid-cols-2 gap-2">
                    {plano.lista_compras.map((item, i) => (
                      <label key={i} className="flex items-center gap-2 p-2 rounded-lg hover:bg-secondary/50 cursor-pointer text-sm">
                        <input type="checkbox" className="rounded border-border" />
                        <span className="text-foreground">{item}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Tips */}
            {plano.dicas && plano.dicas.length > 0 && (
              <div className="bg-card rounded-2xl shadow-soft p-6">
                <h2 className="font-display text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-accent" /> Dicas da IA
                </h2>
                <div className="space-y-3">
                  {plano.dicas.map((d, i) => (
                    <div key={i} className="flex items-start gap-3 text-sm">
                      <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 font-display font-bold text-xs">
                        {i + 1}
                      </span>
                      <p className="text-muted-foreground">{d}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Regenerate */}
            <div className="text-center space-y-3">
              <Button variant="hero" size="lg" onClick={generatePlan} disabled={generating} className="gap-2">
                {generating ? <><RefreshCw className="w-5 h-5 animate-spin" /> Regenerando...</> : <><RefreshCw className="w-5 h-5" /> Gerar novo plano</>}
              </Button>
              {!user && (
                <p className="text-xs text-muted-foreground">
                  <button onClick={() => navigate("/auth")} className="text-primary font-semibold underline">Faça login</button> para planos personalizados
                </p>
              )}
            </div>
          </div>
        )}

        <div className="mt-10">
          <MotivationalQuote />
        </div>
      </div>
    </div>
  );
};

export default PlanoSemanal;
