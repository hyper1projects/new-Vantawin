-- Migration: Enable RLS on Flagged Tables
-- Date: 2025-12-27
-- Purpose: Fix Supabase security lints by enabling RLS and defining access policies.

-- 1. Rake Structures (Public Read, Admin Write)
ALTER TABLE public.rake_structures ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public Read Rake Structures"
    ON public.rake_structures FOR SELECT
    USING (true);

-- 2. Payout Structures (Public Read, Admin Write)
ALTER TABLE public.payout_structures ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public Read Payout Structures"
    ON public.payout_structures FOR SELECT
    USING (true);

-- 3. User Badges (Public Read, System/Admin Write)
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public Read User Badges"
    ON public.user_badges FOR SELECT
    USING (true);

-- 4. Pool Participants (Public Read for stats, System/User Write)
ALTER TABLE public.pool_participants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public Read Pool Participants"
    ON public.pool_participants FOR SELECT
    USING (true);

CREATE POLICY "Users can join (insert own)"
    ON public.pool_participants FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can left (delete own)"
    ON public.pool_participants FOR DELETE
    USING (auth.uid() = user_id);
