import { supabase } from '@/integrations/supabase/client';

export interface PlaceBetResponse {
    success: boolean;
    new_balance: number;
    bet_id: string;
}

export const placeBet = async (
    matchId: string,
    poolId: string,
    outcome: string,
    stake: number,
    odds: number,
    matchData: any
): Promise<PlaceBetResponse> => {
    const { data, error } = await supabase.functions.invoke('place-bet', {
        body: {
            match_id: matchId,
            pool_id: poolId,
            outcome,
            stake,
            odds,
            match_data: matchData
        }
    });

    if (error) throw new Error(error.message);
    return data;
};
