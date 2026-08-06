import * as React from "react";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  ArrowDownRight, ArrowUpRight, Bot, Check, Droplets, Flame,
  LucideIcon, Minus, ScanLine, Target, UtensilsCrossed,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/* Base                                                                */
/* ------------------------------------------------------------------ */

export const DSCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { interactive?: boolean }
>(({ className, interactive, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(interactive ? "ds-surface-interactive" : "ds-surface", "p-5", className)}
    {...props}
  />
));
DSCard.displayName = "DSCard";

export const DSCardHeader = ({
  title, subtitle, icon: Icon, action,
}: { title: string; subtitle?: string; icon?: LucideIcon; action?: React.ReactNode }) => (
  <div className="mb-4 flex items-start justify-between gap-3">
    <div className="flex items-center gap-3 min-w-0">
      {Icon && (
        <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-primary-soft text-primary" aria-hidden="true">
          <Icon className="size-[18px]" strokeWidth={2} />
        </span>
      )}
      <div className="min-w-0">
        <p className="type-h4 truncate">{title}</p>
        {subtitle && <p className="type-caption truncate">{subtitle}</p>}
      </div>
    </div>
    {action}
  </div>
);

/* ------------------------------------------------------------------ */
/* Evolution Card                                                      */
/* ------------------------------------------------------------------ */

export const EvolutionCard = ({
  label, value, unit, delta, hint, className,
}: {
  label: string; value: string | number; unit?: string;
  delta?: number; hint?: string; className?: string;
}) => {
  const dir = delta === undefined ? "flat" : delta > 0 ? "up" : delta < 0 ? "down" : "flat";
  const DeltaIcon = dir === "up" ? ArrowUpRight : dir === "down" ? ArrowDownRight : Minus;
  const tone =
    dir === "up" ? "text-success" : dir === "down" ? "text-info" : "text-muted-foreground";

  return (
    <DSCard interactive className={className}>
      <p className="type-label">{label}</p>
      <div className="mt-2 flex items-end gap-2">
        <span className="type-numeric text-3xl text-foreground">{value}</span>
        {unit && <span className="type-body-sm text-muted-foreground pb-1">{unit}</span>}
      </div>
      {delta !== undefined && (
        <p className={cn("mt-2 inline-flex items-center gap-1 text-sm font-medium", tone)}>
          <DeltaIcon className="size-4" aria-hidden="true" />
          {Math.abs(delta).toLocaleString("pt-BR")} {unit}
          <span className="sr-only">{dir === "up" ? "aumento" : dir === "down" ? "redução" : "estável"}</span>
        </p>
      )}
      {hint && <p className="type-caption mt-1">{hint}</p>}
    </DSCard>
  );
};

/* ------------------------------------------------------------------ */
/* Nutrition Card                                                      */
/* ------------------------------------------------------------------ */

export const NutritionCard = ({
  title, calories, protein, carbs, fat, className,
}: {
  title: string; calories: number; protein: number; carbs: number; fat: number; className?: string;
}) => {
  const macros = [
    { label: "Proteína", value: protein, tone: "bg-chart-1" },
    { label: "Carbo", value: carbs, tone: "bg-chart-2" },
    { label: "Gordura", value: fat, tone: "bg-chart-4" },
  ];
  const total = Math.max(1, protein + carbs + fat);

  return (
    <DSCard className={className}>
      <DSCardHeader title={title} subtitle={`${Math.round(calories)} kcal`} icon={Flame} />
      <div className="flex h-2 overflow-hidden rounded-full bg-muted" aria-hidden="true">
        {macros.map((m) => (
          <div key={m.label} className={cn(m.tone)} style={{ width: `${(m.value / total) * 100}%` }} />
        ))}
      </div>
      <dl className="mt-4 grid grid-cols-3 gap-3">
        {macros.map((m) => (
          <div key={m.label}>
            <dt className="type-caption">{m.label}</dt>
            <dd className="type-numeric text-base text-foreground">{Math.round(m.value)}g</dd>
          </div>
        ))}
      </dl>
    </DSCard>
  );
};

/* ------------------------------------------------------------------ */
/* Scanner Result Card                                                 */
/* ------------------------------------------------------------------ */

export const ScannerResultCard = ({
  name, confidence, portion, calories, className,
}: { name: string; confidence: number; portion?: string; calories?: number; className?: string }) => (
  <DSCard className={cn("relative overflow-hidden", className)}>
    <div className="absolute inset-x-0 top-0 h-1 bg-gradient-primary" aria-hidden="true" />
    <DSCardHeader
      title={name}
      subtitle={portion}
      icon={ScanLine}
      action={
        <Badge variant={confidence >= 80 ? "default" : "secondary"}>
          {Math.round(confidence)}% confiança
        </Badge>
      }
    />
    <Progress value={confidence} className="h-1.5" />
    {calories !== undefined && (
      <p className="type-body-sm mt-4 text-muted-foreground">
        Estimativa: <span className="type-numeric text-foreground">{Math.round(calories)} kcal</span>
      </p>
    )}
  </DSCard>
);

