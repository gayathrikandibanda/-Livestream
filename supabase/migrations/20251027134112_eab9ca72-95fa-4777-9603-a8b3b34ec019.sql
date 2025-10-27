-- Create overlays table to store custom overlay settings
CREATE TABLE public.overlays (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('text', 'logo', 'image')),
  content TEXT,
  image_url TEXT,
  position_x FLOAT NOT NULL DEFAULT 0,
  position_y FLOAT NOT NULL DEFAULT 0,
  width FLOAT NOT NULL DEFAULT 100,
  height FLOAT NOT NULL DEFAULT 100,
  font_size INTEGER DEFAULT 16,
  color TEXT DEFAULT '#000000',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create settings table for livestream configuration
CREATE TABLE public.livestream_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  rtsp_url TEXT NOT NULL,
  stream_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE public.overlays ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.livestream_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for overlays
CREATE POLICY "Users can view their own overlays"
  ON public.overlays FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own overlays"
  ON public.overlays FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own overlays"
  ON public.overlays FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own overlays"
  ON public.overlays FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for livestream_settings
CREATE POLICY "Users can view their own settings"
  ON public.livestream_settings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own settings"
  ON public.livestream_settings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own settings"
  ON public.livestream_settings FOR UPDATE
  USING (auth.uid() = user_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at
CREATE TRIGGER update_overlays_updated_at
  BEFORE UPDATE ON public.overlays
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_livestream_settings_updated_at
  BEFORE UPDATE ON public.livestream_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();