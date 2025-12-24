import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminMatches() {
    const [matches, setMatches] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingMatch, setEditingMatch] = useState<any>(null);

    const [homeScore, setHomeScore] = useState('');
    const [awayScore, setAwayScore] = useState('');
    const [status, setStatus] = useState('completed');
    const [updating, setUpdating] = useState(false);

    const fetchMatches = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('matches')
            .select('*, home_team, away_team')
            .order('start_time', { ascending: false })
            .limit(20);

        if (error) toast.error('Failed to load matches');
        else setMatches(data || []);
        setLoading(false);
    };

    useEffect(() => {
        fetchMatches();
    }, []);

    const handleUpdateScore = async () => {
        if (!editingMatch) return;
        setUpdating(true);

        const { error } = await supabase.rpc('update_match_score', {
            p_match_id: editingMatch.id,
            p_home_score: parseInt(homeScore),
            p_away_score: parseInt(awayScore),
            p_status: status
        });

        if (error) {
            toast.error(error.message);
        } else {
            toast.success('Match updated & settlement triggered!');
            setEditingMatch(null);
            fetchMatches();
        }
        setUpdating(false);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Recent Matches</h2>
                <button onClick={fetchMatches} className="p-2 hover:bg-white/5 rounded-full">
                    <RefreshCw className="w-5 h-5" />
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>
            ) : (
                <div className="space-y-4">
                    {matches.map(match => (
                        <div key={match.id} className="bg-white/5 p-4 rounded-xl flex justify-between items-center border border-white/5 hover:border-white/10 transition-all">
                            <div>
                                <div className="text-xs text-vanta-neon-blue mb-1">{match.league}</div>
                                <div className="font-semibold text-lg flex items-center gap-2">
                                    <span>{match.home_team?.name || 'Home'}</span>
                                    <span className="text-gray-500 text-sm">vs</span>
                                    <span>{match.away_team?.name || 'Away'}</span>
                                </div>
                                <div className="text-sm text-gray-400 mt-1">
                                    Score: {match.home_score ?? '-'} - {match.away_score ?? '-'} | Status: {match.status}
                                </div>
                            </div>
                            <button
                                onClick={() => {
                                    setEditingMatch(match);
                                    setHomeScore(match.home_score?.toString() || '0');
                                    setAwayScore(match.away_score?.toString() || '0');
                                    setStatus(match.status || 'completed');
                                }}
                                className="px-4 py-2 bg-vanta-neon-blue/10 text-vanta-neon-blue rounded-lg hover:bg-vanta-neon-blue/20 transition-colors"
                            >
                                Override
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {editingMatch && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
                    <div className="bg-vanta-grey-dark p-6 rounded-2xl w-full max-w-md border border-white/10">
                        <h3 className="text-xl font-bold mb-4">Override Match Score</h3>
                        <p className="mb-4 text-sm text-gray-400">
                            Setting status to <b>'completed'</b> will trigger bet settlement immediately.
                        </p>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-xs mb-1">Home Score</label>
                                <input
                                    type="number"
                                    value={homeScore}
                                    onChange={e => setHomeScore(e.target.value)}
                                    className="w-full bg-black/30 border border-white/10 rounded-lg p-2"
                                />
                            </div>
                            <div>
                                <label className="block text-xs mb-1">Away Score</label>
                                <input
                                    type="number"
                                    value={awayScore}
                                    onChange={e => setAwayScore(e.target.value)}
                                    className="w-full bg-black/30 border border-white/10 rounded-lg p-2"
                                />
                            </div>
                        </div>

                        <div className="mb-6">
                            <label className="block text-xs mb-1">Status</label>
                            <select
                                value={status}
                                onChange={e => setStatus(e.target.value)}
                                className="w-full bg-black/30 border border-white/10 rounded-lg p-2 text-white"
                            >
                                <option value="scheduled">Scheduled</option>
                                <option value="live">Live</option>
                                <option value="completed">Completed (Triggers Settlement)</option>
                                <option value="postponed">Postponed</option>
                            </select>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setEditingMatch(null)}
                                className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleUpdateScore}
                                disabled={updating}
                                className="flex-1 py-3 rounded-xl bg-vanta-neon-blue text-black font-bold hover:bg-vanta-neon-blue/90 disabled:opacity-50"
                            >
                                {updating ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Confirm Update'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}