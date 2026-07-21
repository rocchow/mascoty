-- Persist the exact prompt string sent to the image model so we can A/B
-- tune the character-sheet template without losing the ability to
-- reproduce older generations after buildCharacterSheetPrompt() changes.

ALTER TABLE public.free_trial_generations
  ADD COLUMN prompt TEXT,
  ADD COLUMN model TEXT,
  ADD COLUMN quality TEXT;
