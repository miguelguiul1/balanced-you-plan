import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { preferences } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    let preferencesContext = "";
    if (preferences) {
      const parts: string[] = [];
      if (preferences.objective) parts.push(`Objetivo: ${preferences.objective}`);
      if (preferences.restrictions?.length) parts.push(`Restrições: ${preferences.restrictions.join(", ")}`);
      if (preferences.disliked_foods?.length) parts.push(`NÃO usar: ${preferences.disliked_foods.join(", ")}`);
      if (preferences.liked_foods?.length) parts.push(`Preferidos: ${preferences.liked_foods.join(", ")}`);
      if (parts.length) preferencesContext = `\n\nPERFIL DO USUÁRIO:\n${parts.join("\n")}`;
    }

    const systemPrompt = `Você é um nutricionista brasileiro. Crie um plano semanal de refeições (segunda a domingo) com café da manhã, almoço, lanche e jantar. Retorne APENAS JSON válido (sem markdown, sem backticks):
{
  "plano": [
    {
      "dia": "Segunda",
      "refeicoes": [
        {"tipo": "Café da manhã", "nome": "string", "calorias": number, "proteina": number, "carb": number, "gordura": number, "ingredientes": ["string"], "preparo": "string resumido"},
        {"tipo": "Almoço", ...},
        {"tipo": "Lanche", ...},
        {"tipo": "Jantar", ...}
      ]
    }
  ],
  "resumo": {"calorias_media": number, "proteina_media": number, "carb_media": number, "gordura_media": number},
  "lista_compras": ["string"],
  "custo_estimado": "string",
  "dicas": ["string"]
}

Regras:
- Receitas práticas (até 15 min), econômicas e saudáveis
- Varie os pratos ao longo da semana
- Inclua lista de compras completa
- Estime o custo semanal em reais
- 3 dicas personalizadas
- SOMENTE JSON${preferencesContext}`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        max_tokens: 16000,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: "Gere um plano semanal de refeições completo, personalizado e econômico. Retorne o JSON." },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Limite de requisições excedido. Tente novamente." }), {
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
      return new Response(JSON.stringify({ error: "Erro ao gerar plano" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "";

    let parsed;
    try {
      const cleanContent = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      parsed = JSON.parse(cleanContent);
    } catch {
      console.error("Failed to parse meal plan:", content);
      return new Response(JSON.stringify({ error: "Erro ao interpretar o plano" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("meal-plan error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Erro desconhecido" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
