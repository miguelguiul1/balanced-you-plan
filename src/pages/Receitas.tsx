import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Clock, DollarSign, Flame, Search, Filter } from "lucide-react";
import MotivationalQuote from "@/components/MotivationalQuote";

type Receita = {
  id: number;
  nome: string;
  tempo: string;
  custo: string;
  calorias: number;
  proteina: number;
  carb: number;
  gordura: number;
  ingredientes: string[];
  preparo: string;
  tags: string[];
};

const receitas: Receita[] = [
  {
    id: 1, nome: "Ovo mexido com tomate", tempo: "5 min", custo: "R$ 2,50", calorias: 220,
    proteina: 14, carb: 5, gordura: 16,
    ingredientes: ["2 ovos", "1 tomate picado", "Sal e pimenta", "Azeite"],
    preparo: "Aqueça azeite, refogue o tomate, adicione os ovos mexendo até cozinhar.",
    tags: ["rapido", "barato", "proteina"],
  },
  {
    id: 2, nome: "Banana com aveia e mel", tempo: "3 min", custo: "R$ 1,80", calorias: 280,
    proteina: 6, carb: 52, gordura: 5,
    ingredientes: ["1 banana", "3 col. aveia", "1 col. mel"],
    preparo: "Amasse a banana, misture com aveia e mel. Pronto!",
    tags: ["rapido", "barato", "energia"],
  },
  {
    id: 3, nome: "Arroz com ovo e feijão", tempo: "15 min", custo: "R$ 3,00", calorias: 450,
    proteina: 20, carb: 65, gordura: 12,
    ingredientes: ["Arroz cozido", "Feijão cozido", "1 ovo frito", "Salada verde"],
    preparo: "Monte o prato com arroz, feijão, ovo frito e salada ao lado.",
    tags: ["classico", "barato", "completo"],
  },
  {
    id: 4, nome: "Wrap de frango rápido", tempo: "10 min", custo: "R$ 5,00", calorias: 350,
    proteina: 28, carb: 30, gordura: 12,
    ingredientes: ["1 tortilha", "Frango desfiado", "Alface", "Tomate", "Requeijão"],
    preparo: "Espalhe requeijão na tortilha, adicione frango, alface e tomate. Enrole.",
    tags: ["rapido", "proteina", "pratico"],
  },
  {
    id: 5, nome: "Sopa de legumes", tempo: "15 min", custo: "R$ 4,00", calorias: 180,
    proteina: 6, carb: 28, gordura: 5,
    ingredientes: ["Cenoura", "Abobrinha", "Batata", "Cebola", "Alho", "Sal"],
    preparo: "Cozinhe todos os legumes em água, tempere e bata no liquidificador.",
    tags: ["barato", "saudavel", "leve"],
  },
  {
    id: 6, nome: "Tapioca com queijo e tomate", tempo: "7 min", custo: "R$ 3,50", calorias: 260,
    proteina: 10, carb: 35, gordura: 9,
    ingredientes: ["Goma de tapioca", "Queijo branco", "Tomate fatiado", "Orégano"],
    preparo: "Espalhe a goma na frigideira, adicione recheio quando firmar.",
    tags: ["rapido", "pratico", "barato"],
  },
  {
    id: 7, nome: "Macarrão alho e óleo", tempo: "12 min", custo: "R$ 2,00", calorias: 380,
    proteina: 10, carb: 55, gordura: 14,
    ingredientes: ["Macarrão", "Alho", "Azeite", "Sal", "Salsinha"],
    preparo: "Cozinhe o macarrão. Doure o alho no azeite e misture.",
    tags: ["rapido", "barato", "classico"],
  },
  {
    id: 8, nome: "Smoothie proteico", tempo: "5 min", custo: "R$ 4,50", calorias: 300,
    proteina: 25, carb: 35, gordura: 6,
    ingredientes: ["1 banana", "200ml leite", "1 scoop whey", "1 col. aveia"],
    preparo: "Bata tudo no liquidificador com gelo.",
    tags: ["rapido", "proteina", "energia"],
  },
];

const allTags = ["rapido", "barato", "proteina", "saudavel", "pratico", "energia", "classico", "completo", "leve"];
const tagLabels: Record<string, string> = {
  rapido: "⚡ Rápido", barato: "💰 Barato", proteina: "💪 Proteína", saudavel: "🥗 Saudável",
  pratico: "👨‍🍳 Prático", energia: "🔋 Energia", classico: "🍚 Clássico", completo: "✅ Completo", leve: "🍃 Leve",
};

