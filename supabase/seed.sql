-- SEED DATA
-- Runs automatically after `supabase db reset`
-- Use this to populate 'Static' data like Pools and Matches for testing.

-- 1. Create an Active Pool (Bronze Tier, $5 Entry)
INSERT INTO public.pools (
    name, 
    description, 
    image_url, 
    tier, 
    entry_fee, 
    max_participants, 
    start_time, 
    end_time, 
    status, 
    total_pot
) VALUES (
    'Weekly Bronze Clash', 
    'The standard weekly competition for new players.', 
    'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80', -- Generic Trophy/Sport Image
    'Bronze', 
    5, 
    1000, 
    NOW() - INTERVAL '1 day', -- Started yesterday
    NOW() + INTERVAL '6 days', -- Ends in 6 days
    'ongoing',
    500 -- Seed pot with some fake money
);

-- 2. Create some Dummy Matches for Betting
INSERT INTO public.matches (
    league, 
    home_team, 
    away_team, 
    start_time, 
    status, 
    home_score, 
    away_score, 
    questions
) VALUES 
-- Match 1: Premier League (Upcoming)
(
    'Premier League', 
    '{"name": "Arsenal", "abbreviation": "ARS"}', 
    '{"name": "Liverpool", "abbreviation": "LIV"}', 
    NOW() + INTERVAL '2 days', 
    'scheduled', 
    NULL, 
    NULL,
    '[
        {"id": "full_time_result", "type": "win_match", "text": "Who will win?", "options": [{"id": "opt_home", "label": "Arsenal", "odds": 2.10}, {"id": "opt_away", "label": "Liverpool", "odds": 3.40}]},
        {"id": "over_2_5_goals", "type": "over_2_5_goals", "text": "Over 2.5 Goals?", "options": [{"id": "opt_over", "label": "Yes", "odds": 1.70}, {"id": "opt_under", "label": "No", "odds": 2.10}]}
    ]'::jsonb
),
-- Match 2: La Liga (Live)
(
    'La Liga', 
    '{"name": "Real Madrid", "abbreviation": "RMA"}', 
    '{"name": "Barcelona", "abbreviation": "BAR"}', 
    NOW() - INTERVAL '30 minutes', 
    'live', 
    1, 
    1,
    '[
        {"id": "full_time_result", "type": "win_match", "text": "Who will win?", "options": [{"id": "opt_home", "label": "Real Madrid", "odds": 2.50}, {"id": "opt_away", "label": "Barcelona", "odds": 2.80}]}
    ]'::jsonb
);

-- 3. Rake Structures (Required for Settlement)
INSERT INTO public.rake_structures (tier, percentage) VALUES
('Bronze', 10),
('Silver', 8),
('Gold', 5),
('Platinum', 3)
ON CONFLICT (tier) DO NOTHING;

-- 4. Payout Structures (Top 25% curve)
-- Corrected Columns: rank_start, rank_end, percentage, description
INSERT INTO public.payout_structures (rank_start, rank_end, percentage, description) VALUES
(1, 1, 15.0, '1st Place'),
(2, 2, 10.0, '2nd Place'),
(3, 3, 8.0, '3rd Place'),
(4, 10, 5.0, 'Runners Up') -- Example range
ON CONFLICT DO NOTHING;
