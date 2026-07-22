import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DashboardMockup from "./landing/DashboardMockup";


// Decorative organic leaf
const Leaf = ({ className = "", style }: { className?: string; style?: React.CSSProperties }) => (
  <svg viewBox="0 0 64 64" className={className} style={style} fill="none" aria-hidden="true">
    <path
      d="M32 4 C 12 14, 6 34, 14 54 C 34 52, 54 40, 60 20 C 50 12, 42 8, 32 4 Z"
      fill="currentColor"
    />
    <path
      d="M16 50 C 26 38, 40 26, 56 18"
      stroke="hsl(152 45% 25%)"
      strokeOpacity="0.35"
      strokeWidth="1.2"
      strokeLinecap="round"
    />
  </svg>
);

// Small phone mockup showing a meal card
const PhoneMockup = ({
  className = "",
  style,
  variant = "meal",
}: {
  className?: string;
  style?: React.CSSProperties;
  variant?: "meal" | "list";
}) => (
  <div
    className={`relative rounded-[2.2rem] border border-border/60 bg-card shadow-2xl shadow-primary/10 p-2 ${className}`}
    style={style}
  >
    <div className="absolute top-2 left-1/2 -translate-x-1/2 w-20 h-4 rounded-full bg-foreground/80 z-10" />
    <div className="rounded-[1.8rem] overflow-hidden bg-background aspect-[9/19] w-[190px] flex flex-col">
      <div className="h-14 bg-gradient-to-br from-primary/15 to-primary/5" />
      {variant === "meal" ? (
        <div className="p-3 flex-1 flex flex-col gap-2.5">
          <div className="text-[10px] font-display font-semibold text-muted-foreground">HOJE</div>
          <div className="text-xs font-display font-bold text-foreground leading-tight">
            Bowl de quinoa<br />& frango grelhado
          </div>
          <div className="flex gap-1.5">
            <div className="flex-1 rounded-md bg-primary/10 p-1.5">
              <div className="text-[8px] text-muted-foreground">Kcal</div>
              <div className="text-[10px] font-bold text-foreground">420</div>
            </div>
            <div className="flex-1 rounded-md bg-accent/15 p-1.5">
              <div className="text-[8px] text-muted-foreground">Prot</div>
              <div className="text-[10px] font-bold text-foreground">38g</div>
            </div>
            <div className="flex-1 rounded-md bg-secondary p-1.5">
              <div className="text-[8px] text-muted-foreground">Carb</div>
              <div className="text-[10px] font-bold text-foreground">42g</div>
            </div>
          </div>
          <div className="mt-1 h-6 rounded-md bg-primary text-primary-foreground text-[9px] font-display font-semibold flex items-center justify-center">
            Ver receita
          </div>
        </div>
      ) : (
        <div className="p-3 flex-1 flex flex-col gap-2">
          <div className="text-[10px] font-display font-semibold text-muted-foreground">LISTA</div>
          <div className="text-xs font-display font-bold text-foreground leading-tight">
            Compras da semana
          </div>
          {["Quinoa 500g", "Frango 1kg", "Abacate x2", "Espinafre", "Grão-de-bico", "Azeite"].map(
            (item, i) => (
              <div key={item} className="flex items-center gap-1.5 text-[10px] text-foreground">
                <div className={`w-2.5 h-2.5 rounded-sm border border-primary/50 ${i < 3 ? "bg-primary" : ""}`} />
                <span className={i < 3 ? "line-through text-muted-foreground" : ""}>{item}</span>
              </div>
            ),
          )}
        </div>
      )}
    </div>
  </div>
);

