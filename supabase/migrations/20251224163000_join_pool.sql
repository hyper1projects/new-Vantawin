-- Migration: Create join_pool function
-- Purpose: Atomically join a pool by deducting balance and creating an entry.

CREATE OR REPLACE FUNCTION public.join_pool(
    p_pool_id uuid,
    p_user_id uuid
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_pool_fee integer;
    v_user_balance numeric;
    v_pool_status text;
    v_max_participants integer;
    v_current_participants integer;
    v_slots_left integer;
    v_existing_entry_id uuid;
BEGIN
    -- 1. Get Pool Details
    SELECT entry_fee, status, max_participants
    INTO v_pool_fee, v_pool_status, v_max_participants
    FROM public.pools
    WHERE id = p_pool_id;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Pool not found';
    END IF;

    -- 2. Validate Pool Status
    IF v_pool_status = 'ended' THEN
        RAISE EXCEPTION 'Pool has ended';
    END IF;

    -- 3. Check Capacity
    IF v_max_participants IS NOT NULL THEN
        SELECT count(*) INTO v_current_participants
        FROM public.tournament_entries
        WHERE pool_id = p_pool_id;
        
        IF v_current_participants >= v_max_participants THEN
             RAISE EXCEPTION 'Pool is full';
        END IF;
    END IF;

    -- 4. Check for Existing Entry
    SELECT id INTO v_existing_entry_id
    FROM public.tournament_entries
    WHERE pool_id = p_pool_id AND user_id = p_user_id;
    
    IF v_existing_entry_id IS NOT NULL THEN
        RAISE EXCEPTION 'Already joined this pool';
    END IF;

    -- 5. Check User Balance
    SELECT real_money_balance INTO v_user_balance
    FROM public.users
    WHERE id = p_user_id;
    
    IF v_user_balance < v_pool_fee THEN
        RAISE EXCEPTION 'Insufficient balance. Required: $%, Available: $%', v_pool_fee, v_user_balance;
    END IF;

    -- 6. Process Transaction
    -- Deduct Fee
    UPDATE public.users
    SET real_money_balance = real_money_balance - v_pool_fee
    WHERE id = p_user_id;
    
    -- Create Entry
    INSERT INTO public.tournament_entries (user_id, pool_id, vanta_balance)
    VALUES (p_user_id, p_pool_id, 1000); -- Starting with 1000 Vanta
    
    -- (Optional) Add to Prize Pool? (Logic usually handled separately or calculated dynamically)
    UPDATE public.pools
    SET total_pot = total_pot + v_pool_fee
    WHERE id = p_pool_id;

    RETURN json_build_object('success', true, 'message', 'Joined pool successfully');
END;
$$;
