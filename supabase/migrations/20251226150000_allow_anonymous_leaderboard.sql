-- Fix Leaderboard View to allow missing User records (Simulation Bots)
-- We use LEFT JOIN on users so that if a user record is missing (due to auth restrictions in sim), the entry still shows.

DROP VIEW IF EXISTS public.leaderboard_view CASCADE;

CREATE OR REPLACE VIEW public.leaderboard_view AS
WITH bet_stats AS (
    SELECT 
        e.id AS entry_id,
        COUNT(*) FILTER (WHERE b.status = 'win') AS wins,
        COUNT(*) FILTER (WHERE b.status IN ('win', 'loss')) AS total_settled
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
    COALESCE(u.username, 'Anonymous Bot') as username, -- Fallback for missing user
    e.user_id, -- Added for frontend matching
    e.total_xp,
    e.vanta_balance,
    e.id as entry_id,
    COALESCE(bs.total_settled, 0) as total_bets,
    
    COALESCE(
        (bs.wins::numeric / NULLIF(bs.total_settled, 0)) * 100, 
        0
    )::numeric(5,2) as win_rate,

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
LEFT JOIN public.users u ON e.user_id = u.id -- Changed to LEFT JOIN
JOIN public.pools p ON e.pool_id = p.id
LEFT JOIN bet_stats bs ON e.id = bs.entry_id
LEFT JOIN pool_stats ps ON e.pool_id = ps.pool_id;
