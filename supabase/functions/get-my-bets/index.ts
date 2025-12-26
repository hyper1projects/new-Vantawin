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
            Deno.env.get('SUPABASE_ANON_KEY') ?? '',
            { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
        )

        const { data: { user } } = await supabaseClient.auth.getUser()
        if (!user) throw new Error('User not authenticated')

        const { data: entriesData, error: entriesError } = await supabaseClient
            .from('tournament_entries')
            .select('id')
            .eq('user_id', user.id);

        if (entriesError) {
            console.error(`Error fetching entries for user ${user.id}:`, entriesError);
            throw entriesError;
        }

        if (!entriesData || entriesData.length === 0) {
            return new Response(JSON.stringify([]), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
        }

        const entryIds = entriesData.map(entry => entry.id);

        const { data: betsData, error: betsError } = await supabaseClient
            .from('bets')
            .select('*, match:matches(*)')
            .in('entry_id', entryIds)
            .order('created_at', { ascending: false });

        if (betsError) {
            console.error(`Error fetching bets for entries ${entryIds}:`, betsError);
            throw betsError;
        }

        return new Response(JSON.stringify(betsData || []), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

    } catch (error) {
        return new Response(
            JSON.stringify({ error: error.message }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
        )
    }
})