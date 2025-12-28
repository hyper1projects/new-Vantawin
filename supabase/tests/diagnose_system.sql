-- Diagnostic Script: System Health Check
-- run via Supabase SQL Editor

DO $$
DECLARE
    v_recent_entry record;
    v_pool record;
    v_now timestamptz := now();
BEGIN
    RAISE NOTICE '--- DIAGNOSTIC START: % ---', v_now;

    -- 1. Check for ANY recent entries (created in last hour) that are NOT bots
    -- Assumption: Real users don't have 'bot' in their username usually, or we check creation time.
    RAISE NOTICE 'Scanning for recent real-user entries...';
    
    FOR v_recent_entry IN 
        SELECT e.*, u.email as user_email, u.id as u_id
        FROM tournament_entries e
        JOIN auth.users u ON e.user_id = u.id
        WHERE e.created_at > (now() - interval '1 hour')
        AND u.email NOT LIKE '%bot%' -- Try to filter out our sim bots
    LOOP
        RAISE NOTICE 'Found Recent Entry: User: %, Pool: %, Balance: %', v_recent_entry.user_email, v_recent_entry.pool_id, v_recent_entry.vanta_balance;
        
        -- Check Pool Status for this entry
        SELECT * INTO v_pool FROM pools WHERE id = v_recent_entry.pool_id;
        RAISE NOTICE '   -> Pool Status: %, Start: %, End: %', v_pool.status, v_pool.start_time, v_pool.end_time;
        
        IF v_pool.end_time <= v_now THEN
            RAISE WARNING '   [ISSUE] Pool has ended! This explains why it is not "Active".';
        ELSIF v_pool.status NOT IN ('ongoing', 'upcoming') THEN
             RAISE WARNING '   [ISSUE] Pool status is %, not ongoing/upcoming.', v_pool.status;
        ELSE
            RAISE NOTICE '   [OK] Pool looks valid.';
        END IF;

    END LOOP;

    -- 2. Check Pools Overview
    RAISE NOTICE '--- Active Pools Overview ---';
    FOR v_pool IN 
        SELECT 
            p.name, 
            p.id, 
            p.status, 
            p.max_participants,
            (SELECT count(*) FROM tournament_entries WHERE pool_id = p.id) as current_count
        FROM pools p 
        WHERE p.status IN ('ongoing', 'upcoming') 
    LOOP
        RAISE NOTICE 'Pool: "%" (%) - Status: %, Users: %/%', v_pool.name, v_pool.id, v_pool.status, v_pool.current_count, v_pool.max_participants;
    END LOOP;

    RAISE NOTICE '--- DIAGNOSTIC END ---';
END;
$$;
