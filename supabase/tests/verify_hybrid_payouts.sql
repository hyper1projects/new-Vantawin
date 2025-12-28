-- MASTER SCRIPT: Cleanup, Migrate, and Verify Hybrid Payouts
-- Run this in your Supabase SQL Editor.

BEGIN;

-- ==========================================
-- 1. CLEANUP (Safe Order)
-- ==========================================
TRUNCATE TABLE public.tournament_entries CASCADE;
TRUNCATE TABLE public.payout_batch_items CASCADE;
TRUNCATE TABLE public.payout_batches CASCADE;

-- Drop ghost function if exists
DROP FUNCTION IF EXISTS public.consolidate_pool(uuid, uuid);

-- Drop tables to safely recreate with new schema
DROP TABLE IF EXISTS public.user_badges CASCADE;
DROP TABLE IF EXISTS public.payout_structures CASCADE;

DELETE FROM public.pools;


-- ==========================================
-- 2. SCHEMA MIGRATION
-- ==========================================

-- Recreate Payout Structures (Rank columns nullable for 'percentile' type)
CREATE TABLE public.payout_structures (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    type text CHECK (type IN ('exact_rank', 'percentile')),
    rank_start int, -- Nullable
    rank_end int,   -- Nullable
    percentile_cutoff numeric, -- Nullable
    percentage numeric NOT NULL,
    badge_name text,
    description text,
    created_at timestamptz DEFAULT now()
);

-- Enable RLS and Policies for Payout Structures
ALTER TABLE public.payout_structures ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public Read Payout Structures" ON public.payout_structures;
CREATE POLICY "Public Read Payout Structures" ON public.payout_structures FOR SELECT USING (true);

-- Create Transactions Table
CREATE TABLE IF NOT EXISTS public.transactions (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES public.users(id) NOT NULL,
    type text NOT NULL CHECK (type IN ('deposit', 'withdrawal', 'entry_fee', 'payout', 'refund')),
    amount numeric NOT NULL,
    status text NOT NULL DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'failed', 'processed')),
    description text,
    reference_id uuid,
    created_at timestamptz DEFAULT now()
);

-- Enable RLS for Transactions (Good practice here too)
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
-- (Assuming specific policies are handled elsewhere or verification runs as admin/postgres)
-- Adding a generic verify policy for now to avoid locking ourselves out during test
DROP POLICY IF EXISTS "Enable all access for verification" ON public.transactions;
CREATE POLICY "Enable all access for verification" ON public.transactions FOR ALL USING (true) WITH CHECK (true);


-- Add tracking column to pools
ALTER TABLE public.pools 
ADD COLUMN IF NOT EXISTS distribution_processed boolean DEFAULT false;

-- Recreate User Badges Table
CREATE TABLE public.user_badges (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES public.users(id),
    pool_id uuid REFERENCES public.pools(id),
    badge_name text NOT NULL,
    awarded_at timestamptz DEFAULT now(),
    UNIQUE(user_id, pool_id, badge_name)
);

-- Enable RLS and Policies for User Badges
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public Read User Badges" ON public.user_badges;
CREATE POLICY "Public Read User Badges" ON public.user_badges FOR SELECT USING (true);

-- Seed Hybrid Structure
INSERT INTO public.payout_structures (type, rank_start, rank_end, percentage, badge_name, description) VALUES
('exact_rank', 1, 1, 22.0, 'Champion', '1st Place'),
('exact_rank', 2, 2, 13.0, 'Runner Up', '2nd Place'),
('exact_rank', 3, 3, 9.5, 'Podium', '3rd Place');

INSERT INTO public.payout_structures (type, percentile_cutoff, percentage, description) VALUES
('percentile', 0.25, 55.5, 'Winners Circle Shared Pool');


