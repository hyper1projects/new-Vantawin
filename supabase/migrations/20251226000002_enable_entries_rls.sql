-- Enable RLS on tournament_entries table
ALTER TABLE public.tournament_entries ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own entries
DROP POLICY IF EXISTS "Users can view their own entries" ON public.tournament_entries;
CREATE POLICY "Users can view their own entries" 
ON public.tournament_entries FOR SELECT 
USING (user_id = auth.uid());

-- Note: We don't need a service_role policy as it bypasses RLS by default, 
-- but ensuring the user can SELECT their own entry is critical for the MyGamesTab fetch.
