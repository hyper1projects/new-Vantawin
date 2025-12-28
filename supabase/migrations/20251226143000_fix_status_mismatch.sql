-- Fix 'win' vs 'won' Mismatch
-- Standardizing on 'win' and 'loss' to match the bets table constraint.

-- 1. Update Leaderboard View
DROP VIEW IF EXISTS public.leaderboard_view CASCADE;
CREATE OR REPLACE VIEW public.leaderboard_view AS
WITH bet_stats AS (
    SELECT 
        e.id AS entry_id,
        COUNT(*) FILTER (WHERE b.status = 'win') AS wins, -- Fixed from 'won'
        COUNT(*) FILTER (WHERE b.status IN ('win', 'loss')) AS total_settled -- Fixed from 'won'
    FROM public.tournament_entries e
    LEFT JOIN public.bets b ON e.id = b.entry_id
    GROUP BY e.id
),
pool_stats AS (
    SELECT 
        e.pool_id,
        AVG(
            CASE WHEN bs.total_settled > 0 
            THEN (bs.wins::numeric / bs.total_settled) * 100 
            ELSE 0 END
        ) AS global_avg_win_rate
    FROM public.tournament_entries e
    LEFT JOIN bet_stats bs ON e.id = bs.entry_id
    GROUP BY e.pool_id
)
SELECT 
    e.pool_id,
    p.tier,
    u.username,
    e.total_xp,
    e.vanta_balance,
    e.id as entry_id,
    COALESCE(bs.total_settled, 0) as total_bets,
    
    -- Raw Win Rate
    COALESCE(
        (bs.wins::numeric / NULLIF(bs.total_settled, 0)) * 100, 
        0
    )::numeric(5,2) as win_rate,

    -- Weighted Score (Bayesian Average)
    COALESCE(
        (
          (
            (COALESCE(bs.total_settled, 0) * COALESCE((bs.wins::numeric / NULLIF(bs.total_settled, 0)) * 100, 0)) 
            + 
            (10 * COALESCE(ps.global_avg_win_rate, 50)) 
          ) 
          / 
          (COALESCE(bs.total_settled, 0) + 10)
        ),
        0
    )::numeric(5,2) as weighted_score,

    RANK() OVER (PARTITION BY e.pool_id ORDER BY 
        COALESCE(
            (
              (
                (COALESCE(bs.total_settled, 0) * COALESCE((bs.wins::numeric / NULLIF(bs.total_settled, 0)) * 100, 0)) 
                + 
                (10 * COALESCE(ps.global_avg_win_rate, 50))
              ) 
              / 
              (COALESCE(bs.total_settled, 0) + 10)
            ),
            0
        ) DESC
    ) as rank
    
FROM public.tournament_entries e
JOIN public.users u ON e.user_id = u.id
JOIN public.pools p ON e.pool_id = p.id
LEFT JOIN bet_stats bs ON e.id = bs.entry_id
LEFT JOIN pool_stats ps ON e.pool_id = ps.pool_id;


-- 2. Update status check function (for future real matches)
CREATE OR REPLACE FUNCTION check_bet_outcome(
    p_question_id text,
    p_option_id text,
    p_winner text,
    p_home_score int,
    p_away_score int
) RETURNS text AS $$
DECLARE
    v_total_goals int;
    v_btts boolean;
BEGIN
    v_total_goals := p_home_score + p_away_score;
    v_btts := (p_home_score > 0 AND p_away_score > 0);

    -- 1. Full Time Result
    IF p_question_id = 'full_time_result' THEN
        IF p_option_id LIKE '%_home' AND p_winner = 'Home' THEN RETURN 'win'; END IF;
        IF p_option_id LIKE '%_away' AND p_winner = 'Away' THEN RETURN 'win'; END IF;
        IF p_option_id LIKE '%_draw' AND p_winner = 'Draw' THEN RETURN 'win'; END IF;
        RETURN 'loss';
    END IF;

    -- 2. Totals
    IF p_question_id = 'over_2_5_goals' THEN
        IF p_option_id LIKE '%_over_2_5' AND v_total_goals >= 3 THEN RETURN 'win'; END IF;
        IF p_option_id LIKE '%_under_2_5' AND v_total_goals < 3 THEN RETURN 'win'; END IF;
        RETURN 'loss';
    END IF;
    
    -- 3. BTTS
    IF p_question_id = 'btts' THEN
        IF p_option_id LIKE '%_yes' AND v_btts THEN RETURN 'win'; END IF;
        IF p_option_id LIKE '%_no' AND NOT v_btts THEN RETURN 'win'; END IF;
        RETURN 'loss';
    END IF;

    RETURN 'void'; 
END;
$$ LANGUAGE plpgsql;

-- 3. Update Settlement Logic to handle 'win' return
CREATE OR REPLACE FUNCTION settle_matches() RETURNS TRIGGER AS $$
DECLARE
    v_bet RECORD;
    v_outcome text;
BEGIN
    IF NEW.status = 'completed' THEN
        FOR v_bet IN SELECT * FROM public.bets WHERE match_id = NEW.id AND status = 'pending' LOOP
            
            v_outcome := check_bet_outcome(
                v_bet.question_id,
                v_bet.option_id,
                NEW.winner,
                NEW.home_score,
                NEW.away_score
            );

            -- Update Bet
            UPDATE public.bets 
            SET status = v_outcome 
            WHERE id = v_bet.id;

            -- Pay out if won
            IF v_outcome = 'win' THEN -- Fixed from 'won'
                UPDATE public.tournament_entries
                SET vanta_balance = vanta_balance + v_bet.potential_payout
                -- Note: Logic for XP update should also be here if dynamic
                WHERE id = v_bet.entry_id;
            END IF;
            
        END LOOP;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
