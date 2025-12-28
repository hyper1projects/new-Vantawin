import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Gamepad2, Target, Trophy, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface UserProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: {
        username: string;
        avatarUrl?: string | null;
        totalWins: number;
        totalGames: number;
        winRate: number;
        userId: string;
        poolId: string;
    } | null;
}

interface BetHistory {
    id: string;
    outcome_selection: string;
    amount: number;
    status: 'win' | 'loss' | 'pending';
    created_at: string;
    match: {
        home_team: any;
        away_team: any;
        home_score: number;
        away_score: number;
        league: string;
    };
}

export default function UserProfileModal({ isOpen, onClose, user }: UserProfileModalProps) {
    const [recentBets, setRecentBets] = useState<BetHistory[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen && user?.userId && user?.poolId) {
            fetchHistory();
        }
    }, [isOpen, user]);

    async function fetchHistory() {
        setLoading(true);
        // First get the entry_id for this user/pool combo
        const { data: entry } = await supabase
            .from('tournament_entries')
            .select('id')
            .eq('user_id', user!.userId)
            .eq('pool_id', user!.poolId)
            .single();

        if (entry) {
            const { data: bets } = await supabase
                .from('bets')
                .select(`
                    id, outcome_selection, amount, status, created_at,
                    match:match_id (
                        home_team, away_team, home_score, away_score, league
                    )
                `)
                .eq('entry_id', entry.id)
                .order('created_at', { ascending: false })
                .limit(3);

            if (bets) {
                setRecentBets(bets as any);
            }
        }
        setLoading(false);
    }

    if (!user) return null;

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="bg-[#001233] border-vanta-accent-dark-blue text-white w-[90%] max-w-[400px] rounded-[24px] p-0 overflow-hidden">
                {/* Close Button Override */}


                {/* Header Section */}
                <div className="flex flex-col items-center pt-8 pb-6 bg-gradient-to-b from-vanta-accent-dark-blue/50 to-transparent">
                    <div className="relative mb-3">
                        <Avatar className="h-24 w-24 border-4 border-[#012A5E] shadow-xl">
                            <AvatarImage src={user.avatarUrl || ''} />
                            <AvatarFallback className="bg-[#011B47] text-2xl text-vanta-neon-blue font-bold">
                                {user.username.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        {/* Status Checkmark (Stylistic from reference) */}
                        <div className="absolute bottom-1 right-1 h-6 w-6 bg-cyan-400 rounded-full border-4 border-[#001233]"></div>
                    </div>
                    <h2 className="text-2xl font-bold">{user.username}</h2>
                    <p className="text-gray-400 text-sm">Player</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-3 px-6 pb-6">
                    <div className="bg-[#011B47] rounded-xl p-3 flex flex-col items-center justify-center border border-white/5">
                        <Gamepad2 className="w-5 h-5 text-gray-400 mb-1" />
                        <span className="text-xl font-bold text-cyan-400">{user.totalGames}</span>
                        <span className="text-xs text-gray-400">Games</span>
                    </div>
                    <div className="bg-[#011B47] rounded-xl p-3 flex flex-col items-center justify-center border border-white/5">
                        <Target className="w-5 h-5 text-gray-400 mb-1" />
                        <span className="text-xl font-bold text-cyan-400">{user.winRate}%</span>
                        <span className="text-xs text-gray-400">Winrate</span>
                    </div>
                    <div className="bg-[#011B47] rounded-xl p-3 flex flex-col items-center justify-center border border-white/5">
                        <Trophy className="w-5 h-5 text-gray-400 mb-1" />
                        <span className="text-xl font-bold text-cyan-400">{user.totalWins}</span>
                        <span className="text-xs text-gray-400">Wins</span>
                    </div>
                </div>

                {/* Game History */}
                <div className="px-6 pb-8">
                    <h3 className="text-lg font-bold mb-4">Game History</h3>
                    <div className="space-y-3">
                        {loading && <p className="text-center text-gray-500 text-sm">Loading history...</p>}
                        {!loading && recentBets.length === 0 && <p className="text-center text-gray-500 text-sm">No recent games</p>}

                        {recentBets.map(bet => {
                            const isWin = bet.status === 'win';
                            const home = bet.match.home_team; // Assuming JSON {name, logo...} or similar string?
                            const away = bet.match.away_team;
                            // Check if team objects or strings, adapting to your schema
                            const homeName = typeof home === 'string' ? JSON.parse(home).name : home.name;
                            const awayName = typeof away === 'string' ? JSON.parse(away).name : away.name;
                            // Logos
                            const homeLogo = typeof home === 'string' ? `https://media.api-sports.io/football/teams/${JSON.parse(home).id}.png` : home.logo; // Just a guess or generic

                            return (
                                <div key={bet.id} className="bg-[#011B47] rounded-xl p-4 flex items-center justify-between border border-white/5">
                                    <div className="flex-1">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-xs text-gray-400">{bet.match.league || 'League'}</span>
                                            <span className={`text-xs px-2 py-0.5 rounded ${isWin ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                                {isWin ? 'Win' : (bet.status === 'pending' ? 'Pending' : 'Loss')}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="flex flex-col items-center w-16">
                                                {/* Simple Team Display */}
                                                <span className="text-sm font-bold truncate w-full text-center">{homeName}</span>
                                            </div>
                                            <div className="text-xl font-bold text-gray-300 mx-2">
                                                {bet.match.home_score ?? '-'} vs {bet.match.away_score ?? '-'}
                                            </div>
                                            <div className="flex flex-col items-center w-16">
                                                <span className="text-sm font-bold truncate w-full text-center">{awayName}</span>
                                            </div>
                                        </div>
                                        <div className="mt-2 text-center">
                                            <span className="text-xs text-gray-500">
                                                {new Date(bet.created_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

            </DialogContent>
        </Dialog>
    );
}
