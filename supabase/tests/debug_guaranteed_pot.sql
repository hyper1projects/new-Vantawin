-- Check if the column exists by selecting it
SELECT id, name, total_pot, guaranteed_pot FROM public.pools LIMIT 5;

-- Update a pool to have a guaranteed pot to test the UI
UPDATE public.pools 
SET guaranteed_pot = 10000 
WHERE id = (
    SELECT id 
    FROM public.pools 
    WHERE status = 'ongoing' 
    LIMIT 1
);
