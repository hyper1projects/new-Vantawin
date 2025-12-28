import React, { useState, useEffect } from 'react';
import { supabase } from '../../integrations/supabase/client';
import { Loader2, AlertTriangle, ArrowRight, Merge } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface Pool {
    id: string;
    name: string;
    status: string;
    tier: string;
    current_participants: number; // View or calculated
    max_participants: number;
    total_pot: number;
    entry_fee: number;
}

export default function AdminPoolConsolidation() {
    const [pools, setPools] = useState<Pool[]>([]);
    const [loading, setLoading] = useState(true);
    const [consolidating, setConsolidating] = useState(false);
    const [sourceId, setSourceId] = useState<string>('');
    const [targetId, setTargetId] = useState<string>('');
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    // Fetch Pools
    useEffect(() => {
        fetchPools();
    }, []);

    const fetchPools = async () => {
        try {
            setLoading(true);
            // We need participant counts. The 'pools' table usually has a trigger or view for this, 
            // OR we rely on a view. For now, we'll try to get it from a view if available, or just raw pools
            // and maybe a separate count query if needed. 
            // Assuming 'pools' has current info or we use 'leaderboard_view' logic.
            // Let's assume 'pools' has basic info and we might need to query counts if not present.
            // Actually, based on previous diag script, 'current_participants' IS NOT in pools table.

            // To do this right, we should use the RPC or query entries. 
            // For simplicity, let's fetch pools and just trust the RPC handles the actual math.
            const { data, error } = await supabase
                .from('pools')
                .select('*')
                .in('status', ['upcoming', 'ongoing'])
                .order('start_time', { ascending: false });

            if (error) throw error;
            setPools(data || []);
        } catch (err: any) {
            console.error('Error fetching pools:', err);
            setMessage({ type: 'error', text: 'Failed to load pools' });
        } finally {
            setLoading(false);
        }
    };

    const handleConsolidate = async () => {
        if (!sourceId || !targetId) return;
        if (sourceId === targetId) {
            setMessage({ type: 'error', text: 'Source and Target cannot be the same.' });
            return;
        }

        setConsolidating(true);
        setMessage(null);

        try {
            const { data, error } = await supabase
                .rpc('consolidate_pools', {
                    p_source_pool_id: sourceId,
                    p_target_pool_id: targetId
                });

            if (error) throw error;

            setMessage({ type: 'success', text: `Success! Moved users. ${data?.message || ''}` });
            setSourceId('');
            setTargetId('');
            fetchPools(); // Refresh list
        } catch (err: any) {
            console.error('Consolidation failed:', err);
            setMessage({ type: 'error', text: err.message || 'Consolidation failed' });
        } finally {
            setConsolidating(false);
        }
    };

    const sourcePool = pools.find(p => p.id === sourceId);
    const targetPool = pools.find(p => p.id === targetId);

    return (
        <Card className="bg-white/5 border-white/10 text-white">
            <CardHeader>
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-yellow-500/20 rounded-lg">
                        <Merge className="w-6 h-6 text-yellow-500" />
                    </div>
                    <div>
                        <CardTitle>Pool Consolidation</CardTitle>
                        <CardDescription>Merge an under-filled pool into another active pool.</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-6">
                <Alert className="bg-blue-900/20 border-blue-900/50">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Warning</AlertTitle>
                    <AlertDescription>
                        This action is irreversible. All users and funds from the Source pool will be moved to the Target pool.
                        The Source pool will be marked as 'consolidated'.
                    </AlertDescription>
                </Alert>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                    {/* Source Selection */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-400">Source Pool (To be closed)</label>
                        <Select value={sourceId} onValueChange={setSourceId}>
                            <SelectTrigger className="bg-black/20 border-white/10">
                                <SelectValue placeholder="Select Source" />
                            </SelectTrigger>
                            <SelectContent>
                                {pools.filter(p => p.id !== targetId).map(pool => (
                                    <SelectItem key={pool.id} value={pool.id}>
                                        {pool.name} ({pool.tier})
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {sourcePool && (
                            <div className="text-xs text-gray-500 p-2 bg-black/20 rounded">
                                Status: {sourcePool.status}<br />
                                Fee: {sourcePool.entry_fee}<br />
                                Max: {sourcePool.max_participants}
                            </div>
                        )}
                    </div>

                    {/* Arrow */}
                    <div className="flex justify-center">
                        <ArrowRight className="w-8 h-8 text-gray-600" />
                    </div>

                    {/* Target Selection */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-400">Target Pool (Receiver)</label>
                        <Select value={targetId} onValueChange={setTargetId}>
                            <SelectTrigger className="bg-black/20 border-white/10">
                                <SelectValue placeholder="Select Target" />
                            </SelectTrigger>
                            <SelectContent>
                                {pools
                                    .filter(p => p.id !== sourceId)
                                    .filter(p => !sourceId || (sourcePool && p.tier === sourcePool.tier)) // Filter by Tier
                                    .map(pool => (
                                        <SelectItem key={pool.id} value={pool.id}>
                                            {pool.name} ({pool.tier})
                                        </SelectItem>
                                    ))}
                            </SelectContent>
                        </Select>
                        {targetPool && (
                            <div className="text-xs text-gray-500 p-2 bg-black/20 rounded">
                                Status: {targetPool.status}<br />
                                Fee: {targetPool.entry_fee}<br />
                                Max: {targetPool.max_participants}
                            </div>
                        )}
                    </div>
                </div>

                {message && (
                    <div className={`p-4 rounded-lg ${message.type === 'success' ? 'bg-green-900/50 text-green-200' : 'bg-red-900/50 text-red-200'}`}>
                        {message.text}
                    </div>
                )}

                <Button
                    className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-bold"
                    disabled={!sourceId || !targetId || consolidating || loading}
                    onClick={handleConsolidate}
                >
                    {consolidating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Merge className="mr-2 h-4 w-4" />}
                    Consolidate Pools
                </Button>
            </CardContent>
        </Card>
    );
}
