import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Clock, Apple, Flame, ChevronDown, ChevronUp, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ScanRecord {
  id: string;
  created_at: string;
  result: {
    alimentos?: { nome: string; quantidade: string; calorias: number }[];
    receitas?: { nome: string; ingredientes: string[]; tempo: string; calorias: number; proteina: number; carb: number; gordura: number }[];
    dicas?: string[];
  };
}

const Historico = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [scans, setScans] = useState<ScanRecord[]>([]);
  const [loadingScans, setLoadingScans] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
      return;
    }
    if (user) {
      loadScans();
    }
  }, [user, loading]);

  const loadScans = async () => {
    const { data, error } = await supabase
      .from("scan_history")
      .select("*")
      .eq("user_id", user!.id)
      .order("created_at", { ascending: false });
    if (!error && data) setScans(data as ScanRecord[]);
    setLoadingScans(false);
  };

  const deleteScan = async (id: string) => {
    const { error } = await supabase.from("scan_history").delete().eq("id", id);
    if (!error) {
      setScans((prev) => prev.filter((s) => s.id !== id));
      toast({ title: "Análise removida" });
    }
  };

  const formatDate = (d: string) => {
    return new Date(d).toLocaleDateString("pt-BR", {
      day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit",
    });
  };

  if (loading || loadingScans) {
    return (
      <div className="min-h-screen bg-background pt-20 pb-16 flex items-center justify-center">
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-20 pb-16">
      <div className="container mx-auto px-6 max-w-3xl">
        <div className="text-center mb-10">
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground">
            Meu <span className="text-primary">Histórico</span>
          </h1>
          <p className="mt-3 text-muted-foreground">
            Veja todas as análises de geladeira que você já fez
          </p>
        </div>

        {scans.length === 0 ? (
          <div className="bg-card rounded-2xl shadow-soft p-12 text-center">
            <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="font-display font-semibold text-foreground mb-2">Nenhuma análise ainda</p>
            <p className="text-sm text-muted-foreground mb-6">Use o Scanner para analisar sua geladeira</p>
            <Button variant="hero" onClick={() => navigate("/scanner")}>Ir para o Scanner</Button>
          </div>
        ) : (
          <div className="space-y-4">
            {scans.map((scan) => (
              <div key={scan.id} className="bg-card rounded-2xl shadow-soft overflow-hidden">
                <button
                  onClick={() => setExpanded(expanded === scan.id ? null : scan.id)}
                  className="w-full p-5 flex items-center justify-between text-left"
                >
                  <div>
                    <p className="font-display font-semibold text-foreground text-sm">
                      {scan.result.alimentos?.length || 0} alimentos · {scan.result.receitas?.length || 0} receitas
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      <Clock className="w-3 h-3 inline mr-1" />
                      {formatDate(scan.created_at)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => { e.stopPropagation(); deleteScan(scan.id); }}
                      className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    {expanded === scan.id ? <ChevronUp className="w-5 h-5 text-muted-foreground" /> : <ChevronDown className="w-5 h-5 text-muted-foreground" />}
                  </div>
                </button>

                {expanded === scan.id && (
                  <div className="px-5 pb-5 space-y-4 border-t border-border pt-4">
                    {/* Foods */}
                    {scan.result.alimentos && (
                      <div>
                        <h3 className="font-display text-sm font-semibold text-foreground mb-2 flex items-center gap-1">
                          <Apple className="w-4 h-4 text-primary" /> Alimentos
                        </h3>
                        <div className="grid grid-cols-2 gap-2">
                          {scan.result.alimentos.map((a) => (
                            <div key={a.nome} className="flex items-center justify-between p-2 rounded-lg bg-secondary/50 text-xs">
                              <span className="text-foreground font-medium">{a.nome}</span>
                              <span className="text-primary font-semibold">{a.calorias} cal</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Recipes */}
                    {scan.result.receitas && (
                      <div>
                        <h3 className="font-display text-sm font-semibold text-foreground mb-2 flex items-center gap-1">
                          <Flame className="w-4 h-4 text-accent" /> Receitas
                        </h3>
                        <div className="space-y-2">
                          {scan.result.receitas.map((r) => (
                            <div key={r.nome} className="p-3 rounded-lg border border-border">
                              <div className="flex justify-between items-center">
                                <p className="font-medium text-foreground text-sm">{r.nome}</p>
                                <span className="text-xs text-primary">⏱ {r.tempo}</span>
                              </div>
                              <p className="text-xs text-muted-foreground mt-1">
                                {r.calorias} kcal · {r.proteina}g prot · {r.carb}g carb · {r.gordura}g gord
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Historico;
