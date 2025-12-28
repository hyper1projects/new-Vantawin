-- Migration: Cleanup and Permissions for place_bet
-- Purpose: 
-- 1. Drop the old 5-argument place_bet function to prevent ambiguity/overloading issues.
-- 2. Explicitly grant EXECUTE permissions to the new 6-argument place_bet function.

-- 1. Drop old signature (if exists)
DROP FUNCTION IF EXISTS public.place_bet(uuid, text, text, numeric, numeric);

-- 2. Grant Permissions to the new signature
-- New Signature: place_bet(pool_id, match_id, question_id, option_id, stake, odds)
GRANT EXECUTE ON FUNCTION public.place_bet(uuid, uuid, text, text, numeric, numeric) TO authenticated;
GRANT EXECUTE ON FUNCTION public.place_bet(uuid, uuid, text, text, numeric, numeric) TO service_role;
GRANT EXECUTE ON FUNCTION public.place_bet(uuid, uuid, text, text, numeric, numeric) TO anon; 
