import React, { useState } from 'react';
import { usePools } from '../../hooks/usePools';
import { supabase } from '../../integrations/supabase/client';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Loader2, Merge, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';

export default function AdminPoolList() {
    const { pools, loading, error } = usePools();
    const [consolidating, setConsolidating] = useState<string | null>(null);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const handleConsolidate = async (poolId: string) => {
        if (!confirm('Are you sure you want to consolidate this pool? This will attempt to move all users to another suitable pool.')) return;

        setConsolidating(poolId);
        setMessage(null);

        try {
            const { data, error } = await supabase.rpc('consolidate_pool', { p_pool_id: poolId });

            if (error) throw error;

            console.log('Consolidation result:', data);

            if (data.success) {
                setMessage({ type: 'success', text: data.message });
                // Ideally refresh pools here, but usePools doesn't expose refetch yet. 
                // We'll just reload the page for now or wait for real-time (not implemented).
                setTimeout(() => window.location.reload(), 2000);
            } else {
                setMessage({ type: 'error', text: data.message });
            }

        } catch (err: any) {
            console.error('Consolidation failed:', err);
            setMessage({ type: 'error', text: err.message });
        } finally {
            setConsolidating(null);
        }
    };

    if (loading) return <div className="p-8 text-center"><Loader2 className="animate-spin h-8 w-8 mx-auto" /></div>;
    if (error) return <div className="text-red-500">Error: {error}</div>;

    // Filter only upcoming/ongoing pools for management usually, but admin might want to see all.
    // Let's show upcoming/active first.
    const sortedPools = [...pools].sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());

    return (
        <div className="space-y-6">
            <Card className="bg-white/5 border-white/10 text-white">
                <CardHeader>
                    <CardTitle>Manage Pools</CardTitle>
                    <CardDescription>Overview of existing pools. Consolidate under-filled pools here.</CardDescription>
                </CardHeader>
                <CardContent>
                    {message && (
                        <div className={`mb-4 p-3 rounded bg-opacity-20 ${message.type === 'success' ? 'bg-green-500 text-green-200' : 'bg-red-500 text-red-200'}`}>
                            {message.text}
                        </div>
                    )}

                    <div className="space-y-4">
                        {sortedPools.map(pool => (
                            <div key={pool.id} className="flex items-center justify-between p-4 bg-black/20 rounded-lg border border-white/5">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold text-lg">{pool.name}</span>
                                        <Badge variant="outline" className={pool.status === 'ongoing' ? 'text-green-400 border-green-400' : 'text-gray-400 border-gray-400'}>
                                            {pool.status}
                                        </Badge>
                                        <Badge variant="secondary">{pool.tier}</Badge>
                                    </div>
                                    <div className="text-sm text-gray-400">
                                        Fee: ${pool.entryFee} • Pot: ${pool.prizePool}
                                    </div>
                                    <div className="text-sm text-gray-400">
                                        Participants: <span className={pool.minParticipants && pool.participants < pool.minParticipants ? "text-red-400 font-bold" : "text-white"}>
                                            {pool.participants}
                                        </span>
                                        {pool.maxParticipants && ` / ${pool.maxParticipants}`}
                                        {pool.minParticipants && ` (Min: ${pool.minParticipants})`}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        Start: {format(new Date(pool.startTime), 'MMM d, yyyy HH:mm')}
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    {(pool.status === 'upcoming' || pool.status === 'ongoing') && pool.minParticipants && pool.participants < pool.minParticipants && (
                                        <Button
                                            size="sm"
                                            variant="destructive"
                                            disabled={consolidating === pool.id}
                                            onClick={() => handleConsolidate(pool.id)}
                                        >
                                            {consolidating === pool.id ? <Loader2 className="animate-spin h-4 w-4" /> : <Merge className="h-4 w-4 mr-1" />}
                                            Consolidate
                                        </Button>
                                    )}

                                    {(pool.status === 'upcoming' || pool.status === 'ongoing') && (
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="text-red-400 border-red-400 hover:bg-red-500/10"
                                            onClick={async () => {
                                                if (!confirm(`Are you sure you want to cancel/deactivate ${pool.name}?`)) return;
                                                try {
                                                    const { error } = await supabase.from('pools').update({ status: 'cancelled' }).eq('id', pool.id);
                                                    if (error) throw error;
                                                    window.location.reload();
                                                } catch (e: any) {
                                                    alert(e.message);
                                                }
                                            }}
                                        >
                                            Deactivate
                                        </Button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
