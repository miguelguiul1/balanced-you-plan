/** Listas compartilhadas entre a página de Preferências e o Onboarding. */
export const ALL_FOODS: Record<string, string[]> = {
  "Proteínas": ["Frango", "Ovo", "Carne vermelha", "Peixe", "Atum", "Sardinha", "Tofu", "Feijão", "Lentilha", "Grão-de-bico", "Whey"],
  "Carboidratos": ["Arroz", "Arroz integral", "Pão", "Pão integral", "Macarrão", "Batata", "Batata-doce", "Aveia", "Tapioca", "Mandioca", "Milho", "Quinoa"],
  "Gorduras": ["Azeite", "Castanhas", "Abacate", "Manteiga", "Queijo", "Amendoim", "Linhaça", "Chia", "Coco"],
  "Frutas": ["Banana", "Maçã", "Laranja", "Morango", "Uva", "Manga", "Mamão", "Melancia", "Abacaxi", "Limão"],
  "Verduras/Legumes": ["Brócolis", "Espinafre", "Cenoura", "Tomate", "Alface", "Couve", "Abobrinha", "Chuchu", "Beterraba", "Pepino"],
  "Laticínios": ["Leite", "Iogurte", "Queijo cottage", "Requeijão", "Leite de amêndoas"],
};

export const RESTRICTIONS = [
  "Intolerância à lactose", "Alergia ao glúten", "Vegetariano", "Vegano",
  "Alergia a frutos do mar", "Alergia a amendoim", "Diabetes", "Hipertensão",
];

export const SPORTS = [
  { id: "musculacao", label: "Musculação", icon: "🏋️" },
  { id: "corrida", label: "Corrida", icon: "🏃" },
  { id: "natacao", label: "Natação", icon: "🏊" },
  { id: "futebol", label: "Futebol", icon: "⚽" },
  { id: "ciclismo", label: "Ciclismo", icon: "🚴" },
  { id: "luta", label: "Luta / MMA", icon: "🥊" },
  { id: "crossfit", label: "CrossFit", icon: "💪" },
  { id: "yoga", label: "Yoga / Pilates", icon: "🧘" },
  { id: "danca", label: "Dança", icon: "💃" },
  { id: "caminhada", label: "Caminhada", icon: "🚶" },
  { id: "basquete", label: "Basquete", icon: "🏀" },
  { id: "tenis", label: "Tênis", icon: "🎾" },
  { id: "nenhum", label: "Nenhum no momento", icon: "❌" },
];
