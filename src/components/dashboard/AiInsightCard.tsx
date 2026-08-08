import { useState } from "react";
import { Link } from "react-router-dom";
import { Sparkles, X, ChevronRight, ShieldCheck } from "lucide-react";
import { useAiInsights } from "@/hooks/useAiInsights";
import { Button } from "@/components/ui/button";

const AiInsightCard = () => {
  const { loading, current, dismiss } = useAiInsights();
  const [open, setOpen] = useState(false);

  if (loading)
    return (
      <div className="bg-card rounded-2xl shadow-soft border border-border/50 p-5 animate-pulse">
        <div className="h-3 w-24 bg-secondary rounded mb-3" />
        <div className="h-3 w-full bg-secondary rounded" />
      </div>
    );

  if (!current)
    return (
      <div className="bg-card rounded-2xl shadow-soft border border-border/50 p-5 flex items-start gap-3">
        <span className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
          <Sparkles className="w-4 h-4" />
        </span>
        <div>
          <p className="font-display font-semibold text-sm text-foreground">Insight da IA</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Nada de novo por aqui. Continue registrando para receber análises personalizadas.
          </p>
        </div>
      </div>
    );

  return (
    <div className="relative bg-card rounded-2xl shadow-soft border border-primary/20 p-5 overflow-hidden">
      <span className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-primary to-accent" />
      <button
        onClick={() => dismiss.mutate(current)}
        aria-label="Ignorar insight"
        className="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition-colors"
      >
        <X className="w-4 h-4" />
      </button>

      <div className="flex items-start gap-3">
        <span className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
          <Sparkles className="w-4 h-4" />
        </span>
        <div className="min-w-0 pr-6">
          <p className="font-display font-semibold text-sm text-foreground">Insight da IA</p>
          <p className="text-sm text-foreground/80 mt-1 leading-relaxed">{current.message}</p>

          {open && (
            <div className="mt-3 rounded-xl bg-secondary/60 p-3 space-y-2 animate-in fade-in duration-200">
              <p className="text-xs text-muted-foreground leading-relaxed">{current.detail}</p>
              <p className="text-[11px] text-muted-foreground inline-flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Informativo — não substitui nutricionista ou médico.
              </p>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-2 mt-3">
            <Button size="sm" variant="secondary" className="h-8 text-xs" onClick={() => setOpen((v) => !v)}>
              {open ? "Ocultar" : "Ver detalhes"}
            </Button>
            <Button asChild size="sm" variant="ghost" className="h-8 text-xs text-primary">
              <Link to={current.route}>
                Abrir <ChevronRight className="w-3 h-3 ml-1" />
              </Link>
            </Button>
            <button
              onClick={() => dismiss.mutate(current)}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors ml-auto"
            >
              Ignorar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiInsightCard;