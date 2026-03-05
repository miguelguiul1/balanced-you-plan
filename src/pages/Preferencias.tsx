import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Heart, ThumbsDown, AlertTriangle, Target, Check, X, Camera } from "lucide-react";
import MotivationalQuote from "@/components/MotivationalQuote";

const allFoods = {
  "Proteínas": ["Frango", "Ovo", "Carne vermelha", "Peixe", "Atum", "Sardinha", "Tofu", "Feijão", "Lentilha", "Grão-de-bico", "Whey"],
  "Carboidratos": ["Arroz", "Arroz integral", "Pão", "Pão integral", "Macarrão", "Batata", "Batata-doce", "Aveia", "Tapioca", "Mandioca", "Milho", "Quinoa"],
  "Gorduras": ["Azeite", "Castanhas", "Abacate", "Manteiga", "Queijo", "Amendoim", "Linhaça", "Chia", "Coco"],
  "Frutas": ["Banana", "Maçã", "Laranja", "Morango", "Uva", "Manga", "Mamão", "Melancia", "Abacaxi", "Limão"],
  "Verduras/Legumes": ["Brócolis", "Espinafre", "Cenoura", "Tomate", "Alface", "Couve", "Abobrinha", "Chuchu", "Beterraba", "Pepino"],
  "Laticínios": ["Leite", "Iogurte", "Queijo cottage", "Requeijão", "Leite de amêndoas"],
};

const restrictions = [
  "Intolerância à lactose", "Alergia ao glúten", "Vegetariano", "Vegano",
  "Alergia a frutos do mar", "Alergia a amendoim", "Diabetes", "Hipertensão",
];

const objectives = [
  { id: "emagrecimento", label: "Emagrecimento", icon: "🔥", desc: "Perder gordura de forma saudável" },
  { id: "massa", label: "Ganho de massa", icon: "💪", desc: "Construir músculos com nutrição certa" },
  { id: "reeducacao", label: "Reeducação alimentar", icon: "🍃", desc: "Aprender a comer melhor" },
  { id: "saudavel", label: "Comer saudável", icon: "🥗", desc: "Foco em saúde e bem-estar" },
  { id: "economia", label: "Economizar dinheiro", icon: "💰", desc: "Comer bem gastando pouco" },
  { id: "rapido", label: "Soluções rápidas", icon: "⚡", desc: "Refeições práticas para o dia a dia" },
];

const Preferencias = () => {
  const [liked, setLiked] = useState<string[]>([]);
  const [disliked, setDisliked] = useState<string[]>([]);
  const [selectedRestrictions, setSelectedRestrictions] = useState<string[]>([]);
  const [selectedObjective, setSelectedObjective] = useState("");
  const [saved, setSaved] = useState(false);

  const toggleLiked = (food: string) => {
    setDisliked((prev) => prev.filter((f) => f !== food));
    setLiked((prev) => prev.includes(food) ? prev.filter((f) => f !== food) : [...prev, food]);
  };

  const toggleDisliked = (food: string) => {
    setLiked((prev) => prev.filter((f) => f !== food));
    setDisliked((prev) => prev.includes(food) ? prev.filter((f) => f !== food) : [...prev, food]);
  };

  const toggleRestriction = (r: string) => {
    setSelectedRestrictions((prev) => prev.includes(r) ? prev.filter((x) => x !== r) : [...prev, r]);
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="min-h-screen bg-background pt-20 pb-16">
      <div className="container mx-auto px-6 max-w-3xl">
        <div className="text-center mb-10">
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground">
            Meu Perfil <span className="text-primary">Alimentar</span>
          </h1>
          <p className="mt-3 text-muted-foreground">
            Personalize suas preferências para receber sugestões sob medida
          </p>
        </div>

        <MotivationalQuote />

        {/* Objective */}
        <div className="mt-10">
          <h2 className="font-display text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" /> Qual seu objetivo?
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {objectives.map((obj) => (
              <button
                key={obj.id}
                onClick={() => setSelectedObjective(obj.id)}
                className={`p-4 rounded-xl border-2 transition-all text-left ${
                  selectedObjective === obj.id
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/30"
                }`}
              >
                <span className="text-2xl">{obj.icon}</span>
                <p className="font-display font-semibold text-foreground text-sm mt-2">{obj.label}</p>
                <p className="text-xs text-muted-foreground mt-1">{obj.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Restrictions */}
        <div className="mt-10">
          <h2 className="font-display text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-accent" /> Restrições alimentares
          </h2>
          <div className="flex flex-wrap gap-2">
            {restrictions.map((r) => (
              <button
                key={r}
                onClick={() => toggleRestriction(r)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedRestrictions.includes(r)
                    ? "bg-accent text-accent-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* Foods */}
        <div className="mt-10">
          <h2 className="font-display text-xl font-semibold text-foreground mb-2">
            Selecione seus alimentos
          </h2>
          <p className="text-sm text-muted-foreground mb-6">
            <Heart className="w-4 h-4 inline text-primary" /> = gosto &nbsp;
            <ThumbsDown className="w-4 h-4 inline text-destructive" /> = não gosto
          </p>

          {Object.entries(allFoods).map(([category, foods]) => (
            <div key={category} className="mb-8">
              <h3 className="font-display text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                {category}
              </h3>
              <div className="flex flex-wrap gap-2">
                {foods.map((food) => {
                  const isLiked = liked.includes(food);
                  const isDisliked = disliked.includes(food);
                  return (
                    <div key={food} className="flex items-center gap-0.5">
                      <button
                        onClick={() => toggleLiked(food)}
                        className={`pl-3 pr-1 py-1.5 rounded-l-full text-sm font-medium transition-all border-2 border-r-0 ${
                          isLiked
                            ? "bg-primary/10 border-primary text-primary"
                            : "bg-secondary border-border text-secondary-foreground hover:border-primary/30"
                        }`}
                      >
                        {food}
                        {isLiked && <Check className="w-3 h-3 inline ml-1" />}
                      </button>
                      <button
                        onClick={() => toggleDisliked(food)}
                        className={`px-2 py-1.5 rounded-r-full text-sm transition-all border-2 border-l-0 ${
                          isDisliked
                            ? "bg-destructive/10 border-destructive text-destructive"
                            : "bg-secondary border-border text-muted-foreground hover:border-destructive/30"
                        }`}
                        title="Não gosto"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="bg-card rounded-2xl p-6 shadow-soft mt-8">
          <h3 className="font-display font-semibold text-foreground mb-3">Resumo</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Objetivo</p>
              <p className="font-medium text-foreground">
                {objectives.find((o) => o.id === selectedObjective)?.label || "Não selecionado"}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Restrições</p>
              <p className="font-medium text-foreground">
                {selectedRestrictions.length > 0 ? selectedRestrictions.join(", ") : "Nenhuma"}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Alimentos que gosta</p>
              <p className="font-medium text-primary">{liked.length} selecionados</p>
            </div>
            <div>
              <p className="text-muted-foreground">Alimentos que não gosta</p>
              <p className="font-medium text-destructive">{disliked.length} marcados</p>
            </div>
          </div>
          <Button variant="hero" size="lg" className="w-full mt-6" onClick={handleSave}>
            {saved ? "✓ Perfil salvo!" : "Salvar preferências"}
          </Button>
          <p className="text-xs text-muted-foreground text-center mt-3">
            Em breve: a IA usará seu perfil para gerar receitas e planos personalizados
          </p>
        </div>
      </div>
    </div>
  );
};

export default Preferencias;
