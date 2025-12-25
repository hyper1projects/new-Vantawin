import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// GitHub Repo Config
const GITHUB_USER = 'luukhopman';
const GITHUB_REPO = 'football-logos';
const GITHUB_BRANCH = 'master';
const CDN_BASE = `https://cdn.jsdelivr.net/gh/${GITHUB_USER}/${GITHUB_REPO}@${GITHUB_BRANCH}/logos`;

// League Mapping
// Maps VantaWin League Name -> GitHub Repo Folder Name
const LEAGUE_FOLDERS: { [key: string]: string } = {
    'Premier League': 'England - Premier League',
    'La Liga': 'Spain - LaLiga',
    // Champions League teams are scattered across their domestic leagues.
    // We will use a search list for them.
};

// Folders to search for Champions League teams (Big 5 + others)
const SEARCH_FOLDERS_FOR_CL = [
    'England - Premier League',
    'Spain - LaLiga',
    'Germany - Bundesliga',
    'Italy - Serie A',
    'France - Ligue 1',
    'Netherlands - Eredivisie',
    'Portugal - Liga Portugal'
];

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

        // 4. Loop and Search on GitHub
        const updates = [];
        // Process in batches (Testing with 50)
        for (const teamName of teamsToFetch.slice(0, 50)) {
            console.log(`Searching logo for: ${teamName}`);
            const leagueName = teamLeagueMap.get(teamName);

            let foldersToSearch: string[] = [];

            if (leagueName === 'Champions League') {
                foldersToSearch = SEARCH_FOLDERS_FOR_CL;
            } else if (leagueName && LEAGUE_FOLDERS[leagueName]) {
                foldersToSearch = [LEAGUE_FOLDERS[leagueName]];
            } else {
                console.warn(`Unknown league mapping for "${leagueName}". Will search all common folders.`);
                foldersToSearch = SEARCH_FOLDERS_FOR_CL;
            }

            let foundUrl: string | null = null;

            // Name variations to try
            const nameVariations = [
                teamName, // "Arsenal"
                `${teamName} FC`, // "Arsenal FC"
                `${teamName} AFC`, // "Sunderland AFC"
                teamName.replace(/ FC$/i, ''), // "Arsenal FC" -> "Arsenal"
                teamName.replace(/ AFC$/i, ''), // "Sunderland AFC" -> "Sunderland"
            ];

            // Clean variations (trim and unique)
            const uniqueVariations = [...new Set(nameVariations.map(n => n.trim()))];

            outerLoop:
            for (const folder of foldersToSearch) {
                for (const nameVariant of uniqueVariations) {
                    // Try to fetch HEAD to check existence
                    const fileName = `${nameVariant}.png`;
                    // Encode segments
                    const url = `${CDN_BASE}/${encodeURIComponent(folder)}/${encodeURIComponent(fileName)}`;

                    try {
                        const response = await fetch(url, { method: 'HEAD' });
                        if (response.ok) {
                            foundUrl = url;
                            console.log(`FOUND: ${url}`);
                            break outerLoop;
                        }
                    } catch (e) {
                        // Ignore fetch errors
                    }
                }
            }

            if (foundUrl) {
                updates.push({
                    team_name: teamName,
                    logo_url: foundUrl,
                    league_name: leagueName,
                });
            } else {
                console.log(`No logo found for "${teamName}" in searched folders.`);
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
            message: `Processed ${updates.length} teams.`,
            processed: updates.length,
            found: updates.filter(u => u.logo_url).length,
            teams: updates.map(u => u.team_name)
        }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });

    } catch (error) {
        console.error("Function error:", error);
        return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
});