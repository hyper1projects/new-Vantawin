-- Add shards_balance to users table
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS shards_balance numeric DEFAULT 0 CHECK (shards_balance >= 0);

-- Create rewards_log table
CREATE TABLE IF NOT EXISTS public.rewards_log (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    amount numeric NOT NULL,
    currency text NOT NULL CHECK (currency IN ('USD', 'SHARD')),
    type text NOT NULL, -- 'bonus', 'referral', 'game_reward', 'tier_reward', 'leaderboard_rank'
    status text NOT NULL DEFAULT 'pending' CHECK (status IN ('claimed', 'pending', 'expired')),
    description text,
    metadata jsonb DEFAULT '{}'::jsonb, -- For storing extra info like { "rank": 26, "pool_id": "..." }
    created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on rewards_log
ALTER TABLE public.rewards_log ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own rewards
CREATE POLICY "Users can view own rewards" ON public.rewards_log
    FOR SELECT
    USING (auth.uid() = user_id);

-- Simple index for faster queries by user
CREATE INDEX IF NOT EXISTS idx_rewards_log_user_id ON public.rewards_log(user_id);
