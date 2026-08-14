-- 1) Remover privilégios residuais do papel anon nas tabelas públicas
DO $$
DECLARE t text;
BEGIN
  FOR t IN
    SELECT c.relname FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE n.nspname = 'public' AND c.relkind = 'r'
  LOOP
    EXECUTE format('REVOKE ALL ON public.%I FROM anon', t);
    EXECUTE format('GRANT SELECT, INSERT, UPDATE, DELETE ON public.%I TO authenticated', t);
    EXECUTE format('GRANT ALL ON public.%I TO service_role', t);
  END LOOP;
END $$;

ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE ALL ON TABLES FROM anon;

-- 2) Validações de integridade no banco (triggers, não CHECK, para evoluir com segurança)

CREATE OR REPLACE FUNCTION public.validate_weight_log()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  IF NEW.weight_kg IS NULL OR NEW.weight_kg < 2 OR NEW.weight_kg > 600 THEN
    RAISE EXCEPTION 'Peso invalido: informe um valor entre 2 e 600 kg';
  END IF;
  IF NEW.height_cm IS NOT NULL AND (NEW.height_cm < 30 OR NEW.height_cm > 280) THEN
    RAISE EXCEPTION 'Altura invalida: informe um valor entre 30 e 280 cm';
  END IF;
  IF NEW.body_fat_pct IS NOT NULL AND (NEW.body_fat_pct < 1 OR NEW.body_fat_pct > 80) THEN
    RAISE EXCEPTION 'Percentual de gordura invalido: informe entre 1 e 80';
  END IF;
  IF (NEW.waist_cm IS NOT NULL AND (NEW.waist_cm < 5 OR NEW.waist_cm > 300))
    OR (NEW.hip_cm IS NOT NULL AND (NEW.hip_cm < 5 OR NEW.hip_cm > 300))
    OR (NEW.arm_cm IS NOT NULL AND (NEW.arm_cm < 5 OR NEW.arm_cm > 300))
    OR (NEW.thigh_cm IS NOT NULL AND (NEW.thigh_cm < 5 OR NEW.thigh_cm > 300))
    OR (NEW.chest_cm IS NOT NULL AND (NEW.chest_cm < 5 OR NEW.chest_cm > 300))
    OR (NEW.neck_cm IS NOT NULL AND (NEW.neck_cm < 5 OR NEW.neck_cm > 300)) THEN
    RAISE EXCEPTION 'Medida corporal invalida: informe valores entre 5 e 300 cm';
  END IF;
  RETURN NEW;
END $$;

DROP TRIGGER IF EXISTS validate_weight_log_trg ON public.weight_log;
CREATE TRIGGER validate_weight_log_trg
BEFORE INSERT OR UPDATE ON public.weight_log
FOR EACH ROW EXECUTE FUNCTION public.validate_weight_log();

CREATE OR REPLACE FUNCTION public.validate_water_log()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  IF NEW.amount_ml IS NULL OR NEW.amount_ml < 1 OR NEW.amount_ml > 5000 THEN
    RAISE EXCEPTION 'Quantidade de agua invalida: informe entre 1 e 5000 ml';
  END IF;
  RETURN NEW;
END $$;

DROP TRIGGER IF EXISTS validate_water_log_trg ON public.water_log;
CREATE TRIGGER validate_water_log_trg
BEFORE INSERT OR UPDATE ON public.water_log
FOR EACH ROW EXECUTE FUNCTION public.validate_water_log();

CREATE OR REPLACE FUNCTION public.validate_food_log()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  NEW.food_name := btrim(NEW.food_name);
  NEW.quantity := btrim(NEW.quantity);
  IF NEW.food_name = '' OR length(NEW.food_name) > 200 THEN
    RAISE EXCEPTION 'Nome do alimento invalido';
  END IF;
  IF NEW.quantity = '' OR length(NEW.quantity) > 60 THEN
    RAISE EXCEPTION 'Quantidade invalida';
  END IF;
  IF COALESCE(NEW.calories,0) < 0 OR COALESCE(NEW.calories,0) > 20000
    OR COALESCE(NEW.protein,0) < 0 OR COALESCE(NEW.protein,0) > 5000
    OR COALESCE(NEW.carbs,0) < 0 OR COALESCE(NEW.carbs,0) > 5000
    OR COALESCE(NEW.fat,0) < 0 OR COALESCE(NEW.fat,0) > 5000
    OR COALESCE(NEW.fiber,0) < 0 OR COALESCE(NEW.fiber,0) > 5000 THEN
    RAISE EXCEPTION 'Valores nutricionais fora do intervalo permitido';
  END IF;
  RETURN NEW;
