
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
    // 1. Handle CORS Preflight
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        // 2. Initialize User Client
        // We use the User's Auth Token so the RPC knows exactly who is betting (auth.uid())
        const authHeader = req.headers.get('Authorization')
        if (!authHeader) {
            throw new Error('Missing Authorization Header')
        }

        const supabase = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_ANON_KEY') ?? '', // Use Anon Key + Auth Header
            { global: { headers: { Authorization: authHeader } } }
        )

        // 3. Parse Request
        const { match_id, question_id, option_id, stake, odds } = await req.json();

        // 4. Call Database RPC
        // The RPC 'place_bet' is SECURITY DEFINER, so it has permissions to write to bets/entries
        // but it uses auth.uid() to verify the user identity.
        const { data, error } = await supabase.rpc('place_bet', {
            p_match_id: match_id,
            p_question_id: question_id,
            p_option_id: option_id,
            p_stake: stake,
            p_odds: odds
        });

        if (error) {
            console.error('RPC Error:', error);
            throw error;
        }

        if (!data.success) {
            throw new Error(data.message || 'Bet placement failed');
        }

        return new Response(
            JSON.stringify(data),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )

    } catch (error) {
        return new Response(
            JSON.stringify({ success: false, message: error.message }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        )
    }
})