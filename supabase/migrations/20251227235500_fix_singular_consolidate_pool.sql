-- Migration: Fix Search Path for Legacy/Singular Consolidate Pool Function
-- Date: 2025-12-27
-- Description: Explicitly sets search_path=public for security definer function 'consolidate_pool(uuid)' to resolve linter warning.

ALTER FUNCTION public.consolidate_pool(uuid) SET search_path = public;
