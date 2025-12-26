-- Verification Script: Pool Logic
-- Run this in your Supabase SQL Editor to verify the logic.

DO $$
DECLARE
    v_pool_a_id uuid;
    v_pool_b_id uuid;
    v_user_1_id uuid;
    v_user_2_id uuid;
    v_result json;
    v_count integer;
    v_pot numeric;
    v_pool_status text; -- Added for status check
BEGIN
    RAISE NOTICE '--- STARTING VERIFICATION ---';

    -- 0. Cleanup from previous runs (to ensure we don't match old test pools)
    DELETE FROM public.tournament_entries WHERE pool_id IN (SELECT id FROM public.pools WHERE name LIKE 'TC_Pool_%');
    DELETE FROM public.pools WHERE name LIKE 'TC_Pool_%';

    -- 1. Setup Test Users (using existing users or creating temps if possible, actually relying on current user might be hard in DO block)
    -- We'll assume we can insert dummy users for this test as we are in a transaction block (DO).
    -- NOTE: You might need to adjust this if you have strict user creation rules (like auth triggers).
    -- For safety, let's pick 2 existing users from your DB.
    SELECT id INTO v_user_1_id FROM auth.users LIMIT 1;
    SELECT id INTO v_user_2_id FROM auth.users OFFSET 1 LIMIT 1;
    
    IF v_user_1_id IS NULL OR v_user_2_id IS NULL THEN
        RAISE EXCEPTION 'Need at least 2 users in auth.users to run this test.';
    END IF;

    -- Ensure they have balance
    UPDATE public.users SET real_money_balance = 1000 WHERE id IN (v_user_1_id, v_user_2_id);

    -- 2. Create Test Pools
    -- Use PLATINUM / 100 Fee to isolate from likely existing data
    -- Pool A: Under-filled (Min 5, Max 10)
    INSERT INTO public.pools (name, tier, entry_fee, min_participants, max_participants, start_time, end_time, total_pot, status)
    VALUES ('TC_Pool_A', 'Platinum', 100, 5, 10, now() + interval '1 hour', now() + interval '2 hours', 2000, 'upcoming')
    RETURNING id INTO v_pool_a_id;

    -- Pool B: Target (Same Tier/Fee, Min 0)
    INSERT INTO public.pools (name, tier, entry_fee, min_participants, max_participants, start_time, end_time, total_pot, status)
    VALUES ('TC_Pool_B', 'Platinum', 100, 0, 100, now() + interval '1 hour', now() + interval '2 hours', 5000, 'upcoming')
    RETURNING id INTO v_pool_b_id;

    RAISE NOTICE 'Created Test Pools: A (%), B (%)', v_pool_a_id, v_pool_b_id;

    -- 3. Test Joining & Fixed Prize Pool
    -- User 1 joins Pool A
    PERFORM public.join_pool(v_pool_a_id, v_user_1_id);
    -- User 2 joins Pool A
    PERFORM public.join_pool(v_pool_a_id, v_user_2_id);
    
    -- Verify Users are in Pool A
    SELECT count(*) INTO v_count FROM public.tournament_entries WHERE pool_id = v_pool_a_id;
    RAISE NOTICE 'Pool A Participant Count: %', v_count;
    IF v_count != 2 THEN
        RAISE EXCEPTION 'Join failed! Expected 2 users in Pool A, found %', v_count;
    END IF;

    -- Check Pot (Should remain 2000, NOT 2100)
    SELECT total_pot INTO v_pot FROM public.pools WHERE id = v_pool_a_id;
    IF v_pot != 2000 THEN
        RAISE EXCEPTION 'Prize Pool Logic Failed! Pot increased to %, expected 2000', v_pot;
    ELSE
        RAISE NOTICE 'PASSED: Prize Pool remained fixed at 2000.';
    END IF;

    -- 4. Test Consolidation
    RAISE NOTICE 'Testing Consolidation...';
    SELECT public.consolidate_pool(v_pool_a_id) INTO v_result;
    RAISE NOTICE 'Consolidation Result JSON: %', v_result;
    
    -- Check if success was false
    IF (v_result->>'success')::boolean = false THEN
         RAISE NOTICE 'Consolidation Logic Returned False (Not Performed): %', v_result->>'message';
         -- For this specific test, we EXPECT it to perform.
         -- Unless logic says "Pool meets requirements".
         -- Pool A min=5. Count=2. Should proceed.
    END IF;

    -- Verify Moves
    SELECT count(*) INTO v_count FROM public.tournament_entries WHERE pool_id = v_pool_b_id AND user_id IN (v_user_1_id, v_user_2_id);
    
    IF v_count = 2 THEN
        RAISE NOTICE 'PASSED: Both users moved to Pool B.';
    ELSE
        -- Analyze failure
        DECLARE
            v_rem_count integer;
            v_b_count integer;
        BEGIN
            SELECT count(*) INTO v_rem_count FROM public.tournament_entries WHERE pool_id = v_pool_a_id;
            SELECT count(*) INTO v_b_count FROM public.tournament_entries WHERE pool_id = v_pool_b_id;
            
            RAISE EXCEPTION 'VERIFICATION FAILED! 
            Expected 2 users in Pool B.
            Found in B: %.
            Remaining in A: %.
            Consolidate Result: %', 
            v_b_count, v_rem_count, v_result;
        END;
    END IF;

    -- Verify Pool A Status
    SELECT status INTO v_pool_status FROM public.pools WHERE id = v_pool_a_id;
    IF v_pool_status = 'consolidated' THEN 
         RAISE NOTICE 'PASSED: Pool A marked as consolidated.';
    ELSE
         RAISE EXCEPTION 'Pool A status is %, expected consolidated (Note: if status is cancelled, check consolidation logic returns)', v_pool_status;
    END IF;

    -- 5. Cleanup
    RAISE NOTICE 'Cleaning up test data...';
    DELETE FROM public.tournament_entries WHERE pool_id IN (v_pool_a_id, v_pool_b_id);
    DELETE FROM public.pools WHERE id IN (v_pool_a_id, v_pool_b_id);
    -- Balances are not reset, but that is fine for dev.

    RAISE NOTICE '--- VERIFICATION SUCCESSFUL ---';
END;
$$;
