import { supabase } from '@/integrations/supabase/client';

export interface PlaceBetResponse {
    success: boolean;
    new_balance: number;
    bet_id: string;
}

export const placeBet = async (
    matchId: string,
    poolId: string,
    questionId: string,
    optionId: string,
    stake: number,
    odds: number,
    matchData: any
): Promise<PlaceBetResponse> => {
    const payload = {
        match_id: matchId,
        pool_id: poolId,
        question_id: questionId,
        option_id: optionId,
        stake,
        odds
        // match_data removed to prevent circular reference errors
    };

    console.log('💰 Placing Bet Payload:', payload);

    const { data, error } = await supabase.functions.invoke('place-bet', {
        body: payload
    });

    if (error) {
        console.error('❌ Bet Placement Error (Edge Function):', error);
        // Try to parse if it's a JSON response buried in the error
        if (error instanceof Error) {
            console.error('Error Message:', error.message);
        }
        throw new Error(error.message || "Failed to place bet.");
    }

    console.log('✅ Bet Placement Success:', data);

    if (error) throw new Error(error.message);
    return data;
};
