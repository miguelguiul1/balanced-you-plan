import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders, json, requireUser, rateLimit, readJson, isResponse } from "../_shared/guard.ts";

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Método não permitido" }, 405);
  const auth = await requireUser(req);
  if (isResponse(auth)) return auth;
  const limited = rateLimit("nutrition-chat:" + auth.userId, 25);
  if (limited) return limited;


  try {
    const body = await readJson(req);
    if (isResponse(body)) return body;
    const { messages, profile } = body as Record<string, unknown> as any;
    if (!Array.isArray(messages) || messages.length === 0 || messages.length > 20) {
      return json({ error: "Conversa inválida." }, 400);
    }
    const safeMessages = messages
      .filter((m: any) => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
      .slice(-10)
      .map((m: any) => ({ role: m.role, content: m.content.slice(0, 4000) }));
    if (!safeMessages.length) return json({ error: "Conversa inválida." }, 400);
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY não configurado");

    let ctx = "";
    if (profile) {
      const p: string[] = [];
      if (profile.objective) p.push(`Objetivo: ${profile.objective}`);
      if (profile.calories_goal) p.push(`Meta calórica: ${profile.calories_goal} kcal/dia`);
      if (profile.protein_goal) p.push(`Meta de proteína: ${profile.protein_goal}g/dia`);
      if (profile.water_goal_ml) p.push(`Meta de água: ${profile.water_goal_ml}ml/dia`);
      if (profile.target_weight) p.push(`Peso alvo: ${profile.target_weight}kg`);
      if (profile.restrictions?.length) p.push(`Restrições: ${profile.restrictions.join(", ")}`);
      if (profile.disliked_foods?.length) p.push(`Não gosta de: ${profile.disliked_foods.join(", ")}`);
      if (profile.liked_foods?.length) p.push(`Gosta de: ${profile.liked_foods.join(", ")}`);
      if (profile.memoria?.length) p.push(`Memória da IA (informações que a pessoa pediu para lembrar): ${profile.memoria.join(" | ")}`);

      const h = profile.hoje;
      if (h) p.push(`Hoje: ${h.refeicoes} registro(s), ${h.calorias} kcal, ${h.proteina}g proteína, ${h.carboidratos}g carbo, ${h.gorduras}g gordura, ${h.fibras}g fibra`);
      const s = profile.semana;
      if (s) p.push(`Últimos 7 dias: ${s.dias_registrados} dias registrados, média ${s.media_calorias} kcal / ${s.media_proteina}g proteína / ${s.media_fibras}g fibra${s.alimentos_frequentes?.length ? `; alimentos frequentes: ${s.alimentos_frequentes.join(", ")}` : ""}`);
      const e = profile.evolucao;
      if (e) p.push(`Evolução corporal: peso atual ${e.peso_atual}kg, variação ${e.variacao_kg}kg em ${e.registros} registros (último em ${e.ultimo_registro})`);

      if (p.length) ctx = `\n\nCONTEXTO REAL DO USUÁRIO (use ativamente, sem repetir tudo):\n- ${p.join("\n- ")}`;
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

USO DO CONTEXTO (obrigatório):
- Sempre que houver dados reais do usuário no contexto abaixo, baseie a resposta neles em vez de generalidades.
- Respeite restrições e alimentos que a pessoa não gosta: nunca sugira algo que ela evita.
- Aponte lacunas de forma educativa e nunca alarmista (ex.: "sua proteína hoje está abaixo da meta — que tal...?").
- Nunca invente dados que não estejam no contexto. Se faltar informação, peça em lista curta.

ERROS: se não souber, diga "Não tenho certeza sobre essa informação" e recomende uma fonte profissional. Nunca invente.

INCERTEZA: quando não for possível determinar algo com precisão (ex.: quantidade exata em uma foto), diga isso claramente e apresente como "valores estimados".

TENDÊNCIAS: ao comentar evolução, descreva tendências sem afirmar causalidade ("durante esse período você apresentou X enquanto também registrou Y"). Nunca diga que algo causou um resultado.

MEMÓRIA: respeite integralmente a memória do usuário. Se ela contradisser outro dado, priorize a memória mais específica e confirme com a pessoa.

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
      return new Response(JSON.stringify({ error: "Erro no assistente" }), {
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
    return new Response(JSON.stringify({ error: "Erro interno. Tente novamente." }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});