import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// TheSportsDB Free Key is '3'. 
const TSDB_API_KEY = "3";
const TSDB_BASE_URL = `https://www.thesportsdb.com/api/v1/json/${TSDB_API_KEY}/searchteams.php`;

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const supabase = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        );

        // 1. Get all unique team names from your matches.
        const { data: matches, error: matchError } = await supabase.from('matches').select('home_team, away_team');
        if (matchError) throw matchError;
        if (!matches) return new Response(JSON.stringify({ message: "No matches found" }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });

        const allTeamsInMatches = new Set<string>();
        matches.forEach((m: any) => {
            const homeName = m.home_team?.name || m.home_team;
            const awayName = m.away_team?.name || m.away_team;

            if (typeof homeName === 'string') allTeamsInMatches.add(homeName);
            if (typeof awayName === 'string') allTeamsInMatches.add(awayName);
        });

        // 2. Get all teams we ALREADY have logos for.
        const { data: existingWithLogos, error: metaError } = await supabase
            .from('team_metadata')
            .select('team_name')
            .not('logo_url', 'is', null);
        if (metaError) throw metaError;

        const teamsWithLogosSet = new Set(existingWithLogos?.map(e => e.team_name) || []);

        // 3. Find teams that are in matches but are missing a logo.
        const teamsToFetch = [...allTeamsInMatches].filter(team => !teamsWithLogosSet.has(team));
        console.log(`Found ${teamsToFetch.length} teams missing logos.`);

        // 4. Loop and Fetch from SportsDB with smarter search
        const updates = [];

        for (const teamName of teamsToFetch.slice(0, 10)) { // Process in batches
            console.log(`Searching logo for: ${teamName}`);
            let teamData = null;

            // First attempt: Exact match
            const exactSearchUrl = `${TSDB_BASE_URL}?t=${encodeURIComponent(teamName)}`;
            const exactRes = await fetch(exactSearchUrl);
            const exactData = await exactRes.json();

            if (exactData.teams && exactData.teams.length > 0) {
                teamData = exactData.teams[0];
            } else {
                // Second attempt: Simplified name
                const simplifiedName = teamName.replace(/ FC| AFC| SC| United| City/gi, '').trim();
                if (simplifiedName.toLowerCase() !== teamName.toLowerCase()) {
                    console.log(`... exact match failed, trying simplified name: "${simplifiedName}"`);
                    const simplifiedSearchUrl = `${TSDB_BASE_URL}?t=${encodeURIComponent(simplifiedName)}`;
                    const simplifiedRes = await fetch(simplifiedSearchUrl);
                    const simplifiedData = await simplifiedRes.json();
                    if (simplifiedData.teams && simplifiedData.teams.length > 0) {
                        teamData = simplifiedData.teams[0];
                    }
                }
            }

            if (teamData) {
                const logo = teamData.strTeamBadge || teamData.strTeamLogo || null;
                updates.push({
                    team_name: teamName, // Always use the original name as the key
                    logo_url: logo
                });
                if (!logo) {
                    console.log(`Found team for "${teamName}" but no logo URL was present.`);
                }
            } else {
                console.log(`No logo found for "${teamName}" after both attempts.`);
                // Add a record with a null logo so we don't keep searching for it.
                updates.push({
                    team_name: teamName,
                    logo_url: null
                });
            }
        }

        // 5. Save to DB
        if (updates.length > 0) {
            const { error } = await supabase.from('team_metadata').upsert(updates, { onConflict: 'team_name' });
            if (error) throw error;
        }

        return new Response(JSON.stringify({
            processed: updates.length,
            teams: updates.map(u => u.team_name)
        }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });

    } catch (error) {
        console.error("Function error:", error);
        return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
});