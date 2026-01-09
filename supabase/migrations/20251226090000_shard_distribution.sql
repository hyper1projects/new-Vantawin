-- Function to distribute shards based on leaderboard rank
-- Can be called manually or via a trigger/cron when a pool ends

CREATE OR REPLACE FUNCTION public.distribute_shards_for_pool(p_pool_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- DEPRECATED: Shard distribution is now handled within public.distribute_pool_rewards(p_pool_id)
    -- This function is left here as a placeholder to avoid breaking any legacy triggers, but it performs no action.
    RAISE NOTICE 'Function distribute_shards_for_pool is deprecated. Shards are distributed in distribute_pool_rewards.';
END;
$$;
