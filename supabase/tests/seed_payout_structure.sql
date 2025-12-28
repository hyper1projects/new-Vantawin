-- Seed Payout Structure for 100-User Model (Top 25%)
-- Percentages are PER PERSON

DELETE FROM payout_structures;

-- 1st (22%)
INSERT INTO payout_structures (rank_start, rank_end, percentage) VALUES (1, 1, 22.0);

-- 2nd (13%)
INSERT INTO payout_structures (rank_start, rank_end, percentage) VALUES (2, 2, 13.0);

-- 3rd (9.5%)
INSERT INTO payout_structures (rank_start, rank_end, percentage) VALUES (3, 3, 9.5);

-- 4th (7%)
INSERT INTO payout_structures (rank_start, rank_end, percentage) VALUES (4, 4, 7.0);

-- 5th (5.75%)
INSERT INTO payout_structures (rank_start, rank_end, percentage) VALUES (5, 5, 5.75);

-- 6th (4.75%)
INSERT INTO payout_structures (rank_start, rank_end, percentage) VALUES (6, 6, 4.75);

-- 7th (4.00%)
INSERT INTO payout_structures (rank_start, rank_end, percentage) VALUES (7, 7, 4.0);

-- 8th (3.50%)
INSERT INTO payout_structures (rank_start, rank_end, percentage) VALUES (8, 8, 3.5);

-- 9th (3.00%)
INSERT INTO payout_structures (rank_start, rank_end, percentage) VALUES (9, 9, 3.0);

-- 10th (2.75%)
INSERT INTO payout_structures (rank_start, rank_end, percentage) VALUES (10, 10, 2.75);

-- 11-15 (2.00% each)
INSERT INTO payout_structures (rank_start, rank_end, percentage) VALUES (11, 15, 2.0);

-- 16-20 (1.60% each)
INSERT INTO payout_structures (rank_start, rank_end, percentage) VALUES (16, 20, 1.6);

-- 21-25 (1.35% each)
INSERT INTO payout_structures (rank_start, rank_end, percentage) VALUES (21, 25, 1.35);
