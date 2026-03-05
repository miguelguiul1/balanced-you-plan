CREATE POLICY "Users can delete own scans" ON public.scan_history
  FOR DELETE TO authenticated USING (auth.uid() = user_id);