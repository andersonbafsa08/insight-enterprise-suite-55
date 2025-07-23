-- Corrigir a função update_programacoes_updated_at para definir search_path
CREATE OR REPLACE FUNCTION public.update_programacoes_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;