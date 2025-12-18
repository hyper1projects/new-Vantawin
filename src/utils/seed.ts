import { supabase } from '../integrations/supabase/client';
import { allGamesData } from '../data/games';
import { Game } from '../types/game';

// Helper to ensure we have valid UUIDs for our seed data so upsert works.
// Simple deterministic mapping for the mock "game-X" IDs.
const getUuidForGameId = (id: string): string => {
    const num = id.replace('game-', '');
    // Helper to pad with zeros
    const padded = num.padStart(12, '0');
    // Return a valid UUID-like string (version 4 variant is best, but for seed simple is okay if it passes parsing)
    // Actually, let's just use strict UUID v4 format to be safe with Postgres uuid parser.
    // We'll just stick the number at the end.
    return `00000000-0000-0000-0000-${padded}`;
};

export const seedMatches = async () => {
    console.log('Seeding matches...');

    const matchesToInsert = allGamesData.map((game: Game) => {
        // 1. Transform ID
        const dbId = getUuidForGameId(game.id);

        // 2. Prepare payload matching SupabaseMatch (but for insert, keys must match DB columns exactly)
        return {
            id: dbId,
            start_time: game.start_time,
            league: game.league,
            is_live: game.isLive,
            home_team: game.team1, // The DB expects jsonb, client handles object->json automatically
            away_team: game.team2,
            questions: game.questions,
            // Default status if needed, though DB handles it.
            // We don't map time/date/gameView as they are frontend derived.
        };
    });

    const { data, error } = await supabase
        .from('matches')
        .upsert(matchesToInsert, { onConflict: 'id' }) // Make sure to upsert based on the UUID
        .select();

    if (error) {
        console.error('Error seeding matches:', error);
        return { success: false, error };
    }

    console.log('Successfully seeded matches:', data);
    return { success: true, data };
};
