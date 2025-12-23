-- Admin & Withdrawal Schema

-- 1. Add Admin Flag to Users
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS is_admin boolean DEFAULT false;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS real_money_balance numeric DEFAULT 0;

-- 2. Withdrawal Requests Table
CREATE TABLE IF NOT EXISTS public.withdrawals (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid NOT NULL REFERENCES public.users(id),
    amount numeric NOT NULL CHECK (amount > 0),
    wallet_address text NOT NULL,
    status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    admin_notes text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- RLS for Withdrawals
ALTER TABLE public.withdrawals ENABLE ROW LEVEL SECURITY;

-- Users can view their own withdrawals
CREATE POLICY "Users can view own withdrawals" 
ON public.withdrawals FOR SELECT 
USING (auth.uid() = user_id);

-- Admins can view all (We will use Service Role in Admin Dashboard or policy)
-- Let's add an Admin Policy for completeness if they use client-side auth
CREATE POLICY "Admins can view all withdrawals" 
ON public.withdrawals FOR SELECT 
USING (
    exists (select 1 from public.users where id = auth.uid() and is_admin = true)
);

-- 3. RPC: Request Withdrawal
-- Deducts balance immediately.
CREATE OR REPLACE FUNCTION request_withdrawal(
    p_amount numeric,
    p_wallet_address text
) RETURNS jsonb AS $$
DECLARE
    v_balance numeric;
    v_user_id uuid;
BEGIN
    v_user_id := auth.uid();
    
    -- Check Balance
    SELECT real_money_balance INTO v_balance FROM public.users WHERE id = v_user_id;
    
    IF v_balance < p_amount THEN
        RETURN jsonb_build_object('success', false, 'message', 'Insufficient balance');
    END IF;

    -- Deduct Balance
    UPDATE public.users 
    SET real_money_balance = real_money_balance - p_amount 
    WHERE id = v_user_id;

    -- Create Record
    INSERT INTO public.withdrawals (user_id, amount, wallet_address)
    VALUES (v_user_id, p_amount, p_wallet_address);

    RETURN jsonb_build_object('success', true, 'message', 'Withdrawal requested');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 4. RPC: Approve/Reject Withdrawal (Admin Only)
CREATE OR REPLACE FUNCTION process_withdrawal(
    p_withdrawal_id uuid,
    p_status text, -- 'approved' or 'rejected'
    p_notes text DEFAULT NULL
) RETURNS jsonb AS $$
DECLARE
    v_withdrawal RECORD;
    v_is_admin boolean;
BEGIN
    -- Check Admin
    SELECT is_admin INTO v_is_admin FROM public.users WHERE id = auth.uid();
    
    IF v_is_admin IS NOT TRUE THEN
        RETURN jsonb_build_object('success', false, 'message', 'Unauthorized');
    END IF;

    -- Get Withdrawal
    SELECT * INTO v_withdrawal FROM public.withdrawals WHERE id = p_withdrawal_id;
    
    IF v_withdrawal.status != 'pending' THEN
        RETURN jsonb_build_object('success', false, 'message', 'Request already processed');
    END IF;

    IF p_status = 'rejected' THEN
        -- Refund User
        UPDATE public.users 
        SET real_money_balance = real_money_balance + v_withdrawal.amount 
        WHERE id = v_withdrawal.user_id;
    END IF;

    -- Update Record
    UPDATE public.withdrawals 
    SET status = p_status, admin_notes = p_notes, updated_at = now()
    WHERE id = p_withdrawal_id;

    RETURN jsonb_build_object('success', true, 'status', p_status);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 5. RPC: Update Match Score (Admin Only)
-- Forces a score update and triggers settlement
CREATE OR REPLACE FUNCTION update_match_score(
    p_match_id uuid,
    p_home_score int,
    p_away_score int,
    p_status text -- 'completed', 'live', etc.
) RETURNS jsonb AS $$
DECLARE
    v_is_admin boolean;
    v_winner text;
BEGIN
    -- Check Admin
    SELECT is_admin INTO v_is_admin FROM public.users WHERE id = auth.uid();
    
    IF v_is_admin IS NOT TRUE THEN
        RETURN jsonb_build_object('success', false, 'message', 'Unauthorized');
    END IF;

    -- Determine Winner
    IF p_home_score > p_away_score THEN v_winner := 'Home';
    ELSIF p_away_score > p_home_score THEN v_winner := 'Away';
    ELSE v_winner := 'Draw';
    END IF;

    -- Update Match
    -- This will fire 'trg_settle_matches' if status becomes 'completed'
    UPDATE public.matches 
    SET 
        home_score = p_home_score,
        away_score = p_away_score,
        status = p_status,
        winner = v_winner
    WHERE id = p_match_id;

    RETURN jsonb_build_object('success', true);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
