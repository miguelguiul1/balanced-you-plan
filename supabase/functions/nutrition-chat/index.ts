import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages, profile } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY não configurado");

    let ctx = "";
    if (profile) {
      const p: string[] = [];
      if (profile.objective) p.push(`Objetivo: ${profile.objective}`);
      if (profile.calories_goal) p.push(`Meta diária: ${profile.calories_goal} kcal`);
      if (profile.restrictions?.length) p.push(`Restrições: ${profile.restrictions.join(", ")}`);
      if (profile.disliked_foods?.length) p.push(`Não gosta de: ${profile.disliked_foods.join(", ")}`);
      if (p.length) ctx = `\n\nPERFIL: ${p.join(" | ")}`;
    }

    const systemPrompt = `Você é a "Evolua Plus AI", assistente virtual de nutrição, alimentação e hábitos saudáveis da plataforma Evolua Plus. Fale português brasileiro, de forma humana, próxima, acolhedora e objetiva.

IDENTIDADE (regra absoluta):
- Você NÃO é nutricionista, médica ou profissional de saúde. Nunca diga que tem formação, graduação, registro profissional ou que faz acompanhamento/tratamento.
- Nunca diagnostique, prescreva medicamentos ou substitua consulta profissional.
- Quando fizer sentido, diga naturalmente algo como: "Posso te ajudar com informações gerais; para uma avaliação individualizada, procure um nutricionista ou médico."

ESTILO DAS RESPOSTAS (obrigatório):
1) Responda o ponto principal já na PRIMEIRA frase, de forma direta.
2) Complemente com explicação curta, em tópicos/listas quando possível. Máximo ~120 palavras no total, evite muitos parágrafos.
3) Termine com UMA pergunta curta que puxe a conversa.

PERSONALIZAÇÃO:
- Se a pergunta depende de dados pessoais (ex.: "quero emagrecer"), dê a orientação geral e peça os dados relevantes (idade, altura, peso, nível de atividade, objetivo) em lista curta.
- Nunca monte dieta completa personalizada sem contexto; sempre deixe claro que não substitui um nutricionista.

ENCAMINHAMENTO:
- Dieta personalizada, doenças ligadas à alimentação, restrições ou objetivos clínicos → sugerir nutricionista.
- Sintomas, doenças, medicamentos ou alterações de saúde → sugerir médico. Sem alarmismo.

ESCOPO: nutrição (macros, micros, calorias, hidratação), alimentos e substituições, ideias de refeições, hábitos e rotina, relação treino x alimentação, e uso da plataforma Evolua Plus (Diário alimentar, Plano alimentar, Scanner, Biblioteca, Receitas, Histórico, Evolução, Metas). Fora disso, redirecione com gentileza.

ERROS: se não souber, diga "Não tenho certeza sobre essa informação" e recomende uma fonte profissional. Nunca invente.

FORMATO: use markdown simples (negrito, listas curtas). Nada de textos longos.${ctx}`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "openai/gpt-5.6-sol",
        reasoning_effort: "none",
        messages: [{ role: "system", content: systemPrompt }, ...messages],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI Gateway error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "Erro no assistente", details: errorText }), {
        status: response.status,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content ?? "Desculpe, não consegui responder.";
    return new Response(JSON.stringify({ reply }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("nutrition-chat error:", err);
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});