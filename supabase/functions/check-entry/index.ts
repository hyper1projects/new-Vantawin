import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0',
}

Deno.serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const supabaseClient = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_ANON_KEY') ?? '',
            { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
        )

        const { data: { user }, error: userError } = await supabaseClient.auth.getUser()
        if (userError || !user) throw new Error('Unauthorized')

        // 1. Get User's Active Entry
        // [UPDATED] Check specifically for THIS user's entry, not just a global pool.
        const { data: entryData, error: rpcError } = await supabaseClient
            .rpc('get_user_active_entry', { p_user_id: user.id })

        if (rpcError) throw rpcError

        if (!entryData) {
            // If user has no entry, we might still want to know if there is a global pool to join?
            // For the gatekeeper, false is enough.
            return new Response(
                JSON.stringify({ has_entry: false, message: 'No active entry found' }),
                { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        return new Response(
            JSON.stringify({
                has_entry: true,
                vanta_balance: entryData.vanta_balance || 0,
                pool_id: entryData.pool_id
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )

    } catch (error) {
        return new Response(
            JSON.stringify({ error: error.message }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        )
    }
})
