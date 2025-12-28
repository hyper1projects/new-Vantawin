-- Simulation: Multi-Tier Pools with Disjoint User Bases
-- Setup:
-- 1. Platinum Pool (10 Users)
-- 2. Gold Pool (50 Users)
-- Users are distinct sets to verify Single-Entry Policy (no overlapping users generated here).

DO $$
DECLARE
    v_plat_pool_id uuid;
    v_gold_pool_id uuid;
    v_user_id uuid;
    v_entry_id uuid;
    v_match_id uuid;
    v_i integer;
    v_j integer;
    v_bet_count integer;
    v_status text;
    v_xp integer;
BEGIN
    RAISE NOTICE '--- STARTING MULTI-POOL SIMULATION ---';

    -- 1. Create Dummy Match for bets (Common source of truth)
    INSERT INTO public.matches (home_team, away_team, start_time, status, league)
    VALUES ('{"name": "Sim City"}', '{"name": "Test United"}', now(), 'completed', 'Simulation League')
    RETURNING id INTO v_match_id;

    -- =====================================================================================
    -- POOL A: PLATINUM (10 USERS)
    -- =====================================================================================
    INSERT INTO public.pools (
        name, tier, entry_fee, min_participants, max_participants, 
        start_time, end_time, total_pot, status, prize_distribution
    )
    VALUES (
        'Platinum High Rollers', 'Platinum', 100, 10, 20, 
        now(), now() + interval '2 days', 0, 'upcoming',
        '{"1": 50, "2": 30, "3": 20}'::jsonb
    )
    RETURNING id INTO v_plat_pool_id;
    RAISE NOTICE 'Created Platinum Pool: %', v_plat_pool_id;

    FOR v_i IN 1..10 LOOP
        v_user_id := gen_random_uuid();
        
        -- Mock Auth User (Try/Catch in case of weird permission issues, usually fine in Editor)
        BEGIN
            INSERT INTO auth.users (id, email, raw_user_meta_data)
            VALUES (v_user_id, 'plat_bot_' || v_i || '@test.com', jsonb_build_object('username', 'Plat_Bot_' || v_i));
        EXCEPTION WHEN OTHERS THEN NULL; END;

        -- Public User
        INSERT INTO public.users (id, username, real_money_balance)
        VALUES (v_user_id, 'Plat_Bot_' || v_i, 5000) -- Rich bot
        ON CONFLICT (id) DO NOTHING;

        -- Join Platinum Pool
        INSERT INTO public.tournament_entries (user_id, pool_id, vanta_balance, total_xp)
        VALUES (v_user_id, v_plat_pool_id, 1000, 0)
        RETURNING id INTO v_entry_id;

        -- Update Pool Pot
        UPDATE public.pools SET total_pot = total_pot + 100 WHERE id = v_plat_pool_id;

        -- Simulate Activity (Bets)
        v_bet_count := floor(random() * 5 + 1)::int; -- 1 to 6 bets
        FOR v_j IN 1..v_bet_count LOOP
            IF random() > 0.4 THEN v_status := 'win'; ELSE v_status := 'loss'; END IF;
            
            -- Insert Bet
            INSERT INTO public.bets (
                entry_id, match_id, question_id, option_id, 
                stake_vanta, odds_snapshot, status, earned_xp
            ) VALUES (
                v_entry_id, v_match_id, 'q1', 'opt1',
                100, 2.5, v_status,
                CASE WHEN v_status = 'win' THEN 250 ELSE 0 END
            );
        END LOOP;

        -- Aggregate Stats
        UPDATE public.tournament_entries e
        SET 
            total_wins = (SELECT count(*) FROM bets WHERE entry_id = e.id AND status = 'win'),
            total_bets = (SELECT count(*) FROM bets WHERE entry_id = e.id),
            total_xp = (SELECT COALESCE(SUM(earned_xp),0) FROM bets WHERE entry_id = e.id)
        WHERE id = v_entry_id;

    END LOOP;

    -- =====================================================================================
    -- POOL B: GOLD (50 USERS)
    -- =====================================================================================
    INSERT INTO public.pools (
        name, tier, entry_fee, min_participants, max_participants, 
        start_time, end_time, total_pot, status, prize_distribution
    )
    VALUES (
        'Gold Rush Standard', 'Gold', 50, 20, 100, 
        now(), now() + interval '2 days', 0, 'upcoming',
        '{"1": 40, "2": 20, "3": 10, "4-10": 5}'::jsonb
    )
    RETURNING id INTO v_gold_pool_id;
    RAISE NOTICE 'Created Gold Pool: %', v_gold_pool_id;

    FOR v_i IN 1..50 LOOP
        v_user_id := gen_random_uuid();
        
        BEGIN
            INSERT INTO auth.users (id, email, raw_user_meta_data)
            VALUES (v_user_id, 'gold_bot_' || v_i || '@test.com', jsonb_build_object('username', 'Gold_Bot_' || v_i));
        EXCEPTION WHEN OTHERS THEN NULL; END;

        INSERT INTO public.users (id, username, real_money_balance)
        VALUES (v_user_id, 'Gold_Bot_' || v_i, 1000)
        ON CONFLICT (id) DO NOTHING;

        -- Join Gold Pool
        INSERT INTO public.tournament_entries (user_id, pool_id, vanta_balance, total_xp)
        VALUES (v_user_id, v_gold_pool_id, 1000, 0)
        RETURNING id INTO v_entry_id;

        UPDATE public.pools SET total_pot = total_pot + 50 WHERE id = v_gold_pool_id;

        -- Simulate Activity (More variance)
        v_bet_count := floor(random() * 8 + 1)::int;
        FOR v_j IN 1..v_bet_count LOOP
            IF random() > 0.6 THEN v_status := 'win'; ELSE v_status := 'loss'; END IF;
            INSERT INTO public.bets (
                entry_id, match_id, question_id, option_id, 
                stake_vanta, odds_snapshot, status, earned_xp
            ) VALUES (
                v_entry_id, v_match_id, 'q1', 'opt1',
                50, 5.0, v_status, -- Risky bets
                CASE WHEN v_status = 'win' THEN 250 ELSE 0 END
            );
        END LOOP;

        UPDATE public.tournament_entries e
        SET 
            total_wins = (SELECT count(*) FROM bets WHERE entry_id = e.id AND status = 'win'),
            total_bets = (SELECT count(*) FROM bets WHERE entry_id = e.id),
            total_xp = (SELECT COALESCE(SUM(earned_xp),0) FROM bets WHERE entry_id = e.id)
        WHERE id = v_entry_id;

    END LOOP;

    -- =====================================================================================
    -- ACTIVATE POOLS
    -- =====================================================================================
    UPDATE public.pools SET status = 'ongoing' WHERE id IN (v_plat_pool_id, v_gold_pool_id);

    RAISE NOTICE '--- SIMULATION COMPLETE ---';
END;
$$;
