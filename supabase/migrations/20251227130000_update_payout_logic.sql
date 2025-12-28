-- Migration: Update Payout Logic for Scalable Hybrid Model + Badges
-- 1. Alter payout_structures to support percentile-based payouts and badges
ALTER TABLE public.payout_structures
ADD COLUMN IF NOT EXISTS type text CHECK (type IN ('exact_rank', 'percentile')),
ADD COLUMN IF NOT EXISTS percentile_cutoff numeric DEFAULT NULL, -- e.g., 0.10 for top 10%
ADD COLUMN IF NOT EXISTS badge_name text DEFAULT NULL;

-- 2. Clear old fixed structures
TRUNCATE TABLE public.payout_structures;

-- 3. Seed new Hybrid Structure
-- Top 3 (Exact Ranks)
INSERT INTO public.payout_structures (type, rank_start, rank_end, percentage, badge_name, description) VALUES
('exact_rank', 1, 1, 22.0, 'Champion', '1st Place'),
('exact_rank', 2, 2, 13.0, 'Runner Up', '2nd Place'),
('exact_rank', 3, 3, 9.5, 'Podium', '3rd Place');

-- Shared Tail (Top 25% Share 55.5%)
-- We use a single row to define the monetary pool for the "Field"
-- The logic will be: Anyone > Rank 3 AND <= Total * 0.25 shares this percentage.
INSERT INTO public.payout_structures (type, percentile_cutoff, percentage, description) VALUES
('percentile', 0.25, 55.5, 'Winners Circle Shared Pool');

-- 4. Create table for User Badges if not exists (or add column to profiles? Let's add a separate table for cleaner history)
CREATE TABLE IF NOT EXISTS public.user_badges (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES public.users(id),
    pool_id uuid REFERENCES public.pools(id),
    badge_name text NOT NULL,
    awarded_at timestamptz DEFAULT now()
);

-- 5. Update distribute_pool_rewards Function
CREATE OR REPLACE FUNCTION public.distribute_pool_rewards(p_pool_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_pool_record RECORD;
    v_rake NUMERIC;
    v_net_pot NUMERIC;
    v_total_entries INTEGER;
    v_rank INTEGER;
    v_entry RECORD;
    v_prize_amount NUMERIC;
    
    -- Structure Variables
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
    
    -- Use Guaranteed Pot if higher
    v_net_pot := GREATEST(v_pool_record.total_pot, COALESCE(v_pool_record.guaranteed_pot, 0)) * (1 - (v_rake / 100.0));

    -- C. Get Participation Count
    SELECT count(*) INTO v_total_entries FROM public.tournament_entries WHERE pool_id = p_pool_id;
    
    -- D. Fetch Payout Percentages
    SELECT percentage INTO v_p1_pct FROM public.payout_structures WHERE type = 'exact_rank' AND rank_start = 1;
    SELECT percentage INTO v_p2_pct FROM public.payout_structures WHERE type = 'exact_rank' AND rank_start = 2;
    SELECT percentage INTO v_p3_pct FROM public.payout_structures WHERE type = 'exact_rank' AND rank_start = 3;
    SELECT percentage INTO v_shared_pct FROM public.payout_structures WHERE type = 'percentile' AND percentile_cutoff = 0.25;

    -- E. Calculate Cutoffs
    v_top_25_cutoff := CEIL(v_total_entries * 0.25);
    
    -- Calculate Shared Pool Prize (Total Winners - Top 3)
    v_shared_pool_count := v_top_25_cutoff - 3;
    
    IF v_shared_pool_count > 0 THEN
        v_shared_prize_per_user := (v_net_pot * (v_shared_pct / 100.0)) / v_shared_pool_count;
    ELSE
        -- Fallback if < 4 players total (Edge case: Top 3 might just take it all? For now, stick to math)
        v_shared_prize_per_user := 0; 
    END IF;

    -- F. Loop through Ranked Entries (Assuming 'rank' is already calculated in a view or verify logic here)
    -- Ideally, we iterate through leaderboard. For this RPC, let's assume entries are not yet ranked in DB column.
    -- We'll use a window function for ordering.
    
    FOR v_entry IN 
        SELECT 
            id, 
            user_id,
            RANK() OVER (ORDER BY total_points DESC) as rank
        FROM public.tournament_entries 
        WHERE pool_id = p_pool_id
    LOOP
        v_badge := NULL;
        v_prize_amount := 0;

        -- 1. Determine Prize & Badge
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
            
            -- Badge Logic for Tail
            IF v_entry.rank <= (v_total_entries * 0.10) THEN
                v_badge := 'Elite';
            ELSE
                v_badge := 'Pro';
            END IF;
        END IF;

        -- 2. Award Money (Update User Balance)
        IF v_prize_amount > 0 THEN
            UPDATE public.users 
            SET real_money_balance = real_money_balance + v_prize_amount 
            WHERE id = v_entry.user_id;

            -- Log Transaction
            INSERT INTO public.transactions (user_id, type, amount, description, reference_id)
            VALUES (v_entry.user_id, 'payout', v_prize_amount, 'Prize for Pool: ' || p_pool_id || ' (Rank ' || v_entry.rank || ')', p_pool_id);
        END IF;

        -- 3. Award Badge
        IF v_badge IS NOT NULL THEN
            INSERT INTO public.user_badges (user_id, pool_id, badge_name)
            VALUES (v_entry.user_id, p_pool_id, v_badge)
            ON CONFLICT DO NOTHING;
        END IF;

    END LOOP;
    
    -- Mark Pool as Distributed
    UPDATE public.pools SET status = 'ended', distribution_processed = true WHERE id = p_pool_id;
    
END;
$$;
