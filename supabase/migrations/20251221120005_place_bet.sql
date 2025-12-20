-- RPC: Place Bet
-- Handles deduction of Vanta Balance and creation of Bet record atomically.

CREATE OR REPLACE FUNCTION place_bet(
    p_match_id uuid,
    p_question_id text,
    p_option_id text,
    p_stake numeric,
    p_odds numeric
) RETURNS jsonb AS $$
DECLARE
    v_user_id uuid;
    v_pool_id uuid;
    v_entry_id uuid;
    v_current_balance numeric;
    v_match_start timestamptz;
    v_pool_status text;
    v_pool_end timestamptz;
BEGIN
    v_user_id := auth.uid();
    
    -- 1. Get Active Pool & Entry
    -- We assume the user is betting in the context of the currently active week/pool.
    -- Logic: Find the entry for the user that corresponds to a currently 'ongoing' or 'upcoming' pool.
    
    SELECT e.id, e.vanta_balance, p.id, p.status, p.end_time, p.start_time
    INTO v_entry_id, v_current_balance, v_pool_id, v_pool_status, v_pool_end, v_match_start -- re-using var for checking match start later
    FROM public.tournament_entries e
    JOIN public.pools p ON e.pool_id = p.id
    WHERE e.user_id = v_user_id
    AND (p.status = 'ongoing' OR p.status = 'upcoming')
    AND p.end_time > now()
    ORDER BY p.start_time ASC
    LIMIT 1;

    IF v_entry_id IS NULL THEN
        RETURN jsonb_build_object('success', false, 'message', 'No active tournament entry found.');
    END IF;

    -- 2. Validate Pool/Game Window
    -- Check if pool is closed? (Checked by status/end_time above)
    -- Ideally, we check if now() is between start and end.
    -- But early betting might be allowed? "Game Loop starts Thursday". 
    -- Let's stick to: If you have an entry, and pool isn't ended, you can bet.

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
        RETURN jsonb_build_object('success', false, 'message', 'Insufficient Vanta Balance.');
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

    RETURN jsonb_build_object(
        'success', true, 
        'message', 'Bet placed successfully!',
        'new_balance', v_current_balance - p_stake
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
