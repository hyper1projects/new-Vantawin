-- Create Transactions Table
CREATE TABLE IF NOT EXISTS public.transactions (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES public.users(id) NOT NULL,
    type text NOT NULL CHECK (type IN ('deposit', 'withdrawal', 'entry_fee', 'payout', 'refund')),
    amount numeric NOT NULL,
    status text NOT NULL DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'failed', 'processed')),
    description text,
    reference_id uuid, -- Can link to pool_id, match_id, etc.
    created_at timestamptz DEFAULT now()
);

-- Index for querying user history
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON public.transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON public.transactions(created_at DESC);

-- RLS: Users can view their own transactions
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own transactions"
    ON public.transactions FOR SELECT
    USING (auth.uid() = user_id);
