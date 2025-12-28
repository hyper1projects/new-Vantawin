-- SIMULATION FINISH SCRIPT
-- 1. Finds the 'Simulation Pool 2025'
-- 2. Ends the pool
-- 3. Runs checking/distribution logic
-- 4. Shows Top 10 results with Badges & Payouts

DO $$
DECLARE
    v_pool_id UUID;
BEGIN
    SELECT id INTO v_pool_id FROM public.pools WHERE name = 'Simulation Pool 2025';
    
    IF v_pool_id IS NULL THEN
        RAISE EXCEPTION 'Simulation Pool not found! Did you run setup?';
    END IF;

    -- 1. END POOL
    UPDATE public.pools 
    SET status = 'ended', end_time = NOW() 
    WHERE id = v_pool_id;

    -- 2. DISTRIBUTE REWARDS
    PERFORM public.distribute_pool_rewards(v_pool_id);

    RAISE NOTICE 'Pool Ended and Rewards Distributed.';
END $$;

-- 3. VERIFY RESULTS
SELECT 
    RANK() OVER (ORDER BY te.total_xp DESC) as Rank,
    u.username,
    te.total_xp,
    u.real_money_balance as Current_Wallet_Total, -- Note: This is total wallet, not just prize. Transaction log shows prize.
    ub.badge_name as Badge_Awarded
FROM public.tournament_entries te
JOIN public.users u ON te.user_id = u.id
LEFT JOIN public.user_badges ub ON u.id = ub.user_id AND ub.pool_id = te.pool_id
WHERE te.pool_id = (SELECT id FROM public.pools WHERE name = 'Simulation Pool 2025')
ORDER BY te.total_xp DESC
LIMIT 15;

-- 4. VERIFY BADGES TABLE IDEPENDENTLY
SELECT count(*) as total_badges_awarded FROM public.user_badges 
WHERE pool_id = (SELECT id FROM public.pools WHERE name = 'Simulation Pool 2025');
