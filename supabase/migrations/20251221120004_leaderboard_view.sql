-- Stub Leaderboard View to fix migration chain
-- This view will be properly redefined in 20251226160000_simplify_leaderboard_ranking.sql
-- We simplify this earlier file to correct any 'bets' table dependency issues during reset.

CREATE OR REPLACE VIEW public.leaderboard_view AS
SELECT 
    e.pool_id,
    'Bronze'::text as tier, -- Cast to ensure type matching if needed
    'Stub User'::text as username,
    e.total_xp,
    e.vanta_balance,
    e.id as entry_id,
    0 as total_bets,
    0.0 as win_rate,
    0.0 as weighted_score,
    1 as rank
FROM public.tournament_entries e;
