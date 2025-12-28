-- Migration: Fix place_bet to respect pool_id
-- Purpose: Ensure bets are placed in the specific pool context requested by the frontend,
-- preventing ambiguity and ensuring robustness.

CREATE OR REPLACE FUNCTION place_bet(
    p_pool_id uuid, -- [NEW] Explicit Pool ID
    p_match_id uuid,
    p_question_id text,
    p_option_id text,
    p_stake numeric,
    p_odds numeric
) RETURNS jsonb AS $$
DECLARE
    v_user_id uuid;
    v_entry_id uuid;
    v_current_balance numeric;
    v_match_start timestamptz;
    v_pool_status text;
    v_pool_end timestamptz;
BEGIN
    v_user_id := auth.uid();
    
    -- 1. Get Active Pool & Entry [FIXED]
    -- Instead of searching for *any* active pool with LIMIT 1, we look for the SPECIFIC pool entry.
    
    SELECT e.id, e.vanta_balance, p.status, p.end_time
    INTO v_entry_id, v_current_balance, v_pool_status, v_pool_end
    FROM public.tournament_entries e
    JOIN public.pools p ON e.pool_id = p.id
    WHERE e.user_id = v_user_id
    AND e.pool_id = p_pool_id; -- Strict check
    
    -- Check if entry exists
    IF v_entry_id IS NULL THEN
        RETURN jsonb_build_object('success', false, 'message', 'You are not a participant in this pool.');
    END IF;

    -- 2. Validate Pool Status
    IF v_pool_status != 'ongoing' AND v_pool_status != 'upcoming' THEN
         RETURN jsonb_build_object('success', false, 'message', 'This pool is not active.');
    END IF;
    
    IF v_pool_end <= now() THEN
        RETURN jsonb_build_object('success', false, 'message', 'This pool has ended.');
    END IF;

    -- 3. Validate Match
    SELECT start_time INTO v_match_start FROM public.matches WHERE id = p_match_id;
    IF v_match_start <= now() THEN
        RETURN jsonb_build_object('success', false, 'message', 'Match has already started.');
    END IF;

    -- 4. Validate Stake
    IF p_stake < 50 OR p_stake > 200 THEN
        RETURN jsonb_build_object('success', false, 'message', 'Stake must be between 50 and 200 Vanta.');
    END IF;

    IF v_current_balance < p_stake THEN
        RETURN jsonb_build_object('success', false, 'message', 'Insufficient Vanta Balance in this pool.');
    END IF;

    -- 5. Execution (Atomic)
    UPDATE public.tournament_entries
    SET vanta_balance = vanta_balance - p_stake
    WHERE id = v_entry_id;

    INSERT INTO public.bets (
        entry_id, 
        match_id, 
        question_id, 
        option_id, 
        stake_vanta, 
        odds_snapshot, 
        status
    ) VALUES (
        v_entry_id,
        p_match_id,
        p_question_id,
        p_option_id,
        p_stake,
        p_odds,
        'pending'
    );

    -- Debug Log
    RAISE NOTICE 'Bet placed for User % in Pool % with stake %', v_user_id, p_pool_id, p_stake;

    RETURN jsonb_build_object(
        'success', true, 
        'message', 'Bet placed successfully!',
        'new_balance', v_current_balance - p_stake
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
