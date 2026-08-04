export type WeightRow = {
  id: string;
  weight_kg: number;
  height_cm: number | null;
  waist_cm: number | null;
  hip_cm: number | null;
  arm_cm: number | null;
  thigh_cm: number | null;
  chest_cm: number | null;
  neck_cm: number | null;
  body_fat_pct: number | null;
  notes: string | null;
  logged_at: string;
};

export type PhotoRow = {
  id: string;
  weight_log_id: string | null;
  photo_type: string;
  photo_url: string;
  created_at: string;
};

export const PHOTO_TYPES = [
  { key: "frente", label: "Frente" },
  { key: "lado", label: "Lado" },
  { key: "costas", label: "Costas" },
] as const;

export const MEASURES = [
  { key: "waist_cm", label: "Cintura" },
  { key: "arm_cm", label: "Braço" },
  { key: "hip_cm", label: "Quadril" },
  { key: "thigh_cm", label: "Coxa" },
  { key: "chest_cm", label: "Peitoral" },
  { key: "neck_cm", label: "Pescoço" },
] as const;

export const fmtDate = (d: string) =>
  new Date(d).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "2-digit" });