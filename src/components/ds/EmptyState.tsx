import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

type Props = {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  actionTo?: string;
  onAction?: () => void;
};

/** Estado vazio padrão do Evolua Plus — sempre acolhedor e com próximo passo claro. */
export const EmptyState = ({ icon: Icon, title, description, actionLabel, actionTo, onAction }: Props) => (
  <div className="bg-card rounded-2xl border border-border/50 shadow-soft p-10 text-center animate-fade-in">
    <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
      <Icon className="h-6 w-6" />
    </span>
    <p className="font-display font-semibold text-foreground">{title}</p>
    <p className="mt-1.5 text-sm text-muted-foreground max-w-sm mx-auto">{description}</p>
    {actionLabel && (actionTo || onAction) && (
      <div className="mt-6">
        {actionTo ? (
          <Button asChild variant="hero"><Link to={actionTo}>{actionLabel}</Link></Button>
        ) : (
          <Button variant="hero" onClick={onAction}>{actionLabel}</Button>
        )}
      </div>
    )}
  </div>
);

export default EmptyState;