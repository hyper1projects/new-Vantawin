-- 1. Add Tracking Columns to tournament_entries (Safe check)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'tournament_entries' AND column_name = 'total_wins') THEN
        ALTER TABLE public.tournament_entries ADD COLUMN total_wins int DEFAULT 0;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'tournament_entries' AND column_name = 'total_bets') THEN
        ALTER TABLE public.tournament_entries ADD COLUMN total_bets int DEFAULT 0;
    END IF;
END $$;


-- 2. Update Settlement Function to Calculate XP & Accuracy
CREATE OR REPLACE FUNCTION settle_matches() RETURNS TRIGGER AS $$
DECLARE
    v_bet RECORD;
    v_outcome text;
BEGIN
    -- Only run if status changed to 'completed'
    IF NEW.status = 'completed' THEN
        
        FOR v_bet IN SELECT * FROM public.bets WHERE match_id = NEW.id AND status = 'pending' LOOP
            
            -- Increment Total Bets Count
            UPDATE public.tournament_entries
            SET total_bets = total_bets + 1
            WHERE id = v_bet.entry_id;

            -- Calculate Outcome
            v_outcome := check_bet_outcome(
                v_bet.question_id,
                v_bet.option_id,
                NEW.winner, 
                NEW.home_score,
                NEW.away_score
            );

            -- Update Bet Status
            UPDATE public.bets 
            SET status = v_outcome 
            WHERE id = v_bet.id;

            -- Handle Win
            IF v_outcome = 'won' THEN
                UPDATE public.tournament_entries
                SET 
                    vanta_balance = vanta_balance + v_bet.potential_payout,
                    total_xp = total_xp + v_bet.potential_payout, -- XP = Stake * Odds (which equals potential_payout)
                    total_wins = total_wins + 1
                WHERE id = v_bet.entry_id;
            END IF;
            
        END LOOP;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
