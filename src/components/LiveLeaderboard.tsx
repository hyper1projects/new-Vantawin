import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Trophy, Medal, User, Edit, Crown, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import UserProfileModal from './UserProfileModal';
import { calculatePoolPrizes } from '../utils/prizeCalculator';

interface LeaderboardEntry {
    pool_id: string;
    tier: string;
    username: string;
    user_id: string; // From new RPC
    total_xp: number;
    vanta_balance: number;
    entry_id: string;
    total_bets: number;
    win_rate: number;
    rank: number;
    badge_name?: string;
    est_payout?: number;
    manual_payout?: number;
    manual_rank?: number;
    total_wins?: number; // From new RPC
}

interface LiveLeaderboardProps {
    poolId: string;
    poolStatus: string;
    prizeDistribution?: any[];
    prizePool?: number;
}

const LiveLeaderboard: React.FC<LiveLeaderboardProps> = ({ poolId, poolStatus, prizeDistribution = [], prizePool = 0 }) => {
    console.log("[LiveLeaderboard] Rendered with:", { poolId, poolStatus, prizePool, prizeDistribution }); // DEBUG
    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);

    // Edit State
    const [editingEntry, setEditingEntry] = useState<LeaderboardEntry | null>(null);
    const [manualRank, setManualRank] = useState('');
    const [manualPayout, setManualPayout] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    // Profile Modal State
    const [selectedUser, setSelectedUser] = useState<{
        username: string;
        avatarUrl?: string | null;
        totalWins: number;
        totalGames: number;
        winRate: number;
        userId: string;
        poolId: string;
    } | null>(null);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);

    useEffect(() => {
        checkAdmin();
        getCurrentUser();

        let channel: any;

        // Only subscribe to realtime updates if pool is NOT ended
        if (poolStatus !== 'ended') {
            channel = supabase
                .channel(`leaderboard:${poolId}`)
                .on(
                    'postgres_changes',
                    {
                        event: '*',
                        schema: 'public',
                        table: 'tournament_entries',
                        filter: `pool_id=eq.${poolId}`
                    },
                    () => {
                        fetchLeaderboard();
                    }
                )
                .subscribe();
        }

        fetchLeaderboard();

        return () => {
            if (channel) supabase.removeChannel(channel);
        };
    }, [poolId, poolStatus]);

    const checkAdmin = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            const { data } = await supabase.from('users').select('is_admin').eq('id', user.id).single();
            if (data?.is_admin) setIsAdmin(true);
        }
    };

    const getCurrentUser = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) setCurrentUserId(user.id);
    };

    const fetchLeaderboard = async () => {
        try {
            const { data, error } = await supabase
                .rpc('get_pool_leaderboard', { p_pool_id: poolId });

            if (error) throw error;
            if (data) {
                let mappedData = data.map((entry: any) => ({
                    ...entry,
                    rank: parseInt(entry.rank)
                }));

                // 1. Sort by Rank
                mappedData.sort((a: any, b: any) => a.rank - b.rank);

                // 2. Identify Winners / Apply Prizes
                const totalEntries = mappedData.length;
                let winners = mappedData.map((e: any) => ({ ...e })); // Clone

                // Rake Calculation
                // Assuming prizePool passed in is GROSS. If it's NET from DB, rake is already done? 
                // Usually DB `total_pot` is gross. Let's apply rake to match backend.
                // Backend logic: v_net_pot := total_pot * (1 - (v_rake / 100.0));
                // Default rake 10% if unknown.
                const rake = 10; // Simplification, ideally passed as prop or fetched
                const netPot = prizePool * (1 - (rake / 100.0));

                if (prizePool && totalEntries > 0) {
                    console.log("[PayoutDebug] Entries:", totalEntries, "Pool:", prizePool, "Net:", netPot); // DEBUG

                    // Use centralized calculator to get prize distribution
                    // Passing null for dbDistribution to rely on default logic unless manual override exists
                    const prizes = calculatePoolPrizes(netPot, totalEntries, prizeDistribution);

                    // Create a map for fast lookup: rank -> amount
                    const prizeMap = new Map<number, number>();
                    // also map rank -> badge
                    const badgeMap = new Map<number, string>();

                    prizes.forEach(p => {
                        // Parse rank string "1st", "4th - 10th" etc to range
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
                            // Single rank like "4th"
                            start = end = parseInt(rankStr.replace(/\D/g, ''));
                        }

                        if (start > 0) {
                            // If it's a range, p.amount is the TOTAL for that range? 
                            // No, calculatePoolPrizes returns 'amount' which is usually per-user for that row? 
                            // Let's check prizeCalculator.ts.
                            // Yes, 'amount' in PoolPrize is the displayed amount. 
                            // For ranges, it calls addFinalRow with 'val' which is per-user.
                            // So p.amount is PER USER.

                            const effectiveEnd = Math.min(end, totalEntries);
                            for (let r = start; r <= effectiveEnd; r++) {
                                prizeMap.set(r, p.amount);
                                if (p.badge) badgeMap.set(r, p.badge.replace(/🏆|🥈|🥉|🏅|✨|🚀/g, '').trim());
                            }
                        }
                    });

                    const top10Cutoff = Math.ceil(totalEntries * 0.1);

                    // Assign to Entries
                    winners = winners.map((e: any) => {
                        // Manual Override Check
                        if (e.manual_payout !== null && e.manual_payout !== undefined) {
                            return { ...e, est_payout: parseFloat(e.manual_payout) };
                        }

                        const prize = prizeMap.get(e.rank) || 0;
                        const calculatorBadge = badgeMap.get(e.rank);

                        // If user has a DB badge, keep it, otherwise use calculator badge
                        let finalBadge = e.badge_name || calculatorBadge;

                        // Strict Top 10% enforcement for non-podium badges
                        if (finalBadge && !['Champion', 'Runner Up', 'Podium'].includes(finalBadge)) {
                            if (e.rank > top10Cutoff) {
                                finalBadge = null;
                            }
                        }

                        return { ...e, est_payout: prize, badge_name: finalBadge };
                    });
                }

                setLeaderboard(winners);
            }
        } catch (error) {
            console.error('Error fetching leaderboard:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleEditClick = (entry: LeaderboardEntry, e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent row click
        setEditingEntry(entry);
        setManualRank(entry.manual_rank?.toString() || entry.rank?.toString() || '');
        setManualPayout(entry.manual_payout?.toString() || entry.est_payout?.toString() || '');
    };

    const handleUserClick = async (entry: LeaderboardEntry) => {
        console.log("handleUserClick:", entry); // Debug Log

        let targetUserId = entry.user_id;

        if (!targetUserId) {
            console.warn("Missing user_id, attempting fetch by username...", entry.username);
            const { data: userData } = await supabase
                .from('users')
                .select('id')
                .eq('username', entry.username)
                .single();

            if (userData) {
                targetUserId = userData.id;
            } else {
                console.error("Could not resolve user_id for", entry.username);
                return;
            }
        }

        setSelectedUser({
            username: entry.username,
            avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${entry.username}`,
            totalWins: entry.total_wins || Math.round(entry.total_bets * (entry.win_rate / 100)) || 0, // Fallback calculation
            totalGames: entry.total_bets,
            winRate: entry.win_rate,
            userId: targetUserId,
            poolId: entry.pool_id
        });
        setIsProfileOpen(true);
    };


    const handleSaveOverride = async () => {
        if (!editingEntry) return;
        setIsSaving(true);
        try {
            const updates: any = {};
            updates.manual_rank = manualRank === '' ? null : parseInt(manualRank);
            updates.manual_payout = manualPayout === '' ? null : parseFloat(manualPayout);

            const { error } = await supabase
                .from('tournament_entries')
                .update(updates)
                .eq('id', editingEntry.entry_id);

            if (error) throw error;

            setEditingEntry(null);
            fetchLeaderboard();

        } catch (e: any) {
            alert('Failed to update: ' + e.message);
        } finally {
            setIsSaving(false);
        }
    };

    // ... (previous code)

    if (isLoading) {
        return <div className="p-8 text-center text-gray-500">Loading Leaderboard...</div>;
    }

    // Filter Logic: Show only Winners (Payout > 0) OR the Current User
    const displayedLeaderboard = leaderboard.filter(e =>
        (e.est_payout && e.est_payout > 0) || (e.user_id === currentUserId)
    );

    const topThree = leaderboard.filter(e => e.rank <= 3);
    const firstPlace = topThree.find(e => e.rank === 1);
    const secondPlace = topThree.find(e => e.rank === 2);
    const thirdPlace = topThree.find(e => e.rank === 3);

    return (
        <div className="w-full bg-[#011B47]/80 backdrop-blur-md rounded-[24px] border border-white/5 overflow-hidden flex flex-col">

            {/* Header */}
            <div className="p-4 md:p-6 bg-white/5 border-b border-white/5 flex justify-between items-center">
                <h3 className="font-bold text-base md:text-xl text-white flex items-center gap-2">
                    {poolStatus === 'ended' ? (
                        <>
                            <Medal className="text-vanta-neon-blue w-5 h-5 md:w-6 md:h-6" />
                            <span className="bg-gradient-to-r from-vanta-neon-blue to-cyan-200 bg-clip-text text-transparent">
                                Final Standings
                            </span>
                        </>
                    ) : (
                        <>
                            <Trophy className="text-yellow-400 w-5 h-5 md:w-6 md:h-6" />
                            <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                                Live Standings
                            </span>
                        </>
                    )}
                </h3>
                <span className="text-[10px] md:text-xs text-gray-400 font-mono px-2 py-1 md:px-3 bg-black/20 rounded-full border border-white/5">
                    {leaderboard.length} ENTRANTS
                </span>
            </div>

            {/* PODIUM SECTION */}
            {leaderboard.length > 0 && (
                <div className="relative pt-8 pb-12 md:pt-12 md:pb-16 px-2 md:px-4 bg-gradient-to-b from-[#012A5E]/50 to-transparent flex justify-center items-end gap-2 md:gap-8">

                    {/* 2nd Place */}
                    {secondPlace && (
                        <div
                            className="flex flex-col items-center cursor-pointer group order-1"
                            onClick={() => handleUserClick(secondPlace)}
                        >
                            <div className="relative mb-2 md:mb-3">
                                <Avatar className="h-12 w-12 md:h-20 md:w-20 border-2 md:border-4 border-gray-300 shadow-[0_0_30px_rgba(209,213,219,0.3)] z-10">
                                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${secondPlace.username}`} />
                                    <AvatarFallback className="bg-gray-800 text-gray-300 text-[10px] md:text-base">2ND</AvatarFallback>
                                </Avatar>
                                <div className="absolute -bottom-2 md:-bottom-3 left-1/2 -translate-x-1/2 bg-gray-300 text-vanta-dark font-bold text-[10px] md:text-xs px-1.5 py-0.5 rounded-full border-2 border-vanta-dark z-20">
                                    #2
                                </div>
                            </div>
                            <div className="text-center mt-2 p-2 md:p-3 bg-white/5 rounded-xl border border-gray-500/30 w-24 md:w-40 transition-transform group-hover:-translate-y-1 duration-300 backdrop-blur-sm">
                                <div className="font-bold text-white truncate text-xs md:text-base">{secondPlace.username}</div>
                                <div className="text-[10px] md:text-xs text-gray-400 font-mono mb-0.5 md:mb-1">{secondPlace.total_xp.toLocaleString()} XP</div>
                                {secondPlace.est_payout && (
                                    <div className="text-gray-300 font-bold text-xs md:text-sm">
                                        ${secondPlace.est_payout.toFixed(2)}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* 1st Place (Center, Largest) */}
                    {firstPlace && (
                        <div
                            className="flex flex-col items-center cursor-pointer group order-2 -mt-4 md:-mt-6 z-10"
                            onClick={() => handleUserClick(firstPlace)}
                        >
                            <div className="relative mb-3 md:mb-4">
                                <Avatar className="h-16 w-16 md:h-28 md:w-28 border-2 md:border-4 border-yellow-400 shadow-[0_0_50px_rgba(250,204,21,0.5)] z-10 ring-2 md:ring-4 ring-yellow-400/20">
                                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${firstPlace.username}`} />
                                    <AvatarFallback className="bg-yellow-900 text-yellow-100 text-xs md:text-base">1ST</AvatarFallback>
                                </Avatar>
                                <div className="absolute -bottom-3 md:-bottom-4 left-1/2 -translate-x-1/2 bg-yellow-400 text-yellow-950 font-black text-xs md:text-sm px-2 py-0.5 md:px-3 md:py-1 rounded-full border-2 md:border-4 border-vanta-dark z-20 shadow-lg">
                                    #1
                                </div>
                            </div>
                            <div className="text-center mt-3 md:mt-4 p-2 md:p-4 bg-gradient-to-b from-yellow-500/10 to-yellow-500/5 rounded-2xl border border-yellow-500/30 w-28 md:w-48 transition-transform group-hover:-translate-y-2 duration-300 backdrop-blur-md shadow-[0_10px_30px_-10px_rgba(234,179,8,0.2)]">
                                <div className="font-black text-sm md:text-lg text-white truncate mb-0.5 md:mb-1">{firstPlace.username}</div>
                                <div className="text-[10px] md:text-sm text-yellow-200/80 font-mono font-bold mb-1 md:mb-2">{firstPlace.total_xp.toLocaleString()} XP</div>
                                {firstPlace.est_payout && (
                                    <div className="text-yellow-400 font-black text-sm md:text-lg shadow-yellow-400/20 drop-shadow-md">
                                        ${firstPlace.est_payout.toFixed(2)}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* 3rd Place */}
                    {thirdPlace && (
                        <div
                            className="flex flex-col items-center cursor-pointer group order-3"
                            onClick={() => handleUserClick(thirdPlace)}
                        >
                            <div className="relative mb-2 md:mb-3">
                                <Avatar className="h-12 w-12 md:h-20 md:w-20 border-2 md:border-4 border-amber-700 shadow-[0_0_30px_rgba(180,83,9,0.3)] z-10">
                                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${thirdPlace.username}`} />
                                    <AvatarFallback className="bg-amber-900 text-amber-100 text-[10px] md:text-base">3RD</AvatarFallback>
                                </Avatar>
                                <div className="absolute -bottom-2 md:-bottom-3 left-1/2 -translate-x-1/2 bg-amber-700 text-amber-100 font-bold text-[10px] md:text-xs px-1.5 py-0.5 rounded-full border-2 border-vanta-dark z-20">
                                    #3
                                </div>
                            </div>
                            <div className="text-center mt-2 p-2 md:p-3 bg-white/5 rounded-xl border border-amber-700/30 w-24 md:w-40 transition-transform group-hover:-translate-y-1 duration-300 backdrop-blur-sm">
                                <div className="font-bold text-white truncate text-xs md:text-base">{thirdPlace.username}</div>
                                <div className="text-[10px] md:text-xs text-gray-400 font-mono mb-0.5 md:mb-1">{thirdPlace.total_xp.toLocaleString()} XP</div>
                                {thirdPlace.est_payout && (
                                    <div className="text-amber-500 font-bold text-xs md:text-sm">
                                        ${thirdPlace.est_payout.toFixed(2)}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            )}


            <div className="overflow-x-auto bg-[#001233]/50">
                <table className="w-full">
                    <thead>
                        <tr className="text-left text-xs text-gray-400 border-b border-white/5 bg-black/20">
                            <th className="p-2 md:p-4 pl-4 md:pl-6 font-medium whitespace-nowrap">Rank</th>
                            <th className="p-2 md:p-4 font-medium whitespace-nowrap">Player</th>
                            <th className="p-2 md:p-4 font-medium text-right whitespace-nowrap">XP</th>
                            <th className="hidden md:table-cell p-2 md:p-4 font-medium text-right whitespace-nowrap">Win Rate</th>
                            <th className="p-2 md:p-4 pr-4 md:pr-6 font-medium text-right whitespace-nowrap">Est. Payout</th>
                            {isAdmin && <th className="p-2 md:p-4 font-medium text-center whitespace-nowrap">Admin</th>}
                        </tr>
                    </thead>
                    <tbody className="text-sm">
                        {displayedLeaderboard.length > 0 ? (
                            displayedLeaderboard.map((entry) => (
                                <tr
                                    key={entry.entry_id}
                                    className={`
                                        border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer relative group
                                        ${entry.user_id === currentUserId ? 'bg-vanta-neon-blue/10 border-l-2 border-l-vanta-neon-blue' : ''}
                                        ${entry.rank <= 3 ? 'bg-white/[0.02]' : ''}
                                    `}
                                    onClick={() => handleUserClick(entry)}
                                >
                                    <td className="p-2 md:p-4 pl-3 md:pl-6 font-bold text-white relative whitespace-nowrap text-xs md:text-base">
                                        <div className="flex items-center gap-2 md:gap-3">
                                            {/* Rank Indicator */}
                                            <div className={`
                                                w-5 h-5 md:w-6 md:h-6 flex items-center justify-center rounded-full text-[10px] md:text-xs
                                                ${entry.rank === 1 ? 'bg-yellow-400 text-black font-black box-shadow-glow-yellow' :
                                                    entry.rank === 2 ? 'bg-gray-300 text-black font-bold' :
                                                        entry.rank === 3 ? 'bg-amber-700 text-white font-bold' : 'text-gray-500'}
                                            `}>
                                                {entry.rank}
                                            </div>
                                            {entry.manual_rank && <span className="text-[8px] md:text-[9px] text-purple-400 border border-purple-500/30 px-1 rounded bg-purple-500/10">FIXED</span>}
                                        </div>
                                    </td>
                                    <td className="p-2 md:p-4 whitespace-nowrap text-xs md:text-base">
                                        <div className="flex items-center gap-2 md:gap-3">
                                            <Avatar className={`h-6 w-6 md:h-8 md:w-8 border ${entry.user_id === currentUserId ? 'border-vanta-neon-blue' : 'border-white/10'}`}>
                                                <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${entry.username}`} />
                                                <AvatarFallback><User size={10} /></AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <div className={`font-semibold flex items-center gap-2 transition-colors ${entry.user_id === currentUserId ? 'text-vanta-neon-blue' : 'text-white group-hover:text-cyan-200'}`}>
                                                    <span className="max-w-[80px] md:max-w-xs truncate">{entry.username}</span>
                                                    {entry.badge_name && (
                                                        <Badge variant="secondary" className="text-[8px] md:text-[9px] h-3 md:h-3.5 px-1 bg-white/10 text-white/70 border-0 hidden sm:flex">
                                                            {entry.badge_name}
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-2 md:p-4 text-right text-white font-mono font-bold tracking-wide whitespace-nowrap text-xs md:text-sm">
                                        {entry.total_xp.toLocaleString()}
                                    </td>
                                    <td className="hidden md:table-cell p-2 md:p-4 text-right text-gray-400 font-mono whitespace-nowrap text-xs md:text-sm">
                                        {entry.win_rate}%
                                    </td>
                                    <td className="p-2 md:p-4 pr-3 md:pr-6 text-right whitespace-nowrap text-xs md:text-sm">
                                        {entry.est_payout && entry.est_payout > 0 ? (
                                            <span className={`font-bold px-1.5 py-0.5 md:px-2 md:py-1 rounded text-[10px] md:text-xs ${entry.rank === 1 ? 'text-yellow-400 bg-yellow-400/10' : 'text-green-400 bg-green-400/10'}`}>
                                                ${entry.est_payout.toFixed(2)}
                                            </span>
                                        ) : (
                                            <span className="text-gray-700">-</span>
                                        )}
                                    </td>
                                    {isAdmin && (
                                        <td className="p-2 md:p-4 text-center whitespace-nowrap">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-7 w-7 p-0 text-white/30 hover:text-white hover:bg-white/10"
                                                onClick={(e) => handleEditClick(entry, e)}
                                            >
                                                <Edit size={12} />
                                            </Button>
                                        </td>
                                    )}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={isAdmin ? 6 : 5} className="p-12 text-center text-gray-500 italic">
                                    No entries found yet. Be the first to join!
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Admin Edit Modal */}
            <Dialog open={!!editingEntry} onOpenChange={(open) => !open && setEditingEntry(null)}>
                <DialogContent className="bg-vanta-dark border-white/10 text-white sm:max-w-[400px]">
                    {/* ... keep existing modal content ... */}
                    <DialogHeader>
                        <DialogTitle>Override Entry: {editingEntry?.username}</DialogTitle>
                    </DialogHeader>
                    <div className="py-4 space-y-4">
                        <div className="space-y-2">
                            <Label>Manual Rank override</Label>
                            <Input
                                type="number"
                                placeholder="Leave empty for auto"
                                value={manualRank}
                                onChange={(e) => setManualRank(e.target.value)}
                                className="bg-black/20 font-mono"
                            />
                            <p className="text-xs text-gray-500">Set a fixed rank to resolve ties manually.</p>
                        </div>
                        <div className="space-y-2">
                            <Label>Manual Payout ($)</Label>
                            <Input
                                type="number"
                                placeholder="Leave empty for auto"
                                value={manualPayout}
                                onChange={(e) => setManualPayout(e.target.value)}
                                className="bg-black/20 font-mono"
                            />
                            <p className="text-xs text-gray-500">Force a specific prize amount.</p>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setEditingEntry(null)}>Cancel</Button>
                        <Button onClick={handleSaveOverride} disabled={isSaving} className="bg-vanta-neon-blue text-black font-bold">
                            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Save Override
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* User Profile Modal */}
            <UserProfileModal
                isOpen={isProfileOpen}
                onClose={() => setIsProfileOpen(false)}
                user={selectedUser}
            />
        </div>
    );
};

export default LiveLeaderboard;
