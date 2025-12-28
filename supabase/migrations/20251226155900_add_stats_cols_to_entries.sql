-- Add total_wins and total_bets to tournament_entries
ALTER TABLE public.tournament_entries 
ADD COLUMN IF NOT EXISTS total_wins INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_bets INTEGER DEFAULT 0;
