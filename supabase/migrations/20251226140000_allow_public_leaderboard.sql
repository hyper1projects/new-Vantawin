-- Fix Leaderboard Visibility
-- 1. Ensure tournament_entries is public readable
DROP POLICY IF EXISTS "Users can view their own entries" ON public.tournament_entries;
DROP POLICY IF EXISTS "Users can view own entries" ON public.tournament_entries;
DROP POLICY IF EXISTS "Public view entries" ON public.tournament_entries;

CREATE POLICY "Public view entries" 
ON public.tournament_entries 
FOR SELECT 
TO public 
USING (true);

-- 2. Ensure Bets are public readable (so Leaderboard View can calculate win rates)
-- Note: In a real app, you might want to hide 'pending' bets, but for leaderboard stats we need access.
DROP POLICY IF EXISTS "Users can view own bets" ON public.bets;
DROP POLICY IF EXISTS "Public view bets" ON public.bets;

CREATE POLICY "Public view bets" 
ON public.bets 
FOR SELECT 
TO public 
USING (true);

-- 3. Ensure Users table is readable (for Usernames)
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
DROP POLICY IF EXISTS "Public view profiles" ON public.users;

CREATE POLICY "Public view profiles" 
ON public.users 
FOR SELECT 
TO public 
USING (true);
