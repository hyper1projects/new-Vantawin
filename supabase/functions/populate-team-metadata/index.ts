import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const API_FOOTBALL_KEY = Deno.env.get('API_FOOTBALL_KEY');
const API_FOOTBALL_HOST = 'v3.football.api-sports.io';

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Map our league names to the IDs used by API-Football
const leagueIdMap: { [key: string]: number } = {
    'Premier League': 39,
    'La Liga': 140,
    'Champions League': 2,
};

Deno.serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        if (!API_FOOTBALL_KEY) {
            throw new Error('API_FOOTBALL_KEY is not set. Please add it to your project secrets.');
        }

        const supabase = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        );

        // 1. Get all unique team names and their leagues from your matches.
        const { data: matches, error: matchError } = await supabase.from('matches').select('home_team, away_team, league');
        if (matchError) throw matchError;
        if (!matches) return new Response(JSON.stringify({ message: "No matches found" }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });

        const teamLeagueMap = new Map<string, string>();
        matches.forEach((m: any) => {
            const homeName = m.home_team?.name;
            const awayName = m.away_team?.name;
            if (homeName) teamLeagueMap.set(homeName, m.league);
            if (awayName) teamLeagueMap.set(awayName, m.league);
        });
        const allTeamsInMatches = Array.from(teamLeagueMap.keys());

        // 2. Get all teams we ALREADY have logos for.
        const { data: existingWithLogos, error: metaError } = await supabase
            .from('team_metadata')
            .select('team_name')
            .not('logo_url', 'is', null);
        if (metaError) throw metaError;

        const teamsWithLogosSet = new Set(existingWithLogos?.map(e => e.team_name) || []);

        // 3. Find teams that are in matches but are missing a logo.
        const teamsToFetch = allTeamsInMatches.filter(team => !teamsWithLogosSet.has(team));
        console.log(`Found ${teamsToFetch.length} teams missing logos.`);

        if (teamsToFetch.length === 0) {
            return new Response(JSON.stringify({ message: "All team logos are up to date.", processed: 0 }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
        }

        // 4. Loop and Fetch from API-Football
        const updates = [];
        const currentSeason = new Date().getFullYear();

        // Process in batches to avoid hitting API rate limits
        for (const teamName of teamsToFetch.slice(0, 10)) { // Batch of 10
            console.log(`Searching logo for: ${teamName}`);
            const leagueName = teamLeagueMap.get(teamName);
            const leagueId = leagueName ? leagueIdMap[leagueName] : null;

            if (!leagueId) {
                console.warn(`No league ID mapping for team "${teamName}" in league "${leagueName}". Skipping.`);
                continue;
            }

            const searchUrl = `https://${API_FOOTBALL_HOST}/teams?search=${encodeURIComponent(teamName)}&league=${leagueId}&season=${currentSeason}`;

            const apiResponse = await fetch(searchUrl, {
                headers: {
                    'x-rapidapi-host': API_FOOTBALL_HOST,
                    'x-rapidapi-key': API_FOOTBALL_KEY,
                },
            });

            if (!apiResponse.ok) {
                console.error(`API-Football request failed for "${teamName}": ${apiResponse.status} ${apiResponse.statusText}`);
                continue;
            }

            const apiData = await apiResponse.json();

            if (apiData.response && apiData.response.length > 0) {
                const bestMatch = apiData.response[0]; // The first result is usually the best when filtered by league
                const { team } = bestMatch;

                if (team.id && team.logo) {
                    updates.push({
                        team_name: teamName,
                        api_football_id: team.id,
                        logo_url: team.logo,
                        league_name: leagueName,
                    });
                    console.log(`Found logo for "${teamName}" (ID: ${team.id})`);
                } else {
                    updates.push({ team_name: teamName, logo_url: null });
                }
            } else {
                console.log(`No logo found for "${teamName}" in league ID ${leagueId}.`);
                updates.push({ team_name: teamName, logo_url: null });
            }
        }

        // 5. Save to DB
        if (updates.length > 0) {
            console.log(`Upserting ${updates.length} team metadata records.`);
            const { error } = await supabase.from('team_metadata').upsert(updates, { onConflict: 'team_name' });
            if (error) {
                console.error("Supabase upsert error:", error);
            }
        }

        return new Response(JSON.stringify({
            message: `Processed ${updates.length} teams. Run again if more are missing.`,
            processed: updates.length,
            teams: updates.map(u => u.team_name)
        }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });

    } catch (error) {
        console.error("Function error:", error);
        return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
});