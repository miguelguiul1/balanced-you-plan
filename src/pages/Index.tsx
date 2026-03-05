import HeroSection from "@/components/HeroSection";
import Calculator from "@/components/Calculator";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Navbar is now global in App.tsx */}

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
