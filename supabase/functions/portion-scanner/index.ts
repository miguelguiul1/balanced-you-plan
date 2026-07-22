import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { imageBase64 } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY não configurado");

    const systemPrompt = `Você é um nutricionista analisando a foto de um prato/porção. Retorne APENAS JSON válido (sem markdown):
{
  "prato": "string breve descrevendo o prato",
  "porcao_estimada": "string ex: 250g, 1 prato médio",
  "calorias_totais": number,
  "itens": [{"alimento":"string","quantidade":"string","calorias":number,"proteina":number,"carb":number,"gordura":number}],
  "avaliacao": "string curta sobre valor nutricional",
  "dica": "string curta com uma sugestão prática"
}
Seja realista nas quantidades. Sem texto extra fora do JSON.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          {
            role: "user",
            content: [
              { type: "text", text: "Analise esta porção e retorne o JSON." },
              { type: "image_url", image_url: { url: imageBase64 } },
            ],
          },
        ],
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return new Response(JSON.stringify({ error: "Erro na análise", details: errorText }), {
        status: response.status,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    let raw = data.choices?.[0]?.message?.content ?? "";
    raw = raw.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(raw);
    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("portion-scanner error:", err);
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});