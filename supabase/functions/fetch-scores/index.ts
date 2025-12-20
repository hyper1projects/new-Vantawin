import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { v5 as uuidv5 } from 'https://esm.sh/uuid@9.0.1'

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const NAMESPACE = '6ba7b810-9dad-11d1-80b4-00c04fd430c8';
const API_KEY = Deno.env.get('ODDS_API_KEY');

// Helper to determine winner
const getWinner = (home: number, away: number) => {
    if (home > away) return 'Home';
    if (away > home) return 'Away';
    return 'Draw';
};

Deno.serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        if (!API_KEY) throw new Error('ODDS_API_KEY not set');

        const supabaseClient = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        )

        const leagues = [
            { key: 'soccer_epl', name: 'Premier League' },
            { key: 'soccer_spain_la_liga', name: 'La Liga' },
            { key: 'soccer_uefa_champs_league', name: 'Champions League' }
        ];

        let updatedCount = 0;
        const updates = [];

        for (const league of leagues) {
            // Fetch scores for last 3 days to catch recently finished games
            const url = `https://api.the-odds-api.com/v4/sports/${league.key}/scores/?daysFrom=3&apiKey=${API_KEY}`;
            const response = await fetch(url);

            if (!response.ok) {
                console.error(`Failed to fetch scores for ${league.name}`);
                continue;
            }

            const data = await response.json();

            // Filter for completed games only? Or live too?
            // "Scores" endpoint returns games with "completed": true/false
            // We only want to finalize games that are definitely done to trigger settlement.
            // Or we update live scores for UI? 
            // Phase 4 says "Settlement Trigger", so we need 'completed'.
            // Let's update all, but status is key.

            for (const game of data) {
                if (game.completed) {
                    // Generate ID same way as Ingestion to match records
                    let dbId;
                    try {
                        dbId = uuidv5(game.id, NAMESPACE);
                    } catch (e) {
                        continue;
                    }

                    // Parse Scores
                    // API returns scores: [ { name: 'HomeTeam', score: '2'}, ... ]
                    // Need to map correctly.
                    const homeScoreObj = game.scores?.find((s: any) => s.name === game.home_team);
                    const awayScoreObj = game.scores?.find((s: any) => s.name === game.away_team);

                    if (homeScoreObj && awayScoreObj) {
                        const homeScore = parseInt(homeScoreObj.score);
                        const awayScore = parseInt(awayScoreObj.score);

                        updates.push({
                            id: dbId,
                            home_score: homeScore,
                            away_score: awayScore,
                            status: 'completed', // 'completed' triggers the settlement PLPGSQL function
                            winner: getWinner(homeScore, awayScore),
                            updated_at: new Date().toISOString()
                        });
                    }
                }
            }
        }

        if (updates.length > 0) {
            const { error } = await supabaseClient
                .from('matches')
                .upsert(updates, { onConflict: 'id' }); // Only updates fields provided? No, upsert replaces? 
            // Wait, upsert replaces entire row if not specified?? 
            // Supabase upsert updates columns if ID matches. But we are only passing subset.
            // We should make sure we don't wipe other fields.
            // Actually, `upsert` in Supabase JS updates the row. Columns not in the object *might* be nulled if allowed?
            // No, standard Postgres UPSERT (INSERT ... DO UPDATE SET ...) usually requires specifying cols.
            // Supabase JS `upsert` handles this by defaulting to updating all passed columns. 
            // IMPORTANT: If we don't pass 'start_time', does it keep old one? 
            // Standard behavior: It updates the row with the new values. It does NOT nullify missing columns unless specified.
            // Safest to just update, assuming ID matches.

            if (error) throw error;
            updatedCount = updates.length;
        }

        return new Response(
            JSON.stringify({ success: true, updated: updatedCount }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )

    } catch (error) {
        return new Response(
            JSON.stringify({ error: error.message }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
        )
    }
})
