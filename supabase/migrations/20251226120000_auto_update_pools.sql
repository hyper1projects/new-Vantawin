-- Migration: Auto-update pool statuses
-- Date: 2025-12-26

-- 1. Create function to update statuses
CREATE OR REPLACE FUNCTION public.update_pool_statuses()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Set to 'ongoing' if start_time passed and currently 'upcoming'
    UPDATE public.pools
    SET status = 'ongoing'
    WHERE status = 'upcoming'
    AND start_time <= now();

    -- Set to 'ended' if end_time passed and currently 'ongoing'
    UPDATE public.pools
    SET status = 'ended'
    WHERE status = 'ongoing'
    AND end_time <= now();
END;
$$;

-- 2. Schedule cron job (requires pg_cron extension)
-- Attempt to schedule. If pg_cron is not enabled or permission denied, this might fail or be ignored.
-- Supabase projects usually have pg_cron available.

SELECT cron.schedule(
    'update-pool-statuses', -- name of the cron job
    '* * * * *',           -- every minute
    'SELECT public.update_pool_statuses()'
);
