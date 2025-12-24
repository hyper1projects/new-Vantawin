-- Migration: Create Bot Simulation Function
-- Purpose: To simulate active betting and result outcomes for bots to demonstrate leaderboard movement.

CREATE OR REPLACE FUNCTION public.simulate_bot_activity(
    p_pool_id uuid,
    p_rounds integer DEFAULT 1
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER -- Run as owner to bypass RLS if needed for bots
AS $$
DECLARE
    v_bot_entry record;
    v_random_xp numeric;
    v_random_change numeric;
    i integer;
BEGIN
    -- Loop through the requested number of rounds
    FOR i IN 1..p_rounds LOOP
        
        -- Loop through all bots in the pool (users with email starting with 'bot_')
        FOR v_bot_entry IN 
            SELECT te.id, te.user_id, te.vanta_balance, te.total_xp
            FROM public.tournament_entries te
            JOIN auth.users u ON te.user_id = u.id
            WHERE te.pool_id = p_pool_id
            AND u.email LIKE 'bot_%'
        LOOP
            -- 1. Simulate a fluctuating performance
            -- Random XP gain (0 to 50)
            v_random_xp := floor(random() * 50);
            
            -- Random Balance change (-100 to +150) (Simulating wins and losses)
            v_random_change := floor(random() * 250) - 100;
            
            -- 2. Update the entry
            UPDATE public.tournament_entries
            SET 
                total_xp = total_xp + v_random_xp,
                vanta_balance = GREATEST(0, vanta_balance + v_random_change), -- Prevent negative balance
                updated_at = now()
            WHERE id = v_bot_entry.id;
            
            -- 3. Optional: Create a "Fake Bet" record if you want it to show in recent bets
            -- (Skipping for now to keep it simple, focused on Leaderboard movement)
            
        END LOOP;
        
        -- Small pause not possible in pure SQL without extension, 
        -- so we rely on the client ensuring not to spam if they want 'slow' updates,
        -- or we just blast these updates which is fine for "Realtime" demo.
        
    END LOOP;
END;
$$;
