import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Bot, Send, Sparkles, User } from "lucide-react";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type Msg = { role: "user" | "assistant"; content: string };

const AssistenteIA = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", content: "Olá! Sou seu assistente nutricional do Evolua+. Posso ajudar com dúvidas sobre alimentação, treino, receitas e hábitos saudáveis. O que você quer saber hoje?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const loadHistory = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("chat_messages")
      .select("role, content")
      .eq("user_id", user.id)
      .order("created_at", { ascending: true })
      .limit(30);
    if (data?.length) setMessages(data as Msg[]);
  };

  useEffect(() => { loadHistory(); /* eslint-disable-next-line */ }, [user]);

  const send = async () => {
    if (!input.trim() || loading || !user) return;
    const userMsg: Msg = { role: "user", content: input.trim() };
    const newMsgs = [...messages, userMsg];
    setMessages(newMsgs);
    setInput("");
    setLoading(true);

    try {
      const { data: pref } = await supabase
        .from("user_preferences")
        .select("objective, restrictions, disliked_foods")
        .eq("user_id", user.id)
        .maybeSingle();
      const { data: goals } = await supabase
        .from("user_goals")
        .select("calories_goal")
        .eq("user_id", user.id)
        .maybeSingle();

      const { data, error } = await supabase.functions.invoke("nutrition-chat", {
        body: {
          messages: newMsgs.slice(-10),
          profile: { ...pref, ...goals },
        },
      });
      if (error) throw error;
      const reply: Msg = { role: "assistant", content: data.reply };
      setMessages([...newMsgs, reply]);

      await supabase.from("chat_messages").insert([
        { user_id: user.id, role: "user", content: userMsg.content },
        { user_id: user.id, role: "assistant", content: reply.content },
      ]);
    } catch (e: any) {
      toast.error("Erro ao conversar com IA", { description: e.message });
    } finally {
      setLoading(false);
    }
  };

  const suggestions = [
    "Como aumentar minha proteína no dia?",
    "Receita rápida com frango",
    "Estou com fome à noite, o que fazer?",
    "Como quebrar o platô?",
  ];

  return (
    <main className="min-h-screen pt-24 pb-12 bg-background">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-3">
            <Sparkles className="w-3 h-3" /> Assistente Nutricional IA
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground">
            Converse com sua nutri virtual
          </h1>
          <p className="text-muted-foreground mt-2 text-sm">
            Tire dúvidas, peça receitas ou orientação personalizada baseada no seu perfil.
          </p>
        </div>

        <Card className="border-border/60 bg-card overflow-hidden flex flex-col h-[60vh]">
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((m, i) => (
              <div key={i} className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                  m.role === "user" ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground"
                }`}>
                  {m.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>
                <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                  m.role === "user" ? "bg-primary text-primary-foreground whitespace-pre-wrap" : "bg-secondary text-foreground"
                }`}>
                  {m.role === "assistant" ? (
                    <div className="prose prose-sm max-w-none dark:prose-invert prose-p:my-2 prose-headings:my-2 prose-ul:my-2 prose-ol:my-2 prose-li:my-0.5 prose-strong:text-foreground prose-a:text-primary">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>{m.content}</ReactMarkdown>
                    </div>
                  ) : (
                    m.content
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                  <Bot className="w-4 h-4 animate-pulse" />
                </div>
                <div className="bg-secondary rounded-2xl px-4 py-3 text-sm text-muted-foreground">
                  Pensando…
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-border p-3">
            {messages.length <= 1 && (
              <div className="flex gap-2 flex-wrap mb-3">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    onClick={() => setInput(s)}
                    className="text-xs px-3 py-1.5 rounded-full bg-secondary hover:bg-primary/10 hover:text-primary transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
                placeholder="Pergunte qualquer coisa sobre nutrição…"
                disabled={loading}
              />
              <Button onClick={send} disabled={loading || !input.trim()} size="icon">
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </main>
  );
};

export default AssistenteIA;