-- Function to calculate if a bet won
-- This logic parses the option_id/question_id against the match score
CREATE OR REPLACE FUNCTION check_bet_outcome(
    p_question_id text,
    p_option_id text,
    p_winner text,
    p_home_score int,
    p_away_score int
) RETURNS text AS $$
DECLARE
    v_total_goals int;
    v_btts boolean;
BEGIN
    v_total_goals := p_home_score + p_away_score;
    v_btts := (p_home_score > 0 AND p_away_score > 0);

    -- 1. Full Time Result
    IF p_question_id = 'full_time_result' THEN
        -- Option ID format: opt_{id}_home, opt_{id}_away, opt_{id}_draw
        IF p_option_id LIKE '%_home' AND p_winner = 'Home' THEN RETURN 'won'; END IF;
        IF p_option_id LIKE '%_away' AND p_winner = 'Away' THEN RETURN 'won'; END IF;
        IF p_option_id LIKE '%_draw' AND p_winner = 'Draw' THEN RETURN 'won'; END IF;
        RETURN 'lost';
    END IF;

    -- 2. Totals (Over/Under 2.5) -- extending logic to handle generalized lines if possible or standard 2.5
    IF p_question_id = 'over_2_5_goals' THEN
        IF p_option_id LIKE '%_over_2_5' AND v_total_goals >= 3 THEN RETURN 'won'; END IF;
        IF p_option_id LIKE '%_under_2_5' AND v_total_goals < 3 THEN RETURN 'won'; END IF;
        RETURN 'lost';
    END IF;
    
    -- 3. BTTS
    IF p_question_id = 'btts' THEN
        IF p_option_id LIKE '%_yes' AND v_btts THEN RETURN 'won'; END IF;
        IF p_option_id LIKE '%_no' AND NOT v_btts THEN RETURN 'won'; END IF;
        RETURN 'lost';
    END IF;

    -- Default to void/pending if unknown market
    RETURN 'void'; 
END;
$$ LANGUAGE plpgsql;

-- Main Settlement Function
CREATE OR REPLACE FUNCTION settle_matches() RETURNS TRIGGER AS $$
DECLARE
    v_bet RECORD;
    v_outcome text;
BEGIN
    -- Only run if status changed to 'completed' / 'finished'
    -- API usually returns 'FT' or 'completed'. fetch-odds logic maps this. Assuming 'completed'.
    IF NEW.status = 'completed' THEN
        
        FOR v_bet IN SELECT * FROM public.bets WHERE match_id = NEW.id AND status = 'pending' LOOP
            
            v_outcome := check_bet_outcome(
                v_bet.question_id,
                v_bet.option_id,
                NEW.winner, -- Expects 'Home', 'Away', 'Draw' stored in matches table
                NEW.home_score,
                NEW.away_score
            );

            -- Update Bet
            UPDATE public.bets 
            SET status = v_outcome 
            WHERE id = v_bet.id;

            -- Pay out if won
            IF v_outcome = 'won' THEN
                UPDATE public.tournament_entries
                SET vanta_balance = vanta_balance + v_bet.potential_payout
                WHERE id = v_bet.entry_id;
            END IF;
            
        END LOOP;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger
DROP TRIGGER IF EXISTS trg_settle_matches ON public.matches;
CREATE TRIGGER trg_settle_matches
AFTER UPDATE OF status ON public.matches
FOR EACH ROW
WHEN (OLD.status IS DISTINCT FROM NEW.status AND NEW.status = 'completed')
EXECUTE FUNCTION settle_matches();
