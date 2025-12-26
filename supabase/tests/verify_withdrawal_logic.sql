-- Verification Script: Withdrawal Logic
-- Run this in your Supabase SQL Editor.

DO $$
DECLARE
    v_user_id uuid;
    v_initial_balance numeric;
    v_withdrawal_id uuid;
    v_new_balance numeric;
    v_result jsonb;
BEGIN
    RAISE NOTICE '--- STARTING WITHDRAWAL VERIFICATION ---';

    -- 1. Setup Test User
    SELECT id INTO v_user_id FROM auth.users LIMIT 1;
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'No users found to test with.';
    END IF;

    -- Update user to be admin (needed for process_withdrawal) 
    -- and give balance
    UPDATE public.users 
    SET is_admin = true, real_money_balance = 1000 
    WHERE id = v_user_id;
    
    SELECT real_money_balance INTO v_initial_balance FROM public.users WHERE id = v_user_id;
    RAISE NOTICE 'User % Initial Balance: %', v_user_id, v_initial_balance;

    -- Mock Auth Context (So auth.uid() works in the function)
    PERFORM set_config('request.jwt.claim.sub', v_user_id::text, true);

    -- 2. Test Request (Success)
    RAISE NOTICE 'Testing Withdrawal Request ($100)...';
    SELECT request_withdrawal(100, 'test_wallet_address') INTO v_result;
    
    IF (v_result->>'success')::boolean IS NOT TRUE THEN
        RAISE EXCEPTION 'Request Failed: %', v_result;
    END IF;

    -- Verify Balance Deducted
    SELECT real_money_balance INTO v_new_balance FROM public.users WHERE id = v_user_id;
    RAISE NOTICE 'Balance after request: % (Expected 900)', v_new_balance;
    
    IF v_new_balance != 900 THEN
        RAISE EXCEPTION 'Balance deduction failed! Match: %, Expected 900', v_new_balance;
    END IF;

    -- Get Withdrawal ID
    SELECT id INTO v_withdrawal_id 
    FROM public.withdrawals 
    WHERE user_id = v_user_id AND status = 'pending' 
    ORDER BY created_at DESC LIMIT 1;

    -- 3. Test Rejection (Refund)
    RAISE NOTICE 'Testing Rejection (Refund)...';
    PERFORM process_withdrawal(v_withdrawal_id, 'rejected', 'Test Rejection');

    -- Verify Refund
    SELECT real_money_balance INTO v_new_balance FROM public.users WHERE id = v_user_id;
    RAISE NOTICE 'Balance after rejection: % (Expected 1000)', v_new_balance;
    
    IF v_new_balance != 1000 THEN
        RAISE EXCEPTION 'Refund failed! Match: %, Expected 1000', v_new_balance;
    END IF;

    -- 4. Test Approval (No Refund)
    RAISE NOTICE 'Testing Approval...';
    -- Create new request
    PERFORM request_withdrawal(50, 'test_wallet_address_2');
    
    -- Get ID
    SELECT id INTO v_withdrawal_id 
    FROM public.withdrawals 
    WHERE user_id = v_user_id AND status = 'pending' 
    ORDER BY created_at DESC LIMIT 1;
    
    -- Approve
    PERFORM process_withdrawal(v_withdrawal_id, 'approved', 'Test Approval');

    -- Verify Balance (Should be 950)
    SELECT real_money_balance INTO v_new_balance FROM public.users WHERE id = v_user_id;
    RAISE NOTICE 'Balance after approval: % (Expected 950)', v_new_balance;
    
    IF v_new_balance != 950 THEN
        RAISE EXCEPTION 'Approval balance check failed! Match: %, Expected 950', v_new_balance;
    END IF;

    RAISE NOTICE '--- VERIFICATION SUCCESSFUL ---';
END;
$$;
