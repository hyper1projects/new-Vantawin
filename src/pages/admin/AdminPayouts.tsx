import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, CheckCircle, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

export default function AdminPayouts() {
    const [batches, setBatches] = useState<any[]>([]);
    const [payoutItems, setPayoutItems] = useState<any[]>([]);
    const [selectedBatch, setSelectedBatch] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [approving, setApproving] = useState(false);

    useEffect(() => {
        fetchPendingBatches();
    }, []);

    const fetchPendingBatches = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('payout_batches')
            .select(`
                id,
                status,
                total_amount,
                created_at,
                pools (
                    id,
                    name,
                    end_time
                )
            `)
            .eq('status', 'processing') // or 'draft' depending on flow, but func sets to processing
            .order('created_at', { ascending: false });

        if (error) {
            console.error(error);
            toast.error('Failed to fetch pending batches');
        } else {
            setBatches(data || []);
        }
        setLoading(false);
    };

    const loadBatchItems = async (batchId: string) => {
        setSelectedBatch(batchId);
        const { data, error } = await supabase
            .from('payout_batch_items')
            .select('*, users(username)')
            .eq('batch_id', batchId)
            .order('rank', { ascending: true });

        if (error) {
            console.error(error);
            toast.error('Failed to load batch items');
        } else {
            setPayoutItems(data || []);
        }
    };

    const handleApprove = async () => {
        if (!selectedBatch) return;
        if (!confirm('Are you sure you want to approve and distribute these funds? This action involves real money.')) return;

        setApproving(true);
        const { error } = await supabase.rpc('approve_payout_batch', { p_batch_id: selectedBatch });

        if (error) {
            console.error(error);
            toast.error(`Approval Failed: ${error.message}`);
        } else {
            toast.success('Payouts Approved & Distributed!');
            setSelectedBatch(null);
            setPayoutItems([]);
            fetchPendingBatches();
        }
        setApproving(false);
    };

    if (loading) return <div className="p-8"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-semibold">Pending Payout Batches</h2>

            {/* List of Batches */}
            {batches.length === 0 && !selectedBatch && (
                <div className="p-12 text-center text-gray-500 bg-white/5 rounded-xl">
                    No batches waiting for approval.
                </div>
            )}

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {batches.map(batch => (
                    <div key={batch.id} className={`p-4 border rounded-xl cursor-pointer transition-colors ${selectedBatch === batch.id ? 'bg-vanta-neon-blue/20 border-vanta-neon-blue' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
                        onClick={() => loadBatchItems(batch.id)}
                    >
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="font-bold text-white">{batch.pools?.name || 'Unknown Pool'}</h3>
                            <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-full uppercase">{batch.status}</span>
                        </div>

                        <p className="text-xs text-gray-400">Total Payout: <span className="text-green-400 font-mono">${batch.total_amount}</span></p>
                        <p className="text-xs text-gray-500 mt-1">Created: {new Date(batch.created_at).toLocaleDateString()}</p>

                        <div className="flex items-center gap-2 mt-3 text-vanta-neon-blue text-sm">
                            <Eye size={16} /> Review Distribution
                        </div>
                    </div>
                ))}
            </div>

            {/* Selected Detail View */}
            {selectedBatch && (
                <div className="bg-black/20 border border-white/10 rounded-xl p-6 mt-8 animate-in fade-in slide-in-from-bottom-4">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold">Distribution Plan</h3>
                        <Button onClick={handleApprove} disabled={approving} className="bg-green-600 hover:bg-green-700">
                            {approving ? <Loader2 className="animate-spin mr-2" /> : <CheckCircle className="mr-2" />}
                            Execute Distribution
                        </Button>
                    </div>

                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="text-gray-400 border-b border-white/10">
                                <th className="p-2">Rank</th>
                                <th className="p-2">User</th>
                                <th className="p-2">Amount</th>
                                <th className="p-2">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {payoutItems.map(p => (
                                <tr key={p.id} className="border-b border-white/5">
                                    <td className="p-2 font-mono">#{p.rank}</td>
                                    <td className="p-2">{p.users?.username || 'Unknown'}</td>
                                    <td className="p-2 text-green-400 font-bold">${p.amount}</td>
                                    <td className="p-2 text-xs opacity-50">{p.status}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
