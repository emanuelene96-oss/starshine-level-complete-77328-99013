-- Add columns to game_saves to store in-progress level state
ALTER TABLE public.game_saves
ADD COLUMN IF NOT EXISTS level_in_progress jsonb DEFAULT NULL,
ADD COLUMN IF NOT EXISTS hints_remaining integer DEFAULT 3;

COMMENT ON COLUMN public.game_saves.level_in_progress IS 'Stores the current state of an in-progress level including visible bottles, target, moves, matches';
COMMENT ON COLUMN public.game_saves.hints_remaining IS 'Number of hints remaining for the player';