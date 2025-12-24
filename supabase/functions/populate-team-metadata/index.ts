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
            .not('logo_url', 'is', null); // The key change: only select teams that HAVE a logo.
        if (metaError) throw metaError;

        const teamsWithLogosSet = new Set(existingWithLogos?.map(e => e.team_name) || []);

        // 3. Find teams that are in matches but are missing a logo.
        const teamsToFetch = [...allTeamsInMatches].filter(team => !teamsWithLogosSet.has(team));
        console.log(`Found ${teamsToFetch.length} teams missing logos.`);

        // 4. Loop and Fetch from SportsDB
        const updates = [];

        // Rate Limit Safety: 10 items per run is a safe batch size.
        for (const teamName of teamsToFetch.slice(0, 10)) {
            console.log(`Searching logo for: ${teamName}`);
            const searchName = encodeURIComponent(teamName);
            const url = `${TSDB_BASE_URL}?t=${searchName}`;

            try {
                const res = await fetch(url);
                if (!res.ok) {
                    console.error(`Failed to fetch for ${teamName}: ${res.statusText}`);
                    continue;
                }
                const data = await res.json();

                if (data.teams && data.teams.length > 0) {
                    const teamData = data.teams[0];
                    const logo = teamData.strTeamBadge || teamData.strTeamLogo || null;
                    
                    updates.push({
                        team_name: teamName,
                        logo_url: logo
                    });

                    if (!logo) {
                        console.log(`No logo found for ${teamName} in strTeamBadge or strTeamLogo.`);
                    }
                } else {
                    console.log(`No logo found for ${teamName}`);
                    // We still add it with null so we don't search for it again unless the table is cleared.
                    // Or we can choose not to add it, so it gets retried next time. Let's not add it.
                }
            } catch (err) {
                console.error(`Error processing ${teamName}:`, err);
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