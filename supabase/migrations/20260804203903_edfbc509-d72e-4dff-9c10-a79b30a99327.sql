ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS height_cm numeric;

ALTER TABLE public.weight_log
  ADD COLUMN IF NOT EXISTS chest_cm numeric,
  ADD COLUMN IF NOT EXISTS neck_cm numeric,
  ADD COLUMN IF NOT EXISTS body_fat_pct numeric,
  ADD COLUMN IF NOT EXISTS height_cm numeric,
  ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();

ALTER TABLE public.progress_photos
  ADD COLUMN IF NOT EXISTS weight_log_id uuid REFERENCES public.weight_log(id) ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS progress_photos_weight_log_id_idx ON public.progress_photos(weight_log_id);

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

DROP TRIGGER IF EXISTS update_weight_log_updated_at ON public.weight_log;
CREATE TRIGGER update_weight_log_updated_at
BEFORE UPDATE ON public.weight_log
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

GRANT SELECT, INSERT, UPDATE, DELETE ON public.weight_log TO authenticated;
GRANT ALL ON public.weight_log TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.progress_photos TO authenticated;
GRANT ALL ON public.progress_photos TO service_role;
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;