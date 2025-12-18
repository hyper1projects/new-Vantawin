import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { v5 as uuidv5 } from 'https://esm.sh/uuid@9.0.1'

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Fixed namespace for game ID generation to ensure stability updates
const NAMESPACE = '6ba7b810-9dad-11d1-80b4-00c04fd430c8';

// IMPORTANT: Ensure ODDS_API_KEY is set in Supabase Edge Function secrets.
// Removed hardcoded fallback to ensure the environment variable is used.
const API_KEY = Deno.env.get('ODDS_API_KEY'); 

Deno.serve(async (req) => {
    // Handle CORS
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        if (!API_KEY) {
            console.error('ODDS_API_KEY is not set in environment variables.');
            return new Response(JSON.stringify({ error: 'ODDS_API_KEY is not configured.' }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 500,
            });
        }

        const supabaseClient = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        )

        const leagues = [
            { key: 'soccer_epl', name: 'Premier League' },
            { key: 'soccer_spain_la_liga', name: 'La Liga' },
            { key: 'soccer_uefa_champs_league', name: 'Champions League' }
        ];

        const allMatches = [];

        console.log("Starting fetch process for odds...");

        for (const league of leagues) {
            console.log(`Fetching ${league.name}...`);
            const url = `https://api.the-odds-api.com/v4/sports/${league.key}/odds?regions=eu&markets=h2h,totals,btts&apiKey=${API_KEY}`;
            const response = await fetch(url);

            if (!response.ok) {
                const errorText = await response.text();
                console.error(`Failed to fetch ${league.name} (Status: ${response.status}): ${errorText}`);
                // If the API key is invalid or rate-limited, it often returns a 401 or 429 status.
                // We should log this more clearly.
                if (response.status === 401) {
                    console.error('API Key Unauthorized: Please check your ODDS_API_KEY.');
                } else if (response.status === 429) {
                    console.error('API Rate Limit Exceeded: You might have used up your daily requests.');
                }
                continue;
            }

            const data = await response.json();

            if (!Array.isArray(data)) {
                console.error(`Invalid data format for ${league.name}`, data);
                continue;
            }

            const mapped = data.map((game: any) => {
                // Generate standard UUIDv5 from valid API ID string
                let dbId;
                try {
                    const data = new TextEncoder().encode(game.id);
                    dbId = uuidv5(game.id, NAMESPACE);
                } catch (e) {
                    console.error("UUID gen error", e);
                    dbId = crypto.randomUUID();
                }

                const bookmaker = game.bookmakers && game.bookmakers[0]; // Use first available
                const h2h = bookmaker?.markets?.find((m: any) => m.key === "h2h");
                const totals = bookmaker?.markets?.find((m: any) => m.key === "totals");
                const btts = bookmaker?.markets?.find((m: any) => m.key === "btts");

                const h2hOutcomeHome = h2h?.outcomes.find((o: any) => o.name === game.home_team)?.price || 0;
                const h2hOutcomeAway = h2h?.outcomes.find((o: any) => o.name === game.away_team)?.price || 0;
                const h2hOutcomeDraw = h2h?.outcomes.find((o: any) => o.name === "Draw")?.price || 0;

                // Calculate "Not Draw" odds
                let notDrawOdds = 0;
                if (h2hOutcomeDraw > 1) {
                    const probDraw = 1 / h2hOutcomeDraw;
                    const probNotDraw = 1 - probDraw;
                    if (probNotDraw > 0) {
                        notDrawOdds = Math.round((1 / probNotDraw) * 100) / 100;
                    }
                }

                // Build Questions (JSONB)
                const questions = [
                    {
                        id: "full_time_result",
                        type: "win_match",
                        text: "What team will win this game?",
                        options: [
                            {
                                id: `opt_${game.id}_home`,
                                label: game.home_team,
                                odds: h2hOutcomeHome
                            },
                            {
                                id: `opt_${game.id}_away`,
                                label: game.away_team,
                                odds: h2hOutcomeAway
                            }
                        ]
                    },
                    {
                        id: "is_draw",
                        type: "is_draw",
                        text: "Will the game end as a draw?",
                        options: [
                            {
                                id: `opt_${game.id}_draw_yes`,
                                label: "Yes",
                                odds: h2hOutcomeDraw
                            },
                            {
                                id: `opt_${game.id}_draw_no`,
                                label: "No",
                                odds: notDrawOdds
                            }
                        ]
                    },
                    totals ? {
                        id: "over_2_5_goals",
                        type: "over_2_5_goals",
                        text: "Will there be 3 or more goals?",
                        options: [
                            {
                                id: `opt_${game.id}_over_2_5`,
                                label: "Yes",
                                odds: totals.outcomes.find((o: any) => o.name === "Over")?.price || 0
                            },
                            {
                                id: `opt_${game.id}_under_2_5`,
                                label: "No",
                                odds: totals.outcomes.find((o: any) => o.name === "Under")?.price || 0
                            }
                        ]
                    } : null,
                    btts ? {
                        id: "btts",
                        type: "btts",
                        text: "Will both teams score?",
                        options: [
                            {
                                id: `opt_${game.id}_btts_yes`,
                                label: "Yes",
                                odds: btts.outcomes.find((o: any) => o.name === "Yes")?.price || 0
                            },
                            {
                                id: `opt_${game.id}_btts_no`,
                                label: "No",
                                odds: btts.outcomes.find((o: any) => o.name === "No")?.price || 0
                            }
                        ]
                    } : null
                ].filter(Boolean);

                return {
                    id: dbId,
                    league: league.name,
                    home_team: {
                        name: game.home_team,
                        abbreviation: game.home_team.substring(0, 3).toUpperCase(),
                        // logo? Frontend often hardcodes or uses identifier
                    },
                    away_team: {
                        name: game.away_team,
                        abbreviation: game.away_team.substring(0, 3).toUpperCase()
                    },
                    start_time: game.commence_time,
                    is_live: false, // API live field logic needed? for now default false or calculate
                    status: 'scheduled',
                    questions: questions
                };
            });

            allMatches.push(...mapped);
        }

        if (allMatches.length > 0) {
            const { error } = await supabaseClient
                .from('matches')
                .upsert(allMatches, { onConflict: 'id' });

            if (error) {
                console.error('Supabase Upsert Error:', error);
                throw error;
            }
        }

        return new Response(JSON.stringify({ success: true, count: allMatches.length }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })

    } catch (error) {
        console.error("General Error", error);
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 500,
        })
    }
})