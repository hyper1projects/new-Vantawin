import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Game, SupabaseMatch, formatMatchFromDB } from '../types/game';

export const useMatches = () => {
    const [games, setGames] = useState<Game[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchMatches = useCallback(async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .rpc('get_matches_with_logos');

            if (error) {
                throw error;
            }

            if (data) {
                // Transform the raw DB data (SupabaseMatch) into our frontend structure (Game)
                if (data && data.length > 0) {
                    const firstMatch = data[0] as unknown as SupabaseMatch;
                    console.log("[DEBUG] First Match Home Team IMAGE:", firstMatch.home_team?.image);
                    console.log("[DEBUG] First Match Home Team NAME:", firstMatch.home_team?.name);
                }

                const formattedGames = (data as unknown as SupabaseMatch[]).map(formatMatchFromDB);
                if (formattedGames.length > 0) {
                    console.log("[DEBUG] Formatted First Game Team1 IMAGE:", formattedGames[0].team1?.image);
                }
                setGames(formattedGames);
                setError(null);
            }
        } catch (err: any) {
            console.error('Error fetching matches:', err);
            setError(err.message || 'Failed to fetch matches');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchMatches();
        // No real-time subscription as requested (Limited Data Plan)
    }, [fetchMatches]);

    return {
        games,
        loading,
        error,
        refetch: fetchMatches
    };
};