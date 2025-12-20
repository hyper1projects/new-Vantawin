-- Function to increment user balance (used by payment webhook)
CREATE OR REPLACE FUNCTION increment_balance(
    p_user_id uuid,
    p_amount numeric
) RETURNS void AS $$
BEGIN
    UPDATE public.users
    SET real_money_balance = real_money_balance + p_amount,
        updated_at = now()
    WHERE id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
