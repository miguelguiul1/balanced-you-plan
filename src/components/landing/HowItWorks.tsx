import { ClipboardList, Sparkles, UtensilsCrossed, LineChart } from "lucide-react";

const steps = [
  {
    icon: ClipboardList,
    title: "Responda algumas perguntas",
    desc: "Objetivo, restrições, rotina e preferências alimentares em 2 minutos.",
  },
  {
    icon: Sparkles,
    title: "A IA analisa seu perfil",
    desc: "Calculamos suas necessidades e montamos um plano feito para você.",
  },
  {
    icon: UtensilsCrossed,
    title: "Receba um plano personalizado",
    desc: "Refeições, receitas, lista de compras e substituições prontas.",
  },
  {
    icon: LineChart,
    title: "Acompanhe sua evolução",
    desc: "Peso, medidas, hidratação e macros com gráficos e insights.",
  },
];

const HowItWorks = () => (
  <section id="como-funciona" className="py-24 px-6 bg-background">
    <div className="container mx-auto max-w-6xl">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <span className="inline-block mb-3 px-3 py-1 rounded-full bg-primary/10 text-primary font-display text-xs font-semibold tracking-wide uppercase">
          Como funciona
        </span>
        <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground">
          Do cadastro ao seu plano em <span className="text-gradient-primary">4 passos</span>
        </h2>
        <p className="mt-4 text-muted-foreground">
          Sem planilhas, sem cálculos manuais. A IA cuida da nutrição, você foca em executar.
        </p>
      </div>

      <div className="relative grid md:grid-cols-4 gap-6">
        {/* Connector line */}
        <div className="hidden md:block absolute top-8 left-[12%] right-[12%] h-0.5 bg-gradient-to-r from-primary/10 via-primary/40 to-primary/10" aria-hidden />
        {steps.map((s, i) => (
          <div key={s.title} className="relative flex flex-col items-center text-center">
            <div className="relative w-16 h-16 rounded-2xl bg-card border border-border/60 shadow-soft flex items-center justify-center mb-4 z-10">
              <s.icon className="w-7 h-7 text-primary" />
              <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-display font-bold flex items-center justify-center">
                {i + 1}
              </span>
            </div>
            <h3 className="font-display font-semibold text-foreground mb-1">{s.title}</h3>
            <p className="text-sm text-muted-foreground max-w-[220px]">{s.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default HowItWorks;