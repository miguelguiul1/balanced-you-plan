import { useState, useEffect } from "react";
import { Sparkles } from "lucide-react";

const quotes = [
  { text: "Disciplina pesa gramas. Arrependimento pesa toneladas.", category: "geral" },
  { text: "Você não precisa comer menos. Precisa comer melhor.", category: "reeducacao" },
  { text: "Seu corpo é construído pelas escolhas que você faz diariamente.", category: "geral" },
  { text: "Comida é combustível. Escolha bem o que abastece você.", category: "geral" },
  { text: "Não existe dieta perfeita. Existe a consistência que transforma.", category: "geral" },
  { text: "Cuidar da alimentação é o ato mais inteligente de autocuidado.", category: "saudavel" },
  { text: "Resultados não vêm do que você faz de vez em quando, mas do que faz todos os dias.", category: "emagrecimento" },
  { text: "A melhor dieta é aquela que você consegue manter.", category: "reeducacao" },
  { text: "Cada refeição é uma oportunidade de nutrir o seu corpo.", category: "geral" },
  { text: "Saúde não é sobre ser perfeito. É sobre ser melhor do que ontem.", category: "geral" },
  { text: "Músculos são construídos na cozinha e esculpidos na academia.", category: "massa" },
  { text: "Investir em alimentação é investir em longevidade.", category: "economia" },
  { text: "O segredo não é gastar mais. É escolher melhor.", category: "economia" },
  { text: "Sua energia vem do que você come. Abasteça-se com qualidade.", category: "energia" },
  { text: "Comer bem não precisa ser caro. Precisa ser inteligente.", category: "economia" },
];

const MotivationalQuote = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setIndex(Math.floor(Math.random() * quotes.length));
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % quotes.length);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-primary/5 border border-primary/10 rounded-2xl p-6 text-center">
      <Sparkles className="w-5 h-5 text-primary mx-auto mb-3" />
      <p className="font-display text-lg sm:text-xl font-semibold text-foreground italic leading-relaxed">
        "{quotes[index].text}"
      </p>
    </div>
  );
};

export default MotivationalQuote;
