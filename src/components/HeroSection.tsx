import { Button } from "@/components/ui/button";
import { ArrowDown } from "lucide-react";
import { useEffect, useState } from "react";
import heroBowl from "@/assets/hero-bowl.png";
import heroPlate from "@/assets/hero-plate.png";

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
          <div className="h-20 relative flex items-center justify-center">
            <img
              src={heroBowl}
              alt=""
              className="max-h-full w-auto object-contain drop-shadow-md"
              loading="lazy"
            />
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

  const scrollToCalculator = () => {
    document.getElementById("calculator")?.scrollIntoView({ behavior: "smooth" });
  };

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
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden hero-radial">
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
      <Leaf
        className="hidden md:block absolute top-[52%] left-[2%] w-8 h-8 text-primary/15 animate-float"
        style={{ animationDelay: "2s" }}
      />
      <Leaf
        className="absolute top-[6%] left-[42%] w-9 h-9 text-primary/20 animate-float-slow"
        style={{ transform: `translateY(${scrollY * -0.18}px) rotate(75deg)`, animationDelay: "0.9s" }}
      />
      <Leaf
        className="absolute top-[38%] right-[2%] w-11 h-11 text-primary/25 animate-float"
        style={{ transform: `translateY(${scrollY * -0.14}px) rotate(-45deg)`, animationDelay: "1.6s" }}
      />
      <Leaf
        className="absolute top-[62%] right-[38%] w-8 h-8 text-accent/35 animate-float-slow"
        style={{ transform: `translateY(${scrollY * -0.09}px) rotate(200deg)`, animationDelay: "0.3s" }}
      />
      <Leaf
        className="hidden md:block absolute bottom-[4%] left-[38%] w-10 h-10 text-primary/20 animate-float"
        style={{ transform: `translateY(${scrollY * -0.11}px) rotate(160deg)`, animationDelay: "2.4s" }}
      />
      <Leaf
        className="absolute top-[30%] left-[24%] w-6 h-6 text-primary/15 animate-float-slow"
        style={{ animationDelay: "1.4s" }}
      />
      <Leaf
        className="hidden md:block absolute bottom-[30%] right-[26%] w-7 h-7 text-primary/20 animate-float"
        style={{ animationDelay: "0.7s" }}
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

      {/* Realistic food bowl — right side */}
      <div
        className="hidden md:block absolute right-[2%] lg:right-[5%] top-1/2 -translate-y-1/2 animate-fade-up pointer-events-none"
        style={{
          transform: `translateY(calc(-50% + ${scrollY * -0.12}px))`,
          animationDelay: "0.5s",
        }}
        aria-hidden
      >
        <div className="relative animate-float-slow">
          {/* soft ground shadow */}
          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-[70%] h-8 bg-primary/25 blur-2xl rounded-full" />
          <img
            src={heroBowl}
            alt="Bowl saudável de quinoa, frango e vegetais"
            className="relative w-56 lg:w-80 xl:w-96 drop-shadow-2xl"
            style={{ filter: "drop-shadow(0 30px 40px hsl(152 45% 25% / 0.25))" }}
          />
        </div>
      </div>

      {/* Small realistic plate — top left */}
      <div
        className="hidden lg:block absolute left-[4%] top-[14%] animate-fade-up pointer-events-none"
        style={{
          transform: `translateY(${scrollY * -0.08}px)`,
          animationDelay: "0.7s",
        }}
        aria-hidden
      >
        <div className="relative animate-float">
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-[70%] h-6 bg-primary/20 blur-2xl rounded-full" />
          <img
            src={heroPlate}
            alt=""
            className="relative w-40 xl:w-52"
            style={{ filter: "drop-shadow(0 20px 30px hsl(152 45% 25% / 0.22))" }}
          />
        </div>
      </div>

      {/* Phone mockup — bottom left, overlapping the plate area */}
      <div
        className="hidden lg:block absolute left-[6%] bottom-[6%] animate-fade-up"
        style={{
          transform: `translateY(${scrollY * -0.05}px) rotate(-6deg)`,
          animationDelay: "0.9s",
        }}
        aria-hidden
      >
        <PhoneMockup variant="meal" className="animate-float-slow" />
      </div>

      {/* Second phone mockup — right side, showing shopping list */}
      <div
        className="hidden xl:block absolute right-[3%] bottom-[8%] animate-fade-up"
        style={{
          transform: `translateY(${scrollY * -0.07}px) rotate(7deg)`,
          animationDelay: "1.1s",
        }}
        aria-hidden
      >
        <PhoneMockup variant="list" className="animate-float" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 text-center max-w-3xl">
        <div className="animate-fade-up">
          <span className="inline-block mb-6 px-4 py-1.5 rounded-full bg-primary/10 text-primary font-display text-sm font-medium tracking-wide">
            Nutrição inteligente e acessível
          </span>
        </div>

        <h1
          className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight text-foreground animate-fade-up"
          style={{ animationDelay: "0.1s" }}
        >
          Descubra o que você
          <br />
          <span className="text-gradient-primary">realmente precisa</span>
          <br />
          para evoluir
        </h1>

        <p
          className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-xl mx-auto font-body animate-fade-up"
          style={{ animationDelay: "0.2s" }}
        >
          Planejamento personalizado, lista de compras inteligente e foco em alimentação acessível. Sem fórmulas genéricas.
        </p>

        <div
          className="mt-10 flex flex-col sm:flex-row gap-4 justify-center animate-fade-up"
          style={{ animationDelay: "0.3s" }}
        >
          <Button variant="hero" size="xl" onClick={scrollToCalculator}>
            Calcular meu plano
          </Button>
        </div>

        <button
          onClick={scrollToCalculator}
          className="mt-16 animate-bounce text-muted-foreground hover:text-primary transition-colors"
          aria-label="Rolar para calculadora"
        >
          <ArrowDown className="w-6 h-6 mx-auto" />
        </button>
      </div>
    </section>
  );
};

export default HeroSection;
