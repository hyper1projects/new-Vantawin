
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '../context/AuthContext';

export interface UserStats {
    gamesPlayed: number;
    wins: number;
    winRate: number;
    rank: string;
    loading: boolean;
}

export function useUserStats() {
    const { user } = useAuth();
    const [stats, setStats] = useState<UserStats>({
        gamesPlayed: 0,
        wins: 0,
        winRate: 0,
        rank: '#--',
        loading: true,
    });

    useEffect(() => {
        async function fetchStats() {
            if (!user) {
                setStats(prev => ({ ...prev, loading: false }));
                return;
            }

            try {
                // 1. Get all entry IDs for this user to link to bets
                const { data: entries, error: entryError } = await supabase
                    .from('tournament_entries')
                    .select('id')
                    .eq('user_id', user.id);

                if (entryError) throw entryError;

                if (!entries || entries.length === 0) {
                    setStats({
                        gamesPlayed: 0,
                        wins: 0,
                        winRate: 0,
                        rank: '#--', // Placeholder for now
                        loading: false
                    });
                    return;
                }

                const entryIds = entries.map(e => e.id);

                let bets = []; // Initialize bets as an empty array
                let rank = '#--'; // Initialize rank with default placeholder

                if (entryIds.length > 0) {
                    // 2. Fetch all bets for these entries
                    const { data: betsData, error: betsError } = await supabase
                        .from('bets')
                        .select('status')
                        .in('entry_id', entryIds);

                    if (betsError) throw betsError;
                    bets = betsData || [];

                    // 3. Fetch rank from leaderboard_view for the most recent entry
                    // Assuming the last entry in entryIds (or finding the one from active pool) is most relevant
                    // entries from step 1 are not guaranteed order unless we specified. 
                    // Let's rely on fetching rank for ALL entries and picking the best or latest.
                    const { data: rankData, error: rankError } = await supabase
                        .from('leaderboard_view')
                        .select('rank')
                        .in('entry_id', entryIds)
                        // If we want the rank for the *latest* pool, we depend on how entries were fetched.
                        // Let's just take the best rank (min) for now, or the one matching the highest entry_id?
                        // A better user exp is probably their rank in the *active* pool.
                        // Let's assume the component wants the rank relevant to the main context.
                        // For now, getting the rank of the first returned row (arbitrary if not ordered) or min rank.
                        .order('rank', { ascending: true }) // Show their BEST rank?
                        .limit(1);

                    if (!rankError && rankData && rankData.length > 0) {
                        rank = `#${rankData[0].rank}`;
                    }
                }

                const gamesPlayed = bets?.length || 0;
                const wins = bets?.filter(b => b.status === 'won').length || 0;
                const winRate = gamesPlayed > 0 ? Math.round((wins / gamesPlayed) * 100) : 0;

                setStats({
                    gamesPlayed,
                    wins,
                    winRate,
                    rank,
                    loading: false
                });

            } catch (error) {
                console.error('Error fetching user stats:', error);
                setStats(prev => ({ ...prev, loading: false }));
            }
        }

        fetchStats();
    }, [user]);

    return stats;
}
