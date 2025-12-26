-- Reset Simulation Data
-- Run this to wipe previous simulation attempts (Pools, Users, Entries)

DO $$
DECLARE
    v_sim_pool_ids uuid[];
BEGIN
    RAISE NOTICE '--- STARTING RESET ---';

    -- 1. Identify Simulation Pools
    SELECT array_agg(id) INTO v_sim_pool_ids
    FROM public.pools
    WHERE name LIKE 'Simulation Pool%';

    IF v_sim_pool_ids IS NULL THEN
        RAISE NOTICE 'No simulation pools found to clean up.';
    ELSE
        RAISE NOTICE 'Cleaning up pools: %', v_sim_pool_ids;

        -- 2. Delete Bets (Must come before entries due to strict FK)
        DELETE FROM public.bets 
        WHERE entry_id IN (
            SELECT id FROM public.tournament_entries WHERE pool_id = ANY(v_sim_pool_ids)
        );

        -- 3. Delete entries
        DELETE FROM public.tournament_entries WHERE pool_id = ANY(v_sim_pool_ids);
        
        -- 4. Delete the Pools
        DELETE FROM public.pools WHERE id = ANY(v_sim_pool_ids);
    END IF;

    -- 5. Delete Simulation Users (Bots)
    -- We identify them by the pattern we used: 'Bot_User_%' OR 'User %' (from full simulation)
    DELETE FROM public.users WHERE username LIKE 'Bot_User_%' OR username LIKE 'User %';
    
    -- Note: We generally can't delete from auth.users easily via SQL editor unless we are superuser.
    -- If this fails on auth.users, we accept that 'ghost' auth users might remain, 
    -- but public.users are gone, which is what matters for our app logic.
    BEGIN
        DELETE FROM auth.users WHERE email LIKE 'bot_%@test.com' OR email LIKE 'realbot_%@test.com';
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'Could not clean up auth.users (likely permission denied). This is expected and ignored.';
    END;

    RAISE NOTICE '--- RESET COMPLETE ---';
END;
$$;
