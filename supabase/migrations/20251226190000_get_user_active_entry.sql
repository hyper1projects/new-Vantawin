-- Migration: Get User Active Entry
-- Purpose: Correctly identify which pool the user is currently participating in,
-- instead of assuming a single global active pool.

CREATE OR REPLACE FUNCTION get_user_active_entry(p_user_id uuid)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_entry_record record;
BEGIN
    SELECT 
        e.pool_id,
        e.vanta_balance,
        p.status
    INTO v_entry_record
    FROM public.tournament_entries e
    JOIN public.pools p ON e.pool_id = p.id
    WHERE e.user_id = p_user_id
    AND (p.status = 'ongoing' OR p.status = 'upcoming')
    AND p.end_time > now()
    ORDER BY p.start_time ASC
    LIMIT 1;

    IF v_entry_record IS NULL THEN
        RETURN NULL;
    END IF;

    RETURN json_build_object(
        'pool_id', v_entry_record.pool_id,
        'vanta_balance', v_entry_record.vanta_balance
    );
END;
$$;
