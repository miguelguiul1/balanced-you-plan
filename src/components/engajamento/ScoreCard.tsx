import { Sparkles } from "lucide-react";
import { ScoreBreakdown } from "@/hooks/useEngagement";

type Props = {
  score: number;
  message: string;
  breakdown?: ScoreBreakdown[];
  compact?: boolean;
};

const ScoreCard = ({ score, message, breakdown, compact }: Props) => {
  const r = 42;
  const c = 2 * Math.PI * r;

  return (
    <div className="bg-card rounded-2xl shadow-soft border border-border/50 p-5">
      <div className="flex items-center gap-4">
        <div className="relative w-24 h-24 shrink-0">
          <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
            <circle cx="50" cy="50" r={r} fill="none" strokeWidth="8" className="stroke-secondary" />
            <circle
              cx="50" cy="50" r={r} fill="none" strokeWidth="8" strokeLinecap="round"
              className="stroke-primary transition-all duration-700"
              strokeDasharray={c}
              strokeDashoffset={c - (c * score) / 100}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-display text-2xl font-bold text-foreground">{score}</span>
            <span className="text-[10px] text-muted-foreground">/ 100</span>
          </div>
        </div>
        <div className="min-w-0">
          <p className="font-display font-semibold text-foreground flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-accent" /> Score do dia
          </p>
          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{message}</p>
        </div>
      </div>

      {!compact && breakdown && (
        <div className="mt-4 space-y-2">
          {breakdown.map((b) => (
            <div key={b.label} className="flex items-center gap-3">
              <span className="text-xs text-muted-foreground w-40 shrink-0">{b.label}</span>
              <div className="h-1.5 flex-1 bg-secondary rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${b.ok ? "bg-primary" : "bg-accent"}`}
                  style={{ width: `${Math.round((b.points / b.max) * 100)}%` }}
                />
              </div>
              <span className="text-[11px] text-muted-foreground w-12 text-right">{b.points}/{b.max}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ScoreCard;