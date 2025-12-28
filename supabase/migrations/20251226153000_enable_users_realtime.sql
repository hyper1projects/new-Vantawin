-- Enable Realtime for Users Table
-- This ensures that balance updates are pushed to the frontend immediately.

DO $$
BEGIN
  -- Add users table to the realtime publication
  -- We wrap this in a block to ignore error if table is already in publication
  BEGIN
    alter publication supabase_realtime add table public.users;
  EXCEPTION WHEN duplicate_object THEN
    NULL;
  END;
END;
$$;
