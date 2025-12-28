-- Migration: Grant Permissions for Leaderboard RPC
-- Date: 2025-12-28
-- Purpose: Grant execute permissions after DROP/CREATE of get_pool_leaderboard

GRANT EXECUTE ON FUNCTION public.get_pool_leaderboard(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_pool_leaderboard(UUID) TO service_role;
GRANT EXECUTE ON FUNCTION public.get_pool_leaderboard(UUID) TO anon; -- Allow public access if needed for public leaderboards

-- Also ensure search_path is safe since it is SECURITY DEFINER
ALTER FUNCTION public.get_pool_leaderboard(UUID) SET search_path = public;
