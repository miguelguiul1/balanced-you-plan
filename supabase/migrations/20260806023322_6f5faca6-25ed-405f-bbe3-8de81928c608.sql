CREATE POLICY "Users can delete own profile" ON public.profiles FOR DELETE TO authenticated USING (auth.uid() = id);
CREATE POLICY "Users delete own goals" ON public.user_goals FOR DELETE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own preferences" ON public.user_preferences FOR DELETE TO authenticated USING (auth.uid() = user_id);