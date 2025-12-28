-- CLEANUP SCRIPT: Wipe ONLY Simulation Data
BEGIN;

-- 1. Get Simulation Pool ID
DO $$
DECLARE
    v_pool_id UUID;
BEGIN
    SELECT id INTO v_pool_id FROM public.pools WHERE name = 'Simulation Pool 2025';

    IF v_pool_id IS NOT NULL THEN
        -- Delete dependent data for this pool
        DELETE FROM public.bets WHERE entry_id IN (SELECT id FROM public.tournament_entries WHERE pool_id = v_pool_id);
        DELETE FROM public.tournament_entries WHERE pool_id = v_pool_id;
        DELETE FROM public.user_badges WHERE pool_id = v_pool_id;
        DELETE FROM public.transactions WHERE description LIKE '%Simulation Pool 2025%';
    END IF;
END $$;

-- 2. Delete the Pool itself
DELETE FROM public.pools WHERE name = 'Simulation Pool 2025';

-- 3. Delete Bot Users
DELETE FROM public.users WHERE username LIKE 'bot_%';
DELETE FROM auth.users WHERE email LIKE 'bot_%@vantawin.online';

-- 4. Delete Simulation Matches
DELETE FROM public.matches WHERE league = 'Simulation League';

COMMIT;

-- Verification
SELECT count(*) as pools_left FROM public.pools WHERE name = 'Simulation Pool 2025';
SELECT count(*) as bots_left FROM public.users WHERE username LIKE 'bot_%';