const HeroSection = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id: string) => () =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  // Particle positions (fixed to avoid rerenders)
  const particles = [
    { top: "12%", left: "8%", size: 8, delay: "0s", color: "bg-primary/40" },
    { top: "22%", left: "88%", size: 6, delay: "1.2s", color: "bg-accent/50" },
    { top: "68%", left: "6%", size: 10, delay: "0.6s", color: "bg-primary/30" },
    { top: "78%", left: "92%", size: 7, delay: "2s", color: "bg-primary/40" },
    { top: "40%", left: "14%", size: 5, delay: "1.8s", color: "bg-accent/40" },
    { top: "55%", left: "82%", size: 9, delay: "0.4s", color: "bg-primary/30" },
    { top: "18%", left: "48%", size: 4, delay: "2.5s", color: "bg-primary/40" },
    { top: "82%", left: "42%", size: 5, delay: "1s", color: "bg-accent/40" },
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden hero-radial pt-24 pb-16">
      {/* Soft orbs */}
      <div
        className="absolute -top-32 -left-32 w-[36rem] h-[36rem] rounded-full bg-primary/20 blur-3xl animate-float-slow"
        aria-hidden
      />
      <div
        className="absolute -bottom-40 -right-40 w-[40rem] h-[40rem] rounded-full bg-accent/15 blur-3xl animate-float"
        aria-hidden
      />

      {/* Grain */}
      <div className="absolute inset-0 grain opacity-[0.35] mix-blend-multiply pointer-events-none" aria-hidden />

      {/* Organic wavy lines */}
      <svg
        className="absolute inset-x-0 top-0 w-full h-40 text-primary/15"
        viewBox="0 0 1440 160"
        preserveAspectRatio="none"
        aria-hidden
      >
        <path
          d="M0,80 C240,20 480,140 720,80 C960,20 1200,140 1440,80 L1440,0 L0,0 Z"
          fill="currentColor"
        />
      </svg>
      <svg
        className="absolute inset-x-0 bottom-0 w-full h-32 text-primary/10"
        viewBox="0 0 1440 160"
        preserveAspectRatio="none"
        aria-hidden
      >
        <path
          d="M0,80 C360,140 720,20 1080,80 C1260,110 1350,90 1440,80 L1440,160 L0,160 Z"
          fill="currentColor"
        />
      </svg>

      {/* Floating leaves */}
      <Leaf
        className="absolute top-[10%] left-[4%] w-16 h-16 text-primary/25 animate-float"
        style={{ transform: `translateY(${scrollY * -0.15}px) rotate(-20deg)` }}
      />
      <Leaf
        className="absolute top-[20%] right-[6%] w-12 h-12 text-primary/20 animate-float-slow"
        style={{ transform: `translateY(${scrollY * -0.1}px) rotate(35deg)` }}
      />
      <Leaf
        className="absolute bottom-[14%] left-[10%] w-10 h-10 text-accent/40 animate-float"
        style={{ transform: `translateY(${scrollY * -0.2}px) rotate(120deg)`, animationDelay: "1.2s" }}
      />
      <Leaf
        className="absolute bottom-[22%] right-[12%] w-14 h-14 text-primary/20 animate-float-slow"
        style={{ transform: `translateY(${scrollY * -0.12}px) rotate(-60deg)`, animationDelay: "0.6s" }}
      />

      {/* Particles */}
      {particles.map((p, i) => (
        <div
          key={i}
          className={`absolute rounded-full ${p.color} animate-drift pointer-events-none`}
          style={{
            top: p.top,
            left: p.left,
            width: `${p.size}px`,
            height: `${p.size}px`,
            animationDelay: p.delay,
          }}
          aria-hidden
        />
      ))}

      {/* Content: two-column hero */}
      <div className="relative z-10 container mx-auto px-6 grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
        <div className="text-center lg:text-left max-w-2xl mx-auto lg:mx-0">
          <div className="animate-fade-up">
            <span className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full bg-primary/10 text-primary font-display text-sm font-medium tracking-wide">
              <Sparkles className="w-3.5 h-3.5" />
              Seu nutricionista inteligente 24h
            </span>
          </div>

          <h1
            className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.05] tracking-tight text-foreground animate-fade-up"
            style={{ animationDelay: "0.1s" }}
          >
            Receba seu plano alimentar{" "}
            <span className="text-gradient-primary">personalizado</span> em menos de 2 minutos
          </h1>

          <p
            className="mt-6 text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0 font-body animate-fade-up"
            style={{ animationDelay: "0.2s" }}
          >
            IA que entende seus objetivos, restrições e preferências. Emagrecimento, hipertrofia,
            energia e saúde — com refeições reais, lista de compras e evolução acompanhada.
          </p>

          <div
            className="mt-8 flex flex-col sm:flex-row gap-3 justify-center lg:justify-start animate-fade-up"
            style={{ animationDelay: "0.3s" }}
          >
            <Button asChild variant="hero" size="xl">
              <Link to="/auth">
                Criar meu plano grátis <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </Button>
            <Button variant="outline" size="xl" onClick={scrollTo("como-funciona")}>
              Ver como funciona
            </Button>
          </div>

          <div
            className="mt-6 flex items-center gap-4 text-xs text-muted-foreground justify-center lg:justify-start animate-fade-up"
            style={{ animationDelay: "0.4s" }}
          >
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-primary" /> Sem cartão de crédito
            </span>
            <span>•</span>
            <span>Cancele quando quiser</span>
          </div>
        </div>

        {/* Right column: dashboard mockup */}
        <div
          className="relative max-w-md mx-auto lg:max-w-none w-full animate-fade-up"
          style={{ animationDelay: "0.5s", transform: `translateY(${scrollY * -0.04}px)` }}
        >
          <DashboardMockup className="lg:rotate-1 hover:rotate-0 transition-transform duration-500" />
          {/* Floating chip */}
          <div className="hidden md:flex absolute -left-6 top-16 items-center gap-2 rounded-full bg-card border border-border/60 shadow-lg px-3 py-1.5 text-xs font-display font-semibold text-foreground animate-float-slow">
            <span className="w-2 h-2 rounded-full bg-primary" /> Plano ativo
          </div>
          <div className="hidden md:flex absolute -right-4 bottom-24 items-center gap-2 rounded-full bg-card border border-border/60 shadow-lg px-3 py-1.5 text-xs font-display font-semibold text-foreground animate-float">
            <Sparkles className="w-3 h-3 text-accent" /> IA em ação
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
