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

        // 1. Get Active Pool
        const { data: poolId, error: poolError } = await supabaseClient
            .rpc('get_active_pool_id')

        if (poolError) throw poolError
        if (!poolId) {
            return new Response(
                JSON.stringify({ has_entry: false, message: 'No active pool found' }),
                { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        // 2. Check for Entry
        const { data: entry, error: entryError } = await supabaseClient
            .from('tournament_entries')
            .select('vanta_balance')
            .eq('user_id', user.id)
            .eq('pool_id', poolId)
            .maybeSingle()

        if (entryError) throw entryError

        return new Response(
            JSON.stringify({
                has_entry: !!entry,
                vanta_balance: entry?.vanta_balance || 0,
                pool_id: poolId
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
