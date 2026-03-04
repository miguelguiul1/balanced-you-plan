import { Button } from "@/components/ui/button";
import { ArrowDown } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

const HeroSection = () => {
  const scrollToCalculator = () => {
    document.getElementById("calculator")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src={heroBg}
          alt=""
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />
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
