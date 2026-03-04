import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, Zap, Flame, Dumbbell, Leaf, Target } from "lucide-react";

type FormData = {
  peso: string;
  altura: string;
  idade: string;
  sexo: string;
  atividade: string;
  objetivo: string;
};

type Results = {
  tmb: number;
  tdee: number;
  calorias: number;
  proteina: number;
  carboidrato: number;
  gordura: number;
  objetivo: string;
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

const Calculator = () => {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormData>({
    peso: "",
    altura: "",
    idade: "",
    sexo: "",
    atividade: "",
    objetivo: "",
  });
  const [results, setResults] = useState<Results | null>(null);

  const calculate = () => {
    const peso = parseFloat(form.peso);
    const altura = parseFloat(form.altura);
    const idade = parseFloat(form.idade);
    const mult = activityMultipliers[form.atividade] || 1.55;

    // Mifflin-St Jeor (default neutral if no sex selected)
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

    setResults({
      tmb: Math.round(tmb),
      tdee: Math.round(tdee),
      calorias: Math.round(calorias),
      proteina: Math.round(proteina),
      carboidrato: Math.round(carboidrato),
      gordura: Math.round(gordura),
      objetivo: objectives.find((o) => o.id === form.objetivo)?.label || "",
    });
    setStep(4);
  };

  const canProceed = () => {
    switch (step) {
      case 0:
        return form.objetivo !== "";
      case 1:
        return form.peso !== "" && form.altura !== "" && form.idade !== "";
      case 2:
        return form.atividade !== "";
      case 3:
        return true;
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (step === 3) {
      calculate();
    } else {
      setStep((s) => s + 1);
    }
  };

  return (
    <section id="calculator" className="py-24 px-6">
      <div className="container mx-auto max-w-2xl">
        {step < 4 && (
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground">
              Monte seu plano
            </h2>
            <p className="mt-3 text-muted-foreground">
              Responda algumas perguntas rápidas
            </p>
            {/* Progress */}
            <div className="mt-8 flex gap-2 justify-center">
              {[0, 1, 2, 3].map((i) => (
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

          {/* Step 2: Activity */}
          {step === 2 && (
            <div className="space-y-4 animate-fade-in">
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
            </div>
          )}

          {/* Step 3: Confirm */}
          {step === 3 && (
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
              </div>
            </div>
          )}

          {/* Step 4: Results */}
          {step === 4 && results && (
            <div className="animate-fade-in">
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary font-display text-sm font-medium mb-4">
                  <Zap className="w-4 h-4" />
                  Seu plano Evolua+
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

              <div className="grid grid-cols-3 gap-3">
                <MacroCard label="Proteína" value={results.proteina} unit="g" color="bg-primary" />
                <MacroCard label="Carboidrato" value={results.carboidrato} unit="g" color="bg-accent" />
                <MacroCard label="Gordura" value={results.gordura} unit="g" color="bg-secondary" />
              </div>

              <div className="mt-8 text-center">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => {
                    setStep(0);
                    setResults(null);
                    setForm({ peso: "", altura: "", idade: "", sexo: "", atividade: "", objetivo: "" });
                  }}
                >
                  Recalcular
                </Button>
              </div>
            </div>
          )}

          {/* Navigation */}
          {step < 4 && (
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
                {step === 3 ? "Ver resultado" : "Próximo"} <ArrowRight className="w-4 h-4" />
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
