-- Simplify Leaderboard Ranking
-- 1. Rank primarily by Total XP (descending).
-- 2. Tie-break by Win Rate (descending).
-- 3. Drops the 'weighted_score' logic entirely.

DROP VIEW IF EXISTS public.leaderboard_view CASCADE;

CREATE OR REPLACE VIEW public.leaderboard_view AS

SELECT 
    e.pool_id,
    p.tier,
    COALESCE(u.username, 'Anonymous Bot') as username,
    u.avatar_url, -- Added Avatar URL
    e.user_id,
    e.total_xp,
    e.vanta_balance,
    e.id as entry_id,
    COALESCE(e.total_wins, 0) as total_wins,
    COALESCE(e.total_bets, 0) as total_bets,
    e.prize_money,
    
    COALESCE(
        (e.total_wins::numeric / NULLIF(e.total_bets, 0)) * 100, 
        0
    )::numeric(5,2) as win_rate,

    ROW_NUMBER() OVER (
        PARTITION BY e.pool_id 
        ORDER BY 
            e.total_xp DESC, -- Primary: XP
            COALESCE((e.total_wins::numeric / NULLIF(e.total_bets, 0)) * 100, 0) DESC, -- Secondary: Win Rate
            e.created_at ASC -- Tertiary: Earliest Joiner Wins Tie
    ) as rank
    
FROM public.tournament_entries e
LEFT JOIN public.users u ON e.user_id = u.id
JOIN public.pools p ON e.pool_id = p.id;

-- Ensure permissions are reapplied after recreation
GRANT SELECT ON public.leaderboard_view TO anon, authenticated, service_role;
