import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const supabaseClient = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        )

        // 1. Find pools pending distribution
        // Status 'ended' (Settled pools are 'settled')
        const { data: pools, error: fetchError } = await supabaseClient
            .from('pools')
            .select('id, name')
            .eq('status', 'ended')

        if (fetchError) throw fetchError

        const results = []

        for (const pool of pools) {
            // 2. Call the Distribution RPC
            const { data: distResult, error: distError } = await supabaseClient.rpc('distribute_pool_rewards', {
                p_pool_id: pool.id
            })

            if (distError) {
                console.error(`Failed to distribute pool ${pool.id}`, distError)
                results.push({ pool: pool.name, error: distError.message })
            } else {
                results.push({ pool: pool.name, result: distResult })
            }
        }

        return new Response(
            JSON.stringify({
                success: true,
                processed_count: results.length,
                details: results
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
