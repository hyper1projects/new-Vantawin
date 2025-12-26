-- Enable RLS on matches table
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;

-- Policy: Everyone (authenticated or anon) can view matches
-- This is public data (sports scores) so we allow public read.
CREATE POLICY "Public read access for matches" 
ON public.matches FOR SELECT 
USING (true);
