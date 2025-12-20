-- Function to get the active pool ID for the current week
-- Logic:
-- 1. Looks for pools with status 'upcoming' or 'ongoing'
-- 2. Filters for start_time <= NOW() <= end_time OR close to start time
-- The User Flow says: "The Games start Thursday". Pools might be generated ahead of time.
-- We want the pool that is relevant for *Right Now*.

CREATE OR REPLACE FUNCTION get_active_pool_id(p_tier text DEFAULT NULL)
RETURNS uuid AS $$
DECLARE
    v_pool_id uuid;
BEGIN
    SELECT id INTO v_pool_id
    FROM public.pools
    WHERE 
        (status = 'upcoming' OR status = 'ongoing')
        AND (p_tier IS NULL OR tier = p_tier)
        -- Ensure it's for the current timeframe. 
        -- e.g., ending in the future.
        AND end_time > now() 
    ORDER BY start_time ASC -- Get the soonest/current one
    LIMIT 1;

    RETURN v_pool_id;
END;
$$ LANGUAGE plpgsql;
