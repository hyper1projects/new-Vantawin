-- Enable RLS on all tables
-- Note: Fixed public.profiles -> public.users reference.
-- Note: Fixed bets RLS to use entry_id join (bets table has no user_id).

alter table public.users enable row level security;
alter table public.tournament_entries enable row level security;
alter table public.bets enable row level security;
alter table public.pools enable row level security;
alter table public.matches enable row level security;

-- 1. Users: Users can view their own profile/balance
create policy "Users can view own profile" 
on public.users for select 
using (auth.uid() = id);

-- 2. Entries: Users can see their own entries (Vanta Balance)
create policy "Users can view own entries" 
on public.tournament_entries for select 
using (auth.uid() = user_id);

-- 3. Bets: Users can only place bets for their own entry
create policy "Users can create bets" 
on public.bets for insert 
with check (
  exists (
    select 1 from public.tournament_entries 
    where id = entry_id and user_id = auth.uid()
  )
);

create policy "Users can view own bets" 
on public.bets for select 
using (
  exists (
    select 1 from public.tournament_entries 
    where id = entry_id and user_id = auth.uid()
  )
);

-- 4. Public Data: Everyone can view Pools and Matches
create policy "Public view pools" on public.pools for select using (true);

create policy "Public view matches" on public.matches for select using (true);
