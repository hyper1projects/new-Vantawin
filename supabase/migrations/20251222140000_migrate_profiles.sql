-- Migration: Finalize Users Table & Migrate Data from Profiles
-- ROBUST VERSION: Handles column creation AND data migration.

-- 1. Add ALL columns from 'profiles' to 'users' if they don't exist
-- This prevents errors if this script runs before 'update_user_profiles.sql'
ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS first_name text,
ADD COLUMN IF NOT EXISTS last_name text,
ADD COLUMN IF NOT EXISTS phone_number text,
ADD COLUMN IF NOT EXISTS date_of_birth date,
ADD COLUMN IF NOT EXISTS gender text,
ADD COLUMN IF NOT EXISTS avatar_url text,
ADD COLUMN IF NOT EXISTS telegram_id bigint;

-- 2. Migrate Data: Copy profiles -> users
-- MAPPING:
-- profiles.username       -> users.username
-- profiles.first_name     -> users.first_name
-- profiles.last_name      -> users.last_name
-- profiles.mobile_number  -> users.phone_number
-- profiles.date_of_birth  -> users.date_of_birth
-- profiles.gender         -> users.gender
-- profiles.avatar_url     -> users.avatar_url
-- profiles.telegram_id    -> users.telegram_id

-- Check if profiles table exists to avoid errors on fresh installs where it might be gone
DO $$
BEGIN
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'profiles') THEN
        INSERT INTO public.users (
            id, 
            username, 
            first_name, 
            last_name, 
            phone_number, 
            date_of_birth, 
            gender, 
            avatar_url, 
            telegram_id,
            updated_at
        )
        SELECT 
            id, 
            username, 
            first_name, 
            last_name, 
            mobile_number, 
            date_of_birth, 
            gender, 
            avatar_url, 
            telegram_id,
            updated_at
        FROM public.profiles
        ON CONFLICT (id) DO UPDATE SET
            username = EXCLUDED.username,
            first_name = EXCLUDED.first_name,
            last_name = EXCLUDED.last_name,
            phone_number = EXCLUDED.phone_number,
            date_of_birth = EXCLUDED.date_of_birth,
            gender = EXCLUDED.gender,
            avatar_url = EXCLUDED.avatar_url,
            telegram_id = EXCLUDED.telegram_id,
            updated_at = NOW();
    END IF;
END $$;
