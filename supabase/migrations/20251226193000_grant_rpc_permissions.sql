-- Migration: Grant API Permissions
-- Purpose: Ensure the frontend/functions can call the new RPC

GRANT EXECUTE ON FUNCTION public.get_user_active_entry(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_user_active_entry(uuid) TO service_role;
GRANT EXECUTE ON FUNCTION public.get_user_active_entry(uuid) TO anon; -- If needed for unauthed checks (though function takes user_id)
