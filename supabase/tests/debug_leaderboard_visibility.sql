-- Debug Script: Check Leaderboard Data Visibility
-- Run this in your Supabase SQL Editor

DO $$
DECLARE
    v_pool_id uuid;
    v_entry_count int;
    v_bet_count int;
    v_view_count int;
    v_winning_bets int;
    v_status_sample text;
BEGIN
    RAISE NOTICE '--- STARTING DEBUG ---';

    -- 1. Find the Simulation Pool (most recently created)
    SELECT id INTO v_pool_id FROM public.pools 
    WHERE name LIKE 'Simulation Pool%' 
    ORDER BY created_at DESC LIMIT 1;

    IF v_pool_id IS NULL THEN
        RAISE EXCEPTION 'No Simulation Pool found! Did the simulation script run?';
    END IF;
    
    RAISE NOTICE 'Debugging Pool ID: %', v_pool_id;

    -- 2. Check Raw Entries
    SELECT count(*) INTO v_entry_count FROM public.tournament_entries WHERE pool_id = v_pool_id;
    RAISE NOTICE 'Raw Entries in Table: % (Expected ~100)', v_entry_count;

    -- 3. Check Bets (Are there bets?)
    SELECT count(*) INTO v_bet_count 
    FROM public.bets b
    JOIN public.tournament_entries e ON b.entry_id = e.id
    WHERE e.pool_id = v_pool_id;
    
    RAISE NOTICE 'Total Bets for Pool: %', v_bet_count;

    -- 4. Check Bet Statuses (Win vs Won)
    SELECT b.status INTO v_status_sample FROM public.bets b LIMIT 1;
    SELECT count(*) INTO v_winning_bets 
    FROM public.bets b
    JOIN public.tournament_entries e ON b.entry_id = e.id
    WHERE e.pool_id = v_pool_id AND (b.status = 'win' OR b.status = 'won');
    
    RAISE NOTICE 'Winning Bets (win/won): %', v_winning_bets;

    -- 5. Check View output (Does the view see them?)
    SELECT count(*) INTO v_view_count FROM public.leaderboard_view WHERE pool_id = v_pool_id;
    RAISE NOTICE 'Rows in Leaderboard View: %', v_view_count;

    IF v_view_count = 0 THEN
         RAISE NOTICE 'CRITICAL: View is empty despite having raw entries!';
         -- Attempt to diagnose WHY view is empty
         -- View joins: entries e JOIN users u JOIN pools p LEFT JOIN bet_stats ...
         -- Check if users exist for these entries?
         DECLARE
            v_user_check int;
         BEGIN
             SELECT count(*) INTO v_user_check 
             FROM public.tournament_entries e
             JOIN public.users u ON e.user_id = u.id
             WHERE e.pool_id = v_pool_id;
             RAISE NOTICE 'Entries with Valid Users: % (If low, foreign key join to users failed)', v_user_check;
         END;
    END IF;

    RAISE NOTICE '--- END DEBUG ---';
END;
$$;
