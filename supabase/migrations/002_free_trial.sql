-- Anonymous free-trial character-sheet generations
-- No user_id: signup-free flow gated by a per-IP daily cap and a global hourly safety-valve.

CREATE TABLE public.free_trial_generations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  share_slug TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL,
  ip_hash TEXT,
  url TEXT,
  name TEXT NOT NULL,
  role TEXT,
  personality TEXT,
  species TEXT,
  description TEXT,
  style TEXT NOT NULL,
  colors JSONB,
  gallery_opt_in BOOLEAN NOT NULL DEFAULT FALSE,
  image_url TEXT,
  image_path TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  error TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ,
  email_sent_at TIMESTAMPTZ
);

CREATE INDEX idx_free_trial_created_at ON public.free_trial_generations(created_at DESC);
CREATE INDEX idx_free_trial_ip_hash ON public.free_trial_generations(ip_hash, created_at DESC)
  WHERE ip_hash IS NOT NULL;
CREATE INDEX idx_free_trial_gallery ON public.free_trial_generations(created_at DESC)
  WHERE gallery_opt_in = TRUE AND status = 'completed';

ALTER TABLE public.free_trial_generations ENABLE ROW LEVEL SECURITY;
-- No policies: all access goes through the service-role admin client.

-- Reserve a generation slot atomically.
-- Enforces:
--   1. per-IP: 1 completed/pending generation per 24 hours
--   2. global: 30 generations per rolling hour (safety valve)
-- Returns JSONB { id: uuid | null, reason: 'ok' | 'ip_daily_limit' | 'global_hourly_limit' }
CREATE OR REPLACE FUNCTION public.reserve_free_trial_slot(
  p_share_slug TEXT,
  p_email TEXT,
  p_ip_hash TEXT,
  p_url TEXT,
  p_name TEXT,
  p_role TEXT,
  p_personality TEXT,
  p_species TEXT,
  p_description TEXT,
  p_style TEXT,
  p_colors JSONB,
  p_gallery_opt_in BOOLEAN
) RETURNS JSONB AS $$
DECLARE
  new_id UUID;
  ip_slots INTEGER;
  global_slots INTEGER;
BEGIN
  PERFORM pg_advisory_xact_lock(hashtext('mascoty_free_trial_slot'));

  -- Per-IP daily cap.
  IF p_ip_hash IS NOT NULL AND length(p_ip_hash) > 0 THEN
    SELECT COUNT(*) INTO ip_slots
    FROM public.free_trial_generations
    WHERE ip_hash = p_ip_hash
      AND created_at > now() - interval '1 day'
      AND status <> 'failed';

    IF ip_slots >= 1 THEN
      RETURN jsonb_build_object('id', NULL, 'reason', 'ip_daily_limit');
    END IF;
  END IF;

  -- Global hourly safety valve.
  SELECT COUNT(*) INTO global_slots
  FROM public.free_trial_generations
  WHERE created_at > now() - interval '1 hour';

  IF global_slots >= 30 THEN
    RETURN jsonb_build_object('id', NULL, 'reason', 'global_hourly_limit');
  END IF;

  INSERT INTO public.free_trial_generations (
    share_slug, email, ip_hash, url, name, role, personality, species,
    description, style, colors, gallery_opt_in
  ) VALUES (
    p_share_slug, p_email, p_ip_hash, p_url, p_name, p_role, p_personality,
    p_species, p_description, p_style, p_colors, p_gallery_opt_in
  ) RETURNING id INTO new_id;

  RETURN jsonb_build_object('id', new_id, 'reason', 'ok');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