-- ==========================================
-- 3. LOGIC (The New Payout Function)
-- ==========================================
CREATE OR REPLACE FUNCTION public.distribute_pool_rewards(p_pool_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public 
AS $$
DECLARE
    v_pool_record RECORD;
    v_rake NUMERIC;
    v_net_pot NUMERIC;
    v_total_entries INTEGER;
    v_entry RECORD;
    v_prize_amount NUMERIC;
    
    v_p1_pct NUMERIC;
    v_p2_pct NUMERIC;
    v_p3_pct NUMERIC;
    v_shared_pct NUMERIC;
    v_top_25_cutoff INTEGER;
    v_shared_pool_count INTEGER;
    v_shared_prize_per_user NUMERIC;
    v_badge TEXT;
BEGIN
    -- A. Get Pool Info
    SELECT * INTO v_pool_record FROM public.pools WHERE id = p_pool_id;
    IF v_pool_record.status != 'ended' THEN
        RAISE EXCEPTION 'Pool is not ended';
    END IF;

    -- B. Calculate Net Pot
    SELECT percentage INTO v_rake FROM public.rake_structures WHERE tier = v_pool_record.tier;
    IF v_rake IS NULL THEN v_rake := 10; END IF;
    
    v_net_pot := GREATEST(v_pool_record.total_pot, COALESCE(v_pool_record.guaranteed_pot, 0)) * (1 - (v_rake / 100.0));

    -- C. Get Participation Count
    SELECT count(*) INTO v_total_entries FROM public.tournament_entries WHERE pool_id = p_pool_id;
    
    -- D. Fetch Payout Percentages
    SELECT percentage INTO v_p1_pct FROM public.payout_structures WHERE type = 'exact_rank' AND rank_start = 1;
    SELECT percentage INTO v_p2_pct FROM public.payout_structures WHERE type = 'exact_rank' AND rank_start = 2;
    SELECT percentage INTO v_p3_pct FROM public.payout_structures WHERE type = 'exact_rank' AND rank_start = 3;
    SELECT percentage INTO v_shared_pct FROM public.payout_structures WHERE percentile_cutoff = 0.25;

    -- E. Calculate Cutoffs
    v_top_25_cutoff := CEIL(v_total_entries * 0.25);
    v_shared_pool_count := v_top_25_cutoff - 3;
    
    IF v_shared_pool_count > 0 THEN
        v_shared_prize_per_user := (v_net_pot * (v_shared_pct / 100.0)) / v_shared_pool_count;
    ELSE
        v_shared_prize_per_user := 0; 
    END IF;

    -- F. Loop through Ranked Entries
    FOR v_entry IN 
        SELECT 
            id, 
            user_id,
            RANK() OVER (ORDER BY total_xp DESC) as rank
        FROM public.tournament_entries 
        WHERE pool_id = p_pool_id
    LOOP
        v_badge := NULL;
        v_prize_amount := 0;

        -- Rank Logic
        IF v_entry.rank = 1 THEN
            v_prize_amount := v_net_pot * (v_p1_pct / 100.0);
            v_badge := 'Champion';
        ELSIF v_entry.rank = 2 THEN
            v_prize_amount := v_net_pot * (v_p2_pct / 100.0);
            v_badge := 'Runner Up';
        ELSIF v_entry.rank = 3 THEN
            v_prize_amount := v_net_pot * (v_p3_pct / 100.0);
            v_badge := 'Podium';
        ELSIF v_entry.rank <= v_top_25_cutoff THEN
            v_prize_amount := v_shared_prize_per_user;
            
            -- Dynamic Badge: Top 10% = Elite, Rest = Pro
            IF v_entry.rank <= (v_total_entries * 0.10) THEN
                v_badge := 'Elite';
            ELSE
                v_badge := 'Pro';
            END IF;
        END IF;

        -- Award Money
        IF v_prize_amount > 0 THEN
            UPDATE public.users 
            SET real_money_balance = real_money_balance + v_prize_amount 
            WHERE id = v_entry.user_id;

            -- Log Transaction
            INSERT INTO public.transactions (user_id, type, amount, description, reference_id)
            VALUES (v_entry.user_id, 'payout', v_prize_amount, 'Prize for Pool: ' || p_pool_id || ' (Rank ' || v_entry.rank || ')', p_pool_id);
        END IF;

        -- Award Badge
        IF v_badge IS NOT NULL THEN
            INSERT INTO public.user_badges (user_id, pool_id, badge_name)
            VALUES (v_entry.user_id, p_pool_id, v_badge)
            ON CONFLICT DO NOTHING;
        END IF;

    END LOOP;
    
    UPDATE public.pools SET distribution_processed = true WHERE id = p_pool_id;
    
END;
$$;


-- ==========================================
-- 4. TEST EXECUTION (40 Mock Users)
-- ==========================================
INSERT INTO public.pools (id, name, status, entry_fee, total_pot, guaranteed_pot, tier, start_time, end_time)
VALUES (
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'Payout Verification Pool',
    'ended',
    5, -- $5
    730, -- 146 * 5 = 730
    0,
    'Bronze', -- 10% Rake
    NOW() - INTERVAL '1 day',
    NOW()
);

-- Generate 146 Users with decreasing scores
DO $$
DECLARE
    i INTEGER;
    v_uid UUID;
BEGIN
    FOR i IN 1..146 LOOP
        v_uid := gen_random_uuid();
        
        -- Create Identity in auth.users (Mock)
        -- Use unique email to avoid collisions with previous test runs
        INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at)
        VALUES (v_uid, 'player_' || i || '_' || substring(gen_random_uuid()::text, 1, 8) || '@test.com', 'password', now())
        ON CONFLICT (id) DO NOTHING;

        -- Create Public Profile
        INSERT INTO public.users (id, username, real_money_balance) 
        VALUES (v_uid, 'Player_' || i, 0)
        ON CONFLICT (id) DO NOTHING;

        INSERT INTO public.tournament_entries (pool_id, user_id, total_xp) 
        VALUES ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', v_uid, 1000 - i);
    END LOOP;
