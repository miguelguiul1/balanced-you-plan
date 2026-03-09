import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Check,
  Star,
  ShieldCheck,
  Zap,
  Heart,
  ArrowRight,
  ChevronDown,
  Utensils,
  Target,
  Clock,
  Leaf,
} from "lucide-react";
import { useState } from "react";

const KIRVANO_CHECKOUT_URL = "#"; // Substituir pelo link da Kirvano

const benefits = [
  {
    icon: Target,
    title: "100% Personalizado",
    description: "Plano adaptado ao seu objetivo, rotina e preferências alimentares.",
  },
  {
    icon: Utensils,
    title: "Receitas Práticas",
    description: "Refeições simples, saborosas e acessíveis para o dia a dia.",
  },
  {
    icon: Clock,
    title: "Economia de Tempo",
    description: "Lista de compras pronta e cardápio semanal organizado.",
  },
  {
    icon: Leaf,
    title: "Sem Restrições Extremas",
    description: "Alimentação equilibrada sem cortar o que você gosta.",
  },
  {
    icon: Zap,
    title: "Resultados Rápidos",
    description: "Metas alcançáveis com acompanhamento inteligente.",
  },
  {
    icon: Heart,
    title: "Saúde em Primeiro Lugar",
    description: "Baseado em ciência nutricional atualizada.",
  },
];

const testimonials = [
  {
    name: "Mariana S.",
    text: "Em 3 semanas já senti diferença na disposição e perdi 2kg sem passar fome. Super recomendo!",
    rating: 5,
  },
  {
    name: "Carlos R.",
    text: "Finalmente um plano que cabe no meu bolso e na minha rotina corrida. Melhor investimento que fiz.",
    rating: 5,
  },
  {
    name: "Ana Paula L.",
    text: "As receitas são deliciosas e fáceis de fazer. Minha família inteira aderiu!",
    rating: 5,
  },
];

const faqs = [
  {
    q: "Para quem é esse plano?",
    a: "Para qualquer pessoa que quer melhorar a alimentação de forma prática, acessível e sem radicalismo.",
  },
  {
    q: "Preciso de suplementos?",
    a: "Não! O plano é baseado em alimentos naturais e acessíveis encontrados em qualquer mercado.",
  },
  {
    q: "Recebo o plano na hora?",
    a: "Sim! Após a confirmação do pagamento, você recebe acesso imediato ao conteúdo.",
  },
  {
    q: "Tem garantia?",
    a: "Sim! Garantia incondicional de 7 dias. Se não gostar, devolvemos 100% do valor.",
  },
  {
    q: "Funciona para vegetarianos?",
    a: "Sim! Temos opções adaptadas para diferentes preferências e restrições alimentares.",
  },
];

