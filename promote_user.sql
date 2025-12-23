
DO $$
DECLARE
  v_user_id uuid;
BEGIN
  -- 1. Find the user
  SELECT id INTO v_user_id FROM auth.users WHERE email = 'kevin.ethh@gmail.com';

  IF v_user_id IS NULL THEN
    RAISE NOTICE 'User not found!';
  ELSE
    -- 2. Confirm Email
    UPDATE auth.users 
    SET email_confirmed_at = now() 
    WHERE id = v_user_id;

    -- 3. Promote to Admin
    UPDATE public.users 
    SET is_admin = true 
    WHERE id = v_user_id;
    
    RAISE NOTICE 'User % promoted to admin and email confirmed.', v_user_id;
  END IF;
END $$;
