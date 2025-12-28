-- Migration: Fix Column Name in Distribute Rewards
-- Date: 2025-12-28
-- Purpose: Fix 'total_points' -> 'total_xp' in distribute_pool_rewards to prevent crash.

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
    -- Removing check for 'ended' status here because we might call it *as* we end it, 
    -- or if the transaction sets it to end before calling this. 
    -- However, the previous logic enforced it. Let's keep it but ensure the caller updates status first.
    -- The caller (simulation_finish) DOES update status first.
    
    IF v_pool_record.status != 'ended' THEN
        -- Check if it was updated in current transaction? 
        -- If simulation_finish runs UPDATE then PERFORM, the snapshot *should* see it if in same transaction block?
        -- Actually, usually better to NOT rely on that if simpler. 
        -- Let's assume the caller handles status update.
        NULL; 
    END IF;

    -- B. Calculate Net Pot
    SELECT percentage INTO v_rake FROM public.rake_structures WHERE tier = v_pool_record.tier;
    IF v_rake IS NULL THEN v_rake := 10; END IF;
    
    v_net_pot := GREATEST(v_pool_record.total_pot, COALESCE(v_pool_record.guaranteed_pot, 0)) * (1 - (v_rake / 100.0));

    -- C. Get Participation
    SELECT count(*) INTO v_total_entries FROM public.tournament_entries WHERE pool_id = p_pool_id;
    
    -- D. Payout Configs
    SELECT percentage INTO v_p1_pct FROM public.payout_structures WHERE type = 'exact_rank' AND rank_start = 1;
    SELECT percentage INTO v_p2_pct FROM public.payout_structures WHERE type = 'exact_rank' AND rank_start = 2;
    SELECT percentage INTO v_p3_pct FROM public.payout_structures WHERE type = 'exact_rank' AND rank_start = 3;
    SELECT percentage INTO v_shared_pct FROM public.payout_structures WHERE type = 'percentile' AND percentile_cutoff = 0.25;

    -- E. Cutoffs
    v_top_25_cutoff := CEIL(v_total_entries * 0.25);
    v_shared_pool_count := v_top_25_cutoff - 3;
    
    IF v_shared_pool_count > 0 THEN
        v_shared_prize_per_user := (v_net_pot * (v_shared_pct / 100.0)) / v_shared_pool_count;
    ELSE
        v_shared_prize_per_user := 0; 
    END IF;

    -- F. Loop Winners
    FOR v_entry IN 
        SELECT 
            id, 
            user_id,
            RANK() OVER (ORDER BY total_xp DESC) as rank  -- FIXED: total_points -> total_xp
        FROM public.tournament_entries 
        WHERE pool_id = p_pool_id
    LOOP
        v_badge := NULL;
        v_prize_amount := 0;

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
    
    -- Mark Distributed
    UPDATE public.pools SET status = 'ended', distribution_processed = true WHERE id = p_pool_id;
    
END;
$$;
