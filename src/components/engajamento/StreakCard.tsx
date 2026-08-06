import { Flame } from "lucide-react";

const StreakCard = ({ current, best }: { current: number; best: number }) => (
  <div className="bg-card rounded-2xl shadow-soft border border-border/50 p-5 flex items-center gap-4">
    <span className="w-12 h-12 rounded-xl bg-accent/10 text-accent flex items-center justify-center shrink-0">
      <Flame className={`w-6 h-6 ${current > 0 ? "animate-pulse" : ""}`} />
    </span>
    <div className="min-w-0">
      <p className="font-display font-semibold text-foreground">
        {current > 0 ? `${current} ${current === 1 ? "dia" : "dias"} de sequência` : "Comece sua sequência hoje"}
      </p>
      <p className="text-xs text-muted-foreground mt-0.5">
        {current > 0
          ? "Você está registrando sua alimentação com constância."
          : "Registre uma refeição para iniciar sua sequência."}
      </p>
      <p className="text-[11px] text-muted-foreground mt-1">Maior sequência: <strong className="text-foreground">{best} dias</strong></p>
    </div>
  </div>
);

export default StreakCard;