END $$;

-- ==========================================
-- 4.1. SEED MOCK MATCH & BETS (For My Games Visibility)
-- ==========================================
-- Create a mock match if it doesn't exist (using upsert ID)
INSERT INTO public.matches (id, home_team, away_team, start_time, league, status, questions)
VALUES (
    'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    '{"name": "Team Alpha"}', 
    '{"name": "Team Beta"}',
    NOW() - INTERVAL '2 hours',
    'Simulation League',
    'finished',
    '[{"id": "q1", "text": "Match Winner", "type": "win_match", "options": [{"id": "o1", "label": "Team Alpha", "odds": 1.5}, {"id": "o2", "label": "Team Beta", "odds": 2.5}]}]'
) ON CONFLICT (id) DO NOTHING;

-- Insert Bets for Top 3 Users (so they have history)
INSERT INTO public.bets (entry_id, match_id, question_id, option_id, stake_vanta, odds_snapshot, status)
SELECT 
    te.id, 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'q1', 'o1', 100, 1.5, 'win'
FROM public.tournament_entries te
WHERE te.pool_id = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'
LIMIT 5;


-- Run Distribution
SELECT public.distribute_pool_rewards('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11');


-- ==========================================
-- 5. VERIFICATION QUERY
-- ==========================================
SELECT 
    RANK() OVER (ORDER BY te.total_xp DESC) as Rank,
    u.username,
    u.real_money_balance as Payout,
    ub.badge_name as Badge
FROM public.tournament_entries te
JOIN public.users u ON te.user_id = u.id
LEFT JOIN public.user_badges ub ON u.id = ub.user_id AND ub.pool_id = te.pool_id
WHERE te.pool_id = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'
ORDER BY te.total_xp DESC
LIMIT 12;

-- ==========================================
-- 6. VERIFY TRANSACTIONS
-- ==========================================
SELECT * FROM public.transactions 
WHERE reference_id = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'
ORDER BY created_at DESC
LIMIT 10;


COMMIT;