END $$;

DROP TRIGGER IF EXISTS validate_food_log_trg ON public.food_log;
CREATE TRIGGER validate_food_log_trg
BEFORE INSERT OR UPDATE ON public.food_log
FOR EACH ROW EXECUTE FUNCTION public.validate_food_log();

CREATE OR REPLACE FUNCTION public.validate_food_favorites()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  NEW.food_name := btrim(NEW.food_name);
  IF NEW.food_name = '' OR length(NEW.food_name) > 200 THEN
    RAISE EXCEPTION 'Nome do alimento invalido';
  END IF;
  IF NEW.portion_g IS NULL OR NEW.portion_g <= 0 OR NEW.portion_g > 5000 THEN
    RAISE EXCEPTION 'Porcao invalida: informe entre 0.1 e 5000 g';
  END IF;
  IF NEW.calories < 0 OR NEW.calories > 20000
    OR NEW.protein < 0 OR NEW.protein > 5000
    OR NEW.carbs < 0 OR NEW.carbs > 5000
    OR NEW.fat < 0 OR NEW.fat > 5000
    OR NEW.fiber < 0 OR NEW.fiber > 5000
    OR COALESCE(NEW.sodium_mg,0) < 0 OR COALESCE(NEW.sodium_mg,0) > 100000 THEN
    RAISE EXCEPTION 'Valores nutricionais fora do intervalo permitido';
  END IF;
  RETURN NEW;
END $$;

DROP TRIGGER IF EXISTS validate_food_favorites_trg ON public.food_favorites;
CREATE TRIGGER validate_food_favorites_trg
BEFORE INSERT OR UPDATE ON public.food_favorites
FOR EACH ROW EXECUTE FUNCTION public.validate_food_favorites();

CREATE OR REPLACE FUNCTION public.validate_user_goals()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  IF NEW.calories_goal < 500 OR NEW.calories_goal > 10000 THEN
    RAISE EXCEPTION 'Meta de calorias invalida: informe entre 500 e 10000';
  END IF;
  IF NEW.water_goal_ml < 250 OR NEW.water_goal_ml > 10000 THEN
    RAISE EXCEPTION 'Meta de agua invalida: informe entre 250 e 10000 ml';
  END IF;
  IF NEW.protein_goal < 10 OR NEW.protein_goal > 500 THEN
    RAISE EXCEPTION 'Meta de proteina invalida: informe entre 10 e 500 g';
  END IF;
  IF NEW.target_weight IS NOT NULL AND (NEW.target_weight < 2 OR NEW.target_weight > 600) THEN
    RAISE EXCEPTION 'Peso alvo invalido: informe entre 2 e 600 kg';
  END IF;
  RETURN NEW;
END $$;

DROP TRIGGER IF EXISTS validate_user_goals_trg ON public.user_goals;
CREATE TRIGGER validate_user_goals_trg
BEFORE INSERT OR UPDATE ON public.user_goals
FOR EACH ROW EXECUTE FUNCTION public.validate_user_goals();

CREATE OR REPLACE FUNCTION public.validate_profiles()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  IF NEW.height_cm IS NOT NULL AND (NEW.height_cm < 30 OR NEW.height_cm > 280) THEN
    RAISE EXCEPTION 'Altura invalida: informe um valor entre 30 e 280 cm';
  END IF;
  RETURN NEW;
END $$;

DROP TRIGGER IF EXISTS validate_profiles_trg ON public.profiles;
CREATE TRIGGER validate_profiles_trg
BEFORE INSERT OR UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.validate_profiles();