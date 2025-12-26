import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, TrendingUp, Trophy } from 'lucide-react';

interface LeaderboardEntry {
    entry_id: string;
    user_id: string; // Added for correct matching
    username: string;
    total_xp: number;
    rank: number;
    vanta_balance: number;
    est_payout?: number;
}
// ... (rest of imports/interface)


interface PayoutStructure {
    rank_start: number;
    rank_end: number;
    percentage: number;
}

export default function LiveLeaderboard({ poolId, currentUserId }: { poolId: string, currentUserId?: string }) {
    const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [cutoffRank, setCutoffRank] = useState(0);
    const [netPot, setNetPot] = useState(0);
    const [payouts, setPayouts] = useState<PayoutStructure[]>([]);

    useEffect(() => {
        let intervalId: NodeJS.Timeout;

        const fetchData = async () => {
            if (!poolId) return;
            setLoading(true);
            try {
                // 1. Fetch Pool Info (Pot & Tier)
                const { data: poolData } = await supabase.from('pools').select('total_pot, tier').eq('id', poolId).single();
                if (!poolData) throw new Error('Pool not found');

                // 2. Fetch Rake
                const { data: rakeData } = await supabase.from('rake_structures').select('percentage').eq('tier', poolData.tier).single();
                const rake = rakeData?.percentage || 10;

                // 3. Calculate Net Pot
                const pot = poolData.total_pot || 0;
                const net = pot * (1 - (rake / 100));
                setNetPot(net);

                // 4. Fetch Payout Structure
                const { data: payoutData } = await supabase.from('payout_structures').select('*').order('rank_start', { ascending: true });
                setPayouts(payoutData || []);

                // 5. Initial Leaderboard Fetch
                await fetchLeaderboard(net, payoutData || []);

                // 6. Setup Interval
                intervalId = setInterval(() => fetchLeaderboard(net, payoutData || []), 30000);

            } catch (err) {
                console.error('Error init leaderboard:', err);
                setLoading(false);
            }
        };

        fetchData();

        return () => {
            if (intervalId) clearInterval(intervalId);
        };
    }, [poolId]);

    async function fetchLeaderboard(currentNetPot: number, currentPayouts: PayoutStructure[]) {
        try {
            const { data, error } = await supabase
                .from('leaderboard_view')
                .select('*')
                .eq('pool_id', poolId)
                .order('rank', { ascending: true })
                .order('rank', { ascending: true })
                .limit(100);

            console.log('Leaderboard Fetch:', { poolId, count: data?.length, error }); // DEBUG LOG

            if (error) throw error;

            if (data) {
                // Calculate Payouts for each entry
                const enhancedEntries = data.map((entry: any) => {
                    const rank = entry.rank;
                    const payoutRow = currentPayouts.find(p => rank >= p.rank_start && rank <= p.rank_end);
                    let est_payout = 0;
                    if (payoutRow) {
                        est_payout = currentNetPot * (payoutRow.percentage / 100);
                    }
                    return { ...entry, est_payout };
                });

                setEntries(enhancedEntries);

                // Determine Cutoff (Max rank in payout table)
                const maxRank = Math.max(...currentPayouts.map(p => p.rank_end), 0);
                setCutoffRank(maxRank);
            }
        } catch (err) {
            console.error('Error fetching leaderboard:', err);
        } finally {
            setLoading(false);
        }
    }

    if (loading) return <div className="p-8 text-center text-gray-400 flex justify-center"><Loader2 className="animate-spin mr-2" /> Loading Standings...</div>;

    return (
        <div className="w-full bg-vanta-grey-dark rounded-xl overflow-hidden shadow-2xl border border-white/10">
            {/* DEBUG OVERLAY */}
            <div className="bg-red-900/50 p-2 text-xs text-white font-mono border-b border-red-500">
                [DEBUG] PoolID: {poolId || 'MISSING'} | Entries: {entries.length} | Loading: {String(loading)} | NetPot: {netPot}
            </div>

            {/* Header */}
            <div className="bg-white/5 p-4 border-b border-white/10 flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-bold text-white flex items-center">
                        <Trophy className="w-5 h-5 mr-2 text-yellow-500" />
                        Live Standings
                    </h2>
                    <div className="text-xs text-gray-400 mt-1">
                        Net Prize Pool: <span className="text-emerald-400 font-mono">${netPot.toFixed(2)}</span>
                    </div>
                </div>
                <div className="flex flex-col items-end">
                    <span className="text-xs font-mono text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded border border-emerald-400/20 mb-1">
                        Top {cutoffRank} Get Paid
                    </span>
                </div>
            </div>

            {/* List */}
            <div className="max-h-[500px] overflow-y-auto">
                {entries.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">No bets placed yet. Be the first!</div>
                ) : (
                    entries.map((entry) => {
                        const isMe = currentUserId ? entry.user_id === currentUserId : false;
                        const isWinner = entry.rank <= cutoffRank;

                        return (
                            <div key={entry.entry_id}>

                                {/* The Cutoff Line */}
                                {entry.rank === cutoffRank + 1 && (
                                    <div className="relative py-2 text-center bg-black/20">
                                        <div className="absolute inset-0 flex items-center" aria-hidden="true">
                                            <div className="w-full border-t border-red-500/30 border-dashed"></div>
                                        </div>
                                        <span className="relative bg-vanta-grey-dark px-2 text-xs text-red-400 font-mono">
                                            PAYOUT ZONE ENDS HERE
                                        </span>
                                    </div>
                                )}

                                {/* The User Card */}
                                <div className={`
                  flex items-center justify-between p-3 border-b border-white/5 
                  ${isMe ? 'bg-indigo-500/10 border-l-4 border-l-indigo-500' : 'hover:bg-white/5'}
                `}>
                                    <div className="flex items-center space-x-3">
                                        {/* Rank Badge */}
                                        <div className={`
                      w-8 h-8 flex items-center justify-center rounded-full font-bold text-sm
                      ${entry.rank === 1 ? 'bg-yellow-500 text-black' :
                                                entry.rank === 2 ? 'bg-gray-300 text-black' :
                                                    entry.rank === 3 ? 'bg-amber-600 text-black' :
                                                        'bg-white/10 text-gray-300'}
                    `}>
                                            {entry.rank}
                                        </div>

                                        <div>
                                            <div className={`font-medium ${isMe ? 'text-indigo-300' : 'text-gray-200'}`}>
                                                {entry.username || 'Anonymous'} {isMe && '(You)'}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                {isWinner ?
                                                    <span className="text-emerald-500 font-bold">
                                                        Est. ${entry.est_payout?.toFixed(2)}
                                                    </span>
                                                    : `${cutoffRank - entry.rank + 1} spots to payout`}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="text-right">
                                        <div className="text-emerald-400 font-bold font-mono">
                                            {entry.total_xp.toLocaleString()} XP
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            {entry.vanta_balance} Ammo
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
