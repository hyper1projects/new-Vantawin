-- Migration: Add Profile Fields to Users Table
-- Adds first_name, last_name, phone_number, date_of_birth, gender
-- wallet_address already exists from previous migration.

ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS first_name text,
ADD COLUMN IF NOT EXISTS last_name text,
ADD COLUMN IF NOT EXISTS phone_number text,
ADD COLUMN IF NOT EXISTS date_of_birth date,
ADD COLUMN IF NOT EXISTS gender text;

-- Optional: Add constraint for gender if strictness is needed (e.g. 'Male', 'Female', 'Other')
-- For now, leaving as text for flexibility as requested.
