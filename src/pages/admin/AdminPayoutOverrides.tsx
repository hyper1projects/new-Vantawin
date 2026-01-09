import React, { useState, useEffect } from 'react';
import { supabase } from '../../integrations/supabase/client';
import { Loader2, Save, Plus, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface PayoutRule {
    rank: string;
    percentage: string; // string for input handling
}

interface PoolCompact {
    id: string;
    name: string;
    status: string;
    tier: string;
    total_pot: number;
    prize_distribution: PayoutRule[] | null;
}

export default function AdminPayoutOverrides() {
    const [pools, setPools] = useState<PoolCompact[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedPoolId, setSelectedPoolId] = useState<string>('');
    const [rules, setRules] = useState<PayoutRule[]>([]);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    useEffect(() => {
        fetchPools();
    }, []);

    useEffect(() => {
        if (selectedPoolId) {
            const pool = pools.find(p => p.id === selectedPoolId);
            if (pool && pool.prize_distribution && Array.isArray(pool.prize_distribution)) {
                // Ensure percentage is string for input
                setRules(pool.prize_distribution.map(r => ({ ...r, percentage: r.percentage.toString() })));
            } else {
                setRules([{ rank: '1st', percentage: '0' }]);
            }
        }
    }, [selectedPoolId]);

    const fetchPools = async () => {
        setLoading(true);
        // Fetch ongoing and upcoming pools
        const { data, error } = await supabase
            .from('pools')
            .select('id, name, status, tier, total_pot, prize_distribution')
            .in('status', ['ongoing', 'upcoming'])
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching pools:', error);
        } else {
            setPools(data || []);
        }
        setLoading(false);
    };

    const handleAddRule = () => {
        setRules([...rules, { rank: '', percentage: '0' }]);
    };

    const handleRemoveRule = (index: number) => {
        const newRules = [...rules];
        newRules.splice(index, 1);
        setRules(newRules);
    };

    const handleRuleChange = (index: number, field: keyof PayoutRule, value: string) => {
        const newRules = [...rules];
        newRules[index] = { ...newRules[index], [field]: value };
        setRules(newRules);
    };

    const handleSave = async () => {
        if (!selectedPoolId) return;
        setLoading(true);
        setMessage(null);

        // Validate percentages sum (optional but good practice)
        const totalPercent = rules.reduce((acc, curr) => acc + parseFloat(curr.percentage || '0'), 0);

        // Prepare for DB (convert percent keys to numbers)
        const dbPayload = rules.map(r => ({
            rank: r.rank,
            percentage: parseFloat(r.percentage)
        })).filter(r => r.rank && !isNaN(r.percentage)); // Filter empty

        try {
            const { error } = await supabase
                .from('pools')
                .update({ prize_distribution: dbPayload })
                .eq('id', selectedPoolId);

            if (error) throw error;

            setMessage({ type: 'success', text: `Saved! Total Allocation: ${totalPercent}%` });

            // Update local state
            setPools(pools.map(p => p.id === selectedPoolId ? { ...p, prize_distribution: dbPayload as any } : p));

        } catch (err: any) {
            setMessage({ type: 'error', text: err.message });
        } finally {
            setLoading(false);
        }
    };

    const handleReset = async () => {
        if (!selectedPoolId) return;
        setLoading(true);
        try {
            const { error } = await supabase
                .from('pools')
                .update({ prize_distribution: null })
                .eq('id', selectedPoolId);

            if (error) throw error;

            setRules([]);
            setMessage({ type: 'success', text: "Reset Complete. Pool is now using Dynamic Logic." });

            // Update local state
            setPools(pools.map(p => p.id === selectedPoolId ? { ...p, prize_distribution: null } : p));

        } catch (error: any) {
            setMessage({ type: 'error', text: "Failed to reset: " + error.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="bg-white/5 border-white/10 text-white">
            <CardHeader>
                <CardTitle>Payout Overrides</CardTitle>
                <CardDescription>Manually define prize distribution percentages for active pools.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">

                {/* Pool Selector */}
                <div className="space-y-2">
                    <Label>Select Pool</Label>
                    <Select value={selectedPoolId} onValueChange={setSelectedPoolId}>
                        <SelectTrigger className="bg-black/20 border-white/10">
                            <SelectValue placeholder="Choose a pool..." />
                        </SelectTrigger>
                        <SelectContent>
                            {pools.map(pool => (
                                <SelectItem key={pool.id} value={pool.id}>
                                    {pool.name} ({pool.status}) - Tier: {pool.tier}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {selectedPoolId && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                        <div className="flex justify-between items-center border-b border-white/10 pb-2">
                            <h3 className="font-bold">Distribution Rules</h3>
                            <div className="flex space-x-2">
                                <Button
                                    size="sm"
                                    onClick={handleReset}
                                    variant="outline"
                                    disabled={loading}
                                    className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                                >
                                    Reset to Dynamic
                                </Button>
                                <Button size="sm" onClick={handleAddRule} variant="outline" className="border-vanta-neon-blue text-vanta-neon-blue hover:bg-vanta-neon-blue/10">
                                    <Plus size={16} className="mr-1" /> Add Rank
                                </Button>
                            </div>
                        </div>

                        {rules.map((rule, index) => (
                            <div key={index} className="flex gap-4 items-end">
                                <div className="flex-1 space-y-1">
                                    <Label className="text-xs text-gray-400">Rank Label</Label>
                                    <Input
                                        value={rule.rank}
                                        onChange={(e) => handleRuleChange(index, 'rank', e.target.value)}
                                        placeholder="e.g. 1st, 2nd, 4th-10th"
                                        className="bg-black/20 border-white/10"
                                    />
                                </div>
                                <div className="w-32 space-y-1">
                                    <Label className="text-xs text-gray-400">Percentage (%)</Label>
                                    <Input
                                        type="number"
                                        value={rule.percentage}
                                        onChange={(e) => handleRuleChange(index, 'percentage', e.target.value)}
                                        className="bg-black/20 border-white/10"
                                    />
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleRemoveRule(index)}
                                    className="text-red-400 hover:text-red-300 hover:bg-red-400/10 mb-0.5"
                                >
                                    <Trash2 size={18} />
                                </Button>
                            </div>
                        ))}

                        {rules.length === 0 && (
                            <p className="text-center text-gray-500 italic py-4">No custom rules defined (using default logic).</p>
                        )}

                        {message && (
                            <div className={`p-3 rounded-lg flex items-center gap-2 ${message.type === 'success' ? 'bg-green-500/20 text-green-200' : 'bg-red-500/20 text-red-200'}`}>
                                {message.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                                {message.text}
                            </div>
                        )}

                        <Button
                            onClick={handleSave}
                            disabled={loading}
                            className="w-full bg-emerald-600 hover:bg-emerald-500 font-bold"
                        >
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Save Payout Configuration
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
