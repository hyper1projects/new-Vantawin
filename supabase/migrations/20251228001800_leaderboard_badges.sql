-- Migration: Add Badge Name to Leaderboard RPC
-- Date: 2025-12-28
-- Purpose: Include 'badge_name' from 'user_badges' in the leaderboard function.

-- Drop first because return type signature is changing
DROP FUNCTION IF EXISTS public.get_pool_leaderboard(UUID);

CREATE OR REPLACE FUNCTION public.get_pool_leaderboard(p_pool_id UUID)
RETURNS TABLE (
    pool_id UUID,
    tier TEXT,
    username TEXT,
    total_xp INT,
    vanta_balance NUMERIC,
    entry_id UUID,
    total_bets BIGINT,
    win_rate NUMERIC,
    rank BIGINT,
    badge_name TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    WITH bet_stats AS (
         SELECT e.id AS entry_id,
            count(*) FILTER (WHERE (b.status = 'win')) AS wins,
            count(*) FILTER (WHERE (b.status = 'win' OR b.status = 'loss')) AS total_settled
           FROM public.tournament_entries e
             LEFT JOIN public.bets b ON e.id = b.entry_id
           WHERE e.pool_id = p_pool_id
          GROUP BY e.id
        )
    SELECT 
        e.pool_id,
        p.tier,
        u.username,
        e.total_xp,
        e.vanta_balance,
        e.id AS entry_id,
        COALESCE(bs.total_settled, 0) AS total_bets,
        (COALESCE(((bs.wins::numeric / NULLIF(bs.total_settled, 0)::numeric) * 100::numeric), 0::numeric))::numeric(5,2) AS win_rate,
        rank() OVER (ORDER BY e.total_xp DESC, COALESCE(((bs.wins::numeric / NULLIF(bs.total_settled, 0)::numeric) * 100::numeric), 0::numeric) DESC) AS rank,
        ub.badge_name
    FROM public.tournament_entries e
    JOIN public.users u ON e.user_id = u.id
    JOIN public.pools p ON e.pool_id = p.id
    LEFT JOIN bet_stats bs ON e.id = bs.entry_id
    LEFT JOIN public.user_badges ub ON e.user_id = ub.user_id AND e.pool_id = ub.pool_id
    WHERE e.pool_id = p_pool_id;
END;
$$;
