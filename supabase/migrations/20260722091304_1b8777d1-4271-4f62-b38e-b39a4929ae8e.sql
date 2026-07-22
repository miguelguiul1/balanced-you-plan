
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_premium BOOLEAN NOT NULL DEFAULT false;

CREATE TABLE public.weight_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  weight_kg NUMERIC(5,2) NOT NULL,
  waist_cm NUMERIC(5,2),
  hip_cm NUMERIC(5,2),
  arm_cm NUMERIC(5,2),
  thigh_cm NUMERIC(5,2),
  notes TEXT,
  logged_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.weight_log TO authenticated;
GRANT ALL ON public.weight_log TO service_role;
ALTER TABLE public.weight_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own weight_log" ON public.weight_log FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE public.progress_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  photo_url TEXT NOT NULL,
  photo_type TEXT NOT NULL DEFAULT 'antes',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.progress_photos TO authenticated;
GRANT ALL ON public.progress_photos TO service_role;
ALTER TABLE public.progress_photos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own progress_photos" ON public.progress_photos FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE public.chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.chat_messages TO authenticated;
GRANT ALL ON public.chat_messages TO service_role;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own chat_messages" ON public.chat_messages FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "own read progress" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'progress' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "own upload progress" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'progress' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "own delete progress" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'progress' AND auth.uid()::text = (storage.foldername(name))[1]);
