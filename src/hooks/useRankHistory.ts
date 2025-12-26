
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '../context/AuthContext';

export interface RankHistoryEntry {
    rank: number;
    xp: number;
    date: string;
    poolId: string;
}

export function useRankHistory() {
    const { user } = useAuth();
    const [history, setHistory] = useState<RankHistoryEntry[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchHistory() {
            if (!user) {
                setLoading(false);
                return;
            }

            try {
                const { data, error } = await supabase
                    .from('tournament_entries')
                    .select(`
            final_rank,
            total_xp,
            pool_id,
            pool:pools (
              end_time
            )
          `)
                    .eq('user_id', user.id)
                    .not('final_rank', 'is', null)
                    .order('created_at', { ascending: false });

                if (error) throw error;

                const mappedHistory: RankHistoryEntry[] = (data || []).map((entry: any) => ({
                    rank: entry.final_rank,
                    xp: entry.total_xp,
                    date: entry.pool?.end_time || new Date().toISOString(), // Fallback if no pool date
                    poolId: entry.pool_id
                }));

                setHistory(mappedHistory);
            } catch (err) {
                console.error('Error fetching rank history:', err);
            } finally {
                setLoading(false);
            }
        }

        fetchHistory();
    }, [user]);

    return { history, loading };
}
