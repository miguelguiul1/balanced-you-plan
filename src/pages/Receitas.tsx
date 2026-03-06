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
  // Café da manhã
  { id: 1, nome: "Ovo mexido com tomate", tempo: "5 min", custo: "R$ 2,50", calorias: 220, proteina: 14, carb: 5, gordura: 16, ingredientes: ["2 ovos", "1 tomate picado", "Sal e pimenta", "Azeite"], preparo: "Aqueça azeite, refogue o tomate, adicione os ovos mexendo até cozinhar.", tags: ["rapido", "barato", "proteina"] },
  { id: 2, nome: "Banana com aveia e mel", tempo: "3 min", custo: "R$ 1,80", calorias: 280, proteina: 6, carb: 52, gordura: 5, ingredientes: ["1 banana", "3 col. aveia", "1 col. mel"], preparo: "Amasse a banana, misture com aveia e mel. Pronto!", tags: ["rapido", "barato", "energia"] },
  { id: 3, nome: "Tapioca com queijo e tomate", tempo: "7 min", custo: "R$ 3,50", calorias: 260, proteina: 10, carb: 35, gordura: 9, ingredientes: ["Goma de tapioca", "Queijo branco", "Tomate fatiado", "Orégano"], preparo: "Espalhe a goma na frigideira, adicione recheio quando firmar.", tags: ["rapido", "pratico", "barato"] },
  { id: 4, nome: "Smoothie proteico", tempo: "5 min", custo: "R$ 4,50", calorias: 300, proteina: 25, carb: 35, gordura: 6, ingredientes: ["1 banana", "200ml leite", "1 scoop whey", "1 col. aveia"], preparo: "Bata tudo no liquidificador com gelo.", tags: ["rapido", "proteina", "energia"] },
  { id: 5, nome: "Pão com ovo e requeijão", tempo: "5 min", custo: "R$ 2,00", calorias: 290, proteina: 14, carb: 30, gordura: 13, ingredientes: ["2 fatias de pão", "1 ovo", "Requeijão"], preparo: "Frite o ovo e monte no pão com requeijão.", tags: ["rapido", "barato", "pratico"] },
  { id: 6, nome: "Mingau de aveia", tempo: "8 min", custo: "R$ 2,00", calorias: 250, proteina: 8, carb: 42, gordura: 6, ingredientes: ["4 col. aveia", "200ml leite", "Canela", "1 col. mel"], preparo: "Cozinhe a aveia no leite mexendo até engrossar. Finalize com canela e mel.", tags: ["barato", "energia", "saudavel"] },
  { id: 7, nome: "Crepioca de banana", tempo: "7 min", custo: "R$ 2,50", calorias: 270, proteina: 12, carb: 38, gordura: 8, ingredientes: ["1 ovo", "2 col. tapioca", "1 banana", "Canela"], preparo: "Misture ovo e tapioca, despeje na frigideira. Recheie com banana e canela.", tags: ["rapido", "pratico", "energia"] },
  { id: 8, nome: "Iogurte com granola e frutas", tempo: "3 min", custo: "R$ 4,00", calorias: 240, proteina: 10, carb: 38, gordura: 6, ingredientes: ["1 pote iogurte natural", "3 col. granola", "Frutas picadas"], preparo: "Monte em camadas: iogurte, granola e frutas por cima.", tags: ["rapido", "saudavel", "pratico"] },
  { id: 9, nome: "Torrada com pasta de amendoim", tempo: "3 min", custo: "R$ 2,50", calorias: 310, proteina: 10, carb: 28, gordura: 18, ingredientes: ["2 fatias pão integral", "2 col. pasta de amendoim", "Mel a gosto"], preparo: "Torre o pão e espalhe a pasta de amendoim. Finalize com fio de mel.", tags: ["rapido", "energia", "proteina"] },
  // Almoço / Jantar
  { id: 10, nome: "Arroz com ovo e feijão", tempo: "15 min", custo: "R$ 3,00", calorias: 450, proteina: 20, carb: 65, gordura: 12, ingredientes: ["Arroz cozido", "Feijão cozido", "1 ovo frito", "Salada verde"], preparo: "Monte o prato com arroz, feijão, ovo frito e salada ao lado.", tags: ["classico", "barato", "completo"] },
  { id: 11, nome: "Wrap de frango rápido", tempo: "10 min", custo: "R$ 5,00", calorias: 350, proteina: 28, carb: 30, gordura: 12, ingredientes: ["1 tortilha", "Frango desfiado", "Alface", "Tomate", "Requeijão"], preparo: "Espalhe requeijão na tortilha, adicione frango, alface e tomate. Enrole.", tags: ["rapido", "proteina", "pratico"] },
  { id: 12, nome: "Macarrão alho e óleo", tempo: "12 min", custo: "R$ 2,00", calorias: 380, proteina: 10, carb: 55, gordura: 14, ingredientes: ["Macarrão", "Alho", "Azeite", "Sal", "Salsinha"], preparo: "Cozinhe o macarrão. Doure o alho no azeite e misture.", tags: ["rapido", "barato", "classico"] },
  { id: 13, nome: "Sopa de legumes", tempo: "15 min", custo: "R$ 4,00", calorias: 180, proteina: 6, carb: 28, gordura: 5, ingredientes: ["Cenoura", "Abobrinha", "Batata", "Cebola", "Alho", "Sal"], preparo: "Cozinhe todos os legumes em água, tempere e bata no liquidificador.", tags: ["barato", "saudavel", "leve"] },
  { id: 14, nome: "Frango grelhado com salada", tempo: "15 min", custo: "R$ 6,00", calorias: 320, proteina: 35, carb: 8, gordura: 16, ingredientes: ["1 filé de frango", "Alface", "Tomate", "Pepino", "Azeite", "Limão"], preparo: "Tempere e grelhe o frango. Sirva com salada temperada com azeite e limão.", tags: ["proteina", "saudavel", "leve"] },
  { id: 15, nome: "Strogonoff de frango", tempo: "15 min", custo: "R$ 7,00", calorias: 480, proteina: 30, carb: 45, gordura: 18, ingredientes: ["Frango em cubos", "Creme de leite", "Ketchup", "Mostarda", "Arroz", "Batata palha"], preparo: "Refogue o frango, adicione ketchup, mostarda e creme de leite. Sirva com arroz e batata palha.", tags: ["classico", "completo", "proteina"] },
  { id: 16, nome: "Omelete recheada", tempo: "8 min", custo: "R$ 3,50", calorias: 310, proteina: 20, carb: 5, gordura: 24, ingredientes: ["3 ovos", "Presunto", "Queijo", "Tomate", "Orégano"], preparo: "Bata os ovos, despeje na frigideira e adicione o recheio. Dobre ao firmar.", tags: ["rapido", "proteina", "pratico"] },
  { id: 17, nome: "Arroz de frango cremoso", tempo: "15 min", custo: "R$ 5,00", calorias: 420, proteina: 25, carb: 50, gordura: 14, ingredientes: ["Arroz", "Frango desfiado", "Creme de leite", "Milho", "Temperos"], preparo: "Cozinhe o arroz, misture frango desfiado, milho e creme de leite.", tags: ["pratico", "completo", "classico"] },
  { id: 18, nome: "Salada de atum", tempo: "5 min", custo: "R$ 5,50", calorias: 280, proteina: 22, carb: 15, gordura: 14, ingredientes: ["1 lata atum", "Alface", "Tomate", "Milho", "Azeite"], preparo: "Misture todos os ingredientes e tempere com azeite.", tags: ["rapido", "proteina", "leve"] },
  { id: 19, nome: "Cuscuz com ovo", tempo: "10 min", custo: "R$ 2,00", calorias: 350, proteina: 16, carb: 48, gordura: 10, ingredientes: ["Flocos de milho", "Água", "Sal", "1 ovo", "Manteiga"], preparo: "Hidrate o cuscuz, cozinhe na cuscuzeira. Sirva com ovo e manteiga.", tags: ["barato", "classico", "energia"] },
  { id: 20, nome: "Macarrão com molho de tomate", tempo: "12 min", custo: "R$ 3,00", calorias: 400, proteina: 12, carb: 60, gordura: 12, ingredientes: ["Macarrão", "Molho de tomate", "Cebola", "Alho", "Azeite", "Queijo ralado"], preparo: "Cozinhe o macarrão. Refogue cebola e alho, adicione molho. Misture e finalize com queijo.", tags: ["barato", "classico", "pratico"] },
  { id: 21, nome: "Panqueca de carne moída", tempo: "15 min", custo: "R$ 6,00", calorias: 420, proteina: 24, carb: 38, gordura: 18, ingredientes: ["Farinha", "Leite", "Ovo", "Carne moída", "Molho de tomate"], preparo: "Faça a massa (farinha, leite, ovo). Frite as panquecas, recheie com carne e cubra com molho.", tags: ["completo", "proteina", "classico"] },
  { id: 22, nome: "Batata doce com frango", tempo: "15 min", custo: "R$ 5,50", calorias: 380, proteina: 30, carb: 45, gordura: 8, ingredientes: ["Batata doce", "Filé de frango", "Azeite", "Sal", "Temperos"], preparo: "Cozinhe a batata doce e grelhe o frango temperado. Sirva juntos.", tags: ["proteina", "saudavel", "energia"] },
  // Lanches
  { id: 23, nome: "Vitamina de banana e mamão", tempo: "5 min", custo: "R$ 3,00", calorias: 220, proteina: 6, carb: 42, gordura: 3, ingredientes: ["1 banana", "1 fatia mamão", "200ml leite", "1 col. mel"], preparo: "Bata tudo no liquidificador.", tags: ["rapido", "energia", "saudavel"] },
  { id: 24, nome: "Sanduíche natural de atum", tempo: "5 min", custo: "R$ 4,50", calorias: 290, proteina: 18, carb: 28, gordura: 12, ingredientes: ["Pão integral", "Atum", "Alface", "Tomate", "Maionese light"], preparo: "Misture atum com maionese, monte no pão com alface e tomate.", tags: ["rapido", "proteina", "pratico"] },
  { id: 25, nome: "Bolinho de arroz", tempo: "10 min", custo: "R$ 2,00", calorias: 200, proteina: 6, carb: 30, gordura: 7, ingredientes: ["Arroz cozido (sobra)", "1 ovo", "Salsinha", "Sal", "Óleo"], preparo: "Misture arroz, ovo e salsinha. Modele bolinhos e frite.", tags: ["barato", "pratico", "classico"] },
  { id: 26, nome: "Banana empanada com canela", tempo: "5 min", custo: "R$ 1,50", calorias: 180, proteina: 2, carb: 32, gordura: 6, ingredientes: ["1 banana", "Canela", "Açúcar", "Manteiga"], preparo: "Corte a banana ao meio, passe na canela com açúcar e doure na manteiga.", tags: ["rapido", "barato", "energia"] },
  { id: 27, nome: "Mix de castanhas e frutas secas", tempo: "1 min", custo: "R$ 5,00", calorias: 200, proteina: 5, carb: 18, gordura: 13, ingredientes: ["Castanha de caju", "Castanha do Pará", "Uva passa", "Damasco"], preparo: "Misture tudo em um potinho. Lanche pronto para levar!", tags: ["rapido", "saudavel", "energia"] },
  { id: 28, nome: "Pão de queijo", tempo: "15 min", custo: "R$ 3,50", calorias: 260, proteina: 8, carb: 32, gordura: 11, ingredientes: ["Polvilho azedo", "Ovo", "Óleo", "Leite", "Queijo ralado", "Sal"], preparo: "Misture todos os ingredientes, modele bolinhas e asse a 200°C por 15 min.", tags: ["classico", "pratico", "barato"] },
  { id: 29, nome: "Açaí na tigela", tempo: "5 min", custo: "R$ 6,00", calorias: 350, proteina: 5, carb: 55, gordura: 12, ingredientes: ["Polpa de açaí", "Banana", "Granola", "Mel"], preparo: "Bata açaí com banana, coloque na tigela e cubra com granola e mel.", tags: ["rapido", "energia", "saudavel"] },
  { id: 30, nome: "Pipoca temperada", tempo: "5 min", custo: "R$ 1,00", calorias: 150, proteina: 3, carb: 20, gordura: 7, ingredientes: ["Milho de pipoca", "Óleo", "Sal", "Orégano ou páprica"], preparo: "Estoure o milho no óleo, tempere com sal e especiarias a gosto.", tags: ["rapido", "barato", "leve"] },
  // Sopas e cremes
  { id: 31, nome: "Caldo verde", tempo: "15 min", custo: "R$ 4,50", calorias: 220, proteina: 8, carb: 28, gordura: 9, ingredientes: ["Batata", "Couve", "Linguiça calabresa", "Cebola", "Alho", "Azeite"], preparo: "Cozinhe batata e bata. Refogue couve e calabresa, misture ao caldo.", tags: ["classico", "completo", "barato"] },
  { id: 32, nome: "Creme de abóbora", tempo: "15 min", custo: "R$ 3,50", calorias: 190, proteina: 4, carb: 30, gordura: 6, ingredientes: ["Abóbora", "Cebola", "Alho", "Creme de leite", "Sal", "Noz-moscada"], preparo: "Cozinhe a abóbora, bata no liquidificador com temperos e finalize com creme de leite.", tags: ["saudavel", "leve", "barato"] },
  { id: 33, nome: "Sopa de lentilha", tempo: "15 min", custo: "R$ 4,00", calorias: 260, proteina: 14, carb: 38, gordura: 5, ingredientes: ["Lentilha", "Cenoura", "Batata", "Cebola", "Alho", "Azeite"], preparo: "Cozinhe a lentilha com legumes em água temperada até ficar macia.", tags: ["proteina", "saudavel", "completo"] },
  // Pratos rápidos extras
  { id: 34, nome: "Miojo turbinado", tempo: "8 min", custo: "R$ 3,00", calorias: 380, proteina: 14, carb: 48, gordura: 14, ingredientes: ["1 miojo", "1 ovo", "Legumes picados", "Temperos"], preparo: "Cozinhe o miojo, adicione ovo e legumes nos últimos minutos.", tags: ["rapido", "barato", "pratico"] },
  { id: 35, nome: "Quesadilla de queijo e presunto", tempo: "7 min", custo: "R$ 4,00", calorias: 340, proteina: 16, carb: 30, gordura: 17, ingredientes: ["2 tortilhas", "Queijo", "Presunto", "Orégano"], preparo: "Recheie a tortilha e doure dos dois lados na frigideira.", tags: ["rapido", "pratico", "proteina"] },
  { id: 36, nome: "Risoto de frango simples", tempo: "15 min", custo: "R$ 5,50", calorias: 440, proteina: 22, carb: 55, gordura: 14, ingredientes: ["Arroz", "Frango desfiado", "Cebola", "Alho", "Creme de leite", "Queijo ralado"], preparo: "Refogue cebola e alho, adicione arroz e água aos poucos. Finalize com frango, creme e queijo.", tags: ["completo", "classico", "pratico"] },
  { id: 37, nome: "Escondidinho de carne", tempo: "15 min", custo: "R$ 6,50", calorias: 460, proteina: 24, carb: 42, gordura: 22, ingredientes: ["Purê de batata", "Carne moída", "Queijo ralado", "Cebola", "Alho"], preparo: "Faça o purê e o refogado de carne. Monte em camadas e gratine com queijo.", tags: ["completo", "classico", "proteina"] },
  { id: 38, nome: "Feijão tropeiro", tempo: "15 min", custo: "R$ 5,00", calorias: 420, proteina: 20, carb: 50, gordura: 15, ingredientes: ["Feijão cozido", "Farinha de mandioca", "Ovo", "Linguiça", "Couve", "Alho"], preparo: "Refogue alho, linguiça e couve. Adicione feijão e farinha mexendo.", tags: ["classico", "completo", "energia"] },
  { id: 39, nome: "Salada Caesar rápida", tempo: "10 min", custo: "R$ 6,00", calorias: 300, proteina: 22, carb: 12, gordura: 18, ingredientes: ["Alface romana", "Frango grelhado", "Croutons", "Parmesão", "Molho Caesar"], preparo: "Monte a salada com alface, frango fatiado, croutons e molho.", tags: ["rapido", "proteina", "leve"] },
  { id: 40, nome: "Hambúrguer caseiro", tempo: "12 min", custo: "R$ 6,00", calorias: 480, proteina: 28, carb: 35, gordura: 24, ingredientes: ["Carne moída", "Pão de hambúrguer", "Queijo", "Alface", "Tomate", "Ketchup"], preparo: "Tempere a carne, modele e grelhe. Monte no pão com queijo e salada.", tags: ["pratico", "proteina", "classico"] },
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