/* ------------------------------------------------------------------ */
/* AI Message Card                                                     */
/* ------------------------------------------------------------------ */

export const AIMessageCard = ({
  children, author = "Evolua Plus AI", className,
}: { children: React.ReactNode; author?: string; className?: string }) => (
  <div className={cn("flex gap-3", className)}>
    <span
      className="flex size-9 shrink-0 items-center justify-center rounded-full bg-gradient-primary text-primary-foreground shadow-sm"
      aria-hidden="true"
    >
      <Bot className="size-4" strokeWidth={2} />
    </span>
    <div className="ds-panel max-w-[85%] rounded-2xl rounded-tl-sm p-4">
      <p className="type-label mb-1">{author}</p>
      <div className="type-body-sm text-foreground">{children}</div>
    </div>
  </div>
);

/* ------------------------------------------------------------------ */
/* Goal Card                                                           */
/* ------------------------------------------------------------------ */

export const GoalCard = ({
  title, current, target, unit, className,
}: { title: string; current: number; target: number; unit?: string; className?: string }) => {
  const pct = target > 0 ? Math.min(100, (current / target) * 100) : 0;
  return (
    <DSCard interactive className={className}>
      <DSCardHeader title={title} subtitle={`Meta: ${target}${unit ?? ""}`} icon={Target} />
      <div className="flex items-end justify-between">
        <span className="type-numeric text-2xl text-foreground">
          {current}
          <span className="text-sm text-muted-foreground">{unit}</span>
        </span>
        <span className="type-body-sm text-primary font-semibold">{Math.round(pct)}%</span>
      </div>
      <Progress value={pct} className="mt-3 h-2" />
    </DSCard>
  );
};

/* ------------------------------------------------------------------ */
/* Hydration Card                                                      */
/* ------------------------------------------------------------------ */

export const HydrationCard = ({
  consumedMl, goalMl, onAdd, className,
}: { consumedMl: number; goalMl: number; onAdd?: (ml: number) => void; className?: string }) => {
  const pct = goalMl > 0 ? Math.min(100, (consumedMl / goalMl) * 100) : 0;
  return (
    <DSCard className={className}>
      <DSCardHeader title="Hidratação" subtitle={`${consumedMl} / ${goalMl} ml`} icon={Droplets} />
      <div className="relative h-3 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-info transition-[width] duration-slow ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
      {onAdd && (
        <div className="mt-4 flex flex-wrap gap-2">
          {[200, 300, 500].map((ml) => (
            <button
              key={ml}
              type="button"
              onClick={() => onAdd(ml)}
              className="tap-target rounded-full border border-border bg-surface px-4 text-sm font-medium
                         transition-colors duration-fast hover:border-info/40 hover:bg-info/10"
            >
              +{ml} ml
            </button>
          ))}
        </div>
      )}
    </DSCard>
  );
};

/* ------------------------------------------------------------------ */
/* Meal Card                                                           */
/* ------------------------------------------------------------------ */

export const MealCard = ({
  meal, name, calories, time, className,
}: { meal: string; name: string; calories?: number; time?: string; className?: string }) => (
  <DSCard interactive className={cn("flex items-center gap-4 py-4", className)}>
    <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-accent-soft text-accent-700" aria-hidden="true">
      <UtensilsCrossed className="size-[18px]" strokeWidth={2} />
    </span>
    <div className="min-w-0 flex-1">
      <p className="type-label">{meal}{time ? ` · ${time}` : ""}</p>
      <p className="type-body-sm truncate text-foreground font-medium">{name}</p>
    </div>
    {calories !== undefined && (
      <span className="type-numeric text-sm text-muted-foreground">{Math.round(calories)} kcal</span>
    )}
  </DSCard>
);

/* ------------------------------------------------------------------ */
/* Daily Habit Card                                                    */
/* ------------------------------------------------------------------ */

export const DailyHabitCard = ({
  title, streak = 0, done = false, onToggle, className,
}: { title: string; streak?: number; done?: boolean; onToggle?: () => void; className?: string }) => (
  <DSCard className={cn("flex items-center gap-4 py-4", className)}>
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={done}
      aria-label={`${done ? "Desmarcar" : "Marcar"} hábito ${title}`}
      className={cn(
        "flex size-11 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-normal ease-spring",
        done
          ? "border-primary bg-primary text-primary-foreground scale-100"
          : "border-border bg-transparent text-transparent hover:border-primary/50",
      )}
    >
      <Check className="size-5" strokeWidth={2.5} />
    </button>
    <div className="min-w-0 flex-1">
      <p className={cn("type-body-sm font-medium truncate", done && "text-muted-foreground line-through")}>{title}</p>
      <p className="type-caption">{streak} dia{streak === 1 ? "" : "s"} de sequência</p>
    </div>
  </DSCard>
);