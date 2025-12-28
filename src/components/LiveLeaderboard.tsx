import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, TrendingUp, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';
import LeaderboardPodium from './LeaderboardPodium';
import LeaderboardTable from './LeaderboardTable';
import UserProfileModal from './UserProfileModal';
import { LeaderboardRowSkeleton } from './skeletons/LeaderboardRowSkeleton';

interface LeaderboardEntry {
    entry_id: string;
    user_id: string; // Added for correct matching
    username: string;
    total_xp: number;
    rank: number;
    vanta_balance: number;
    est_payout?: number;
    win_rate?: number;
    avatar_url?: string;
    total_wins?: number;
    total_bets?: number;
    badge_name?: string;
}
// ... (rest of imports/interface)


interface PayoutStructure {
    rank_start: number;
    rank_end: number;
    percentage: number;
    type?: string;
}

export default function LiveLeaderboard({ poolId, currentUserId }: { poolId: string, currentUserId?: string }) {
    const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [cutoffRank, setCutoffRank] = useState(0);
    const [netPot, setNetPot] = useState(0);
    const [poolStatus, setPoolStatus] = useState<string>('ongoing');
    const [payouts, setPayouts] = useState<PayoutStructure[]>([]);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    // Modal State
    const [selectedUser, setSelectedUser] = useState<any | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleUserClick = (user: any) => {
        // Map UI entry back to what Modal expects
        setSelectedUser({
            username: user.playerName,
            avatarUrl: user.avatarUrl,
            totalWins: user.totalWins || 0,
            totalGames: user.totalGames || 0,
            winRate: user.winRate || 0,
            userId: entries.find(e => e.username === user.playerName)?.user_id || '', // Find original ID
            poolId: poolId
        });
        setIsModalOpen(true);
    };

    useEffect(() => {
        let intervalId: NodeJS.Timeout;

        const fetchData = async () => {
            if (!poolId) return;
            setLoading(true);
            try {
                // 1. Fetch Pool Info (Pot, Tier, Status)
                const { data: poolData } = await supabase.from('pools').select('total_pot, tier, status').eq('id', poolId).single();
                if (!poolData) throw new Error('Pool not found');

                setPoolStatus(poolData.status);

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
                .rpc('get_pool_leaderboard', { p_pool_id: poolId });

            // Sort logic moved to client or assumed from RPC (RPC does rank() OVER but order of return is not guaranteed unless ORDER BY is in RETURN QUERY)
            // Wait, my RPC has `rank() OVER` but the final SELECT in RPC doesn't strictly enforce ORDER BY output unless I add it.
            // But usually it respects the window function order if simple. To be safe, let's sort in JS or assume RPC sorts.
            // Actually, for safety, I should ensure RPC has ORDER BY or sort here.
            // The previous code had .limit(100). The RPC returns all (filtered by pool).
            // Let's just take the data.

            console.log('Leaderboard Fetch:', { poolId, count: data?.length, error }); // DEBUG LOG

            if (error) throw error;

            if (data) {
                // 1. Get accurate Total Count of entries for this pool (without limit)
                const { count: totalEntriesCount } = await supabase
                    .from('tournament_entries')
                    .select('*', { count: 'exact', head: true })
                    .eq('pool_id', poolId);

                const validTotalCount = totalEntriesCount || data.length;

                // Determine Cutoff (Top 25% Rule) based on TRUE total count
                const dynamicCutoff = Math.floor(validTotalCount * 0.25);

                // Calculate Payouts for each entry
                const sharedWinnersCount = Math.max(dynamicCutoff - 3, 1); // Avoid division by zero

                const enhancedEntries = data.map((entry: any) => {
                    const rank = entry.rank;

                    // 1. Try Exact Match (e.g. 1st, 2nd, 3rd)
                    let payoutRow = currentPayouts.find(p => p.type === 'exact_rank' && rank >= p.rank_start && rank <= p.rank_end);

                    // 2. Fallback: Percentile Match (Shared Pool)
                    if (!payoutRow && rank <= dynamicCutoff) {
                        payoutRow = currentPayouts.find(p => p.type === 'percentile');
                    }

                    let est_payout = 0;
                    let payout_percentage = 0;

                    if (payoutRow) {
                        const totalTierPrize = currentNetPot * (payoutRow.percentage / 100);

                        if (payoutRow.type === 'percentile') {
                            // Split the shared pool among all qualifiers
                            est_payout = totalTierPrize / sharedWinnersCount;
                        } else {
                            // Fixed rank gets the whole slice
                            est_payout = totalTierPrize;
                        }

                        payout_percentage = payoutRow.percentage;
                    }
                    return { ...entry, est_payout, payout_percentage };
                });

                setEntries(enhancedEntries);

                const tableMax = Math.max(...currentPayouts.map(p => p.rank_end), 0);

                // Use the stricter of the two (Simulated DB table limit vs Dynamic 25%)
                setCutoffRank(Math.min(dynamicCutoff, tableMax));
            }
        } catch (err: any) {
            console.error('Error fetching leaderboard:', err);
            setErrorMsg(err.message || 'Failed to load leaderboard');
        } finally {
            setLoading(false);
        }
    }



    // Map entries to the format expected by the UI components
    const uiEntries = entries.map((e: any) => ({
        rank: e.rank,
        playerName: e.username || 'Unknown',
        avatarUrl: e.avatar_url,
        xp: e.total_xp,
        winRate: e.win_rate || 0,
        prizeNaira: e.est_payout || 0,
        isCurrentUser: e.user_id === currentUserId,
        totalWins: e.total_wins || 0,
        totalGames: e.total_bets || 0,
        badge: e.badge_name,
        payoutPercentage: e.payout_percentage
    }));

    // Filter to only show winners (payout > 0)
    const winners = uiEntries.filter(e => e.prizeNaira > 0);

    // DEBUG: Check if badges are present in the mapped data
    console.log('Leaderboard Sample (Top 5):', uiEntries.slice(0, 5).map(e => ({
        rank: e.rank,
        name: e.playerName,
        badge: e.badge,
        prize: e.prizeNaira
    })));

    console.log('LiveLeaderboard Render:', { poolStatus, loading, entriesCount: entries.length, winnersCount: winners.length, errorMsg });

    if (loading) {
        return (
            <div className="w-full space-y-2">
                {/* Simulate Podium Skeleton if needed, or just list rows */}
                <div className="bg-[#011B47] rounded-[27px] p-6 mb-8 border border-white/5">
                    <div className="flex justify-center items-end space-x-4 h-48 mb-6">
                        {/* Simple Podium Skeleton Placeholder */}
                        <div className="w-24 h-24 bg-white/5 rounded-t-lg animate-pulse"></div>
                        <div className="w-28 h-32 bg-white/10 rounded-t-lg animate-pulse"></div>
                        <div className="w-24 h-20 bg-white/5 rounded-t-lg animate-pulse"></div>
                    </div>
                </div>

                <div className="space-y-2">
                    {[...Array(5)].map((_, i) => (
                        <LeaderboardRowSkeleton key={i} />
                    ))}
                </div>
            </div>
        );
    }

    // Handle Ended/Processing State
    if (poolStatus === 'processing' || poolStatus === 'ended') {
        return (
            <div className="w-full" >
                <div className="flex flex-col items-center justify-center p-8 mb-8 text-center bg-[#011B47] rounded-[27px] border border-vanta-accent-dark-blue/50">
                    <Loader2 className="h-12 w-12 text-yellow-500 animate-spin mb-4" />
                    <h2 className="text-2xl font-bold text-white mb-2">Payouts are being processed</h2>
                    <p className="text-gray-400">Please wait while we finalize the results and calculate winnings.</p>
                    {errorMsg && (
                        <div className="mt-4 p-3 bg-red-500/20 border border-red-500/40 rounded-lg text-red-200 text-sm">
                            Debug Error: {errorMsg}
                        </div>
                    )}
                </div>

                {(winners.length > 0 || uiEntries.length > 0) && (
                    <div className="mb-6">
                        <h3 className="text-emerald-400 font-bold mb-4 px-2">
                            {winners.length > 0 ? "Pending Payouts" : "Leaderboard Results"}
                        </h3>
                        <LeaderboardTable
                            entries={winners.length > 0 ? winners : uiEntries.slice(0, 50)}
                            showPaymentStatus={winners.length > 0}
                            onUserClick={handleUserClick}
                        />
                    </div>
                )}
            </div >
        );
    }

    // Handle Completed/Settled State
    if (poolStatus === 'completed' || poolStatus === 'settled') {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-center bg-[#011B47] rounded-[27px] border border-vanta-accent-dark-blue/50">
                <Trophy className="h-16 w-16 text-vanta-neon-blue mb-6" />
                <h2 className="text-2xl font-bold text-white mb-2">Leaderboard Finalized</h2>
                <p className="text-gray-400 max-w-md mb-8">
                    This pool has ended and payouts have been distributed. Ready for the next challenge?
                </p>

                <div className="bg-[#001233] p-6 rounded-xl border border-white/5 w-full max-w-sm mb-8">
                    <p className="text-lg font-bold text-white mb-4">Join a Pool, predict on your favorite teams, climb leaderboard</p>

                    <Link to={currentUserId ? "/pools" : "/auth"}>
                        <button className="w-full bg-vanta-neon-blue hover:bg-cyan-400 text-[#001233] font-bold py-3 rounded-lg transition-colors shadow-[0_0_15px_rgba(34,211,238,0.3)]">
                            GO
                        </button>
                    </Link>
                </div>
            </div>
        );
    }




    // Filter to get Top 3 (Based on Rank, regardless of prize)
    const top3Players = uiEntries.filter(entry => entry.rank <= 3);

    // Winners Table (Rank > 3)
    const remainingWinners = winners.filter(entry => entry.rank > 3);

    // Find user's entry if they are not in the winners list
    const userEntry = uiEntries.find(e => e.isCurrentUser);
    const isUserWinning = userEntry ? userEntry.rank <= cutoffRank : false;

    return (
        <div className="w-full">
            {/* Removed Header as requested */}

            {entries.length === 0 ? (
                <div className="p-12 text-center text-gray-400 bg-[#011B47] rounded-[27px]">
                    <p className="text-lg">No bets placed yet. Be the first!</p>
                </div>
            ) : (
                <>
                    <LeaderboardPodium topPlayers={top3Players} onUserClick={handleUserClick} className="mb-12" />

                    {/* Winners Table */}
                    {remainingWinners.length > 0 && (
                        <div className="mb-6">
                            <h3 className="text-emerald-400 font-bold mb-4 px-2">In The Money</h3>
                            <LeaderboardTable entries={remainingWinners} onUserClick={handleUserClick} />
                        </div>
                    )}

                    {/* Start of Payout Cutoff Indicator if list is truncated */}
                    {cutoffRank < entries.length && (
                        <div className="relative py-4 text-center">
                            <div className="absolute inset-0 flex items-center" aria-hidden="true">
                                <div className="w-full border-t border-red-500/20 border-dashed"></div>
                            </div>
                            <span className="relative bg-[#001233] px-3 text-xs text-red-400 font-mono">
                                PAYOUT CUTOFF (Top {cutoffRank})
                            </span>
                        </div>
                    )}

                    {/* Current User Stats (if not in winners list) */}
                    {userEntry && !isUserWinning && (
                        <div className="mt-4">
                            <h3 className="text-gray-400 font-bold mb-2 px-2 text-sm">Your Position</h3>
                            <LeaderboardTable
                                entries={[userEntry]}
                                onUserClick={handleUserClick}
                                className="border border-vanta-neon-blue/30 bg-vanta-accent-dark-blue/50"
                            />
                        </div>
                    )}
                </>
            )}


            <UserProfileModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                user={selectedUser}
            />
        </div >
    );
}
