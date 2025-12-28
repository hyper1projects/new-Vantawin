-- Migration: Fix Transactions Type Constraint
-- Date: 2025-12-28
-- Purpose: Expand allowed transaction types to include 'bet', 'wager', and 'win_prize' 
-- to prevent constraint violations if triggers/functions try to log these.

BEGIN;

-- 1. Drop existing constraint
ALTER TABLE public.transactions 
DROP CONSTRAINT IF EXISTS transactions_type_check;

-- 2. Add updated constraint
ALTER TABLE public.transactions 
ADD CONSTRAINT transactions_type_check 
CHECK (type IN (
    'deposit', 
    'withdrawal', 
    'entry_fee', 
    'payout', 
    'refund', 
    'bet', 
    'wager', 
    'win_prize',
    'reward'
));

COMMIT;
