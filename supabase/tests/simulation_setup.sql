-- SIMULATION SETUP SCRIPT
-- 1. Cleans up old 'Simulation Pool 2025'
-- 2. Creates 135 Bot Users
-- 3. Creates a new 'Simulation Pool'
-- 4. Joins Bots to the pool
-- 5. Simulates initial activity (XP gains)
-- 6. Leaves the pool 'ongoing' for the Real User to join.

BEGIN;

-- 1. CLEANUP (Optional, to keep clean state)
DELETE FROM public.user_badges WHERE pool_id IN (SELECT id FROM public.pools WHERE name = 'Simulation Pool 2025');
DELETE FROM public.bets WHERE entry_id IN (SELECT id FROM public.tournament_entries WHERE pool_id IN (SELECT id FROM public.pools WHERE name = 'Simulation Pool 2025'));
DELETE FROM public.tournament_entries WHERE pool_id IN (SELECT id FROM public.pools WHERE name = 'Simulation Pool 2025');
DELETE FROM public.pools WHERE name = 'Simulation Pool 2025';

-- 2. CREATE BOTS (Idempotent)
DO $$
DECLARE
    i INTEGER;
    v_uid UUID;
    usernames text[] := ARRAY[
        'VantaKing', 'CryptoWhale', 'SoccerPro', 'GoalSeeker', 'BetMaster', 
        'OddsWizard', 'LuckyStrike', 'WinBig', 'HodlGang', 'ToTheMoon', 
        'PaperHands', 'DiamondHands', 'AlphaWolf', 'OmegaBet', 'PunterX', 
        'MidfieldMaestro', 'Striker09', 'GoalieWall', 'RefBlind', 'VarCheck',
        'TopBinz', 'Nutmegger', 'OffsideTrap', 'CleanSheet', 'Hooligan',
        'TikiTaka', 'FalseNine', 'ParkTheBus', 'CounterAttack', 'GoldenBoot'
    ];
    base_name text;
BEGIN
    FOR i IN 1..135 LOOP
        v_uid := uuid_generate_v5(uuid_ns_url(), 'bot_' || i || '@sim.com');
        
        -- Pick a random base name
        base_name := usernames[1 + floor(random() * array_length(usernames, 1))::int];

        -- Create Identity
        INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at)
        VALUES (v_uid, 'bot_' || i || '@sim.com', 'password', now())
        ON CONFLICT (id) DO NOTHING;

        -- Create Public Profile with Cool Name + Index for uniqueness
        INSERT INTO public.users (id, username, real_money_balance) 
        -- e.g., "VantaKing_12"
        VALUES (v_uid, base_name || '_' || i, 1000) 
        ON CONFLICT (id) DO UPDATE SET 
            username = EXCLUDED.username, -- Update name if already exists
            real_money_balance = 1000;
    END LOOP;
END $$;

-- 3. CREATE POOL
INSERT INTO public.pools (
    name, 
    status, 
    entry_fee, 
    total_pot, 
    guaranteed_pot, 
    tier, 
    start_time, 
    end_time,
    max_participants
)
VALUES (
    'Simulation Pool 2025',
    'ongoing',
    25,          -- $25 Entry (Valid values: 5, 25, 50, 100)
    0,           -- Pot starts at 0, builds up
    5000,        -- Guaranteed $5000
    'Gold',
    NOW() - INTERVAL '1 hour', -- Started an hour ago
    NOW() + INTERVAL '1 day',  -- Ends tomorrow
    200          -- Plenty of space
);

-- Store Pool ID for next steps
DO $$
DECLARE
    v_pool_id UUID;
    v_bot_id UUID;
    i INTEGER;
BEGIN
    SELECT id INTO v_pool_id FROM public.pools WHERE name = 'Simulation Pool 2025';

    -- 4. JOIN BOTS
    FOR i IN 1..135 LOOP
        v_bot_id := uuid_generate_v5(uuid_ns_url(), 'bot_' || i || '@sim.com');
        
        -- Join Pool (Direct insert to skip checks/RPC overhead for speed)
        INSERT INTO public.tournament_entries (pool_id, user_id, total_xp, vanta_balance)
        VALUES (v_pool_id, v_bot_id, 0, 1000)
        ON CONFLICT DO NOTHING;
        
        -- Update Pool Pot (Simplified)
        UPDATE public.pools SET total_pot = total_pot + 25 WHERE id = v_pool_id;
    END LOOP;

    -- 5. SIMULATE ACTIVITY (Random XP for Bots)
    UPDATE public.tournament_entries
    SET total_xp = floor(random() * 500)
    WHERE pool_id = v_pool_id;

    RAISE NOTICE 'Simulation Pool Created with 135 Bots. ID: %', v_pool_id;
END $$;

COMMIT;
