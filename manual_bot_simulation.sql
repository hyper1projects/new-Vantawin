-- Manual Bot Simulation Script
-- Run this in the Supabase Dashboard SQL Editor to seed bots and simulate league activity.

DO $$
DECLARE
    v_pool_id UUID;
    v_bot_count INTEGER := 0;
    v_bot_record RECORD;
    v_random_xp NUMERIC;
    v_random_change NUMERIC;
    v_new_id UUID;
    i INTEGER;
BEGIN
    -- 1. Get Pool (Latest created)
    SELECT id, status INTO v_pool_id 
    FROM public.pools 
    ORDER BY created_at DESC 
    LIMIT 1;

    -- If no pool found, CREATE ONE
    IF v_pool_id IS NULL THEN
        RAISE NOTICE 'No pools found. Creating a new Bot Simulation Pool.';
        
        INSERT INTO public.pools (
            name, description, status, tier, entry_fee, 
            max_participants, 
            start_time, end_time, 
            prize_distribution,
            total_pot
        ) VALUES (
            'Bot Simulation League', 
            'A generated pool for testing bot mechanics', 
            'ongoing', 
            'Gold', 
            5, 
            1000, 
            now(), 
            now() + interval '7 days',
            '[]'::jsonb,
            5000 
        ) RETURNING id INTO v_pool_id;
    END IF;

    RAISE NOTICE 'Targeting Pool: % (Status: %s)', v_pool_id, (SELECT status FROM public.pools WHERE id = v_pool_id);

    -- 2. Ensure Bots Exist (Generate 20 bots)
    FOR i IN 1..20 LOOP
        DECLARE
            v_bot_email TEXT := 'bot_' || i || '@sim.com';
        BEGIN
            -- Check if exists in auth.users
            SELECT id INTO v_new_id FROM auth.users WHERE email = v_bot_email;
            
            IF v_new_id IS NULL THEN
                v_new_id := gen_random_uuid();
                -- Insert into auth.users (Minimal fields)
                INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, recovery_sent_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token, email_change, email_change_token_new, recovery_token)
                VALUES (
                    v_new_id, 
                    '00000000-0000-0000-0000-000000000000', 
                    'authenticated', 
                    'authenticated', 
                    v_bot_email, 
                    '$2a$10$w8.I1...', -- Dummy hash
                    now(), 
                    NULL, NULL, 
                    '{"provider": "email", "providers": ["email"]}', 
                    '{}', 
                    now(), now(), '', '', '', ''
                );
                
                -- Insert into public.users
                INSERT INTO public.users (id, username, real_money_balance, created_at, updated_at)
                VALUES (v_new_id, 'Bot ' || i, 0, now(), now())
                ON CONFLICT (id) DO NOTHING;
            END IF;
        END;
    END LOOP;

    -- 3. Insert Bots into Pool
    INSERT INTO public.tournament_entries (pool_id, user_id, total_xp, vanta_balance)
    SELECT v_pool_id, u.id, 0, 1000
    FROM public.users u
    JOIN auth.users au ON u.id = au.id
    WHERE au.email LIKE 'bot_%@sim.com'
    ON CONFLICT (user_id, pool_id) DO NOTHING;
    
    GET DIAGNOSTICS v_bot_count = ROW_COUNT;
    RAISE NOTICE 'Seeded % bots into the pool.', v_bot_count;

    -- 4. Run Simulation
    -- Simulate 5 rounds of activity
    FOR i IN 1..5 LOOP
        FOR v_bot_record IN 
            SELECT te.id, te.vanta_balance, te.total_xp
            FROM public.tournament_entries te
            JOIN public.users u ON te.user_id = u.id 
            JOIN auth.users au ON u.id = au.id
            WHERE te.pool_id = v_pool_id
            AND au.email LIKE 'bot_%@sim.com'
        LOOP
            -- Random XP adjustment (0-50)
            v_random_xp := floor(random() * 50);
            -- Random Balance adjustment (-100 to +150)
            v_random_change := floor(random() * 250) - 100;

            UPDATE public.tournament_entries
            SET 
                total_xp = total_xp + v_random_xp,
                vanta_balance = GREATEST(0, vanta_balance + v_random_change)
            WHERE id = v_bot_record.id;
        END LOOP;
    END LOOP;
    
    RAISE NOTICE 'Bot simulation complete.';
END $$;
