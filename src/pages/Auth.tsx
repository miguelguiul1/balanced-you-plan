import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Mail, Lock, User, ArrowRight, Eye, EyeOff, Sparkles, Leaf, Heart } from "lucide-react";

const Auth = () => {
  const [showWelcome, setShowWelcome] = useState(true);
  const [isLogin, setIsLogin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const dismissWelcome = () => {
    setIsLogin(false); // go straight to sign up
    setShowWelcome(false);
  };

  // Auto-dismiss welcome after 3.8s
  useEffect(() => {
    if (!showWelcome) return;
    const t = setTimeout(dismissWelcome, 3800);
    return () => clearTimeout(t);
  }, [showWelcome]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast({ title: "Bem-vindo de volta! 🎉" });
        navigate("/");
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName },
            emailRedirectTo: window.location.origin,
          },
        });
        if (error) throw error;
        toast({
          title: "Conta criada! 📧",
          description: "Verifique seu email para confirmar o cadastro.",
        });
      }
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Algo deu errado. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (showWelcome) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background overflow-hidden">
        {/* Gradient backdrop */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/10" />
        <div className="absolute -top-32 -left-32 w-[36rem] h-[36rem] rounded-full bg-primary/20 blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -right-40 w-[40rem] h-[40rem] rounded-full bg-accent/15 blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />

        {/* Floating decorative icons */}
        <Leaf className="absolute top-[18%] left-[12%] w-8 h-8 text-primary/40 animate-fade-in" style={{ animationDelay: "0.3s", animationDuration: "1s" }} />
        <Leaf className="absolute bottom-[22%] right-[14%] w-10 h-10 text-primary/30 animate-fade-in" style={{ animationDelay: "0.6s", animationDuration: "1s" }} />
        <Sparkles className="absolute top-[26%] right-[18%] w-6 h-6 text-accent/60 animate-fade-in" style={{ animationDelay: "0.9s", animationDuration: "1s" }} />
        <Heart className="absolute bottom-[28%] left-[16%] w-6 h-6 text-primary/40 animate-fade-in" style={{ animationDelay: "1.2s", animationDuration: "1s" }} />

        {/* Content */}
        <div className="relative z-10 text-center px-6 max-w-lg">
          <div className="animate-fade-up">
            <span className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full bg-primary/10 text-primary font-display text-sm font-medium">
              <Sparkles className="w-4 h-4" />
              Sua jornada começa aqui
            </span>
          </div>

          <h1
            className="font-display text-3xl sm:text-4xl font-medium text-muted-foreground animate-fade-up"
            style={{ animationDelay: "0.2s" }}
          >
            Bem-vindo ao
          </h1>

          <div
            className="font-display text-6xl sm:text-8xl font-bold leading-none mt-2 animate-fade-up"
            style={{ animationDelay: "0.5s" }}
          >
            <span className="text-foreground">Evolua</span>
            <span className="text-gradient-primary">+</span>
          </div>

          <p
            className="mt-6 text-base sm:text-lg text-muted-foreground max-w-md mx-auto animate-fade-up"
            style={{ animationDelay: "0.9s" }}
          >
            Nutrição inteligente, personalizada e acessível. Vamos criar sua conta em segundos.
          </p>

          <div
            className="mt-10 animate-fade-up"
            style={{ animationDelay: "1.3s" }}
          >
            <Button variant="hero" size="xl" className="gap-2 group" onClick={dismissWelcome}>
              Começar meu cadastro
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>

          <button
            onClick={() => {
              setIsLogin(true);
              setShowWelcome(false);
            }}
            className="mt-5 text-sm text-muted-foreground hover:text-primary transition-colors animate-fade-in"
            style={{ animationDelay: "1.6s", animationDuration: "1s" }}
          >
            Já tenho conta · <span className="font-semibold text-primary">Entrar</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-20 pb-16 flex items-center justify-center">
      <div className="w-full max-w-md mx-auto px-6">
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl font-bold text-foreground">
            {isLogin ? "Entrar" : "Criar conta"}
          </h1>
          <p className="mt-2 text-muted-foreground">
            {isLogin
              ? "Acesse sua conta para personalizar sua experiência"
              : "Comece sua jornada de nutrição inteligente"}
          </p>
        </div>

        <div className="bg-card rounded-2xl shadow-soft p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="name" className="text-foreground">Nome completo</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="Seu nome"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground">Senha</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Mínimo 6 caracteres"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button variant="hero" size="lg" className="w-full gap-2" type="submit" disabled={loading}>
              {loading ? "Carregando..." : isLogin ? "Entrar" : "Criar conta"}
              <ArrowRight className="w-4 h-4" />
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              {isLogin ? "Não tem conta? " : "Já tem conta? "}
              <span className="font-semibold text-primary">
                {isLogin ? "Cadastre-se" : "Entrar"}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
