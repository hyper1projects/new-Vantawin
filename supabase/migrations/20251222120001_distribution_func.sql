-- Function to Distribute Winnings for a specific Pool
-- Handles Rake, Payout Structure, and Balance Updates

CREATE OR REPLACE FUNCTION distribute_pool_rewards(p_pool_id uuid) RETURNS jsonb AS $$
DECLARE
    v_pool RECORD;
    v_rake_percent numeric;
    v_gross_pot numeric;
    v_net_pot numeric;
    v_entry RECORD;
    v_payout_row RECORD;
    v_rank int;
    v_prize numeric;
    v_user_count int := 0;
    v_total_distributed numeric := 0;
BEGIN
    -- 1. Get Pool Info
    SELECT * INTO v_pool FROM public.pools WHERE id = p_pool_id;
    
    IF v_pool.status != 'ended' THEN
        RETURN jsonb_build_object('success', false, 'message', 'Pool is not in ended status');
    END IF;

    v_gross_pot := v_pool.total_pot;

    -- 2. Get Rake
    SELECT percentage INTO v_rake_percent 
    FROM public.rake_structures 
    WHERE tier = v_pool.tier; -- Matches Case Sensitive 'Bronze', etc.
    
    IF v_rake_percent IS NULL THEN
        v_rake_percent := 10.0; -- Default safety fallback
    END IF;

    -- 3. Calculate Net Pot
    v_net_pot := v_gross_pot * (1 - (v_rake_percent / 100));

    -- 4. Snapshot Ranks & Distribute
    -- process top 25 ranks (or whatever the payout structure covers)
    -- We can iterate through the Leaderboard View
    
    FOR v_entry IN 
        SELECT entry_id, user_id, weighted_score, rank 
        FROM public.leaderboard_view 
        WHERE pool_id = p_pool_id 
        ORDER BY rank ASC
    LOOP
        v_rank := v_entry.rank;
        
        -- Store final rank
        UPDATE public.tournament_entries 
        SET final_rank = v_rank 
        WHERE id = v_entry.entry_id;

        -- Find Payout Percentage for this Rank
        SELECT percentage INTO v_payout_row 
        FROM public.payout_structures 
        WHERE v_rank >= rank_start AND v_rank <= rank_end
        LIMIT 1;

        IF FOUND THEN
            -- Calculate Prize (Percentage is of the NET pot? Or defined per person?)
            -- Plan assumption: The table percentages sum to ~100% of the Net Pot?
            -- "Rank 1: 22%". "Rank 2: 13%".
            -- User Payout Table: "Ratio of Pool". 
            -- Yes, assuming "of Pool" means Net Pot (pool available for prizes).
            
            v_prize := v_net_pot * (v_payout_row.percentage / 100);
            
            -- Credit User
            UPDATE public.users 
            SET real_money_balance = real_money_balance + v_prize 
            WHERE id = v_entry.user_id;

            -- Update Entry
            UPDATE public.tournament_entries 
            SET 
                prize_money = v_prize,
                status = 'settled'
            WHERE id = v_entry.entry_id;
            
            v_total_distributed := v_total_distributed + v_prize;
            v_user_count := v_user_count + 1;
        ELSE
            -- No prize for this rank, just mark settled
            UPDATE public.tournament_entries 
            SET status = 'settled', prize_money = 0
            WHERE id = v_entry.entry_id;
        END IF;

    END LOOP;

    -- 5. Close Pool
    UPDATE public.pools 
    SET status = 'settled' 
    WHERE id = p_pool_id;

    RETURN jsonb_build_object(
        'success', true, 
        'pool_id', p_pool_id, 
        'net_pot', v_net_pot, 
        'distributed', v_total_distributed,
        'winners_count', v_user_count
    );
END;
$$ LANGUAGE plpgsql;
