CREATE TABLE public.food_favorites (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  food_name text NOT NULL,
  emoji text,
  category text,
  portion_g numeric NOT NULL DEFAULT 100,
  calories numeric NOT NULL DEFAULT 0,
  protein numeric NOT NULL DEFAULT 0,
  carbs numeric NOT NULL DEFAULT 0,
  fat numeric NOT NULL DEFAULT 0,
  fiber numeric NOT NULL DEFAULT 0,
  sodium_mg numeric DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE (user_id, food_name)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.food_favorites TO authenticated;
GRANT ALL ON public.food_favorites TO service_role;

ALTER TABLE public.food_favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own favorites" ON public.food_favorites FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users insert own favorites" ON public.food_favorites FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own favorites" ON public.food_favorites FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users delete own favorites" ON public.food_favorites FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE TRIGGER update_food_favorites_updated_at
BEFORE UPDATE ON public.food_favorites
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();