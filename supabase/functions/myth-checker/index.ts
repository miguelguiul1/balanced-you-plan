import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { question } = await req.json();
    if (!question || typeof question !== "string" || question.trim().length < 3) {
      return new Response(JSON.stringify({ error: "Pergunta inválida" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: `Você é um nutricionista especialista em desmistificar mitos alimentares. 
Responda APENAS com JSON válido, sem markdown. Use este formato:
{"veredicto":"MITO" ou "VERDADE" ou "PARCIALMENTE VERDADE","explicacao":"explicação clara em 2-3 frases","fonte":"nome da instituição científica que embasa a resposta"}

Base suas respostas em evidências de: OMS, Harvard T.H. Chan, Ministério da Saúde, estudos publicados em journals revisados por pares. Seja direto e acessível.`,
          },
          {
            role: "user",
            content: `A seguinte afirmação é mito ou verdade? "${question.trim()}"`,
          },
        ],
        max_tokens: 500,
        temperature: 0.3,
      }),
    });

    if (response.status === 429) {
      return new Response(JSON.stringify({ error: "Muitas requisições, tente novamente em alguns segundos." }), {
        status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (response.status === 402) {
      return new Response(JSON.stringify({ error: "Créditos insuficientes." }), {
        status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (!response.ok) throw new Error(`AI error: ${response.status}`);

    const data = await response.json();
    let content = data.choices?.[0]?.message?.content || "";
    content = content.replace(/```json\s*/g, "").replace(/```/g, "").trim();

    const result = JSON.parse(content);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("myth-checker error:", e);
    return new Response(JSON.stringify({ error: "Erro ao verificar. Tente reformular sua pergunta." }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
