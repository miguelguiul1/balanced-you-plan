-- Tabela para favoritos globais (receitas, artigos, respostas da IA, planos).
-- Alimentos favoritos já possuem sua própria tabela (food_favorites).
CREATE TABLE public.global_favorites (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  category TEXT NOT NULL CHECK (category IN ('receita', 'alimento', 'artigo', 'ia', 'plano')),
  item_id TEXT NOT NULL,
  title TEXT NOT NULL,
  subtitle TEXT,
  route TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Evita duplicação: um item só pode ser favoritado uma vez por usuário.
CREATE UNIQUE INDEX global_favorites_user_item_idx ON public.global_favorites (user_id, category, item_id);
CREATE INDEX global_favorites_user_idx ON public.global_favorites (user_id, created_at DESC);

GRANT SELECT, INSERT, DELETE ON public.global_favorites TO authenticated;
GRANT ALL ON public.global_favorites TO service_role;

ALTER TABLE public.global_favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own global favorites"
  ON public.global_favorites FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
