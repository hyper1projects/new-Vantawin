DO $$
DECLARE
  v_user_id uuid;
BEGIN
  -- 1. Find the user by email
  SELECT id INTO v_user_id FROM auth.users WHERE email = 'kevin.ethh@gmail.com';

  IF v_user_id IS NULL THEN
    RAISE NOTICE 'User kevin.ethh@gmail.com not found. Skipping admin promotion.';
  ELSE
    -- 2. Confirm Email (if not already)
    UPDATE auth.users 
    SET email_confirmed_at = COALESCE(email_confirmed_at, now())
    WHERE id = v_user_id;

    -- 3. Promote to Admin
    -- We use ON CONFLICT DO UPDATE in case the user row in public.users is missing but auth exists
    -- (Though usually triggers handle this, we want to be sure)
    INSERT INTO public.users (id, is_admin, email)
    VALUES (v_user_id, true, 'kevin.ethh@gmail.com')
    ON CONFLICT (id) DO UPDATE
    SET is_admin = true;
    
    RAISE NOTICE 'User % promoted to admin.', v_user_id;
  END IF;
END $$;
