-- Create game saves table to store player progress
CREATE TABLE public.game_saves (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  player_name text NOT NULL,
  current_level integer NOT NULL DEFAULT 1,
  total_stars integer NOT NULL DEFAULT 0,
  total_moves integer NOT NULL DEFAULT 0,
  levels_completed integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(player_name)
);

-- Create level scores table to track individual level performance
CREATE TABLE public.level_scores (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  player_name text NOT NULL,
  level integer NOT NULL,
  moves integer NOT NULL,
  stars integer NOT NULL,
  bottle_count integer NOT NULL,
  completed_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(player_name, level)
);

-- Enable Row Level Security
ALTER TABLE public.game_saves ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.level_scores ENABLE ROW LEVEL SECURITY;

-- Create policies for game_saves (public access for this game)
CREATE POLICY "Anyone can view game saves"
ON public.game_saves
FOR SELECT
USING (true);

CREATE POLICY "Anyone can insert game saves"
ON public.game_saves
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anyone can update game saves"
ON public.game_saves
FOR UPDATE
USING (true);

-- Create policies for level_scores (public access for this game)
CREATE POLICY "Anyone can view level scores"
ON public.level_scores
FOR SELECT
USING (true);

CREATE POLICY "Anyone can insert level scores"
ON public.level_scores
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anyone can update level scores"
ON public.level_scores
FOR UPDATE
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_game_saves_updated_at
  BEFORE UPDATE ON public.game_saves
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();