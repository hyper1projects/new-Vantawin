import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// CORS headers for frontend access
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
        // 2. Create a Supabase client with the user's authentication token.
        // This is crucial so that the `place_bet` function's security rules and `auth.uid()` work correctly.
        const supabase = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_ANON_KEY') ?? '', // Use anon key for user-level access
            { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
        )

        // 3. Verify the user is properly authenticated.
        const { data: { user }, error: authError } = await supabase.auth.getUser()
        if (authError || !user) throw new Error('Unauthorized: User not found.')

        // 4. Parse the request body to match the `place_bet` database function's signature.
        const { p_match_id, p_question_id, p_option_id, p_stake, p_odds } = await req.json();

        // 5. Call the existing `place_bet` RPC function.
        // This database function handles all the complex logic atomically:
        // - Finds the user's active tournament entry.
        // - Validates the match has not started.
        // - Checks for sufficient Vanta balance.
        // - Deducts the stake and inserts the bet record.
        const { data, error: rpcError } = await supabase.rpc('place_bet', {
            p_match_id,
            p_question_id,
            p_option_id,
            p_stake,
            p_odds
        });

        if (rpcError) {
            // Forward the specific, user-friendly error from the database function.
            throw new Error(rpcError.message);
        }

        // The RPC returns a JSONB object with the result, which we forward directly to the client.
        return new Response(
            JSON.stringify(data),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
        )

    } catch (error) {
        // Catches errors from authentication, request parsing, or the database function.
        return new Response(
            JSON.stringify({ success: false, message: error.message }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        )
    }
})