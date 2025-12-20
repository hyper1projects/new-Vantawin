-- Create tournament_entries table
create table public.tournament_entries (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) not null,
  pool_id uuid references public.pools(id) not null,
  
  -- The Game Economy
  vanta_balance int default 1000 check (vanta_balance >= 0),
  total_xp numeric default 0,
  
  -- Status
  status text default 'active' check (status in ('active', 'completed', 'settled')),
  final_rank int, -- Populated at end of week
  prize_money numeric default 0, -- Populated at end of week
  
  created_at timestamptz default now(),
  unique(user_id, pool_id) -- Prevents user from joining the same pool twice
);

-- Note: user_id references public.users. Ensure this table exists and is mapped to auth.users if needed.
-- Note: pool_id references public.pools. Ensure this table exists.
