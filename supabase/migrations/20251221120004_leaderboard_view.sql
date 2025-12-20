-- Leaderboard View with Bayesian Weighted Score
-- Formula: ( (TotalBets * WinRate) + (C * GlobalAvg) ) / (TotalBets + C)
-- C = 10 (Confidence constant)

CREATE OR REPLACE VIEW public.leaderboard_view AS
WITH bet_stats AS (
    SELECT 
        e.id AS entry_id,
        COUNT(*) FILTER (WHERE b.status = 'won') AS wins,
        COUNT(*) FILTER (WHERE b.status IN ('won', 'lost')) AS total_settled
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
            (10 * COALESCE(ps.global_avg_win_rate, 50)) -- Default global avg to 50 if null
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
