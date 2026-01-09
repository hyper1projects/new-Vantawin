
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
        }
    }, [user]);

    async function fetchBets() {
        try {
            setLoading(true);

            // 1. Get all entry IDs for this user
            const { data: entries, error: entryError } = await supabase
                .from('tournament_entries')
                .select('id')
                .eq('user_id', user?.id);

            console.log('MyGamesTab: Entries fetch result:', { entries, entryError });

            if (entryError) throw entryError;

            if (!entries || entries.length === 0) {
                console.log('MyGamesTab: No entries found for user', user?.id);
                setBets([]);
                return;
            }

            const entryIds = entries.map(e => e.id);
            console.log('MyGamesTab: Fetching bets for entry IDs:', entryIds);

            // 2. Fetch bets for these entries
            const { data: betsData, error: betsError } = await supabase
                .from('bets')
                .select(`
                    *,
                    match:matches(*)
                `)
                .in('entry_id', entryIds)
                .order('created_at', { ascending: false });

            console.log('MyGamesTab: Bets fetch result:', { betsData, betsError });

            if (betsError) throw betsError;

            if (betsData) {
                setBets(betsData as any);
            }
        } catch (err) {
            console.error('Error fetching bets:', err);
        } finally {
            setLoading(false);
        }
    }

    const getQuestionName = (bet: Bet) => {
        if (!bet.match?.questions) return 'Match Result';

        const questions = Array.isArray(bet.match.questions)
            ? bet.match.questions
            : JSON.parse(JSON.stringify(bet.match.questions));

        const question = questions.find((q: any) => q.id === bet.question_id);
        return question?.text || 'Match Result';
    };

    const getSelectionName = (bet: Bet) => {
        // Find question and option label from match questions JSON
        // questions structure: [ { id: 'q1', options: [ {id: 'o1', label: 'Home'} ] } ]
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
                <p className="text-sm text-gray-400 mt-2">Join a pool and verify your predictions!</p>
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
                    <div key={bet.id} className="bg-vanta-blue-medium p-5 rounded-[20px] border border-vanta-neon-blue/10 hover:border-vanta-neon-blue/30 transition-colors">
                        <div className="flex justify-between items-start mb-3">
                            <div>
                                <div className="text-xs font-mono text-gray-400 mb-1">
                                    {format(new Date(bet.match.start_time), 'MMM d, HH:mm')} • {bet.match.league}
                                </div>
                                <h4 className="font-bold text-lg text-vanta-text-light">
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

                        <div className="bg-black/20 p-2 md:p-3 rounded-xl flex items-center justify-between gap-1 md:gap-4">
                            <div className="flex-1 min-w-0">
                                <div className="text-[9px] md:text-xs text-gray-500 uppercase tracking-tighter mb-0.5">Your Pick</div>
                                <div className="text-[10px] md:text-xs text-gray-300 truncate font-medium">
                                    {getQuestionName(bet)}: <span className="text-vanta-neon-blue">{getSelectionName(bet)}</span>
                                </div>
                            </div>
                            <div className="text-center px-2">
                                <div className="text-[9px] md:text-xs text-gray-500 uppercase tracking-tighter mb-0.5">Wager</div>
                                <div className="text-[10px] md:text-base text-vanta-text-light font-bold">
                                    {bet.stake_vanta}
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-[9px] md:text-xs text-gray-500 uppercase tracking-tighter mb-0.5">
                                    {isWin ? 'Gained' : 'Pot. XP'}
                                </div>
                                <div className={`font-bold text-[10px] md:text-base ${isWin ? 'text-emerald-400' : 'text-gray-300'}`}>
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
