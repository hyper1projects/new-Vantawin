
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Download, AlertCircle, CheckCircle, ChevronDown, ChevronRight, Edit2, Save, X } from 'lucide-react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

interface PayoutBatch {
    id: string;
    pool_id: string;
    status: string;
    total_amount: number;
    created_at: string;
    pools?: {
        name: string;
        tier: string;
    };
    loading?: boolean;
}

interface PayoutItem {
    id: string;
    user_id: string;
    wallet_address: string;
    amount: number;
    currency: string;
    rank: number;
    status: string;
    // Joined user info
    // We might need to fetch user separately or join in query
}

export default function AdminPayouts() {
    const [batches, setBatches] = useState<PayoutBatch[]>([]);
    const [selectedBatchId, setSelectedBatchId] = useState<string | null>(null);
    const [items, setItems] = useState<PayoutItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [itemsLoading, setItemsLoading] = useState(false);

    // Edit State
    const [editingItem, setEditingItem] = useState<string | null>(null);
    const [editForm, setEditForm] = useState<{ wallet: string; amount: number }>({ wallet: '', amount: 0 });

    useEffect(() => {
        fetchBatches();
    }, []);

    useEffect(() => {
        if (selectedBatchId) {
            fetchItems(selectedBatchId);
        } else {
            setItems([]);
        }
    }, [selectedBatchId]);

    const fetchBatches = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('payout_batches')
            .select('*, pools(name, tier)')
            .order('created_at', { ascending: false });

        if (error) console.error('Error fetching batches:', error);
        else setBatches(data || []);
        setLoading(false);
    };

    const fetchItems = async (batchId: string) => {
        setItemsLoading(true);
        const { data, error } = await supabase
            .from('payout_batch_items')
            .select('*')
            .eq('batch_id', batchId)
            .order('rank', { ascending: true });

        if (error) console.error('Error fetching items:', error);
        else setItems(data || []);
        setItemsLoading(false);
    };

    const handleEditClick = (item: PayoutItem) => {
        setEditingItem(item.id);
        setEditForm({ wallet: item.wallet_address, amount: item.amount });
    };

    const handleSaveItem = async (itemId: string) => {
        const { error } = await supabase
            .from('payout_batch_items')
            .update({
                wallet_address: editForm.wallet,
                amount: editForm.amount
            })
            .eq('id', itemId);

        if (error) {
            alert('Failed to update item');
        } else {
            setItems(items.map(i => i.id === itemId ? { ...i, wallet_address: editForm.wallet, amount: editForm.amount } : i));
            setEditingItem(null);
            // Re-fetch batch to update total? Or just optimistically update batch total? 
            // For now, reload batch list
            fetchBatches();
        }
    };

    const downloadJson = () => {
        if (!items.length) return;

        // Format for NOWPayments Mass Payout
        // Expected format: Array of { "amount": number, "currency": string, "address": string, "extra_id": null }
        // Or checking docs: Mass payout usually takes a specific structure. 
        // We will dump a simple array that matches their example input usually.
        const payload = items
            .filter(i => i.status !== 'excluded')
            .map(i => ({
                amount: i.amount,
                currency: i.currency,
                address: i.wallet_address,
                extra_id: null, // or user_id for tracking
                ipn_callback_url: null // optional
            }));

        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(payload, null, 2));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", `payout_batch_${selectedBatchId}.json`);
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    };

    return (
        <div className="text-white space-y-6">
            <h2 className="text-2xl font-bold mb-4">Payout Batches</h2>

            {/* Batch List */}
            <div className="bg-[#011B47] rounded-xl border border-white/10 p-4">
                {loading ? (
                    <div className="flex justify-center p-8"><Loader2 className="animate-spin text-vanta-neon-blue" /></div>
                ) : batches.length === 0 ? (
                    <p className="text-gray-400 text-center py-8">No payout batches generated yet.</p>
                ) : (
                    <div className="space-y-2">
                        {batches.map(batch => (
                            <div
                                key={batch.id}
                                onClick={() => setSelectedBatchId(selectedBatchId === batch.id ? null : batch.id)}
                                className={`p-4 rounded-lg cursor-pointer transition-colors border ${selectedBatchId === batch.id ? 'bg-vanta-accent-dark-blue border-vanta-neon-blue' : 'bg-white/5 border-transparent hover:bg-white/10'}`}
                            >
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center space-x-4">
                                        {selectedBatchId === batch.id ? <ChevronDown className="text-vanta-neon-blue" /> : <ChevronRight className="text-gray-400" />}
                                        <div>
                                            <h3 className="font-bold text-white">{batch.pools?.name} <span className="text-xs text-gray-400 ml-2">({batch.pools?.tier})</span></h3>
                                            <span className="text-xs text-gray-400">{new Date(batch.created_at).toLocaleString()}</span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-mono text-emerald-400 font-bold">${batch.total_amount?.toLocaleString()}</div>
                                        <div className={`text-xs px-2 py-0.5 rounded-full inline-block ${batch.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                                            {batch.status.toUpperCase()}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Selected Batch Details */}
            {selectedBatchId && (
                <div className="bg-[#011B47] rounded-xl border border-white/10 p-6 animate-in slide-in-from-top-4">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-white">Batch Details</h3>
                        <button
                            onClick={downloadJson}
                            className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg font-bold transition-colors"
                        >
                            <Download size={18} />
                            <span>Download JSON</span>
                        </button>
                    </div>

                    {itemsLoading ? (
                        <div className="flex justify-center p-12"><Loader2 className="animate-spin text-vanta-neon-blue" /></div>
                    ) : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="border-white/10 hover:bg-transparent">
                                        <TableHead className="text-gray-400">Rank</TableHead>
                                        <TableHead className="text-gray-400">Wallet Address</TableHead>
                                        <TableHead className="text-right text-gray-400">Amount</TableHead>
                                        <TableHead className="text-right text-gray-400">Status</TableHead>
                                        <TableHead className="text-right text-gray-400">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {items.map((item) => (
                                        <TableRow key={item.id} className="border-white/10 hover:bg-white/5">
                                            <TableCell className="font-medium">#{item.rank}</TableCell>

                                            {/* Wallet Address Cell */}
                                            <TableCell className="font-mono text-xs text-gray-300">
                                                {editingItem === item.id ? (
                                                    <input
                                                        className="bg-[#001233] border border-vanta-neon-blue rounded px-2 py-1 w-full text-white"
                                                        value={editForm.wallet}
                                                        onChange={(e) => setEditForm({ ...editForm, wallet: e.target.value })}
                                                    />
                                                ) : (
                                                    <span className={item.wallet_address === 'NO_WALLET_LINKED' ? 'text-red-400 font-bold' : ''}>
                                                        {item.wallet_address}
                                                    </span>
                                                )}
                                            </TableCell>

                                            {/* Amount Cell */}
                                            <TableCell className="text-right font-mono text-emerald-400 font-bold">
                                                {editingItem === item.id ? (
                                                    <input
                                                        type="number"
                                                        className="bg-[#001233] border border-vanta-neon-blue rounded px-2 py-1 w-24 text-right text-white"
                                                        value={editForm.amount}
                                                        onChange={(e) => setEditForm({ ...editForm, amount: Number(e.target.value) })}
                                                    />
                                                ) : (
                                                    `$${item.amount.toLocaleString()}`
                                                )}
                                            </TableCell>

                                            {/* Status Cell */}
                                            <TableCell className="text-right">
                                                <span className={`text-xs px-2 py-1 rounded-full ${item.status === 'excluded' ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'}`}>
                                                    {item.status}
                                                </span>
                                            </TableCell>

                                            {/* Actions */}
                                            <TableCell className="text-right">
                                                {editingItem === item.id ? (
                                                    <div className="flex justify-end space-x-2">
                                                        <button onClick={() => handleSaveItem(item.id)} className="p-1 text-green-400 hover:bg-green-400/20 rounded"><Save size={16} /></button>
                                                        <button onClick={() => setEditingItem(null)} className="p-1 text-red-400 hover:bg-red-400/20 rounded"><X size={16} /></button>
                                                    </div>
                                                ) : (
                                                    <button onClick={() => handleEditClick(item)} className="p-1 text-gray-400 hover:text-white hover:bg-white/10 rounded">
                                                        <Edit2 size={16} />
                                                    </button>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
