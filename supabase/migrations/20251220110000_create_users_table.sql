-- Create users table (or modify existing profiles if preferred, but following request for 'users')
-- Check if profiles exists, if so, we might need to migrate data or just leave it. 
-- The user explicitly asked for 'users' table.

CREATE TABLE IF NOT EXISTS public.users (
    id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    username text,
    real_money_balance numeric DEFAULT 0 CHECK (real_money_balance >= 0),
    wallet_address text, -- For withdrawals
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- RLS Policies are handled in 20251220120004_enable_rls.sql
