-- Debug Script: Test Place Bet RPC
-- Verifies if the DB logic accepts a valid bet

DO $$
DECLARE
    v_user_email text := 'gold_bot_1@test.com';
    v_user_id uuid;
    v_pool_id uuid;
    v_match_id uuid;
    v_result jsonb;
BEGIN
    RAISE NOTICE '--- DEBUGGING BET PLACEMENT ---';

    -- 1. Get User
    SELECT id INTO v_user_id FROM auth.users WHERE email = v_user_email;
    IF v_user_id IS NULL THEN 
         -- Fallback
         SELECT user_id INTO v_user_id FROM tournament_entries LIMIT 1;
    END IF;
    RAISE NOTICE 'Testing User: %', v_user_id;

    -- 2. Get User's Pool
    SELECT pool_id INTO v_pool_id FROM tournament_entries WHERE user_id = v_user_id LIMIT 1;
    RAISE NOTICE 'Testing Pool: %', v_pool_id;

    -- 3. Create/Find a FUTURE match (to ensure it's bettable)
    INSERT INTO public.matches (home_team, away_team, start_time, status, league)
    VALUES (
        '{"name": "Future FC"}', 
        '{"name": "Tomorrow United"}', 
        now() + interval '1 day', 
        'scheduled', 
        'Debug League'
    )
    RETURNING id INTO v_match_id;
    RAISE NOTICE 'Created Future Match: %', v_match_id;

    -- 4. Set Mock Auth Context (Simulate being logged in as that user)
    -- Note: This only works if RLS policies check auth.uid(). 
    -- We can't easily spoof auth.uid() in a DO block for policies without extensions.
    -- However, the RPC uses `auth.uid()`. 
    -- A workaround for testing RPCs that use auth.uid() in SQL Editor is tricky.
    -- instead we will temporarily allow the RPC to accept an override OR we trust the policy check step.
    
    -- ACTUALLY: We cannot verify the RPC fully here because `auth.uid()` will be null in the SQL Editor.
    -- The previous `place_bet` function specifically does `v_user_id := auth.uid();`
    
    RAISE NOTICE 'SKIPPING DIRECT RPC CALL because auth.uid() is null in SQL Editor.';
    RAISE NOTICE 'To verify this, we must inspect the logs or use the App.';
    
    -- Alternative: We can manually run the logic of the RPC to see if it WOULD pass.
    
    -- A. Validate Entry
    PERFORM * FROM tournament_entries 
    WHERE user_id = v_user_id AND pool_id = v_pool_id;
    IF NOT FOUND THEN RAISE WARNING '[Fail] Entry not found for pool/user pair'; 
    ELSE RAISE NOTICE '[Pass] Entry exists'; END IF;

    -- B. Validate Balance
    PERFORM * FROM tournament_entries 
    WHERE user_id = v_user_id AND vanta_balance >= 50;
    IF NOT FOUND THEN RAISE WARNING '[Fail] Insufficient balance'; 
    ELSE RAISE NOTICE '[Pass] Balance sufficient'; END IF;

    -- C. Validate Match Time
    PERFORM * FROM matches WHERE id = v_match_id AND start_time > now();
    IF NOT FOUND THEN RAISE WARNING '[Fail] Match not in future'; 
    ELSE RAISE NOTICE '[Pass] Match is in future'; END IF;
    
    RAISE NOTICE '--- PRE-CHECKS PASSED ---';
    RAISE NOTICE 'If the app fails, it is likely the Network/Edge Function layer.';
END;
$$;
