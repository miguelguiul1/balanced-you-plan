import { cn } from "@/lib/utils";

export type RingTone = "primary" | "accent" | "info" | "warning" | "error";

const toneVar: Record<RingTone, string> = {
  primary: "var(--primary)",
  accent: "var(--accent)",
  info: "var(--info)",
  warning: "var(--warning)",
  error: "var(--destructive)",
};

interface MacroProgressRingProps {
  value: number;
  max?: number;
  size?: number;
  thickness?: number;
  tone?: RingTone;
  label?: string;
  unit?: string;
  className?: string;
}

/** Anel de progresso de macros — componente exclusivo Evolua Plus. */
export const MacroProgressRing = ({
  value,
  max = 100,
  size = 112,
  thickness = 10,
  tone = "primary",
  label,
  unit,
  className,
}: MacroProgressRingProps) => {
  const pct = Math.max(0, Math.min(1, max > 0 ? value / max : 0));
  const r = (size - thickness) / 2;
  const c = 2 * Math.PI * r;

  return (
    <div
      className={cn("relative inline-flex items-center justify-center", className)}
      role="img"
      aria-label={`${label ?? "Progresso"}: ${Math.round(pct * 100)}%`}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2} cy={size / 2} r={r} fill="none"
          stroke="hsl(var(--muted))" strokeWidth={thickness}
        />
        <circle
          cx={size / 2} cy={size / 2} r={r} fill="none"
          stroke={`hsl(${toneVar[tone]})`}
          strokeWidth={thickness}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - pct)}
          style={{ transition: "stroke-dashoffset var(--duration-slow) var(--ease-out)" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="type-numeric text-xl text-foreground">
          {Math.round(value)}
          {unit && <span className="text-xs text-muted-foreground ml-0.5">{unit}</span>}
        </span>
        {label && <span className="type-caption">{label}</span>}
      </div>
    </div>
  );
};

export default MacroProgressRing;