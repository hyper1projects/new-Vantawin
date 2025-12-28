-- Create Payout Batches Table
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS role text DEFAULT 'user';

CREATE TABLE IF NOT EXISTS public.payout_batches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pool_id UUID NOT NULL REFERENCES public.pools(id),
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'processing', 'completed', 'cancelled')),
    total_amount NUMERIC DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Create Payout Batch Items Table
CREATE TABLE IF NOT EXISTS public.payout_batch_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    batch_id UUID NOT NULL REFERENCES public.payout_batches(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id), -- Can be null if we just have a wallet address in future, but for now strict
    wallet_address TEXT,
    amount NUMERIC NOT NULL DEFAULT 0,
    currency TEXT DEFAULT 'USDT', -- Default currency matches NOWPayments usually
    rank INTEGER, -- Snapshot of their rank
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'included', 'excluded', 'paid')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Enable RLS
ALTER TABLE public.payout_batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payout_batch_items ENABLE ROW LEVEL SECURITY;

-- RLS Policies (Admins Only)
CREATE POLICY "Admins can view all payout batches"
    ON public.payout_batches FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE users.id = auth.uid() AND users.is_admin = true
        )
    );

CREATE POLICY "Admins can insert payout batches"
    ON public.payout_batches FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE users.id = auth.uid() AND users.is_admin = true
        )
    );

CREATE POLICY "Admins can update payout batches"
    ON public.payout_batches FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE users.id = auth.uid() AND users.is_admin = true
        )
    );

-- Items Policies
CREATE POLICY "Admins can view all payout items"
    ON public.payout_batch_items FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE users.id = auth.uid() AND users.is_admin = true
        )
    );

CREATE POLICY "Admins can manage payout items"
    ON public.payout_batch_items FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE users.id = auth.uid() AND users.is_admin = true
        )
    );


-- Trigger to update updated_at
CREATE OR REPLACE FUNCTION update_payout_batch_timestamp()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_payout_batches_timestamp
BEFORE UPDATE ON public.payout_batches
FOR EACH ROW
EXECUTE FUNCTION update_payout_batch_timestamp();


-- MAIN FUNCTION: Generate Payout Batch
CREATE OR REPLACE FUNCTION generate_payout_batch(p_pool_id UUID)
RETURNS UUID AS $$
DECLARE
    v_batch_id UUID;
    v_pool_record RECORD;
    v_rake NUMERIC;
    v_net_pot NUMERIC;
    v_payout_structure RECORD;
    v_total_entries INTEGER;
    v_cutoff_rank INTEGER;
    v_entry RECORD;
    v_prize_amount NUMERIC;
    v_user_wallet TEXT;
BEGIN
    -- 1. Check if pool exists and is ended/completed
    SELECT * INTO v_pool_record FROM public.pools WHERE id = p_pool_id;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Pool not found';
    END IF;
    
    -- 2. Check if batch already exists (optional: allow recreating if draft? For now, just return existing)
    SELECT id INTO v_batch_id FROM public.payout_batches WHERE pool_id = p_pool_id AND status != 'cancelled' LIMIT 1;
    IF v_batch_id IS NOT NULL THEN
        RETURN v_batch_id;
    END IF;

    -- 3. Create new Batch
    INSERT INTO public.payout_batches (pool_id, status)
    VALUES (p_pool_id, 'draft')
    RETURNING id INTO v_batch_id;

    -- 4. Calculate Pot Info
    SELECT percentage INTO v_rake FROM public.rake_structures WHERE tier = v_pool_record.tier;
    IF v_rake IS NULL THEN v_rake := 10; END IF; -- Default 10%

    v_net_pot := v_pool_record.total_pot * (1 - (v_rake / 100.0));

    -- 5. Get Total Entries count for Cutoff Logic
    SELECT COUNT(*) INTO v_total_entries FROM public.tournament_entries WHERE pool_id = p_pool_id;
    v_cutoff_rank := FLOOR(v_total_entries * 0.25); -- Strict Top 25%

    -- 6. Iterate through Leaderboard View results
    -- We can select directly from tournament entries, but need rank.
    -- Let's re-use the logic from leaderboard_view or calculate rank on fly.
    -- Using a window function here is best to ensure consistency with the view.
    
    FOR v_entry IN 
        WITH ranked_entries AS (
            SELECT 
                e.user_id,
                e.total_xp,
                u.wallet_address,
                u.username,
                ROW_NUMBER() OVER (
                    ORDER BY e.total_xp DESC, 
                             e.created_at ASC
                ) as rank
            FROM public.tournament_entries e
            JOIN public.users u ON e.user_id = u.id
            WHERE e.pool_id = p_pool_id
        )
        SELECT * FROM ranked_entries WHERE rank <= v_cutoff_rank  -- Only query winners
    LOOP
        -- Calculate Prize
        v_prize_amount := 0;
        
        -- Find matching payout structure
        SELECT * INTO v_payout_structure 
        FROM public.payout_structures 
        WHERE v_entry.rank >= rank_start AND v_entry.rank <= rank_end
        LIMIT 1;

        IF FOUND THEN
            v_prize_amount := v_net_pot * (v_payout_structure.percentage / 100.0);
        END IF;

        -- Insert Item if prize > 0
        IF v_prize_amount > 0 THEN
            INSERT INTO public.payout_batch_items (
                batch_id, user_id, wallet_address, amount, rank, status
            ) VALUES (
                v_batch_id, 
                v_entry.user_id, 
                COALESCE(v_entry.wallet_address, 'NO_WALLET_LINKED'), -- Flag missing wallets
                v_prize_amount, 
                v_entry.rank,
                'included'
            );
        END IF;

    END LOOP;

    -- 7. Update Batch Total
    UPDATE public.payout_batches
    SET total_amount = (SELECT COALESCE(SUM(amount), 0) FROM public.payout_batch_items WHERE batch_id = v_batch_id)
    WHERE id = v_batch_id;

    RETURN v_batch_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
