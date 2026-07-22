import { Clock, ChefHat, Target, ShoppingBasket, Zap, Repeat, Sparkles, TrendingUp } from "lucide-react";

const benefits = [
  { icon: Clock, title: "Economize horas por semana", desc: "Pare de montar dietas manualmente e planilhar refeições." },
  { icon: Target, title: "Refeições focadas no seu objetivo", desc: "Emagrecer, ganhar massa ou ter mais energia — sem chute." },
  { icon: ShoppingBasket, title: "Lista de compras automática", desc: "Organizada por categoria, pronta para o mercado." },
  { icon: ChefHat, title: "Receitas reais e acessíveis", desc: "Ingredientes que você encontra e sabe cozinhar." },
  { icon: Repeat, title: "Substituições inteligentes", desc: "Não gosta de um alimento? A IA troca sem quebrar o plano." },
  { icon: Zap, title: "Ajustes conforme sua rotina", desc: "Comeu fora? Não almoçou? A IA reorganiza o dia." },
  { icon: Sparkles, title: "Sugestões personalizadas", desc: "Baseadas no seu perfil, restrições e preferências." },
  { icon: TrendingUp, title: "Mais consistência de verdade", desc: "Acompanhamento visual que sustenta o hábito." },
];

const Benefits = () => (
  <section id="beneficios" className="py-24 px-6 bg-secondary/30">
    <div className="container mx-auto max-w-6xl">
      <div className="text-center max-w-2xl mx-auto mb-14">
        <span className="inline-block mb-3 px-3 py-1 rounded-full bg-primary/10 text-primary font-display text-xs font-semibold tracking-wide uppercase">
          Benefícios
        </span>
        <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground">
          O que muda na sua rotina com o <span className="text-gradient-primary">Balanced You</span>
        </h2>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {benefits.map((b) => (
          <div
            key={b.title}
            className="bg-card rounded-2xl border border-border/60 p-5 hover:shadow-soft hover:border-primary/30 transition-all"
          >
            <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-3">
              <b.icon className="w-5 h-5" />
            </div>
            <h3 className="font-display font-semibold text-foreground mb-1">{b.title}</h3>
            <p className="text-sm text-muted-foreground">{b.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Benefits;