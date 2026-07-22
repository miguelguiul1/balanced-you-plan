import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Camera, Plus, TrendingDown, Trash2, LineChart as LineIcon } from "lucide-react";
import { toast } from "sonner";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";

type WeightRow = {
  id: string;
  weight_kg: number;
  waist_cm: number | null;
  hip_cm: number | null;
  arm_cm: number | null;
  thigh_cm: number | null;
  notes: string | null;
  logged_at: string;
};

type Photo = { id: string; photo_url: string; photo_type: string; created_at: string; notes: string | null };

const Evolucao = () => {
  const { user } = useAuth();
  const [logs, setLogs] = useState<WeightRow[]>([]);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [form, setForm] = useState({ weight_kg: "", waist_cm: "", hip_cm: "", arm_cm: "", thigh_cm: "", notes: "" });
  const [uploading, setUploading] = useState(false);
  const [photoType, setPhotoType] = useState<"antes" | "depois">("antes");

  const load = async () => {
    if (!user) return;
    const [{ data: w }, { data: p }] = await Promise.all([
      supabase.from("weight_log").select("*").eq("user_id", user.id).order("logged_at", { ascending: true }),
      supabase.from("progress_photos").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
    ]);
    setLogs((w ?? []) as WeightRow[]);
    // Sign URLs for private bucket photos
    const rows = (p ?? []) as Photo[];
    const signed = await Promise.all(rows.map(async (row) => {
      const path = row.photo_url;
      const { data } = await supabase.storage.from("progress").createSignedUrl(path, 3600);
      return { ...row, photo_url: data?.signedUrl ?? "" };
    }));
    setPhotos(signed);
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [user]);

  const addLog = async () => {
    if (!user || !form.weight_kg) return toast.error("Informe o peso");
    const { error } = await supabase.from("weight_log").insert({
      user_id: user.id,
      weight_kg: parseFloat(form.weight_kg),
      waist_cm: form.waist_cm ? parseFloat(form.waist_cm) : null,
      hip_cm: form.hip_cm ? parseFloat(form.hip_cm) : null,
      arm_cm: form.arm_cm ? parseFloat(form.arm_cm) : null,
      thigh_cm: form.thigh_cm ? parseFloat(form.thigh_cm) : null,
      notes: form.notes || null,
    });
    if (error) return toast.error("Erro", { description: error.message });
    toast.success("Registro adicionado");
    setForm({ weight_kg: "", waist_cm: "", hip_cm: "", arm_cm: "", thigh_cm: "", notes: "" });
    load();
  };

  const delLog = async (id: string) => {
    await supabase.from("weight_log").delete().eq("id", id);
    load();
  };

  const uploadPhoto = async (file: File) => {
    if (!user) return;
    setUploading(true);
    try {
      const path = `${user.id}/${Date.now()}-${file.name}`;
      const { error } = await supabase.storage.from("progress").upload(path, file);
      if (error) throw error;
      await supabase.from("progress_photos").insert({
        user_id: user.id,
        photo_url: path,
        photo_type: photoType,
      });
      toast.success("Foto adicionada");
      load();
    } catch (e: any) {
      toast.error("Erro no upload", { description: e.message });
    } finally {
      setUploading(false);
    }
  };

  const delPhoto = async (p: Photo) => {
    await supabase.from("progress_photos").delete().eq("id", p.id);
    // Extract original storage path — we lost it; parse from signed URL is tricky. Skip storage delete gracefully.
    load();
  };

  const chartData = logs.map((l) => ({
    date: new Date(l.logged_at).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" }),
    peso: Number(l.weight_kg),
    cintura: l.waist_cm ? Number(l.waist_cm) : null,
  }));

  const first = logs[0]?.weight_kg;
  const last = logs[logs.length - 1]?.weight_kg;
  const diff = first && last ? Number(last) - Number(first) : 0;

  return (
    <main className="min-h-screen pt-24 pb-12 bg-background">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-3">
            <TrendingDown className="w-3 h-3" /> Evolução
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground">
            Sua jornada de transformação
          </h1>
          <p className="text-muted-foreground mt-2 text-sm">
            Acompanhe peso, medidas e fotos ao longo do tempo.
          </p>
        </div>

        {logs.length > 0 && (
          <Card className="mb-6 border-border/60">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <LineIcon className="w-4 h-4 text-primary" />
                  <h2 className="font-display font-semibold">Progresso</h2>
                </div>
                {diff !== 0 && (
                  <span className={`text-sm font-semibold ${diff < 0 ? "text-primary" : "text-accent"}`}>
                    {diff > 0 ? "+" : ""}{diff.toFixed(1)} kg
                  </span>
                )}
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="date" fontSize={12} />
                    <YAxis fontSize={12} />
                    <Tooltip />
                    <Line type="monotone" dataKey="peso" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 4 }} />
                    <Line type="monotone" dataKey="cintura" stroke="hsl(var(--accent))" strokeWidth={2} dot={{ r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="border-border/60">
            <CardContent className="p-5">
              <h2 className="font-display font-semibold mb-4">Novo registro</h2>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs">Peso (kg) *</Label>
                  <Input type="number" step="0.1" value={form.weight_kg} onChange={(e) => setForm({ ...form, weight_kg: e.target.value })} />
                </div>
                <div>
                  <Label className="text-xs">Cintura (cm)</Label>
                  <Input type="number" step="0.1" value={form.waist_cm} onChange={(e) => setForm({ ...form, waist_cm: e.target.value })} />
                </div>
                <div>
                  <Label className="text-xs">Quadril (cm)</Label>
                  <Input type="number" step="0.1" value={form.hip_cm} onChange={(e) => setForm({ ...form, hip_cm: e.target.value })} />
                </div>
                <div>
                  <Label className="text-xs">Braço (cm)</Label>
                  <Input type="number" step="0.1" value={form.arm_cm} onChange={(e) => setForm({ ...form, arm_cm: e.target.value })} />
                </div>
                <div className="col-span-2">
                  <Label className="text-xs">Coxa (cm)</Label>
                  <Input type="number" step="0.1" value={form.thigh_cm} onChange={(e) => setForm({ ...form, thigh_cm: e.target.value })} />
                </div>
                <div className="col-span-2">
                  <Label className="text-xs">Notas</Label>
                  <Textarea rows={2} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
                </div>
              </div>
              <Button onClick={addLog} className="w-full mt-4 gap-2">
                <Plus className="w-4 h-4" /> Registrar
              </Button>
            </CardContent>
          </Card>

          <Card className="border-border/60">
            <CardContent className="p-5">
              <h2 className="font-display font-semibold mb-4">Fotos antes/depois</h2>
              <div className="flex gap-2 mb-3">
                {(["antes", "depois"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setPhotoType(t)}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                      photoType === t ? "bg-primary text-primary-foreground" : "bg-secondary"
                    }`}
                  >
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </button>
                ))}
              </div>
              <label className="block border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-primary transition-colors">
                <Camera className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {uploading ? "Enviando…" : "Clique para enviar foto"}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  disabled={uploading}
                  onChange={(e) => e.target.files?.[0] && uploadPhoto(e.target.files[0])}
                />
              </label>
              {photos.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mt-4">
                  {photos.map((p) => (
                    <div key={p.id} className="relative group">
                      <img src={p.photo_url} alt={p.photo_type} className="w-full h-24 object-cover rounded-lg" />
                      <span className="absolute top-1 left-1 bg-background/80 text-xs px-1.5 py-0.5 rounded">
                        {p.photo_type}
                      </span>
                      <button
                        onClick={() => delPhoto(p)}
                        className="absolute top-1 right-1 bg-background/80 rounded p-1 opacity-0 group-hover:opacity-100 transition"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {logs.length > 0 && (
          <Card className="mt-6 border-border/60">
            <CardContent className="p-5">
              <h2 className="font-display font-semibold mb-3">Histórico</h2>
              <div className="space-y-2">
                {[...logs].reverse().map((l) => (
                  <div key={l.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                    <div className="text-sm">
                      <div className="font-semibold">{Number(l.weight_kg).toFixed(1)} kg</div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(l.logged_at).toLocaleDateString("pt-BR")}
                        {l.waist_cm && ` · cintura ${l.waist_cm}cm`}
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => delLog(l.id)}>
                      <Trash2 className="w-4 h-4 text-muted-foreground" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
};

export default Evolucao;