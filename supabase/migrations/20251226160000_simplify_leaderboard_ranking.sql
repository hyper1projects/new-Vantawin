-- Simplify Leaderboard Ranking
-- 1. Rank primarily by Total XP (descending).
-- 2. Tie-break by Win Rate (descending).
-- 3. Drops the 'weighted_score' logic entirely.

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
)
SELECT 
    e.pool_id,
    p.tier,
    COALESCE(u.username, 'Anonymous Bot') as username,
    e.user_id,
    e.total_xp,
    e.vanta_balance,
    e.id as entry_id,
    COALESCE(bs.total_settled, 0) as total_bets,
    
    COALESCE(
        (bs.wins::numeric / NULLIF(bs.total_settled, 0)) * 100, 
        0
    )::numeric(5,2) as win_rate,

    RANK() OVER (
        PARTITION BY e.pool_id 
        ORDER BY 
            e.total_xp DESC, -- Primary: XP
            COALESCE((bs.wins::numeric / NULLIF(bs.total_settled, 0)) * 100, 0) DESC -- Secondary: Win Rate
    ) as rank
    
FROM public.tournament_entries e
LEFT JOIN public.users u ON e.user_id = u.id
JOIN public.pools p ON e.pool_id = p.id
LEFT JOIN bet_stats bs ON e.id = bs.entry_id;

-- Ensure permissions are reapplied after recreation
GRANT SELECT ON public.leaderboard_view TO anon, authenticated, service_role;
