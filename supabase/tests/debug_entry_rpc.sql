-- Debug Script: Verify get_user_active_entry
-- Replace 'YOUR_USER_ID_HERE' with your actual User ID from the Auth table or App
-- You can find your ID by running: SELECT id, email FROM auth.users;

DO $$
DECLARE
    v_user_email text := 'gold_bot_1@test.com'; -- Check for one of our simulated bots first
    v_user_id uuid;
    v_result json;
BEGIN
    RAISE NOTICE '--- DEBUGGING USER ENTRY ---';
    
    -- 1. Find User ID (Modify this to match the user testing it, or use a known bot)
    -- If you are testing with your REAL login, look up your email.
    SELECT id INTO v_user_id FROM auth.users WHERE email = v_user_email;
    
    -- IF checking for yourself, uncomment and set your ID manually if email lookup fails
    -- v_user_id := 'YOUR_UUID_HERE'; 

    IF v_user_id IS NULL THEN 
        RAISE NOTICE 'User not found: %', v_user_email;
        -- Fallback to finding ANY user in the gold pool
        SELECT user_id INTO v_user_id 
        FROM tournament_entries e 
        JOIN pools p ON e.pool_id = p.id 
        WHERE p.tier = 'Gold' 
        LIMIT 1;
        RAISE NOTICE 'Falling back to testing with random Gold User: %', v_user_id;
    ELSE
        RAISE NOTICE 'Found User ID: %', v_user_id;
    END IF;

    -- 2. Call the RPC Function
    v_result := public.get_user_active_entry(v_user_id);
    
    RAISE NOTICE 'RPC Result: %', v_result;

    -- 3. Manual Check
    RAISE NOTICE 'Manual Check details:';
    PERFORM id, pool_id, vanta_balance FROM tournament_entries WHERE user_id = v_user_id;
    
END;
$$;
