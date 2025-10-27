-- Fix function search path security issue by recreating with proper settings
DROP TRIGGER IF EXISTS update_overlays_updated_at ON public.overlays;
DROP TRIGGER IF EXISTS update_livestream_settings_updated_at ON public.livestream_settings;
DROP FUNCTION IF EXISTS update_updated_at_column();

-- Recreate function with proper search_path
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Recreate triggers
CREATE TRIGGER update_overlays_updated_at
  BEFORE UPDATE ON public.overlays
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_livestream_settings_updated_at
  BEFORE UPDATE ON public.livestream_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();