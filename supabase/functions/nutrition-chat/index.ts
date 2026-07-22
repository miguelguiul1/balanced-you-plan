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

    const systemPrompt = `Você é o assistente nutricional do Evolua+, especialista brasileiro em nutrição, treinos e hábitos saudáveis. Responda de forma clara, amigável e prática, em português. Sempre baseie sugestões em ciência. Nunca receite medicamentos. Se a pergunta for fora da área, redirecione com gentileza.${ctx}`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
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