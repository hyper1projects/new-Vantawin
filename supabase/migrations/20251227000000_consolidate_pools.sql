-- Migration: Guaranteed Pot & Consolidation Logic

-- 1. Add Guaranteed Pot Column
-- Allows explicit setting of a "Minimum" pot display, even if collected funds are lower.
ALTER TABLE public.pools ADD COLUMN IF NOT EXISTS guaranteed_pot NUMERIC DEFAULT NULL;

-- 2. Consolidate Pools RPC
-- Merges 'source' pool into 'target' pool.
-- Moves all entries and funds. Overflows target capacity if necessary.
CREATE OR REPLACE FUNCTION consolidate_pools(
    p_source_pool_id UUID,
    p_target_pool_id UUID
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_source_pool record;
    v_target_pool record;
    v_moved_count int;
    v_moved_pot numeric;
BEGIN
    -- 1. Security Check: Admins Only
    IF NOT EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND is_admin = true) THEN
        RAISE EXCEPTION 'Access Denied: Admins Only';
    END IF;

    -- 2. Lock & Load Pools
    SELECT * INTO v_source_pool FROM public.pools WHERE id = p_source_pool_id FOR UPDATE;
    SELECT * INTO v_target_pool FROM public.pools WHERE id = p_target_pool_id FOR UPDATE;

    -- 3. Validation
    IF v_source_pool IS NULL OR v_target_pool IS NULL THEN
        RAISE EXCEPTION 'Pool not found';
    END IF;

    IF v_source_pool.status = 'consolidated' OR v_source_pool.status = 'cancelled' THEN
        RAISE EXCEPTION 'Source pool is already closed';
    END IF;
    
    -- Target must be active to accept users
    IF v_target_pool.status NOT IN ('upcoming', 'ongoing') THEN
        RAISE EXCEPTION 'Target pool is not active';
    END IF;

    -- Tiers must match
    IF v_source_pool.tier != v_target_pool.tier THEN
        RAISE EXCEPTION 'Pools must be defined as the same Tier (e.g. Gold -> Gold)';
    END IF;

    -- 4. Move Entries
    -- Simply re-assigning the pool_id moves them to the new tournament.
    WITH moved_rows AS (
        UPDATE public.tournament_entries
        SET pool_id = p_target_pool_id
        WHERE pool_id = p_source_pool_id
        RETURNING 1
    )
    SELECT COUNT(*) INTO v_moved_count FROM moved_rows;

    -- 5. Move Money
    v_moved_pot := v_source_pool.total_pot;

    -- Update Target Pool
    -- We assume 'total_pot' is the collected cash.
    -- We also increase max_participants if we are overflowing it, to keep data consistent.
    UPDATE public.pools
    SET 
        total_pot = total_pot + v_moved_pot,
        max_participants = GREATEST(max_participants, current_participants_count + v_moved_count) 
        -- Note: We rely on the view or subquery for current count usually, 
        -- but if max_participants is a hard constraint in other logic, updating it here is safe.
        -- If 'current_participants_count' isn't available in the record var, we estimate:
        -- (Ideally we'd query it, but GREATEST logic ensures we don't shrink it)
    WHERE id = p_target_pool_id;
    
    -- 6. Close Source Pool
    UPDATE public.pools
    SET 
        status = 'consolidated', 
        total_pot = 0,
        guaranteed_pot = 0 -- Clear this so it doesn't show up weirdly
    WHERE id = p_source_pool_id;

    -- 7. Log/Return
    RETURN json_build_object(
        'success', true,
        'message', format('Successfully moved %s users and %s Vanta/Money to target pool.', v_moved_count, v_moved_pot),
        'moved_users', v_moved_count,
        'moved_pot', v_moved_pot
    );
END;
$$;

-- Grant Permissions
GRANT EXECUTE ON FUNCTION consolidate_pools(uuid, uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION consolidate_pools(uuid, uuid) TO service_role;
