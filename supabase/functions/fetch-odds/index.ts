import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { v5 as uuidv5 } from 'https://esm.sh/uuid@9.0.1'

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Fixed namespace for game ID generation to ensure stability updates
const NAMESPACE = '6ba7b810-9dad-11d1-80b4-00c04fd430c8';

const API_KEY = Deno.env.get('ODDS_API_KEY');

Deno.serve(async (req) => {
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
            const url = `https://api.the-odds-api.com/v4/sports/${league.key}/odds?regions=eu&markets=h2h,totals&apiKey=${API_KEY}`;
            const response = await fetch(url);

            if (!response.ok) {
                const errorText = await response.text();
                console.error(`Failed to fetch ${league.name} (Status: ${response.status}): ${errorText}`);
                continue;
            }

            const data = await response.json();
            if (!Array.isArray(data) || data.length === 0) {
                console.log(`No upcoming games found for ${league.name}.`);
                continue;
            }

            const mapped = data.map((game: any) => {
                let dbId;
                try {
                    dbId = uuidv5(game.id, NAMESPACE);
                } catch (e) {
                    console.error("UUID gen error", e);
                    dbId = crypto.randomUUID();
                }

                const findMarket = (gameData: any, marketKey: string) => {
                    if (!gameData.bookmakers) return null;
                    for (const bk of gameData.bookmakers) {
                        const market = bk.markets.find((m: any) => m.key === marketKey);
                        if (market && market.outcomes && market.outcomes.length > 0) {
                            return market;
                        }
                    }
                    return null;
                };

                const h2h = findMarket(game, 'h2h');
                const totals = findMarket(game, 'totals');

                if (!h2h) {
                    console.warn(`Game ${game.id} (${game.home_team} vs ${game.away_team}) is missing 'h2h' market data.`);
                }

                const h2hOutcomeHome = h2h?.outcomes.find((o: any) => o.name === game.home_team)?.price || 0;
                const h2hOutcomeAway = h2h?.outcomes.find((o: any) => o.name === game.away_team)?.price || 0;
                const h2hOutcomeDraw = h2h?.outcomes.find((o: any) => o.name === "Draw")?.price || 0;

                let notDrawOdds = 0;
                if (h2hOutcomeDraw > 1) {
                    const probDraw = 1 / h2hOutcomeDraw;
                    const probNotDraw = 1 - probDraw;
                    if (probNotDraw > 0) {
                        notDrawOdds = Math.round((1 / probNotDraw) * 100) / 100;
                    }
                }

                const getTotalsOdds = (line: number) => {
                    if (!totals) return null;
                    const over = totals.outcomes.find((o: any) => o.name === "Over" && o.point === line)?.price || 0;
                    const under = totals.outcomes.find((o: any) => o.name === "Under" && o.point === line)?.price || 0;
                    if (over === 0 || under === 0) return null;
                    return { over, under };
                };

                const getQuestionText = (line: number) => {
                    const targetGoals = Math.ceil(line);
                    return `Will there be ${targetGoals} or more goals from both teams?`;
                };

                const odds15 = getTotalsOdds(1.5);
                const odds25 = getTotalsOdds(2.5);
                const odds35 = getTotalsOdds(3.5);

                const questions = [
                    {
                        id: "full_time_result",
                        type: "win_match",
                        text: "What team will win this game?",
                        options: [
                            { id: `opt_${game.id}_home`, label: game.home_team, odds: h2hOutcomeHome },
                            { id: `opt_${game.id}_away`, label: game.away_team, odds: h2hOutcomeAway }
                        ]
                    },
                    {
                        id: "is_draw",
                        type: "is_draw",
                        text: "Will the game end as a draw?",
                        options: [
                            { id: `opt_${game.id}_draw_yes`, label: "Yes", odds: h2hOutcomeDraw },
                            { id: `opt_${game.id}_draw_no`, label: "No", odds: notDrawOdds }
                        ]
                    },
                    odds15 ? {
                        id: "over_1_5_goals",
                        type: "over_1_5_goals",
                        text: getQuestionText(1.5),
                        options: [
                            { id: `opt_${game.id}_over_1_5`, label: "Yes", odds: odds15.over },
                            { id: `opt_${game.id}_under_1_5`, label: "No", odds: odds15.under }
                        ]
                    } : null,
                    odds25 ? {
                        id: "over_2_5_goals",
                        type: "over_2_5_goals",
                        text: getQuestionText(2.5),
                        options: [
                            { id: `opt_${game.id}_over_2_5`, label: "Yes", odds: odds25.over },
                            { id: `opt_${game.id}_under_2_5`, label: "No", odds: odds25.under }
                        ]
                    } : null,
                    odds35 ? {
                        id: "over_3_5_goals",
                        type: "over_3_5_goals",
                        text: getQuestionText(3.5),
                        options: [
                            { id: `opt_${game.id}_over_3_5`, label: "Yes", odds: odds35.over },
                            { id: `opt_${game.id}_under_3_5`, label: "No", odds: odds35.under }
                        ]
                    } : null,
                ].filter(q => q && q.options.every(opt => opt.odds > 0));

                return {
                    id: dbId,
                    league: league.name,
                    home_team: {
                        name: game.home_team,
                        abbreviation: game.home_team.substring(0, 3).toUpperCase(),
                    },
                    away_team: {
                        name: game.away_team,
                        abbreviation: game.away_team.substring(0, 3).toUpperCase(),
                    },
                    start_time: game.commence_time,
                    is_live: false,
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

            const fiveHoursAgo = new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString();
            console.log(`Cleaning up matches older than: ${fiveHoursAgo}`);

            const { error: deleteError } = await supabaseClient
                .from('matches')
                .delete()
                .lt('start_time', fiveHoursAgo)
                .neq('status', 'completed'); // Don't delete completed matches - needed for bet settlement

            if (deleteError) {
                console.error("Cleanup Error:", deleteError);
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