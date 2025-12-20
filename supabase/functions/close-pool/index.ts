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

        // 1. Find pools to close
        // Status 'upcoming' or 'ongoing' AND end_time < NOW
        const { data: pools, error: fetchError } = await supabaseClient
            .from('pools')
            .select('id, name')
            .in('status', ['upcoming', 'ongoing'])
            .lt('end_time', new Date().toISOString())

        if (fetchError) throw fetchError

        const closedPools = []

        for (const pool of pools) {
            // 2. Update status to 'ended'
            const { error: updateError } = await supabaseClient
                .from('pools')
                .update({ status: 'ended' })
                .eq('id', pool.id)

            if (!updateError) {
                closedPools.push(pool.name)

                // 3. Lock Entries?
                // Optional: Update all entries to 'completed' status to prevent further edits/bets?
                // Actually bets are checked against pool.status or match.start_time.
                // But good for clarity.
                await supabaseClient
                    .from('tournament_entries')
                    .update({ status: 'completed' })
                    .eq('pool_id', pool.id)
                    .eq('status', 'active')
            }
        }

        return new Response(
            JSON.stringify({
                success: true,
                closed_count: closedPools.length,
                pools: closedPools
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
