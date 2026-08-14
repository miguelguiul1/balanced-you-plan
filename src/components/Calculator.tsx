import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, Zap, Flame, Dumbbell, Leaf, Target, Plus, X, UtensilsCrossed, Trophy } from "lucide-react";

type FormData = {
  peso: string;
  altura: string;
  idade: string;
  sexo: string;
  atividade: string;
  objetivo: string;
  esportes: string[];
  refeicoesPorDia: string;
  alimentosAtuais: string[];
};

type Results = {
  tmb: number;
  tdee: number;
  calorias: number;
  proteina: number;
  carboidrato: number;
  gordura: number;
  objetivo: string;
  analiseAlimentar: {
    pontuacao: number;
    dicas: string[];
  };
};

const activityMultipliers: Record<string, number> = {
  sedentario: 1.2,
  leve: 1.375,
  moderado: 1.55,
  intenso: 1.725,
  muito_intenso: 1.9,
};

const objectives = [
  { id: "emagrecer", label: "Emagrecer", icon: Flame, desc: "Perder gordura de forma saudável" },
  { id: "massa", label: "Ganhar massa", icon: Dumbbell, desc: "Aumentar massa muscular" },
  { id: "energia", label: "Mais energia", icon: Zap, desc: "Melhorar disposição e foco" },
  { id: "organizar", label: "Organizar alimentação", icon: Leaf, desc: "Ter uma rotina alimentar equilibrada" },
  { id: "saudavel", label: "Rotina saudável", icon: Target, desc: "Saúde e bem-estar geral" },
];

const activityLevels = [
  { id: "sedentario", label: "Sedentário", desc: "Trabalho de escritório, pouco exercício" },
  { id: "leve", label: "Levemente ativo", desc: "Exercício leve 1-3x por semana" },
  { id: "moderado", label: "Moderadamente ativo", desc: "Exercício moderado 3-5x por semana" },
  { id: "intenso", label: "Muito ativo", desc: "Exercício intenso 6-7x por semana" },
  { id: "muito_intenso", label: "Extremamente ativo", desc: "Treino intenso + trabalho físico" },
];

const alimentosComCalorias: Record<string, number> = {
  "Frango": 165, "Ovo": 155, "Carne vermelha": 250, "Peixe": 120, "Whey": 120, "Tofu": 76, "Feijão": 77,
  "Arroz": 130, "Pão": 265, "Macarrão": 131, "Batata": 77, "Aveia": 68, "Tapioca": 130, "Mandioca": 125,
  "Azeite": 884, "Castanhas": 607, "Abacate": 160, "Manteiga": 717, "Queijo": 350, "Amendoim": 567,
  "Salada": 20, "Frutas": 50, "Legumes": 35, "Iogurte": 59, "Leite": 42, "Suco": 45, "Café": 2,
  "Refrigerante": 140, "Fast food": 550, "Doces": 400, "Salgadinho": 536,
};

const alimentosSugeridos = [
  { categoria: "Proteínas", items: ["Frango", "Ovo", "Carne vermelha", "Peixe", "Whey", "Tofu", "Feijão"] },
  { categoria: "Carboidratos", items: ["Arroz", "Pão", "Macarrão", "Batata", "Aveia", "Tapioca", "Mandioca"] },
  { categoria: "Gorduras", items: ["Azeite", "Castanhas", "Abacate", "Manteiga", "Queijo", "Amendoim"] },
  { categoria: "Outros", items: ["Salada", "Frutas", "Legumes", "Iogurte", "Leite", "Suco", "Café", "Refrigerante", "Fast food", "Doces", "Salgadinho"] },
];

