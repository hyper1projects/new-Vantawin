
-- Ensure pgcrypto
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

DO $$
DECLARE
  new_user_id uuid;
BEGIN
  -- Check if user already exists
  SELECT id INTO new_user_id FROM auth.users WHERE email = 'kevin.ethh@gmail.com';

  IF new_user_id IS NULL THEN
    new_user_id := gen_random_uuid();
    
    INSERT INTO auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      new_user_id,
      'authenticated',
      'authenticated',
      'kevin.ethh@gmail.com',
      crypt('Antigravity123+', gen_salt('bf')),
      now(), -- Auto-confirm
      '{"provider": "email", "providers": ["email"]}',
      '{"username": "KevinAdmin"}',
      now(),
      now()
    );
    
    RAISE NOTICE 'User created: %', new_user_id;

    -- Trigger should handle public.users creation, but let's be safe and wait/upsert
    -- We can just do the admin promotion here explicitly
    
    -- The trigger 'on_auth_user_created' inserts into public.users. 
    -- It is triggered AFTER INSERT. So it should exist now.
    
    -- Force Admin
    UPDATE public.users 
    SET is_admin = true 
    WHERE id = new_user_id;
    
  ELSE
    RAISE NOTICE 'User already exists: %', new_user_id;
    
    -- Just promote if exists
    UPDATE auth.users SET email_confirmed_at = now() WHERE id = new_user_id;
    UPDATE public.users SET is_admin = true WHERE id = new_user_id;
  END IF;

END $$;