const FAQ = ({ q, a }: { q: string; a: string }) => {
  const [open, setOpen] = useState(false);
  return (
    <button
      onClick={() => setOpen(!open)}
      className="w-full text-left border border-border rounded-xl p-5 transition-all hover:border-primary/30"
    >
      <div className="flex items-center justify-between gap-4">
        <span className="font-display font-semibold text-foreground">{q}</span>
        <ChevronDown
          className={`w-5 h-5 text-muted-foreground shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </div>
      {open && (
        <p className="mt-3 text-muted-foreground text-sm leading-relaxed">{a}</p>
      )}
    </button>
  );
};

const Vendas = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden pt-20 pb-16 sm:pt-28 sm:pb-24">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="relative z-10 container mx-auto px-6 text-center max-w-3xl">
          <span className="inline-block mb-5 px-4 py-1.5 rounded-full bg-primary/10 text-primary font-display text-sm font-semibold tracking-wide">
            🔥 Oferta por tempo limitado
          </span>

          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold leading-tight tracking-tight text-foreground">
            Transforme sua
            <br />
            <span className="text-gradient-primary">alimentação</span> sem
            <br />
            gastar uma fortuna
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-xl mx-auto font-body leading-relaxed">
            Plano nutricional completo, personalizado e acessível.
            Receitas práticas, lista de compras e cardápio semanal por menos de R$1 por dia.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a href={KIRVANO_CHECKOUT_URL} target="_blank" rel="noopener noreferrer">
              <Button variant="hero" size="xl" className="group">
                Quero meu plano agora
                <ArrowRight className="w-5 h-5 ml-1 transition-transform group-hover:translate-x-1" />
              </Button>
            </a>
            <span className="text-sm text-muted-foreground flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-primary" />
              Garantia de 7 dias
            </span>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 sm:py-24 bg-card/50">
        <div className="container mx-auto px-6 max-w-5xl">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-center text-foreground mb-4">
            Tudo que você recebe
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-lg mx-auto">
            Um plano completo para mudar sua relação com a comida de verdade.
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((b) => (
              <Card
                key={b.title}
                className="border-border/60 bg-background/80 hover:border-primary/30 transition-colors"
              >
                <CardContent className="p-6 flex gap-4">
                  <div className="shrink-0 w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center">
                    <b.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-foreground mb-1">
                      {b.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {b.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-16 sm:py-24">
        <div className="container mx-auto px-6 max-w-4xl">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-center text-foreground mb-4">
            O que dizem nossos clientes
          </h2>
          <p className="text-center text-muted-foreground mb-12">
            Resultados reais de pessoas reais.
          </p>

          <div className="grid sm:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <Card key={t.name} className="border-border/60 bg-card">
                <CardContent className="p-6">
                  <div className="flex gap-0.5 mb-3">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 fill-accent text-accent"
                      />
                    ))}
                  </div>
                  <p className="text-foreground text-sm leading-relaxed mb-4">
                    "{t.text}"
                  </p>
                  <span className="text-xs font-display font-semibold text-muted-foreground">
                    — {t.name}
                  </span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing CTA */}
      <section className="py-16 sm:py-24 bg-card/50">
        <div className="container mx-auto px-6 max-w-lg text-center">
          <Card className="border-primary/20 bg-background shadow-lg overflow-hidden">
            <div className="bg-primary/5 px-6 py-4">
              <span className="text-sm font-display font-semibold text-primary">
                Oferta Especial
              </span>
            </div>
            <CardContent className="p-8">
              <h3 className="font-display text-2xl font-bold text-foreground mb-2">
                Plano Nutricional Completo
              </h3>
              <p className="text-muted-foreground text-sm mb-6">
                Acesso imediato a tudo que você precisa
              </p>

              <div className="mb-6">
                <span className="text-sm text-muted-foreground line-through">
                  De R$ 97,00
                </span>
                <div className="flex items-baseline justify-center gap-1 mt-1">
                  <span className="text-sm text-foreground font-medium">R$</span>
                  <span className="font-display text-5xl font-bold text-foreground">
                    29
                  </span>
                  <span className="text-sm text-foreground font-medium">,90</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Pagamento único · Acesso vitalício
                </p>
              </div>

              <ul className="text-left space-y-3 mb-8">
                {[
                  "Cardápio semanal personalizado",
                  "Lista de compras inteligente",
                  "+50 receitas práticas e acessíveis",
                  "Guia de substituições alimentares",
                  "Suporte por 30 dias",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-foreground">
                    <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>

              <a
                href={KIRVANO_CHECKOUT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <Button variant="hero" size="xl" className="w-full group">
                  Garantir meu plano
                  <ArrowRight className="w-5 h-5 ml-1 transition-transform group-hover:translate-x-1" />
                </Button>
              </a>

              <p className="mt-4 text-xs text-muted-foreground flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                7 dias de garantia incondicional
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 sm:py-24">
        <div className="container mx-auto px-6 max-w-2xl">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-center text-foreground mb-12">
            Perguntas Frequentes
          </h2>
          <div className="space-y-3">
            {faqs.map((f) => (
              <FAQ key={f.q} q={f.q} a={f.a} />
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 sm:py-24 bg-primary/5">
        <div className="container mx-auto px-6 text-center max-w-2xl">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Pronto para transformar sua alimentação?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Comece agora e veja resultados em poucos dias. Sem riscos com nossa garantia de 7 dias.
          </p>
          <a href={KIRVANO_CHECKOUT_URL} target="_blank" rel="noopener noreferrer">
            <Button variant="hero" size="xl" className="group">
              Começar agora por R$ 29,90
              <ArrowRight className="w-5 h-5 ml-1 transition-transform group-hover:translate-x-1" />
            </Button>
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border">
        <div className="container mx-auto px-6 text-center">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Evolua+ · Todos os direitos reservados
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Este produto não substitui acompanhamento médico ou nutricional profissional.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Vendas;
