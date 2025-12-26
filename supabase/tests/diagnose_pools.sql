-- Diagnostic: List Pools and Entry Counts
-- Run this to see where the users are hiding!

SELECT 
    p.id,
    p.name,
    p.status,
    p.created_at,
    (SELECT count(*) FROM public.tournament_entries WHERE pool_id = p.id) as real_entries_count,
    (SELECT count(*) FROM public.leaderboard_view WHERE pool_id = p.id) as view_entries_count
FROM public.pools p
ORDER BY p.created_at DESC;
