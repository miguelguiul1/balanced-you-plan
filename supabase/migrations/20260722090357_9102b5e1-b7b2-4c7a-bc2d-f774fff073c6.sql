
-- water_log: registro de hidratação
CREATE TABLE public.water_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  amount_ml integer NOT NULL CHECK (amount_ml > 0),
  logged_at date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.water_log TO authenticated;
GRANT ALL ON public.water_log TO service_role;
ALTER TABLE public.water_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own water" ON public.water_log FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users insert own water" ON public.water_log FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own water" ON public.water_log FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users delete own water" ON public.water_log FOR DELETE TO authenticated USING (auth.uid() = user_id);
CREATE INDEX water_log_user_date_idx ON public.water_log(user_id, logged_at DESC);

-- user_goals: metas diárias e alvo de peso
CREATE TABLE public.user_goals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  calories_goal integer NOT NULL DEFAULT 2000,
  water_goal_ml integer NOT NULL DEFAULT 2500,
  protein_goal integer NOT NULL DEFAULT 100,
  target_weight numeric,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_goals TO authenticated;
GRANT ALL ON public.user_goals TO service_role;
ALTER TABLE public.user_goals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own goals" ON public.user_goals FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users insert own goals" ON public.user_goals FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own goals" ON public.user_goals FOR UPDATE TO authenticated USING (auth.uid() = user_id);
