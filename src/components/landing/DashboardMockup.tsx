import { Flame, Beef, Droplet, TrendingUp } from "lucide-react";

/**
 * Pure HTML/CSS mockup of the Evolua Plus dashboard.
 * Used in the hero to show the real product surface.
 */
const DashboardMockup = ({ className = "" }: { className?: string }) => {
  return (
    <div
      className={`relative rounded-2xl border border-border/60 bg-card shadow-2xl shadow-primary/10 overflow-hidden ${className}`}
      aria-hidden="true"
    >
      {/* Top bar */}
      <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-border/50 bg-background/60">
        <div className="w-2.5 h-2.5 rounded-full bg-destructive/70" />
        <div className="w-2.5 h-2.5 rounded-full bg-accent/80" />
        <div className="w-2.5 h-2.5 rounded-full bg-primary/80" />
        <div className="ml-3 text-[10px] font-display text-muted-foreground">
          evoluaplus.app / dashboard
        </div>
      </div>

      <div className="p-5 space-y-4">
        {/* Greeting */}
        <div>
          <p className="text-[10px] text-muted-foreground">Boa tarde,</p>
          <h3 className="font-display font-bold text-lg text-foreground">
            Ana <span className="text-primary">👋</span>
          </h3>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-3 gap-2.5">
          <MockStat icon={Flame} tint="text-orange-500 bg-orange-500/10" label="Kcal" value="1.420" sub="/ 2.000" pct={71} bar="from-orange-400 to-orange-600" />
          <MockStat icon={Beef} tint="text-red-500 bg-red-500/10" label="Prot" value="98g" sub="/ 130g" pct={75} bar="from-red-400 to-red-600" />
          <MockStat icon={Droplet} tint="text-sky-500 bg-sky-500/10" label="Água" value="1,8L" sub="/ 2,5L" pct={72} bar="from-sky-400 to-sky-600" />
        </div>

        {/* Today plan */}
        <div className="rounded-xl border border-border/50 bg-background p-3 space-y-2.5">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-display font-semibold text-muted-foreground uppercase tracking-wider">
              Plano de hoje
            </p>
            <span className="text-[9px] text-primary font-medium">4 refeições</span>
          </div>
          {[
            { time: "08:00", name: "Aveia com frutas e whey", kcal: 380 },
            { time: "12:30", name: "Bowl de quinoa + frango", kcal: 520 },
            { time: "16:00", name: "Iogurte com granola", kcal: 220 },
          ].map((m) => (
            <div key={m.time} className="flex items-center gap-2.5">
              <div className="text-[9px] font-mono text-muted-foreground w-9">{m.time}</div>
              <div className="flex-1 text-[11px] font-medium text-foreground truncate">{m.name}</div>
              <div className="text-[10px] font-semibold text-primary">{m.kcal} kcal</div>
            </div>
          ))}
        </div>

        {/* Weekly progress */}
        <div className="rounded-xl border border-border/50 bg-background p-3">
          <div className="flex items-center gap-1.5 mb-2">
            <TrendingUp className="w-3 h-3 text-primary" />
            <p className="text-[10px] font-display font-semibold text-muted-foreground uppercase tracking-wider">
              Evolução semanal
            </p>
          </div>
          <div className="flex items-end gap-1.5 h-14">
            {[55, 72, 48, 85, 68, 92, 78].map((h, i) => (
              <div
                key={i}
                className="flex-1 rounded-t bg-gradient-to-t from-primary/60 to-primary"
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const MockStat = ({
  icon: Icon,
  tint,
  label,
  value,
  sub,
  pct,
  bar,
}: {
  icon: React.ElementType;
  tint: string;
  label: string;
  value: string;
  sub: string;
  pct: number;
  bar: string;
}) => (
  <div className="rounded-lg border border-border/50 bg-background p-2.5">
    <div className={`w-6 h-6 rounded-md ${tint} flex items-center justify-center mb-1.5`}>
      <Icon className="w-3 h-3" />
    </div>
    <p className="text-[9px] text-muted-foreground">{label}</p>
    <p className="text-xs font-bold text-foreground leading-tight">{value}</p>
    <p className="text-[8px] text-muted-foreground">{sub}</p>
    <div className="mt-1.5 h-1 bg-secondary rounded-full overflow-hidden">
      <div className={`h-full bg-gradient-to-r ${bar}`} style={{ width: `${pct}%` }} />
    </div>
  </div>
);

export default DashboardMockup;