const Receitas = () => {
  const [search, setSearch] = useState("");
  const [activeTag, setActiveTag] = useState("");
  const [expanded, setExpanded] = useState<number | null>(null);

  const filtered = receitas.filter((r) => {
    const matchSearch = r.nome.toLowerCase().includes(search.toLowerCase()) ||
      r.ingredientes.some((i) => i.toLowerCase().includes(search.toLowerCase()));
    const matchTag = !activeTag || r.tags.includes(activeTag);
    return matchSearch && matchTag;
  });

  return (
    <div className="min-h-screen bg-background pt-20 pb-16">
      <div className="container mx-auto px-6 max-w-3xl">
        <div className="text-center mb-10">
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground">
            Pratos <span className="text-primary">Baratos</span> & Rápidos
          </h1>
          <p className="mt-3 text-muted-foreground">
            Receitas nutritivas, econômicas e prontas em até 15 minutos
          </p>
        </div>

        <MotivationalQuote />

        {/* Search */}
        <div className="mt-8 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar por receita ou ingrediente..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-12 pl-12 pr-4 rounded-xl border-2 border-border bg-background text-foreground focus:border-primary focus:outline-none transition-colors"
          />
        </div>

        {/* Tags */}
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            onClick={() => setActiveTag("")}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
              !activeTag ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            }`}
          >
            Todas
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveTag(tag === activeTag ? "" : tag)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                activeTag === tag ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              {tagLabels[tag]}
            </button>
          ))}
        </div>

        {/* Recipes */}
        <div className="mt-8 space-y-4">
          {filtered.map((r) => (
            <div
              key={r.id}
              className="bg-card rounded-2xl shadow-soft overflow-hidden border border-border/50 hover:border-primary/20 transition-colors"
            >
              <button
                onClick={() => setExpanded(expanded === r.id ? null : r.id)}
                className="w-full p-5 text-left"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-display font-semibold text-foreground">{r.nome}</h3>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{r.tempo}</span>
                    <span className="flex items-center gap-1"><DollarSign className="w-3 h-3" />{r.custo}</span>
                    <span className="flex items-center gap-1"><Flame className="w-3 h-3" />{r.calorias}cal</span>
                  </div>
                </div>
                <div className="flex gap-2 mt-2">
                  {r.tags.map((t) => (
                    <span key={t} className="text-xs px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground">
                      {tagLabels[t]}
                    </span>
                  ))}
                </div>
              </button>

              {expanded === r.id && (
                <div className="px-5 pb-5 border-t border-border pt-4 animate-fade-in">
                  <div className="grid grid-cols-4 gap-2 text-center mb-4">
                    <div className="bg-secondary/50 rounded-lg p-2">
                      <p className="font-display font-bold text-foreground text-sm">{r.calorias}</p>
                      <p className="text-xs text-muted-foreground">kcal</p>
                    </div>
                    <div className="bg-secondary/50 rounded-lg p-2">
                      <p className="font-display font-bold text-primary text-sm">{r.proteina}g</p>
                      <p className="text-xs text-muted-foreground">prot</p>
                    </div>
                    <div className="bg-secondary/50 rounded-lg p-2">
                      <p className="font-display font-bold text-accent text-sm">{r.carb}g</p>
                      <p className="text-xs text-muted-foreground">carb</p>
                    </div>
                    <div className="bg-secondary/50 rounded-lg p-2">
                      <p className="font-display font-bold text-foreground text-sm">{r.gordura}g</p>
                      <p className="text-xs text-muted-foreground">gord</p>
                    </div>
                  </div>

                  <h4 className="font-display font-semibold text-foreground text-sm mb-2">Ingredientes:</h4>
                  <ul className="text-sm text-muted-foreground mb-4 space-y-1">
                    {r.ingredientes.map((ing, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                        {ing}
                      </li>
                    ))}
                  </ul>

                  <h4 className="font-display font-semibold text-foreground text-sm mb-2">Preparo:</h4>
                  <p className="text-sm text-muted-foreground">{r.preparo}</p>
                </div>
              )}
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Nenhuma receita encontrada. Tente outro filtro.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Receitas;
