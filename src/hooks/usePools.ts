import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Pool } from '../types/pool';

export const usePools = () => {
    const [pools, setPools] = useState<Pool[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPools = async () => {
            try {
                setLoading(true);
                const { data, error } = await supabase
                    .from('pools')
                    .select('*, pool_participants(count)');

                if (error) {
                    throw error;
                }

                if (data) {
                    // Map DB columns to Pool interface
                    const mappedPools: Pool[] = data.map((item: any) => ({
                        id: item.id,
                        name: item.name,
                        description: item.description,
                        status: item.status,
                        prizePool: item.total_pot,
                        entryFee: item.entry_fee,
                        participants: item.pool_participants[0]?.count ?? 0,
                        maxParticipants: item.max_participants,
                        startTime: item.start_time,
                        endTime: item.end_time,
                        image: item.image_url,
                        tier: item.tier,
                        rules: item.rules,
                        prizeDistribution: item.prize_distribution || []
                    }));
                    setPools(mappedPools);
                }

            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPools();
    }, []);

    return { pools, loading, error };
};