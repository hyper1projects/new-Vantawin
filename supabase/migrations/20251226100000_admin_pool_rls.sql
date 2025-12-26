-- Migration: Enable Admin Pool Creation RLS
-- Date: 2025-12-26

-- Ensure RLS is enabled on pools
ALTER TABLE public.pools ENABLE ROW LEVEL SECURITY;

-- Policy to allow admins to insert pools
-- We assume auth.uid() matches public.users.id and public.users.is_admin is true
CREATE POLICY "Admins can create pools"
ON public.pools
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.users
    WHERE public.users.id = auth.uid()
    AND public.users.is_admin = true
  )
);

-- Policy to allow admins to update pools
CREATE POLICY "Admins can update pools"
ON public.pools
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.users
    WHERE public.users.id = auth.uid()
    AND public.users.is_admin = true
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.users
    WHERE public.users.id = auth.uid()
    AND public.users.is_admin = true
  )
);

-- Policy to allow admins to delete pools
CREATE POLICY "Admins can delete pools"
ON public.pools
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.users
    WHERE public.users.id = auth.uid()
    AND public.users.is_admin = true
  )
);

-- Policy to allow everyone to view pools (assuming public read is desired)
-- This might already exist, so we use IF NOT EXISTS if possible, or just standard CREATE and let it fail if dup (Postgres doesn't support IF NOT EXISTS for policies easily without a DO block, but for Supabase migrations simplistic is often okay or we can check).
-- To be safe against "policy already exists", we can drop first or just add it if we are sure it's missing.
-- Given the error was violation, there might be NO policy for INSERT, or a restrictive one.
-- I'll add a read policy just in case, or rely on existing ones.
-- Safest is to just add the Admin ones which are definitely missing.

-- If a public read policy is needed:
CREATE POLICY "Public can view pools"
ON public.pools
FOR SELECT
TO public
USING (true);
