import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '../context/AuthContext';
import { Loader2, Trophy, XCircle, Clock } from 'lucide-react';
import { format } from 'date-fns';

interface Bet {
    id: string;
    stake_vanta: number;
    odds_snapshot: number;
    status: 'pending' | 'won' | 'lost' | 'void';
    created_at: string;
    question_id: string;
    option_id: string;
    match: {
        id: string;
        home_team: any;
        away_team: any;
        start_time: string;
        league: string;
        status: string;
        questions: any;
    };
}

export default function MyGamesTab() {
    const { user } = useAuth();
    const [bets, setBets] = useState<Bet[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            fetchBets();
        } else {
            setLoading(false);
        }
    }, [user]);

    async function fetchBets() {
        if (!user) {
            setLoading(false);
            return;
        }
        try {
            setLoading(true);
            const { data, error } = await supabase.functions.invoke('get-my-bets');

            if (error) throw error;

            setBets(data || []);

        } catch (err) {
            console.error('Error fetching bets via function:', err);
            setBets([]);
        } finally {
            setLoading(false);
        }
    }

    const getSelectionName = (bet: Bet) => {
        if (!bet.match?.questions) return bet.option_id;

        const questions = Array.isArray(bet.match.questions)
            ? bet.match.questions
            : JSON.parse(JSON.stringify(bet.match.questions));

        const question = questions.find((q: any) => q.id === bet.question_id);
        if (question) {
            const option = question.options.find((o: any) => o.id === bet.option_id);
            if (option) return option.label;
        }
        return bet.option_id; // Fallback
    };

    const getTeamName = (teamObj: any) => {
        if (typeof teamObj === 'string') return teamObj;
        return teamObj?.name || 'Unknown';
    };

    if (loading) {
        return <div className="p-8 text-center text-gray-400 flex justify-center"><Loader2 className="animate-spin mr-2" /> Loading History...</div>;
    }

    if (bets.length === 0) {
        return (
            <div className="bg-vanta-blue-medium p-8 rounded-[27px] text-center text-vanta-text-light">
                <p className="text-lg">No games played yet.</p>
                <p className="text-sm text-gray-400 mt-2">Join a pool and place some bets!</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {bets.map((bet) => {
                const potentialWin = Math.floor(bet.stake_vanta * bet.odds_snapshot);
                const isWin = bet.status === 'won';
                const isLoss = bet.status === 'lost';
                const isPending = bet.status === 'pending';

                return (
                    <div key={bet.id} className="bg-vanta-blue-medium p-5 rounded-[20px] border border-white/5 hover:border-white/10 transition-colors">
                        <div className="flex justify-between items-start mb-3">
                            <div>
                                <div className="text-xs font-mono text-gray-400 mb-1">
                                    {format(new Date(bet.match.start_time), 'MMM d, HH:mm')} • {bet.match.league}
                                </div>
                                <h4 className="font-bold text-lg text-white">
                                    {getTeamName(bet.match.home_team)} vs {getTeamName(bet.match.away_team)}
                                </h4>
                            </div>
                            <div className="text-right">
                                <span className={`
                                    px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1 ml-auto w-fit
                                    ${isWin ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : ''}
                                    ${isLoss ? 'bg-red-500/20 text-red-400 border border-red-500/30' : ''}
                                    ${isPending ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' : ''}
                                `}>
                                    {isWin && <><Trophy size={12} /> WON</>}
                                    {isLoss && <><XCircle size={12} /> LOST</>}
                                    {isPending && <><Clock size={12} /> ONGOING</>}
                                </span>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4 bg-black/20 p-3 rounded-xl">
                            <div>
                                <div className="text-xs text-gray-500 uppercase tracking-tighter">Your Pick</div>
                                <div className="font-medium text-vanta-neon-blue truncate" title={getSelectionName(bet)}>
                                    {getSelectionName(bet)}
                                </div>
                            </div>
                            <div>
                                <div className="text-xs text-gray-500 uppercase tracking-tighter">Wager</div>
                                <div className="font-medium text-white">
                                    {bet.stake_vanta} Vanta
                                </div>
                            </div>
                            <div>
                                <div className="text-xs text-gray-500 uppercase tracking-tighter">
                                    {isWin ? 'XP Gained' : 'Potential XP'}
                                </div>
                                <div className={`font-bold ${isWin ? 'text-emerald-400' : 'text-gray-300'}`}>
                                    {potentialWin} XP
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}