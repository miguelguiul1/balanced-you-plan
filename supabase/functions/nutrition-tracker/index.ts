import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { action, foodName, quantity, dailyLog, preferences } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    let systemPrompt = "";
    let userPrompt = "";

    if (action === "estimate") {
      // Estimate nutritional info for a food item
      systemPrompt = `Você é um nutricionista brasileiro. Estime os valores nutricionais do alimento informado. Retorne APENAS JSON (sem markdown):
{"calories": number, "protein": number, "carbs": number, "fat": number, "fiber": number}
Valores devem ser para a quantidade especificada. Seja preciso baseando-se em tabelas nutricionais brasileiras (TACO/IBGE).`;
      userPrompt = `Alimento: ${foodName}, Quantidade: ${quantity}`;
    } else if (action === "analyze") {
      // Analyze daily consumption
      let prefContext = "";
      if (preferences?.objective) prefContext = `\nObjetivo do usuário: ${preferences.objective}`;
      
      systemPrompt = `Você é um nutricionista brasileiro especialista. Analise o consumo alimentar diário e retorne APENAS JSON (sem markdown):
{
  "resumo": {"calorias_total": number, "proteina_total": number, "carb_total": number, "gordura_total": number, "fibra_total": number},
  "meta_sugerida": {"calorias": number, "proteina": number, "carbs": number, "gordura": number, "fibra": number},
  "pontuacao": number,
  "status": "excelente" | "bom" | "regular" | "precisa_melhorar",
  "excessos": ["string"],
  "deficiencias": ["string"],
  "sugestoes": ["string"],
  "proximo_passo": "string"
}
- pontuacao de 0 a 100
- Compare com metas baseadas no objetivo do usuário
- Sugira ajustes práticos e específicos
- Identifique excessos e deficiências de macro/micronutrientes${prefContext}`;
      userPrompt = `Registro alimentar do dia:\n${JSON.stringify(dailyLog)}`;
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Limite de requisições excedido." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Créditos de IA esgotados." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI error:", response.status, t);
      return new Response(JSON.stringify({ error: "Erro ao processar" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "";

    let parsed;
    try {
      const clean = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      parsed = JSON.parse(clean);
    } catch {
      console.error("Parse error:", content);
      return new Response(JSON.stringify({ error: "Erro ao interpretar resposta" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("nutrition-tracker error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Erro desconhecido" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
