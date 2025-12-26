-- Simulation Script: 97 Bot Users for Leaderboard Test
-- Run this in Supabase SQL Editor

DO $$
DECLARE
    v_pool_id uuid;
    v_bot_id uuid;
    v_bot_count integer := 97;
    v_i integer;
    v_entry_id uuid;
    v_bet_count integer;
    v_win_count integer;
    v_j integer;
    v_status text;
    v_match_id uuid;
BEGIN
    RAISE NOTICE '--- STARTING SIMULATION ---';

    -- 1. Create Test Pool (Capacity 100)
    INSERT INTO public.pools (name, tier, entry_fee, min_participants, max_participants, start_time, end_time, total_pot, status)
    VALUES ('Simulation Pool 100', 'Platinum', 100, 50, 100, now(), now() + interval '1 hour', 10000, 'ongoing')
    RETURNING id INTO v_pool_id;

    RAISE NOTICE 'Created Pool: % (Max 100)', v_pool_id;

    -- 1a. Create Dummy Match for bets
    INSERT INTO public.matches (home_team, away_team, start_time, status, league)
    VALUES ('{"name": "Sim Home"}', '{"name": "Sim Away"}', now(), 'completed', 'Simulation League')
    RETURNING id INTO v_match_id;

    -- 2. Create 97 Bots
    FOR v_i IN 1..v_bot_count LOOP
        -- Generate ID
        v_bot_id := gen_random_uuid();

        -- Insert Auth User (Mocking)
        BEGIN
            INSERT INTO auth.users (id, email, raw_user_meta_data)
            VALUES (v_bot_id, 'bot_' || v_i || '_' || v_pool_id || '@test.com', jsonb_build_object('username', 'Bot_' || v_i));
        EXCEPTION WHEN OTHERS THEN
             -- User might exist or permission denied. Continue.
             NULL;
        END;

        -- Insert Public User
        INSERT INTO public.users (id, username, real_money_balance)
        VALUES (v_bot_id, 'Bot_User_' || v_i, 1000)
        ON CONFLICT (id) DO NOTHING;

        -- Insert Entry
        INSERT INTO public.tournament_entries (user_id, pool_id, vanta_balance, total_xp)
        VALUES (v_bot_id, v_pool_id, 1000, 0)
        RETURNING id INTO v_entry_id;

        -- 3. Simulate Bets
        v_bet_count := floor(random() * 15 + 5)::int;
        
        FOR v_j IN 1..v_bet_count LOOP
             IF random() > 0.5 THEN
                 v_status := 'win'; -- Table constraint is 'win'/'loss'
             ELSE
                 v_status := 'loss';
             END IF;

             INSERT INTO public.bets (
                entry_id, match_id, question_id, option_id, 
                stake_vanta, odds_snapshot, status, earned_xp
             )
             VALUES (
                v_entry_id, v_match_id, 'sim_q', 'sim_opt',
                200, 2.0, v_status,
                CASE WHEN v_status = 'win' THEN 400 ELSE 0 END -- 200 * 2.0 = 400
             );
        END LOOP;

        -- Manually update total_xp for the bot entry based on the bets we just inserted
        UPDATE public.tournament_entries
        SET total_xp = (
            SELECT COALESCE(SUM(earned_xp), 0)
            FROM public.bets
            WHERE entry_id = v_entry_id
        )
        WHERE id = v_entry_id;

    END LOOP;
        


    RAISE NOTICE 'Successfully populated % bots into Pool %', v_bot_count, v_pool_id;
    RAISE NOTICE 'Pool ID is: %', v_pool_id;
END;
$$;
