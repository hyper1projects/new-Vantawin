-- FORCE CLEANUP of RLS Policies
-- This script dynamically finds ALL policies on target tables and deletes them.
-- Then it creates fresh Public Read policies.

DO $$
DECLARE
    r RECORD;
BEGIN
    -- 1. Loop through and DROP ALL policies on usage tables
    FOR r IN (
        SELECT schemaname, tablename, policyname 
        FROM pg_policies 
        WHERE tablename IN ('tournament_entries', 'users', 'bets', 'pools', 'matches')
    ) LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I', r.policyname, r.schemaname, r.tablename);
        RAISE NOTICE 'Dropped policy: % on %', r.policyname, r.tablename;
    END LOOP;
END $$;

-- 2. Enable RLS (just to be sure)
ALTER TABLE public.tournament_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;

-- 3. Create fresh PUBLIC READ policies
CREATE POLICY "p_view_entries" ON public.tournament_entries FOR SELECT TO public USING (true);
CREATE POLICY "p_view_users" ON public.users FOR SELECT TO public USING (true);
CREATE POLICY "p_view_bets" ON public.bets FOR SELECT TO public USING (true);
CREATE POLICY "p_view_pools" ON public.pools FOR SELECT TO public USING (true);
CREATE POLICY "p_view_matches" ON public.matches FOR SELECT TO public USING (true);

-- 4. Grant Select Permissions
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
