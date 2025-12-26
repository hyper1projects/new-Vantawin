-- Enable RLS on bets table
ALTER TABLE public.bets ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own bets
-- They can see bets where the linked entry belongs to them
CREATE POLICY "Users can view their own bets" 
ON public.bets FOR SELECT 
USING (
  entry_id IN (
    SELECT id FROM public.tournament_entries WHERE user_id = auth.uid()
  )
);

-- Policy: Service Role can do everything (for Edge Functions)
-- Implicitly true if using service_role key, but good to be explicit for simple policies if needed. 
-- Actually, we don't need a specific policy for service_role if it bypasses RLS, but if we want to allow insertion from client (we don't, we use RPC), we skip insert policy.
-- The RPC `place_bet` uses SECURITY DEFINER, so it writes to the table with the function owner's privileges (postgres), bypassing RLS for the content, but the user needs RLS to READ naturally.

-- Policy: Users cannot insert/update/delete bets directly (handled via RPC)
-- No INSERT/UPDATE/DELETE policies means default deny for anon/authenticated roles.
