import HeroSection from "@/components/HeroSection";
import Calculator from "@/components/Calculator";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <a href="/" className="font-display text-xl font-bold text-foreground">
            Evolua<span className="text-primary">+</span>
          </a>
          <span className="text-sm text-muted-foreground hidden sm:block">
            Nutrição inteligente para todos
          </span>
        </div>
      </nav>

      <HeroSection />
      <Calculator />

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-border">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          <p className="font-display font-medium text-foreground mb-1">
            Evolua<span className="text-primary">+</span>
          </p>
          <p>Planejamento nutricional inteligente e acessível.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
