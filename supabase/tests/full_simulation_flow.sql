-- Full Simulation Flow: 97 Real Users Joining a Pool
-- Run this in Supabase SQL Editor

DO $$
DECLARE
    v_pool_id uuid;
    v_bot_count integer := 97;
    v_i integer;
    v_user_id uuid;
    v_entry_id uuid;
    v_bet_count integer;
    v_j integer;
    v_status text;
    v_match_id uuid;
    v_entry_fee int := 100;
    v_initial_balance int := 1000;
BEGIN
    RAISE NOTICE '--- STARTING FULL SIMULATION ---';

    -- 1. Create Simulation Pool
    INSERT INTO public.pools (
        name, tier, entry_fee, min_participants, max_participants, 
        start_time, end_time, total_pot, status, prize_distribution
    )
    VALUES (
        'Simulation Pool (Real Users)', 'Platinum', v_entry_fee, 50, 100, 
        now(), now() + interval '1 hour', 0, 'upcoming', -- Start with 0 pot, upcoming
        '{"1": 50, "2": 25, "3": 15, "4-10": 10}'::jsonb
    )
    RETURNING id INTO v_pool_id;
    
    RAISE NOTICE 'Created Pool: %', v_pool_id;

    -- 1a. Create Dummy Match for bets
    INSERT INTO public.matches (home_team, away_team, start_time, status, league)
    VALUES ('{"name": "Sim Home"}', '{"name": "Sim Away"}', now(), 'completed', 'Simulation League')
    RETURNING id INTO v_match_id;

    -- 2. Loop to create users and have them join
    FOR v_i IN 1..v_bot_count LOOP
        
        -- A. Create User ID
        v_user_id := gen_random_uuid();
        
        -- B. Insert into auth.users (Mocking)
        BEGIN
            INSERT INTO auth.users (id, email, raw_user_meta_data)
            VALUES (
                v_user_id, 
                'realbot_' || v_i || '_' || v_pool_id || '@test.com', 
                jsonb_build_object('username', 'User ' || v_i)
            );
        EXCEPTION WHEN OTHERS THEN
            -- If auth fails, we generate a new ID and try once more or just skip auth (relying on public only)
            -- For this simulation, we proceed assuming public.users is the critical table for our joins
            NULL;
        END;

        -- C. Insert into public.users with Money
        INSERT INTO public.users (id, username, real_money_balance)
        VALUES (v_user_id, 'User ' || v_i, v_initial_balance)
        ON CONFLICT (id) DO UPDATE SET real_money_balance = EXCLUDED.real_money_balance;

        -- D. JOIN POOL (Simulating the App Logic)
        -- 1. Deduct Balance
        UPDATE public.users 
        SET real_money_balance = real_money_balance - v_entry_fee
        WHERE id = v_user_id;

        -- 2. Add to Pot
        UPDATE public.pools
        SET total_pot = total_pot + v_entry_fee
        WHERE id = v_pool_id;
        
        -- 3. Create Entry
        INSERT INTO public.tournament_entries (user_id, pool_id, vanta_balance, total_xp)
        VALUES (v_user_id, v_pool_id, 1000, 0) -- 1000 Vanta Start
        RETURNING id INTO v_entry_id;

        -- E. SIMULATE BETS (Generate XP)
        v_bet_count := floor(random() * 15 + 5)::int;
        
        FOR v_j IN 1..v_bet_count LOOP
             IF random() > 0.5 THEN
                 v_status := 'win'; 
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
                CASE WHEN v_status = 'win' THEN 400 ELSE 0 END
             );
        END LOOP;

        -- Update XP and Stats Manual Sync
        WITH stats AS (
            SELECT 
                COALESCE(SUM(earned_xp), 0) as xp,
                COUNT(*) as bets,
                COUNT(*) FILTER (WHERE status = 'win') as wins
            FROM public.bets
            WHERE entry_id = v_entry_id
        )
        UPDATE public.tournament_entries
        SET 
            total_xp = (SELECT xp FROM stats),
            total_bets = (SELECT bets FROM stats),
            total_wins = (SELECT wins FROM stats)
        WHERE id = v_entry_id;

    END LOOP;
    
    -- 3. Update Pool to Ongoing so it appears on Live Leaderboards
    UPDATE public.pools SET status = 'ongoing' WHERE id = v_pool_id;

    RAISE NOTICE 'Success! 97 Users created, joined, and bet in Pool %', v_pool_id;
END;
$$;
