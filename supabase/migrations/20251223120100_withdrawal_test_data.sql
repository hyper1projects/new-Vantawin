-- Seed Test Data for Withdrawals

DO $$
DECLARE
  v_user_id uuid;
BEGIN
  -- 1. Find the test user
  SELECT id INTO v_user_id FROM auth.users WHERE email = 'kevin.ethh@gmail.com';

  IF v_user_id IS NOT NULL THEN
    -- 2. Fund the user
    UPDATE public.users 
    SET real_money_balance = 1000 
    WHERE id = v_user_id;
    
    RAISE NOTICE 'User funded with $1000.';

    -- 3. Create a pending withdrawal request
    INSERT INTO public.withdrawals (user_id, amount, wallet_address, status)
    VALUES 
      (v_user_id, 150.00, '0x1234567890abcdef1234567890abcdef12345678', 'pending'),
      (v_user_id, 50.00, '0xabcdef1234567890abcdef1234567890abcdef12', 'pending')
    ON CONFLICT DO NOTHING; -- Just in case

    RAISE NOTICE 'Created sample withdrawal requests.';
  ELSE
    RAISE NOTICE 'Test user kevin.ethh@gmail.com not found. Skipping seed.';
  END IF;
END $$;
