ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS age integer,
  ADD COLUMN IF NOT EXISTS sex text,
  ADD COLUMN IF NOT EXISTS activity_level text,
  ADD COLUMN IF NOT EXISTS sports text[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS onboarding_completed boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS onboarding_completed_at timestamptz;

ALTER TABLE public.user_goals
  ADD COLUMN IF NOT EXISTS bmr integer,
  ADD COLUMN IF NOT EXISTS tdee integer,
  ADD COLUMN IF NOT EXISTS carbs_goal integer,
  ADD COLUMN IF NOT EXISTS fat_goal integer;

CREATE OR REPLACE FUNCTION public.validate_profiles()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
BEGIN
  IF NEW.height_cm IS NOT NULL AND (NEW.height_cm < 30 OR NEW.height_cm > 280) THEN
    RAISE EXCEPTION 'Altura invalida: informe um valor entre 30 e 280 cm';
  END IF;
  IF NEW.age IS NOT NULL AND (NEW.age < 5 OR NEW.age > 120) THEN
    RAISE EXCEPTION 'Idade invalida: informe um valor entre 5 e 120 anos';
  END IF;
  IF NEW.sex IS NOT NULL AND NEW.sex NOT IN ('masculino','feminino') THEN
    RAISE EXCEPTION 'Sexo invalido';
  END IF;
  IF NEW.activity_level IS NOT NULL AND NEW.activity_level NOT IN ('sedentario','leve','moderado','intenso','muito_intenso') THEN
    RAISE EXCEPTION 'Nivel de atividade invalido';
  END IF;
  IF array_length(NEW.sports, 1) IS NOT NULL AND array_length(NEW.sports, 1) > 20 THEN
    RAISE EXCEPTION 'Muitos esportes selecionados';
  END IF;
  RETURN NEW;
END $function$;

-- Usuários existentes já configurados não devem passar pelo onboarding
UPDATE public.profiles p
SET onboarding_completed = true,
    onboarding_completed_at = COALESCE(p.onboarding_completed_at, now())
WHERE p.onboarding_completed = false
  AND EXISTS (
    SELECT 1 FROM public.user_preferences up
    WHERE up.user_id = p.id AND COALESCE(btrim(up.objective), '') <> ''
  );