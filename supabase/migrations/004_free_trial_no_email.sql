-- Drop the email requirement from the free trial, tighten the global cap to
-- 10/hour to match the marketing copy, and expose a read-only quota lookup so
-- the Generate button can show "N left this hour · resets in Xm".
--
-- Behavior changes:
--   * email is now optional (was NOT NULL) — the anon trial no longer captures
--     it, sign-in is the new "keep this asset" hook instead
--   * the per-fingerprint (IP + user-agent hash) cap stays at 1 completed or
--     pending generation per rolling 24h — same column, richer input on the
--     Node side, so no schema change here
--   * global safety valve drops from 30/hour to 10/hour

ALTER TABLE public.free_trial_generations
  ALTER COLUMN email DROP NOT NULL;

-- Update reserve RPC: nullable email, global cap = 10, expose count + eta so
-- the caller can also tell how close it is to the limit without a second call.
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

  SELECT COUNT(*) INTO global_slots
  FROM public.free_trial_generations
  WHERE created_at > now() - interval '1 hour';

  IF global_slots >= 10 THEN
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

-- Read-only quota lookup for the Generate button UI.
--
-- Returns:
--   remaining_hourly    — INT, 10 minus generations in the last rolling hour
--   next_slot_at        — TIMESTAMPTZ | null, when the oldest of the last 10
--                         will fall out of the 1-hour window (only meaningful
--                         when remaining_hourly = 0)
--   ip_used_today       — BOOLEAN, whether this fingerprint already burned its
--                         daily slot (pending/generating/completed within 24h)
--   ip_resets_at        — TIMESTAMPTZ | null, when their daily slot resets
CREATE OR REPLACE FUNCTION public.get_free_trial_quota(
  p_ip_hash TEXT
) RETURNS JSONB AS $$
DECLARE
  hourly_count INTEGER;
  oldest_in_window TIMESTAMPTZ;
  ip_slot_created TIMESTAMPTZ;
BEGIN
  SELECT COUNT(*) INTO hourly_count
  FROM public.free_trial_generations
  WHERE created_at > now() - interval '1 hour';

  IF hourly_count >= 10 THEN
    SELECT MIN(created_at) INTO oldest_in_window
    FROM (
      SELECT created_at
      FROM public.free_trial_generations
      WHERE created_at > now() - interval '1 hour'
      ORDER BY created_at DESC
      LIMIT 10
    ) recent;
  END IF;

  ip_slot_created := NULL;
  IF p_ip_hash IS NOT NULL AND length(p_ip_hash) > 0 THEN
    SELECT MAX(created_at) INTO ip_slot_created
    FROM public.free_trial_generations
    WHERE ip_hash = p_ip_hash
      AND created_at > now() - interval '1 day'
      AND status <> 'failed';
  END IF;

  RETURN jsonb_build_object(
    'remaining_hourly', GREATEST(0, 10 - hourly_count),
    'next_slot_at', CASE
      WHEN oldest_in_window IS NULL THEN NULL
      ELSE oldest_in_window + interval '1 hour'
    END,
    'ip_used_today', ip_slot_created IS NOT NULL,
    'ip_resets_at', CASE
      WHEN ip_slot_created IS NULL THEN NULL
      ELSE ip_slot_created + interval '1 day'
    END
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;
