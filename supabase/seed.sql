-- SEED DATA
-- Runs automatically after `supabase db reset`
-- Use this to populate 'Static' data like Pools and Matches for testing.

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

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

-- 5. Generate Test Users and Entries (Dynamic)
DO $$
DECLARE
    v_pool_id uuid;
    v_user_id uuid;
    i integer;
BEGIN
    -- Create a specific pool for these bots if it doesn't exist
    INSERT INTO public.pools (name, description, tier, entry_fee, status, total_pot, start_time, end_time)
    VALUES ('Bot Battle Royale', 'A test pool populated with AI bots.', 'Bronze', 5, 'ongoing', 50, NOW(), NOW() + interval '7 days')
    RETURNING id INTO v_pool_id;

    -- Create 10 Bots
    FOR i IN 1..10 LOOP
        v_user_id := gen_random_uuid();
        
        -- Insert into auth.users 
        -- This WILL TRIGGER 'on_auth_user_created' which inserts into public.users automatically
        INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, recovery_sent_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token, email_change, email_change_token_new, recovery_token)
        VALUES (
            v_user_id, 
            '00000000-0000-0000-0000-000000000000',
            'authenticated',
            'authenticated',
            'bot_' || i || '@vantawin.test', 
            crypt('password123', gen_salt('bf')),
            now(),
            now(),
            now(),
            '{"provider": "email", "providers": ["email"]}',
            jsonb_build_object('username', 'bot_user_' || i), -- Pass username here so trigger uses it
            now(),
            now(),
            '',
            '',
            '',
            ''
        );

        -- Update the automatically created public.users record
        -- (The trigger creates it with 0 balance, we want 100)
        UPDATE public.users 
        SET 
            first_name = 'Bot',
            last_name = i::text,
            real_money_balance = 100
        WHERE id = v_user_id;

        -- Enter Pool
        INSERT INTO public.tournament_entries (user_id, pool_id, vanta_balance)
        VALUES (v_user_id, v_pool_id, 1000);
        
    END LOOP;
END $$;