-- Migration: Fix Function Search Path Mutability (Verified Signatures)
-- Date: 2025-12-27
-- Purpose: Security hardening. Set fixed search_path for SECURITY DEFINER functions.

-- 1. Helper Function
ALTER FUNCTION public.get_active_pool_id(text) SET search_path = public;

-- 2. Transaction / Wallet Functions
ALTER FUNCTION public.increment_balance(uuid, numeric) SET search_path = public;
ALTER FUNCTION public.request_withdrawal(numeric, text) SET search_path = public;
-- Verified: process_withdrawal(uuid, text, text)
ALTER FUNCTION public.process_withdrawal(uuid, text, text) SET search_path = public;

-- 3. Gameplay Functions
ALTER FUNCTION public.join_pool(uuid, uuid) SET search_path = public;
ALTER FUNCTION public.place_bet(uuid, uuid, text, text, numeric, numeric) SET search_path = public;
-- Verified: check_bet_outcome(text, text, text, int, int)
ALTER FUNCTION public.check_bet_outcome(text, text, text, int, int) SET search_path = public;
ALTER FUNCTION public.get_user_active_entry(uuid) SET search_path = public;
-- Verified: distribute_shards_for_pool(uuid)
ALTER FUNCTION public.distribute_shards_for_pool(uuid) SET search_path = public;

-- 4. Match & Pool Management
ALTER FUNCTION public.update_match_score(uuid, int, int, text) SET search_path = public;
ALTER FUNCTION public.settle_matches() SET search_path = public;
ALTER FUNCTION public.update_pool_statuses() SET search_path = public;
-- Verified: consolidate_pools(uuid, uuid) (Plural only)
ALTER FUNCTION public.consolidate_pools(uuid, uuid) SET search_path = public;
ALTER FUNCTION public.get_matches_with_logos() SET search_path = public;

-- 5. Payout Logic
ALTER FUNCTION public.distribute_pool_rewards(uuid) SET search_path = public;
-- Verified: generate_payout_batch(uuid)
ALTER FUNCTION public.generate_payout_batch(uuid) SET search_path = public;
ALTER FUNCTION public.update_payout_batch_timestamp() SET search_path = public;

-- 6. Leaderboard
ALTER FUNCTION public.get_pool_leaderboard(uuid) SET search_path = public;



-- 8. Triggers
ALTER FUNCTION public.handle_new_user() SET search_path = public;
