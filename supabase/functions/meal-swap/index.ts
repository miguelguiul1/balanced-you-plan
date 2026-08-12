import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders, json, requireUser, rateLimit, readJson, isResponse } from "../_shared/guard.ts";

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Método não permitido" }, 405);
  const auth = await requireUser(req);
  if (isResponse(auth)) return auth;
  const limited = rateLimit("meal-swap:" + auth.userId, 15);
  if (limited) return limited;


  try {
    const body = await readJson(req);
    if (isResponse(body)) return body;
    const { refeicao, motivo, preferences, memoria } = body as Record<string, unknown> as any;
    if (!refeicao?.nome) {
      return new Response(JSON.stringify({ error: "Refeição inválida" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY não configurado");

    const ctx: string[] = [];
    if (preferences?.objective) ctx.push(`Objetivo: ${preferences.objective}`);
    if (preferences?.restrictions?.length) ctx.push(`Restrições: ${preferences.restrictions.join(", ")}`);
    if (preferences?.disliked_foods?.length) ctx.push(`NÃO usar: ${preferences.disliked_foods.join(", ")}`);
    if (preferences?.liked_foods?.length) ctx.push(`Preferidos: ${preferences.liked_foods.join(", ")}`);
    if (Array.isArray(memoria) && memoria.length) ctx.push(`Memória do usuário: ${memoria.join(" | ")}`);
    if (motivo) ctx.push(`Motivo da troca informado pelo usuário: "${motivo}"`);

    const systemPrompt = `Você é o Evolua Plus AI, assistente de nutrição (não é nutricionista nem médico).
Substitua a refeição informada por UMA nova opção com perfil nutricional semelhante (±15% de calorias e proteína).
Responda APENAS JSON válido (sem markdown):
{"tipo":"string","nome":"string","calorias":number,"proteina":number,"carb":number,"gordura":number,"ingredientes":["string"],"preparo":"string curta","motivo_troca":"string curta explicando a substituição"}

Regras:
- Mantenha o mesmo "tipo" de refeição.
- Receita prática, econômica e brasileira; valores nutricionais são estimados.
- Nunca use alimentos que o usuário rejeita ou que violem restrições.
- SOMENTE o JSON.
${ctx.length ? `\nCONTEXTO:\n${ctx.join("\n")}` : ""}`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Refeição atual: ${JSON.stringify(refeicao)}` },
        ],
        max_tokens: 1200,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Muitas requisições. Aguarde alguns segundos." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Créditos de IA esgotados." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "Erro ao gerar substituição" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const raw = (data.choices?.[0]?.message?.content ?? "").replace(/```json|```/gi, "").trim();
    const start = raw.indexOf("{");
    const end = raw.lastIndexOf("}");
    let parsed;
    try {
      parsed = JSON.parse(start >= 0 ? raw.slice(start, end + 1) : raw);
    } catch {
      console.error("Failed to parse:", raw);
      return new Response(JSON.stringify({ error: "Não consegui montar a substituição. Tente novamente." }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("meal-swap error:", err);
    return new Response(JSON.stringify({ error: "Erro interno. Tente novamente." }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
