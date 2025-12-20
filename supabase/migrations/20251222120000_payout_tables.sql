-- Payout & Rake Structure Tables

-- 1. Rake Structure
CREATE TABLE IF NOT EXISTS public.rake_structures (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    tier text NOT NULL UNIQUE CHECK (tier IN ('Bronze', 'Silver', 'Gold', 'Platinum')),
    percentage numeric NOT NULL CHECK (percentage >= 0 AND percentage <= 100),
    created_at timestamptz DEFAULT now()
);

-- Seed Rake Data
INSERT INTO public.rake_structures (tier, percentage) VALUES
('Bronze', 10.0),
('Silver', 8.5),
('Gold', 7.0),
('Platinum', 5.0)
ON CONFLICT (tier) DO UPDATE SET percentage = EXCLUDED.percentage;


-- 2. Payout Structure
-- Used to calculate distribution for top N ranks
CREATE TABLE IF NOT EXISTS public.payout_structures (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    rank_start int NOT NULL,
    rank_end int NOT NULL,
    percentage numeric NOT NULL CHECK (percentage >= 0 AND percentage <= 100),
    description text,
    created_at timestamptz DEFAULT now(),
    CHECK (rank_start <= rank_end)
);

-- Seed Payout Data (Based on user request)
-- Total should approximate 100%
TRUNCATE public.payout_structures;

INSERT INTO public.payout_structures (rank_start, rank_end, percentage, description) VALUES
(1, 1, 22.00, '1st Place'),
(2, 2, 13.00, '2nd Place'),
(3, 3, 9.50, '3rd Place'),
(4, 4, 7.00, '4th Place'),
(5, 5, 5.75, '5th Place'),
(6, 6, 4.75, '6th Place'),
(7, 7, 4.00, '7th Place'),
(8, 8, 3.50, '8th Place'),
(9, 9, 3.00, '9th Place'),
(10, 10, 2.75, '10th Place'),
(11, 15, 2.00, '11th-15th Place (Each? No, assuming Split or Pool %?) 
-- Re-reading User Request: "11-15 | 2.00% | $9.00" (Total $450 pot). 2% of 450 is 9.
-- So 2.00% is the TOTAL allocated to this bracket? Or PER person?
-- 9$ is 2% of 450. So it is PER PERSON.
-- Wait, table says: "Rank | % of Pool | $ Payout"
-- 11-15 | 2.00% | $9.00. 
-- If there are 5 people (11,12,13,14,15). 5 * 9 = $45. 
-- 2% * 5 = 10%. 
-- Let us sum the single percentages first.
-- 22+13+9.5+7+5.75+4.75+4+3.5+3+2.75 = 75.25%.
-- Remaining: 100 - 75.25 = 24.75%.
-- 11-15 (5 people). If 2% each -> 10%.
-- 16-20 (5 people). If 1.6% each -> 8%.
-- 21-25 (5 people). If 1.35% each -> 6.75%.
-- Total Remaining: 10 + 8 + 6.75 = 24.75%.
-- Matches perfectly!
-- So the percentage in table is PER RANK in that range.
');

INSERT INTO public.payout_structures (rank_start, rank_end, percentage, description) VALUES
(11, 15, 2.00, '11th-15th Place (Per Person)'),
(16, 20, 1.60, '16th-20th Place (Per Person)'),
(21, 25, 1.35, '21st-25th Place (Per Person)');
