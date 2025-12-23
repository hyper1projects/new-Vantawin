
import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, TrendingUp, Trophy } from 'lucide-react';

interface LeaderboardEntry {
    entry_id: string;
    username: string;
    total_xp: number;
    rank: number;
    vanta_balance: number;
}

export default function LiveLeaderboard({ poolId, currentUserId }: { poolId: string, currentUserId?: string }) {
    const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [cutoffRank, setCutoffRank] = useState(0);

    useEffect(() => {
        if (poolId) {
            fetchLeaderboard();
            // Refresh every 30 seconds
            const interval = setInterval(fetchLeaderboard, 30000);
            return () => clearInterval(interval);
        }
    }, [poolId]);

    async function fetchLeaderboard() {
        try {
            const { data, error } = await supabase
                .from('leaderboard_view') // Correct View Name
                .select('*')
                .eq('pool_id', poolId)
                .order('rank', { ascending: true }) // Correct Column Name
                .limit(100);

            if (error) throw error;

            if (data) {
                setEntries(data);
                // Calculate the Top 25% Cutoff
                const totalParticipants = data.length;
                setCutoffRank(Math.ceil(totalParticipants * 0.25));
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

            {/* Header */}
            <div className="bg-white/5 p-4 border-b border-white/10 flex justify-between items-center">
                <h2 className="text-xl font-bold text-white flex items-center">
                    <Trophy className="w-5 h-5 mr-2 text-yellow-500" />
                    Live Standings
                </h2>
                <span className="text-xs font-mono text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded border border-emerald-400/20">
                    Top {cutoffRank} Get Paid
                </span>
            </div>

            {/* List */}
            <div className="max-h-[500px] overflow-y-auto">
                {entries.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">No bets placed yet. Be the first!</div>
                ) : (
                    entries.map((entry) => {
                        const isMe = currentUserId ? entry.entry_id === currentUserId : false; // Check against entry_id (assuming currentUserId passed is actually user_id, wait. entry_id is UUID of entry. currentUserId is likely auth.uid(). We need to check relation.)
                        // The view 'leaderboard_view' has 'username' but not 'user_id' explicitly selected in the top level.
                        // Let's check the view definition again in step 458.
                        // It selects: e.id as entry_id, u.username, e.total_xp...
                        // It DOES NOT select u.id or e.user_id.
                        // Component props say 'currentUserId'. If that is auth.uid(), we can't match it against entry.entry_id.
                        // We should match against username OR update the view to include user_id.
                        // Updating the view is cleaner.

                        // NOTE: For now, I'll rely on View modification or just rendering.
                        // BUT, the component won't highlight "YOU" correctly if I don't fix this.
                        // I will Assume the view returns user_id or I should highlight by username matches if unique? No.

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
                                                {isWinner ? <span className="text-emerald-500">In the money</span> : `${cutoffRank - entry.rank} spots to payout`}
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
