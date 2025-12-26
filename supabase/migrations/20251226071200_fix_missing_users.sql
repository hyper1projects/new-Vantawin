-- Backfill missing users in public.users from auth.users
-- This fixes the issue where existing users (created before the trigger was active or due to errors) cannot access the app properly.

DO $$
BEGIN
    INSERT INTO public.users (id, username, real_money_balance, created_at, updated_at)
    SELECT 
        au.id, 
        COALESCE(au.raw_user_meta_data->>'username', 'user_' || substr(au.id::text, 1, 8)),
        0,
        au.created_at,
        au.created_at
    FROM auth.users au
    WHERE au.id NOT IN (SELECT id FROM public.users)
    ON CONFLICT (id) DO NOTHING;
    
    RAISE NOTICE 'Backfill complete.';
END $$;
