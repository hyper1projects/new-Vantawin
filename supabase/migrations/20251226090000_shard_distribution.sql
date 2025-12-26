-- Function to distribute shards based on leaderboard rank
-- Can be called manually or via a trigger/cron when a pool ends

CREATE OR REPLACE FUNCTION public.distribute_shards_for_pool(p_pool_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    r RECORD;
    v_amount numeric;
    v_user_id uuid;
BEGIN
    -- Iterate through the leaderboard for the specific pool
    FOR r IN
        SELECT 
            entry_id, -- We need user_id, let's get it from the entry join or view
            u.username,
            e.user_id,
            lv.rank
        FROM public.leaderboard_view lv
        JOIN public.tournament_entries e ON lv.entry_id = e.id
        JOIN public.users u ON e.user_id = u.id
        WHERE lv.pool_id = p_pool_id
        AND lv.rank BETWEEN 26 AND 50 -- Only target the reward tiers
    LOOP
        v_user_id := r.user_id;
        
        -- Determine Shard Amount
        IF r.rank = 26 THEN
            v_amount := 3;
        ELSIF r.rank BETWEEN 27 AND 35 THEN
            v_amount := 2;
        ELSIF r.rank BETWEEN 36 AND 50 THEN
            v_amount := 1.5;
        ELSE
            v_amount := 0;
        END IF;

        -- Check if reward already exists for this pool and user to prevent duplicates
        IF NOT EXISTS (
            SELECT 1 FROM public.rewards_log 
            WHERE user_id = v_user_id 
            AND type = 'leaderboard_rank' 
            AND metadata->>'pool_id' = p_pool_id::text
        ) THEN
            -- 1. Insert into rewards_log
            INSERT INTO public.rewards_log (
                user_id,
                amount,
                currency,
                type,
                status,
                description,
                metadata
            ) VALUES (
                v_user_id,
                v_amount,
                'SHARD',
                'leaderboard_rank',
                'claimed',
                'Rank ' || r.rank || ' reward for pool',
                jsonb_build_object('pool_id', p_pool_id, 'rank', r.rank)
            );

            -- 2. Update User Balance
            UPDATE public.users
            SET shards_balance = shards_balance + v_amount
            WHERE id = v_user_id;
            
        END IF;
    END LOOP;
END;
$$;
