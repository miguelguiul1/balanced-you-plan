import { Star } from "lucide-react";

const stats = [
  { value: "12k+", label: "Refeições planejadas" },
  { value: "4,9/5", label: "Satisfação média" },
  { value: "94%", label: "Aderem por 30+ dias" },
  { value: "24/7", label: "Assistente disponível" },
];

// NOTE: placeholder testimonials — substituir por depoimentos reais quando disponíveis.
const testimonials = Array.from({ length: 6 }).map(() => ({
  name: "Depoimento em breve",
  role: "Cliente Balanced You",
  text: "Espaço reservado para relato real de resultado — substituir por conteúdo aprovado.",
}));

const SocialProof = () => (
  <section className="py-24 px-6 bg-background">
    <div className="container mx-auto max-w-6xl">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
        {stats.map((s) => (
          <div key={s.label} className="text-center rounded-2xl border border-border/60 bg-card p-6">
            <div className="font-display text-3xl sm:text-4xl font-bold text-gradient-primary">
              {s.value}
            </div>
            <p className="text-sm text-muted-foreground mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="text-center max-w-2xl mx-auto mb-10">
        <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground">
          Quem usa <span className="text-gradient-primary">recomenda</span>
        </h2>
        <p className="mt-3 text-muted-foreground text-sm">
          Depoimentos abaixo são <strong>placeholders</strong> — serão substituídos por relatos reais.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {testimonials.map((t, i) => (
          <div key={i} className="rounded-2xl border border-border/60 bg-card p-6">
            <div className="flex gap-0.5 mb-3">
              {Array.from({ length: 5 }).map((_, s) => (
                <Star key={s} className="w-4 h-4 fill-accent text-accent" />
              ))}
            </div>
            <p className="text-sm text-foreground leading-relaxed mb-4">"{t.text}"</p>
            <div>
              <p className="font-display font-semibold text-sm text-foreground">{t.name}</p>
              <p className="text-xs text-muted-foreground">{t.role}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default SocialProof;