-- Repair Missing User Profiles
-- This script finds all auth.users that do not have a corresponding public.users row
-- and inserts them (restoring them).

INSERT INTO public.users (id, username, real_money_balance, created_at)
SELECT 
    au.id, 
    COALESCE(au.raw_user_meta_data->>'username', 'Repaired User'), 
    0, -- Start with 0, user can manually fund after
    now()
FROM auth.users au
LEFT JOIN public.users pu ON au.id = pu.id
WHERE pu.id IS NULL;

-- If you want to give a specific user money, you can do it here by Email
-- UPDATE public.users 
-- SET real_money_balance = 300 
-- WHERE id = (SELECT id FROM auth.users WHERE email = 'kevin.ethh@gmail.com');
