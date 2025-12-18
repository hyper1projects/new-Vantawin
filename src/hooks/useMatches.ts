import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../integrations/supabase/client';
import { Game, SupabaseMatch, formatMatchFromDB } from '../types/game';

export const useMatches = () => {
    const [games, setGames] = useState<Game[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchMatches = useCallback(async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('matches')
                .select('*')
                .order('start_time', { ascending: true });

            if (error) {
                throw error;
            }

            if (data) {
                // Transform the raw DB data (SupabaseMatch) into our frontend structure (Game)
                const formattedGames = (data as unknown as SupabaseMatch[]).map(formatMatchFromDB);
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
