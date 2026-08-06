import { cn } from "@/lib/utils";
import { LucideIcon, Trophy } from "lucide-react";

interface AchievementBadgeProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  unlocked?: boolean;
  className?: string;
}

/** Selo de conquista — gamificação Evolua Plus. */
export const AchievementBadge = ({
  title,
  description,
  icon: Icon = Trophy,
  unlocked = false,
  className,
}: AchievementBadgeProps) => (
  <div
    className={cn(
      "flex items-center gap-3 rounded-xl border p-4 transition-all duration-normal ease-out",
      unlocked
        ? "border-accent/40 bg-accent-soft shadow-md"
        : "border-border bg-muted/40 opacity-70",
      className,
    )}
  >
    <div
      className={cn(
        "flex size-11 shrink-0 items-center justify-center rounded-full",
        unlocked ? "bg-gradient-accent text-accent-foreground shadow-glow-accent" : "bg-muted text-muted-foreground",
      )}
      aria-hidden="true"
    >
      <Icon className="size-5" strokeWidth={2} />
    </div>
    <div className="min-w-0">
      <p className="type-h4 truncate">{title}</p>
      {description && <p className="type-caption truncate">{description}</p>}
    </div>
  </div>
);

export default AchievementBadge;