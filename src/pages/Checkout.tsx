import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  ArrowLeft,
  Check,
  ShieldCheck,
  Lock,
  CreditCard,
  Sparkles,
  BadgeCheck,
} from "lucide-react";

const KIRVANO_CHECKOUT_URL = "#"; // Substituir pelo link real da Kirvano

type PlanKey = "mensal" | "semestral" | "anual";

const plans: Record<
  PlanKey,
  {
    label: string;
    price: string;
    period: string;
    priceNumber: number;
    badge?: string;
    highlight?: boolean;
    savings?: string;
  }
> = {
  mensal: {
    label: "Mensal",
    price: "29,90",
    period: "por mês",
    priceNumber: 29.9,
  },
  semestral: {
    label: "Semestral",
    price: "129,90",
    period: "a cada 6 meses",
    priceNumber: 129.9,
    badge: "Mais popular",
    highlight: true,
    savings: "Economize 28%",
  },
  anual: {
    label: "Anual",
    price: "249,90",
    period: "por ano",
    priceNumber: 249.9,
    badge: "Melhor custo-benefício",
    savings: "Economize 30%",
  },
};

const included = [
  "Cardápio semanal personalizado por IA",
  "Lista de compras inteligente",
  "+50 receitas práticas e acessíveis",
  "Scanner de geladeira com IA",
  "Diário alimentar automatizado",
  "Suporte prioritário",
];

const Checkout = () => {
  const [params] = useSearchParams();
  const initial = (params.get("plano") as PlanKey) || "semestral";
  const [selected, setSelected] = useState<PlanKey>(
    plans[initial] ? initial : "semestral",
  );
  const [form, setForm] = useState({ name: "", email: "", phone: "" });

  const plan = plans[selected];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    window.open(KIRVANO_CHECKOUT_URL, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <div className="border-b border-border bg-card/50 backdrop-blur">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            to="/vendas"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Link>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Lock className="w-3.5 h-3.5 text-primary" />
            Pagamento 100% seguro
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-10 max-w-6xl">
        <div className="text-center mb-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-display font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            Finalize sua assinatura
          </span>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground mt-3">
            Você está a um passo do <span className="text-gradient-primary">Evolua Plus</span>
          </h1>
          <p className="text-muted-foreground mt-2 max-w-lg mx-auto">
            Escolha seu plano e comece hoje. Cancelamento simples a qualquer momento.
          </p>
        </div>

        <div className="grid lg:grid-cols-[1fr_400px] gap-8">
          {/* Left: form + plans */}
          <div className="space-y-8">
            {/* Plans */}
            <Card className="border-border/60">
              <CardContent className="p-6 sm:p-8">
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-display font-bold">
                    1
                  </div>
                  <h2 className="font-display font-semibold text-lg text-foreground">
                    Escolha seu plano
                  </h2>
                </div>

                <RadioGroup
                  value={selected}
                  onValueChange={(v) => setSelected(v as PlanKey)}
                  className="grid gap-3"
                >
                  {(Object.keys(plans) as PlanKey[]).map((key) => {
                    const p = plans[key];
                    const active = selected === key;
                    return (
                      <label
                        key={key}
                        htmlFor={`plan-${key}`}
                        className={`relative flex items-center gap-4 p-4 sm:p-5 rounded-xl border cursor-pointer transition-all ${
                          active
                            ? "border-primary bg-primary/5 shadow-sm"
                            : "border-border hover:border-primary/40"
                        }`}
                      >
                        <RadioGroupItem id={`plan-${key}`} value={key} />
                        <div className="flex-1 flex flex-wrap items-center justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-display font-semibold text-foreground">
                                {p.label}
                              </span>
                              {p.badge && (
                                <span className="text-[10px] uppercase tracking-wide px-2 py-0.5 rounded-full bg-accent/20 text-accent-foreground font-semibold">
                                  {p.badge}
                                </span>
                              )}
                            </div>
                            {p.savings && (
                              <span className="text-xs text-primary font-medium">
                                {p.savings}
                              </span>
                            )}
                          </div>
                          <div className="text-right">
                            <div className="font-display font-bold text-foreground">
                              R$ {p.price}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {p.period}
                            </div>
                          </div>
                        </div>
                      </label>
                    );
                  })}
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Info */}
            <Card className="border-border/60">
              <CardContent className="p-6 sm:p-8">
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-display font-bold">
                    2
                  </div>
                  <h2 className="font-display font-semibold text-lg text-foreground">
                    Seus dados
                  </h2>
                </div>

                <form onSubmit={handleSubmit} className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Nome completo</Label>
                    <Input
                      id="name"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Seu nome"
                    />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="email">E-mail</Label>
                      <Input
                        id="email"
                        type="email"
                        required
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder="voce@email.com"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="phone">WhatsApp</Label>
                      <Input
                        id="phone"
                        required
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        placeholder="(11) 90000-0000"
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <Button type="submit" variant="hero" size="xl" className="w-full">
                      <CreditCard className="w-5 h-5" />
                      Ir para pagamento seguro
                    </Button>
                    <p className="text-xs text-muted-foreground text-center mt-3 flex items-center justify-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                      Processado pela Kirvano · Pix, cartão ou boleto
                    </p>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Right: summary */}
          <aside className="lg:sticky lg:top-24 h-fit">
            <Card className="border-primary/20 bg-card overflow-hidden">
              <div className="bg-gradient-to-br from-primary/10 to-accent/5 px-6 py-4 border-b border-border/60">
                <div className="flex items-center gap-2">
                  <BadgeCheck className="w-4 h-4 text-primary" />
                  <span className="font-display font-semibold text-sm text-foreground">
                    Resumo do pedido
                  </span>
                </div>
              </div>
              <CardContent className="p-6 space-y-5">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Evolua Plus {plan.label}
                    </span>
                    <span className="font-display font-semibold text-foreground">
                      R$ {plan.price}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Cobrado {plan.period}
                  </p>
                </div>

                <div className="border-t border-border/60 pt-4">
                  <div className="flex items-baseline justify-between">
                    <span className="font-display font-semibold text-foreground">
                      Total hoje
                    </span>
                    <div className="text-right">
                      <div className="font-display text-2xl font-bold text-foreground">
                        R$ {plan.price}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-border/60 pt-4">
                  <p className="text-xs font-display font-semibold text-foreground mb-3 uppercase tracking-wide">
                    Incluso no plano
                  </p>
                  <ul className="space-y-2">
                    {included.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-2 text-sm text-foreground"
                      >
                        <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="border-t border-border/60 pt-4 space-y-2">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <ShieldCheck className="w-4 h-4 text-primary shrink-0" />
                    Garantia incondicional de 7 dias
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Lock className="w-4 h-4 text-primary shrink-0" />
                    Seus dados são criptografados
                  </div>
                </div>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Checkout;