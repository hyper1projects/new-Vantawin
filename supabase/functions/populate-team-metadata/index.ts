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

        // 1. Get all unique team names from your matches that are NOT in team_metadata yet

        // A. Get all teams currently in matches (Home and Away)
        const { data: matches, error: matchError } = await supabase.from('matches').select('home_team, away_team');
        if (matchError) throw matchError;
        if (!matches) return new Response(JSON.stringify({ message: "No matches found" }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });

        const allTeams = new Set<string>();
        matches.forEach((m: any) => {
            const homeName = m.home_team?.name || m.home_team;
            const awayName = m.away_team?.name || m.away_team;

            if (typeof homeName === 'string') allTeams.add(homeName);
            if (typeof awayName === 'string') allTeams.add(awayName);
        });

        // B. Get all teams we already have logos for
        const { data: existing, error: metaError } = await supabase.from('team_metadata').select('team_name');
        if (metaError) throw metaError;

        const existingSet = new Set(existing?.map(e => e.team_name) || []);

        // C. Find the missing ones
        const missingTeams = [...allTeams].filter(team => !existingSet.has(team));
        console.log(`Found ${missingTeams.length} missing logos.`);

        // 2. Loop and Fetch from SportsDB
        const updates = [];

        // Rate Limit Safety: 10 items per run is a safe batch size.
        for (const teamName of missingTeams.slice(0, 10)) {
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
                    // IMPROVED: Check for logo in order of preference.
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
                    updates.push({ team_name: teamName, logo_url: null });
                }
            } catch (err) {
                console.error(`Error processing ${teamName}:`, err);
            }
        }

        // 3. Save to DB
        if (updates.length > 0) {
            const { error } = await supabase.from('team_metadata').upsert(updates);
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