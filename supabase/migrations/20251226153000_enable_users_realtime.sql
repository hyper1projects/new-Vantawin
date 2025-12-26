-- Enable Realtime for Users Table
-- This ensures that balance updates are pushed to the frontend immediately.

begin;
  -- Add users table to the realtime publication
  alter publication supabase_realtime add table public.users;
commit;
