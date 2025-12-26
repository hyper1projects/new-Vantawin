-- Fix All Permissions (Nuclear Option)
-- This script ensures Public Read Access for the Leaderboard components.

BEGIN;

-- 1. TOURNAMENT ENTRIES
ALTER TABLE public.tournament_entries ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public view entries" ON public.tournament_entries;
DROP POLICY IF EXISTS "Users can view their own entries" ON public.tournament_entries;
DROP POLICY IF EXISTS "Users can view own entries" ON public.tournament_entries; -- Legacy name
CREATE POLICY "Public view entries" ON public.tournament_entries FOR SELECT TO public USING (true);

-- 2. BETS
ALTER TABLE public.bets ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public view bets" ON public.bets;
DROP POLICY IF EXISTS "Users can view own bets" ON public.bets;
CREATE POLICY "Public view bets" ON public.bets FOR SELECT TO public USING (true);

-- 3. USERS (Profiles)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public view profiles" ON public.users;
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
CREATE POLICY "Public view profiles" ON public.users FOR SELECT TO public USING (true);

-- 4. POOLS (Already public usually, but ensuring)
ALTER TABLE public.pools ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public view pools" ON public.pools;
CREATE POLICY "Public view pools" ON public.pools FOR SELECT TO public USING (true);

-- 5. MATCHES
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public view matches" ON public.matches;
CREATE POLICY "Public view matches" ON public.matches FOR SELECT TO public USING (true);

-- 6. GRANT SELECT explicitly (just in case)
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;

COMMIT;
