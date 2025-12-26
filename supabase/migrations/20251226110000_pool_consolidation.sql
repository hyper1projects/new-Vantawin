-- Migration: Pool Consolidation Logic
-- Date: 2025-12-26

-- 1. Add min_participants column
ALTER TABLE public.pools 
ADD COLUMN IF NOT EXISTS min_participants integer;

-- 2. Update status check constraint to include 'cancelled' and 'consolidated'
ALTER TABLE public.pools DROP CONSTRAINT IF EXISTS pools_status_check;
ALTER TABLE public.pools ADD CONSTRAINT pools_status_check 
CHECK (status IN ('ongoing', 'upcoming', 'ended', 'cancelled', 'consolidated'));

-- 3. Create function to consolidate a pool
CREATE OR REPLACE FUNCTION public.consolidate_pool(p_pool_id uuid)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_pool_record RECORD;
    v_target_pool_id uuid;
    v_moved_count integer;
BEGIN
    -- Get pool details
    SELECT * INTO v_pool_record FROM public.pools WHERE id = p_pool_id;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Pool not found';
    END IF;

    -- Check if consolidation is needed (only if min_participants is set)
    IF v_pool_record.min_participants IS NULL THEN
        RETURN json_build_object('success', false, 'message', 'No minimum participants set for this pool');
    END IF;

    -- Get current participant count
    DECLARE
        v_count integer;
    BEGIN
        SELECT count(*) INTO v_count FROM public.tournament_entries WHERE pool_id = p_pool_id;
        
        IF v_count >= v_pool_record.min_participants THEN
             RETURN json_build_object('success', false, 'message', 'Pool meets minimum participant requirement');
        END IF;
        
        -- If count is 0, just cancel
        IF v_count = 0 THEN
             UPDATE public.pools SET status = 'cancelled' WHERE id = p_pool_id;
             RETURN json_build_object('success', true, 'message', 'Pool cancelled (no participants)');
        END IF;
    END;

    -- Find Target Pool
    -- Strategy: Same Tier, Same Fee, Active, Most filled but not full
    SELECT id INTO v_target_pool_id
    FROM public.pools p
    WHERE p.id != p_pool_id
    AND p.tier = v_pool_record.tier
    AND p.entry_fee = v_pool_record.entry_fee
    AND p.status IN ('upcoming', 'ongoing')
    AND (p.max_participants IS NULL OR (
        (SELECT count(*) FROM public.tournament_entries te WHERE te.pool_id = p.id) 
        + 
        (SELECT count(*) FROM public.tournament_entries te2 WHERE te2.pool_id = p_pool_id)
        <= p.max_participants
    ))
    ORDER BY (SELECT count(*) FROM public.tournament_entries te3 WHERE te3.pool_id = p.id) DESC
    LIMIT 1;

    IF v_target_pool_id IS NULL THEN
        -- No target found: Cancel and Refund (Refund logic not fully implemented here, user needs to implement refund manually or via another func)
        -- For now, we will just marking as cancelled and NOT moving. 
        -- Ideally we should refund here.
        -- Assuming real_money_balance needs to be credited back.
        
        UPDATE public.users u
        SET real_money_balance = real_money_balance + v_pool_record.entry_fee
        FROM public.tournament_entries te
        WHERE te.pool_id = p_pool_id AND te.user_id = u.id;
        
        UPDATE public.pools SET status = 'cancelled' WHERE id = p_pool_id;
        
        RETURN json_build_object('success', true, 'message', 'No target pool found. Pool cancelled and users refunded.');
    END IF;

    -- Move Entries
    WITH moved_rows AS (
        UPDATE public.tournament_entries
        SET pool_id = v_target_pool_id
        WHERE pool_id = p_pool_id
        RETURNING 1
    )
    SELECT count(*) INTO v_moved_count FROM moved_rows;

    -- Update old pool status
    UPDATE public.pools SET status = 'consolidated' WHERE id = p_pool_id;

    RETURN json_build_object(
        'success', true, 
        'message', format('Consolidated pool. Moved %s users to pool %s', v_moved_count, v_target_pool_id)
    );
END;
$$;
