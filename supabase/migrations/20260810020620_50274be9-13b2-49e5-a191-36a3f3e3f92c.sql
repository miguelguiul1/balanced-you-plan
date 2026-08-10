
DELETE FROM public.user_goals g WHERE NOT EXISTS (SELECT 1 FROM auth.users u WHERE u.id = g.user_id);
DELETE FROM public.water_log w WHERE NOT EXISTS (SELECT 1 FROM auth.users u WHERE u.id = w.user_id);

ALTER TABLE public.user_goals
  ADD CONSTRAINT user_goals_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE public.water_log
  ADD CONSTRAINT water_log_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS idx_food_log_user_date ON public.food_log (user_id, logged_at DESC);
CREATE INDEX IF NOT EXISTS idx_water_log_user_date ON public.water_log (user_id, logged_at DESC);
CREATE INDEX IF NOT EXISTS idx_weight_log_user_date ON public.weight_log (user_id, logged_at DESC);
CREATE INDEX IF NOT EXISTS idx_scan_history_user_created ON public.scan_history (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_chat_messages_user_created ON public.chat_messages (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_progress_photos_user ON public.progress_photos (user_id, weight_log_id);
CREATE INDEX IF NOT EXISTS idx_food_favorites_user ON public.food_favorites (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_insights_user_status ON public.ai_insights (user_id, status);
CREATE INDEX IF NOT EXISTS idx_ai_memory_user_active ON public.ai_memory (user_id, active);
