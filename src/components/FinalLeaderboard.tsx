import React, { useEffect, useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import LeaderboardTable from './LeaderboardTable';
import { Medal } from 'lucide-react';
import { calculatePoolPrizes } from '../utils/prizeCalculator';

interface FinalLeaderboardProps {
    poolId: string;
}

const FinalLeaderboard: React.FC<FinalLeaderboardProps> = ({ poolId }) => {
    const [entries, setEntries] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);
    const [payoutStatus, setPayoutStatus] = useState<'pending' | 'completed' | 'processing' | 'paid' | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (user) setCurrentUserId(user.id);

                // 1. Fetch Leaderboard Data
                const { data: rawData, error } = await supabase.rpc('get_pool_leaderboard', { p_pool_id: poolId });

                if (error) throw error;

                // 2. Fetch Pool Details & Payout Batch Status
                const { data: poolData } = await supabase
                    .from('pools')
                    .select('total_pot, prize_distribution')
                    .eq('id', poolId)
                    .single();

                const { data: batchData } = await supabase
                    .from('payout_batches')
                    .select('status')
                    .eq('pool_id', poolId)
                    .single();

                // Map status
                if (batchData) {
                    setPayoutStatus(batchData.status as any);
                } else {
                    setPayoutStatus(null);
                }

                // 3. Process Data for LeaderboardTable
                if (rawData) {
                    const totalEntries = rawData.length;
                    const top10Cutoff = Math.ceil(totalEntries * 0.1);

                    // Calculate Prizes
                    let prizeMap = new Map<number, number>();
                    if (poolData) {
                        // Apply Rake (Standard 10% assumption if net pot not explicit, but total_pot in DB is usually gross)
                        // However, calculatePoolPrizes expects NET pot.
                        // In LiveLeaderboard we did: const netPot = prizePool * (1 - (rake / 100.0));
                        // Let's replicate this.
                        const rake = 10;
                        const grossPot = poolData.total_pot || 0;
                        const netPot = grossPot * (1 - (rake / 100.0));

                        const prizes = calculatePoolPrizes(netPot, totalEntries, poolData.prize_distribution as any[]);

                        prizes.forEach(p => {
                            const rankStr = p.rank;
                            let start = 0;
                            let end = 0;

                            if (rankStr === '1st') start = end = 1;
                            else if (rankStr === '2nd') start = end = 2;
                            else if (rankStr === '3rd') start = end = 3;
                            else if (rankStr.includes('-')) {
                                const parts = rankStr.replace(/th|st|nd|rd/g, '').split('-');
                                start = parseInt(parts[0]);
                                end = parseInt(parts[1]);
                            } else {
                                start = end = parseInt(rankStr.replace(/\D/g, ''));
                            }

                            if (start > 0) {
                                const effectiveEnd = Math.min(end, totalEntries);
                                for (let r = start; r <= effectiveEnd; r++) {
                                    prizeMap.set(r, p.amount);
                                }
                            }
                        });
                    }

                    const formatted = rawData.map((e: any) => {
                        const rank = parseInt(e.rank);
                        const calculatedPrize = prizeMap.get(rank) || 0;

                        let badge = e.badge_name;
                        // Restrict badges: Top 3 always get theirs. Others must be in Top 10% to be 'Elite'.
                        if (badge === 'Elite') {
                            if (rank > top10Cutoff) badge = null;
                        }
                        // Filter legacy badges
                        if (!['Champion', 'Runner Up', 'Podium', 'Elite'].includes(badge)) {
                            badge = null;
                        }

                        return {
                            rank: rank,
                            playerName: e.username,
                            avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${e.username}`,
                            xp: e.total_xp,
                            winRate: e.win_rate,
                            prizeNaira: e.est_payout || calculatedPrize, // Prefer RPC if exists, else calc
                            isCurrentUser: user ? e.user_id === user.id : false,
                            badge: badge
                        };
                    }).sort((a: any, b: any) => a.rank - b.rank);

                    setEntries(formatted);
                }

            } catch (err) {
                console.error("Error fetching final leaderboard:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [poolId]);

    return (
        <div className="bg-[#011B47]/80 backdrop-blur-md rounded-[24px] border border-white/5 overflow-hidden flex flex-col">
            <div className="p-6 bg-white/5 border-b border-white/5 flex justify-between items-center">
                <h3 className="font-bold text-xl text-white flex items-center gap-2">
                    <Medal className="text-vanta-neon-blue w-6 h-6" />
                    <span className="bg-gradient-to-r from-vanta-neon-blue to-cyan-200 bg-clip-text text-transparent">
                        Final Standings
                    </span>
                </h3>
                {payoutStatus && (
                    <span className={`text-xs font-bold px-3 py-1 rounded-full border ${payoutStatus === 'completed' || payoutStatus === 'paid'
                        ? 'bg-green-500/20 text-green-400 border-green-500/30'
                        : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                        }`}>
                        PAYOUTS {payoutStatus === 'processing' ? 'PENDING' : payoutStatus.toUpperCase()}
                    </span>
                )}
            </div>

            <div className="p-4">
                <LeaderboardTable
                    entries={entries}
                    showPaymentStatus={true}
                    paymentStatus={payoutStatus}
                    isLoading={loading}
                />
            </div>
        </div>
    );
};

export default FinalLeaderboard;
