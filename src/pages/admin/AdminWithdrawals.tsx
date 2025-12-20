import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminWithdrawals() {
    const [withdrawals, setWithdrawals] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState<string | null>(null);

    const fetchWithdrawals = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('withdrawals')
            .select('*, users(username, wallet_address)') // Assuming users has these
            .order('created_at', { ascending: false });

        if (error) {
            console.error(error);
            toast.error('Failed to load withdrawals');
        }
        else setWithdrawals(data || []);
        setLoading(false);
    };

    useEffect(() => {
        fetchWithdrawals();
    }, []);

    const handleProcess = async (id: string, action: 'approved' | 'rejected') => {
        if (!confirm(`Are you sure you want to MARK this as ${action.toUpperCase()}?`)) return;

        setProcessingId(id);
        const { error } = await supabase.rpc('process_withdrawal', {
            p_withdrawal_id: id,
            p_status: action,
            p_notes: `Processed by Admin at ${new Date().toISOString()}`
        });

        if (error) {
            toast.error(error.message);
        } else {
            toast.success(`Withdrawal ${action}`);
            fetchWithdrawals();
        }
        setProcessingId(null);
    };

    if (loading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Withdrawal Requests</h2>
                <button onClick={fetchWithdrawals} className="text-sm text-vanta-neon-blue hover:underline">Refresh</button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="text-gray-400 border-b border-white/10 text-sm">
                            <th className="p-3">User</th>
                            <th className="p-3">Amount</th>
                            <th className="p-3">Wallet</th>
                            <th className="p-3">Status</th>
                            <th className="p-3">Date</th>
                            <th className="p-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {withdrawals.length === 0 && (
                            <tr>
                                <td colSpan={6} className="p-8 text-center text-gray-500">No withdrawal requests found.</td>
                            </tr>
                        )}
                        {withdrawals.map(w => (
                            <tr key={w.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                <td className="p-3 font-medium">{w.users?.username || 'Unknown'}</td>
                                <td className="p-3 text-emerald-400 font-bold">${w.amount}</td>
                                <td className="p-3 text-xs font-mono text-gray-400">{w.wallet_address || w.users?.wallet_address}</td>
                                <td className="p-3">
                                    <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${w.status === 'approved' ? 'bg-emerald-500/10 text-emerald-500' :
                                            w.status === 'rejected' ? 'bg-red-500/10 text-red-500' :
                                                'bg-yellow-500/10 text-yellow-500'
                                        }`}>
                                        {w.status}
                                    </span>
                                </td>
                                <td className="p-3 text-xs text-gray-400">
                                    {new Date(w.created_at).toLocaleDateString()}
                                </td>
                                <td className="p-3 text-right">
                                    {w.status === 'pending' && (
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => handleProcess(w.id, 'approved')}
                                                disabled={!!processingId}
                                                className="p-2 bg-emerald-500/10 text-emerald-500 rounded hover:bg-emerald-500/20 disabled:opacity-50"
                                                title="Approve"
                                            >
                                                <CheckCircle className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleProcess(w.id, 'rejected')}
                                                disabled={!!processingId}
                                                className="p-2 bg-red-500/10 text-red-500 rounded hover:bg-red-500/20 disabled:opacity-50"
                                                title="Reject"
                                            >
                                                <XCircle className="w-4 h-4" />
                                            </button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}