const esportesDisponiveis = [
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

const mealsOptions = [
  { id: "1-2", label: "1 a 2 refeições", desc: "Poucas refeições por dia" },
  { id: "3", label: "3 refeições", desc: "Café, almoço e janta" },
  { id: "4-5", label: "4 a 5 refeições", desc: "Inclui lanches entre refeições" },
  { id: "6+", label: "6 ou mais", desc: "Refeições fracionadas ao longo do dia" },
];

const TOTAL_STEPS = 5;

const Calculator = () => {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormData>({
    peso: "",
    altura: "",
    idade: "",
    sexo: "",
    atividade: "",
    objetivo: "",
    esportes: [],
    refeicoesPorDia: "",
    alimentosAtuais: [],
  });
  const [novoAlimento, setNovoAlimento] = useState("");
  const [results, setResults] = useState<Results | null>(null);

  const toggleEsporte = (esporte: string) => {
    setForm((prev) => {
      if (esporte === "nenhum") {
        return { ...prev, esportes: prev.esportes.includes("nenhum") ? [] : ["nenhum"] };
      }
      const withoutNenhum = prev.esportes.filter((e) => e !== "nenhum");
      return {
        ...prev,
        esportes: withoutNenhum.includes(esporte)
          ? withoutNenhum.filter((e) => e !== esporte)
          : [...withoutNenhum, esporte],
      };
    });
  };

  const toggleAlimento = (alimento: string) => {
    setForm((prev) => ({
      ...prev,
      alimentosAtuais: prev.alimentosAtuais.includes(alimento)
        ? prev.alimentosAtuais.filter((a) => a !== alimento)
        : [...prev.alimentosAtuais, alimento],
    }));
  };

  const addCustomAlimento = () => {
    const trimmed = novoAlimento.trim();
    if (trimmed && !form.alimentosAtuais.includes(trimmed)) {
      setForm((prev) => ({
        ...prev,
        alimentosAtuais: [...prev.alimentosAtuais, trimmed],
      }));
      setNovoAlimento("");
    }
  };

  const analisarAlimentacao = (): { pontuacao: number; dicas: string[] } => {
    const alimentos = form.alimentosAtuais.map((a) => a.toLowerCase());
    const dicas: string[] = [];
    let pontuacao = 50;

    // Check protein
    const temProteina = ["frango", "ovo", "carne vermelha", "peixe", "whey", "tofu", "feijão"].some((p) =>
      alimentos.some((a) => a.includes(p.toLowerCase()))
    );
    if (temProteina) pontuacao += 10;
    else dicas.push("Inclua mais fontes de proteína como frango, ovo ou feijão.");

    // Check veggies
    const temVegetais = ["salada", "legumes", "frutas"].some((v) =>
      alimentos.some((a) => a.includes(v.toLowerCase()))
    );
    if (temVegetais) pontuacao += 15;
    else dicas.push("Adicione mais vegetais, frutas e saladas ao seu dia.");

    // Check ultraprocessed
    const temUltraprocessado = ["fast food", "refrigerante", "salgadinho", "doces"].some((u) =>
      alimentos.some((a) => a.includes(u.toLowerCase()))
    );
    if (temUltraprocessado) {
      pontuacao -= 15;
      dicas.push("Reduza o consumo de ultraprocessados como fast food e refrigerante.");
    }

    // Check carbs
    const temCarb = ["arroz", "pão", "batata", "aveia", "macarrão"].some((c) =>
      alimentos.some((a) => a.includes(c.toLowerCase()))
    );
    if (temCarb) pontuacao += 5;

    // Check healthy fats
    const temGorduraBoa = ["azeite", "castanhas", "abacate", "amendoim"].some((g) =>
      alimentos.some((a) => a.includes(g.toLowerCase()))
    );
    if (temGorduraBoa) pontuacao += 10;
    else dicas.push("Inclua gorduras saudáveis como azeite, castanhas ou abacate.");

    // Meals feedback
    if (form.refeicoesPorDia === "1-2") {
      pontuacao -= 10;
      dicas.push("Tente fazer ao menos 3 refeições por dia para manter o metabolismo ativo.");
    } else if (form.refeicoesPorDia === "4-5" || form.refeicoesPorDia === "6+") {
      pontuacao += 10;
    }

    // Variety
    if (form.alimentosAtuais.length >= 8) {
      pontuacao += 10;
      dicas.push("Boa variedade alimentar! Continue assim.");
    } else if (form.alimentosAtuais.length < 4) {
      dicas.push("Tente diversificar mais seus alimentos para garantir todos os nutrientes.");
    }

    return { pontuacao: Math.max(0, Math.min(100, pontuacao)), dicas };
  };

  const calculate = () => {
    const peso = parseFloat(form.peso);
    const altura = parseFloat(form.altura);
    const idade = parseFloat(form.idade);
    const mult = activityMultipliers[form.atividade] || 1.55;

    let tmb: number;
    if (form.sexo === "masculino") {
      tmb = 10 * peso + 6.25 * altura - 5 * idade + 5;
    } else if (form.sexo === "feminino") {
      tmb = 10 * peso + 6.25 * altura - 5 * idade - 161;
    } else {
      tmb = 10 * peso + 6.25 * altura - 5 * idade - 78;
    }

    const tdee = tmb * mult;

    let calorias: number;
    switch (form.objetivo) {
      case "emagrecer":
        calorias = tdee - 400;
        break;
      case "massa":
        calorias = tdee + 350;
        break;
      default:
        calorias = tdee;
    }

    const proteina = peso * (form.objetivo === "massa" ? 2.0 : 1.6);
    const gordura = (calorias * 0.25) / 9;
    const carboidrato = (calorias - proteina * 4 - gordura * 9) / 4;

    const analise = analisarAlimentacao();

    setResults({
      tmb: Math.round(tmb),
      tdee: Math.round(tdee),
      calorias: Math.round(calorias),
      proteina: Math.round(proteina),
      carboidrato: Math.round(carboidrato),
      gordura: Math.round(gordura),
      objetivo: objectives.find((o) => o.id === form.objetivo)?.label || "",
      analiseAlimentar: analise,
    });
    setStep(TOTAL_STEPS);
  };

  const bodyDataError = firstError([
    checkRange(form.peso, RANGES.peso),
    checkRange(form.altura, RANGES.altura),
    checkRange(form.idade, RANGES.idade),
  ]);

  const canProceed = () => {
    switch (step) {
      case 0:
        return form.objetivo !== "";
      case 1:
        return bodyDataError === null;
      case 2:
        return form.atividade !== "" && form.esportes.length > 0;
      case 3:
        return form.refeicoesPorDia !== "" && form.alimentosAtuais.length > 0;
      case 4:
        return true;
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (step === 4) {
      calculate();
    } else {
      setStep((s) => s + 1);
    }
  };

  return (
    <section id="calculator" className="py-24 px-6">
      <div className="container mx-auto max-w-2xl">
        {step < TOTAL_STEPS && (
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground">
              Monte seu plano
            </h2>
            <p className="mt-3 text-muted-foreground">
              Responda algumas perguntas rápidas
            </p>
            {/* Progress */}
            <div className="mt-8 flex gap-2 justify-center">
              {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i <= step ? "w-12 bg-primary" : "w-8 bg-border"
                  }`}
                />
              ))}
            </div>
          </div>
        )}

        <div className="bg-card rounded-2xl shadow-soft p-8 sm:p-10">
          {/* Step 0: Objective */}
          {step === 0 && (
            <div className="space-y-4 animate-fade-in">
              <h3 className="font-display text-xl font-semibold text-foreground mb-6">
                Qual é o seu objetivo principal?
              </h3>
              <div className="grid gap-3">
                {objectives.map((obj) => {
                  const Icon = obj.icon;
                  return (
                    <button
                      key={obj.id}
                      onClick={() => setForm({ ...form, objetivo: obj.id })}
                      className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left ${
                        form.objetivo === obj.id
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/30"
                      }`}
                    >
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          form.objetivo === obj.id
                            ? "bg-primary text-primary-foreground"
                            : "bg-secondary text-muted-foreground"
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-display font-semibold text-foreground">{obj.label}</p>
                        <p className="text-sm text-muted-foreground">{obj.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 1: Body data */}
          {step === 1 && (
            <div className="space-y-6 animate-fade-in">
              <h3 className="font-display text-xl font-semibold text-foreground mb-6">
                Seus dados corporais
              </h3>
              <div className="grid sm:grid-cols-3 gap-4">
                {[
                  { key: "peso", label: "Peso (kg)", placeholder: "72" },
                  { key: "altura", label: "Altura (cm)", placeholder: "175" },
                  { key: "idade", label: "Idade", placeholder: "28" },
                ].map((field) => (
                  <div key={field.key}>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">
                      {field.label}
                    </label>
                    <input
                      type="number"
                      placeholder={field.placeholder}
                      value={form[field.key as keyof FormData]}
                      onChange={(e) =>
                        setForm({ ...form, [field.key]: e.target.value })
                      }
                      className="w-full h-12 px-4 rounded-xl border-2 border-border bg-background text-foreground font-display text-lg focus:border-primary focus:outline-none transition-colors"
                    />
                  </div>
                ))}
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-3">
                  Sexo <span className="text-xs">(opcional)</span>
                </label>
                <div className="flex gap-3">
                  {[
                    { id: "masculino", label: "Masculino" },
                    { id: "feminino", label: "Feminino" },
                    { id: "", label: "Prefiro não dizer" },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => setForm({ ...form, sexo: opt.id })}
                      className={`flex-1 py-3 rounded-xl border-2 text-sm font-medium transition-all ${
                        form.sexo === opt.id
                          ? "border-primary bg-primary/5 text-foreground"
                          : "border-border text-muted-foreground hover:border-primary/30"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Activity + Sports */}
          {step === 2 && (
            <div className="space-y-6 animate-fade-in">
              <h3 className="font-display text-xl font-semibold text-foreground mb-6">
                Nível de atividade física
              </h3>
              <div className="grid gap-3">
                {activityLevels.map((level) => (
                  <button
                    key={level.id}
                    onClick={() => setForm({ ...form, atividade: level.id })}
                    className={`p-4 rounded-xl border-2 transition-all text-left ${
                      form.atividade === level.id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/30"
                    }`}
                  >
                    <p className="font-display font-semibold text-foreground">{level.label}</p>
                    <p className="text-sm text-muted-foreground">{level.desc}</p>
                  </button>
                ))}
              </div>

              {/* Sports selection */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-3">
                  <Trophy className="w-4 h-4 text-primary" />
                  Qual esporte você pratica? <span className="text-xs">(pode selecionar vários)</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {esportesDisponiveis.map((esporte) => (
                    <button
                      key={esporte.id}
                      onClick={() => toggleEsporte(esporte.id)}
                      className={`flex items-center gap-2 p-3 rounded-xl border-2 transition-all text-left text-sm ${
                        form.esportes.includes(esporte.id)
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/30"
                      }`}
                    >
                      <span className="text-lg">{esporte.icon}</span>
                      <span className="font-medium text-foreground">{esporte.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Food intake */}
          {step === 3 && (
            <div className="space-y-6 animate-fade-in">
              <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                <UtensilsCrossed className="w-5 h-5 inline-block mr-2 text-primary" />
                Sua alimentação atual
              </h3>
              <p className="text-sm text-muted-foreground -mt-4">
                Nos conte o que você costuma comer no dia a dia
              </p>

              {/* Meals per day */}
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-3">
                  Quantas refeições você faz por dia?
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {mealsOptions.map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => setForm({ ...form, refeicoesPorDia: opt.id })}
                      className={`p-3 rounded-xl border-2 transition-all text-left ${
                        form.refeicoesPorDia === opt.id
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/30"
                      }`}
                    >
                      <p className="font-display font-semibold text-foreground text-sm">{opt.label}</p>
                      <p className="text-xs text-muted-foreground">{opt.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Food selection */}
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-3">
                  O que você costuma comer? <span className="text-xs">(selecione ou adicione)</span>
                </label>

                {/* Selected foods */}
                {form.alimentosAtuais.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {form.alimentosAtuais.map((alimento) => (
                      <span
                        key={alimento}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium"
                      >
                        {alimento} {alimentosComCalorias[alimento] ? <span className="opacity-70 text-xs">({alimentosComCalorias[alimento]}cal)</span> : null}
                        <button
                          onClick={() => toggleAlimento(alimento)}
                          className="ml-1 hover:text-destructive transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                {/* Custom food input */}
                <div className="flex gap-2 mb-4">
                  <input
                    type="text"
                    placeholder="Adicionar outro alimento..."
                    value={novoAlimento}
                    onChange={(e) => setNovoAlimento(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addCustomAlimento()}
                    className="flex-1 h-10 px-4 rounded-xl border-2 border-border bg-background text-foreground text-sm focus:border-primary focus:outline-none transition-colors"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={addCustomAlimento}
                    disabled={!novoAlimento.trim()}
                    className="h-10 px-3"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>

                {/* Suggested foods by category */}
                <div className="space-y-4 max-h-60 overflow-y-auto pr-1">
                  {alimentosSugeridos.map((cat) => (
                    <div key={cat.categoria}>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                        {cat.categoria}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {cat.items.map((item) => (
                          <button
                            key={item}
                            onClick={() => toggleAlimento(item)}
                            className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                              form.alimentosAtuais.includes(item)
                                ? "bg-primary text-primary-foreground"
                                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                            }`}
                          >
                            {item} <span className="opacity-70 text-xs">({alimentosComCalorias[item]}cal)</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Confirm */}
          {step === 4 && (
            <div className="space-y-6 animate-fade-in text-center">
              <h3 className="font-display text-xl font-semibold text-foreground">
                Tudo pronto!
              </h3>
              <p className="text-muted-foreground">
                Vamos calcular seu plano nutricional personalizado baseado nas suas informações.
              </p>
              <div className="grid grid-cols-2 gap-3 text-left max-w-sm mx-auto">
                <span className="text-muted-foreground text-sm">Peso:</span>
                <span className="font-medium text-foreground text-sm">{form.peso} kg</span>
                <span className="text-muted-foreground text-sm">Altura:</span>
                <span className="font-medium text-foreground text-sm">{form.altura} cm</span>
                <span className="text-muted-foreground text-sm">Idade:</span>
                <span className="font-medium text-foreground text-sm">{form.idade} anos</span>
                <span className="text-muted-foreground text-sm">Objetivo:</span>
                <span className="font-medium text-foreground text-sm">
                  {objectives.find((o) => o.id === form.objetivo)?.label}
                </span>
                <span className="text-muted-foreground text-sm">Esporte(s):</span>
                <span className="font-medium text-foreground text-sm">
                  {form.esportes.map((e) => esportesDisponiveis.find((ed) => ed.id === e)?.label).join(", ")}
                </span>
                <span className="text-muted-foreground text-sm">Refeições/dia:</span>
                <span className="font-medium text-foreground text-sm">
                  {mealsOptions.find((m) => m.id === form.refeicoesPorDia)?.label}
                </span>
                <span className="text-muted-foreground text-sm">Alimentos:</span>
                <span className="font-medium text-foreground text-sm">
                  {form.alimentosAtuais.length} selecionados
                </span>
              </div>
            </div>
          )}

          {/* Step 5: Results */}
          {step === TOTAL_STEPS && results && (
            <div className="animate-fade-in">
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary font-display text-sm font-medium mb-4">
                  <Zap className="w-4 h-4" />
                  Seu plano Evolua Plus
                </div>
                <h3 className="font-display text-2xl font-bold text-foreground">
                  Resultado personalizado
                </h3>
                <p className="text-muted-foreground mt-1">
                  Objetivo: {results.objetivo}
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 mb-6">
                <ResultCard label="Taxa Metabólica Basal" value={`${results.tmb}`} unit="kcal" desc="Energia gasta em repouso" />
                <ResultCard label="Gasto Diário Total" value={`${results.tdee}`} unit="kcal" desc="Com atividade física" />
              </div>

              <div className="bg-primary/5 rounded-xl p-6 mb-6 text-center">
                <p className="text-sm text-muted-foreground font-medium">Meta calórica diária</p>
                <p className="font-display text-4xl font-bold text-primary mt-1">
                  {results.calorias}
                  <span className="text-lg font-normal text-muted-foreground ml-1">kcal</span>
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-6">
                <MacroCard label="Proteína" value={results.proteina} unit="g" color="bg-primary" />
                <MacroCard label="Carboidrato" value={results.carboidrato} unit="g" color="bg-accent" />
                <MacroCard label="Gordura" value={results.gordura} unit="g" color="bg-secondary" />
              </div>

              {/* Dietary analysis */}
              <div className="bg-secondary/50 rounded-xl p-6 mb-6">
                <h4 className="font-display font-semibold text-foreground mb-3 flex items-center gap-2">
                  <UtensilsCrossed className="w-4 h-4 text-primary" />
                  Análise da sua alimentação
                </h4>
                
                {/* Score bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Pontuação alimentar</span>
                    <span className={`font-display font-bold ${
                      results.analiseAlimentar.pontuacao >= 70 ? "text-primary" :
                      results.analiseAlimentar.pontuacao >= 40 ? "text-accent-foreground" : "text-destructive"
                    }`}>
                      {results.analiseAlimentar.pontuacao}/100
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-border overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        results.analiseAlimentar.pontuacao >= 70 ? "bg-primary" :
                        results.analiseAlimentar.pontuacao >= 40 ? "bg-accent" : "bg-destructive"
                      }`}
                      style={{ width: `${results.analiseAlimentar.pontuacao}%` }}
                    />
                  </div>
                </div>

                {/* Tips */}
                <div className="space-y-2">
                  {results.analiseAlimentar.dicas.map((dica, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm">
                      <span className="text-primary mt-0.5">•</span>
                      <span className="text-muted-foreground">{dica}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* What they eat summary */}
              <div className="bg-secondary/50 rounded-xl p-6 mb-6">
                <h4 className="font-display font-semibold text-foreground mb-3">
                  Seus alimentos atuais
                </h4>
                <div className="flex flex-wrap gap-2">
                  {form.alimentosAtuais.map((a) => (
                    <span key={a} className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm">
                      {a} {alimentosComCalorias[a] ? <span className="opacity-70 text-xs">({alimentosComCalorias[a]}cal/100g)</span> : null}
                    </span>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-3">
                  {mealsOptions.find((m) => m.id === form.refeicoesPorDia)?.label} por dia
                </p>
              </div>

              <div className="mt-8 text-center">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => {
                    setStep(0);
                    setResults(null);
                    setForm({ peso: "", altura: "", idade: "", sexo: "", atividade: "", objetivo: "", esportes: [], refeicoesPorDia: "", alimentosAtuais: [] });
                  }}
                >
                  Recalcular
                </Button>
              </div>
            </div>
          )}

          {/* Navigation */}
          {step < TOTAL_STEPS && (
            <div className="flex justify-between mt-8 pt-6 border-t border-border">
              <Button
                variant="ghost"
                onClick={() => setStep((s) => s - 1)}
                disabled={step === 0}
                className="gap-2"
              >
                <ArrowLeft className="w-4 h-4" /> Voltar
              </Button>
              <Button
                variant="hero"
                onClick={nextStep}
                disabled={!canProceed()}
                className="gap-2"
              >
                {step === 4 ? "Ver resultado" : "Próximo"} <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

const ResultCard = ({ label, value, unit, desc }: { label: string; value: string; unit: string; desc: string }) => (
  <div className="bg-secondary/50 rounded-xl p-5">
    <p className="text-sm text-muted-foreground font-medium">{label}</p>
    <p className="font-display text-2xl font-bold text-foreground mt-1">
      {value} <span className="text-sm font-normal text-muted-foreground">{unit}</span>
    </p>
    <p className="text-xs text-muted-foreground mt-1">{desc}</p>
  </div>
);

const MacroCard = ({ label, value, unit, color }: { label: string; value: number; unit: string; color: string }) => (
  <div className="text-center p-4 rounded-xl bg-secondary/50">
    <div className={`w-3 h-3 rounded-full ${color} mx-auto mb-2`} />
    <p className="font-display text-xl font-bold text-foreground">{value}{unit}</p>
    <p className="text-xs text-muted-foreground mt-1">{label}</p>
  </div>
);

export default Calculator;
