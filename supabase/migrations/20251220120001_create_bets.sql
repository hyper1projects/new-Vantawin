-- Create bets table
-- Fixes from User's Code:
-- 1. match_id changed from bigint to UUID (to match public.matches)
-- 2. Added question_id to support multiple market types (Winner, Totals, BTTS)

DROP TABLE IF EXISTS public.bets CASCADE;

create table public.bets (
  id uuid default gen_random_uuid() primary key,
  entry_id uuid references public.tournament_entries(id) not null,
  match_id uuid references public.matches(id) not null,
  
  -- The Prediction
  question_id text not null, -- e.g. 'full_time_result', 'over_2_5_goals'
  option_id text not null, -- e.g. 'opt_gameid_home', 'opt_gameid_over' (Renamed from selected_outcome)
  
  stake_vanta int not null check (stake_vanta >= 50 and stake_vanta <= 200),
  odds_snapshot numeric not null, -- Freezes the odds at the moment of betting
  
  -- The Result
  status text default 'pending' check (status in ('pending', 'win', 'loss', 'void')),
  earned_xp numeric default 0,
  
  created_at timestamptz default now()
);

-- Indexes for performance
create index idx_bets_entry_id on public.bets(entry_id);
create index idx_bets_match_id on public.bets(match_id);
