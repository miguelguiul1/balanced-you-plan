/**
 * Validação numérica compartilhada (Pré-Beta 02.1).
 * Espelha as travas de integridade aplicadas no banco de dados.
 */

export type Range = { min: number; max: number; label: string };

export const RANGES = {
  peso: { min: 2, max: 600, label: "Peso deve estar entre 2 e 600 kg" },
  altura: { min: 30, max: 280, label: "Altura deve estar entre 30 e 280 cm" },
  idade: { min: 5, max: 120, label: "Idade deve estar entre 5 e 120 anos" },
  medida: { min: 5, max: 300, label: "Medida deve estar entre 5 e 300 cm" },
  gordura: { min: 1, max: 80, label: "Gordura corporal deve estar entre 1% e 80%" },
  porcao: { min: 0.1, max: 5000, label: "Quantidade deve estar entre 0,1 e 5000 g/ml" },
  agua: { min: 1, max: 5000, label: "Quantidade de água deve estar entre 1 e 5000 ml" },
  calorias: { min: 0, max: 20000, label: "Calorias devem estar entre 0 e 20000 kcal" },
  macro: { min: 0, max: 5000, label: "Macronutriente deve estar entre 0 e 5000 g" },
  sodio: { min: 0, max: 100000, label: "Sódio deve estar entre 0 e 100000 mg" },
  metaCalorias: { min: 500, max: 10000, label: "Meta de calorias deve estar entre 500 e 10000" },
  metaAgua: { min: 250, max: 10000, label: "Meta de água deve estar entre 250 e 10000 ml" },
  metaProteina: { min: 10, max: 500, label: "Meta de proteína deve estar entre 10 e 500 g" },
} satisfies Record<string, Range>;

/** Converte texto em número finito, aceitando vírgula decimal. Retorna null se inválido. */
export const parseNum = (v: unknown): number | null => {
  if (typeof v === "number") return Number.isFinite(v) ? v : null;
  if (typeof v !== "string") return null;
  const cleaned = v.trim().replace(",", ".");
  if (!/^-?\d*\.?\d+$/.test(cleaned)) return null;
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : null;
};

/** Valida um número dentro de um intervalo. Retorna mensagem de erro ou null. */
export const checkRange = (v: unknown, range: Range, required = true): string | null => {
  const n = parseNum(v);
  if (n === null) return required ? "Informe um número válido" : null;
  if (n < range.min || n > range.max) return range.label;
  return null;
};

/** Valida campo opcional: vazio é permitido. */
export const checkOptional = (v: string, range: Range): string | null => {
  if (!v || !v.trim()) return null;
  return checkRange(v, range);
};

/** Retorna a primeira mensagem de erro de uma lista de validações. */
export const firstError = (errors: (string | null)[]): string | null =>
  errors.find((e): e is string => Boolean(e)) ?? null;

/** Código de barras: EAN-8/12/13/14 ou UPC — apenas dígitos, 8 a 14 posições. */
export const normalizeBarcode = (raw: string): string | null => {
  const clean = (raw || "").replace(/\D/g, "");
  if (clean.length < 8 || clean.length > 14) return null;
  return clean;
};

/** Texto livre: exige conteúdo e limita tamanho. */
export const checkText = (v: string, label: string, max: number): string | null => {
  const t = (v || "").trim();
  if (!t) return `Informe ${label}`;
  if (t.length > max) return `${label} deve ter no máximo ${max} caracteres`;
  return null;
};
