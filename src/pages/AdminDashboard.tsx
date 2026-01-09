import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle, XCircle, ShieldAlert } from 'lucide-react';
import { toast } from 'sonner';

interface WithdrawalRequest {
    id: string;
    user_id: string;
    amount: number;
    currency: string;
    wallet_address: string;
    status: string;
    created_at: string;
    user?: { username: string; email: string }; // Optional if we join
}

const AdminDashboard = () => {
    const [requests, setRequests] = useState<WithdrawalRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState<string | null>(null);

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        setLoading(true);
        try {
            // Join with users table for username? 
            // Supabase simpler join:
            const { data, error } = await supabase
                .from('withdrawal_requests')
                .select('*, users(username, email)')
                .eq('status', 'pending')
                .order('created_at', { ascending: true });

            if (error) throw error;
            setRequests(data as any || []);
        } catch (error) {
            console.error('Error fetching requests:', error);
            toast.error('Failed to load requests');
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (id: string) => {
        setProcessingId(id);
        try {
            const { data, error } = await supabase.functions.invoke('process-withdrawal', {
                body: { request_ids: [id] }
            });

            if (error) throw error;
            if (data.error) throw new Error(data.error);

            toast.success('Withdrawal Approved & Processed');
            fetchRequests(); // Refresh list
        } catch (err: any) {
            console.error('Approval Error:', err);
            toast.error(`Approval Failed: ${err.message}`);
        } finally {
            setProcessingId(null);
        }
    };

    const handleReject = async (id: string) => {
        if (!confirm('Are you sure you want to REJECT this withdrawal? The user will be refunded.')) return;

        setProcessingId(id);
        try {
            const { error } = await supabase.rpc('reject_withdrawal', {
                p_request_id: id,
                p_reason: 'Admin Rejected'
            });

            if (error) throw error;

            toast.success('Withdrawal Rejected & Refunded');
            fetchRequests();
        } catch (err: any) {
            console.error('Rejection Error:', err);
            toast.error(`Rejection Failed: ${err.message}`);
        } finally {
            setProcessingId(null);
        }
    };

    if (loading) return <div className="h-screen flex items-center justify-center bg-vanta-dark text-white"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="min-h-screen bg-vanta-dark text-white p-4 md:p-8 max-w-7xl mx-auto">
            <header className="mb-6 md:mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
                    <ShieldAlert className="text-vanta-neon-blue" />
                    Admin Dashboard
                </h1>
                <Button variant="outline" onClick={fetchRequests} className="w-full sm:w-auto">Refresh</Button>
            </header>

            <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-400">Pending Withdrawals ({requests.length})</h2>

                {requests.length === 0 ? (
                    <div className="p-12 bg-white/5 rounded-xl text-center text-gray-500">
                        No pending withdrawal requests.
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {requests.map((req) => (
                            <div key={req.id} className="bg-white/5 border border-white/10 rounded-xl p-6 flex flex-col md:flex-row justify-between md:items-center gap-4 hover:bg-white/10 transition-colors">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <span className="font-mono text-xs text-gray-500 bg-black/40 px-2 py-1 rounded">{req.id.slice(0, 8)}...</span>
                                        <span className="font-bold text-lg text-white">{(req as any).users?.username || 'User'}</span>
                                    </div>
                                    <div className="text-2xl font-bold text-vanta-neon-blue">
                                        ${req.amount.toFixed(2)} <span className="text-sm text-gray-400">{req.currency}</span>
                                    </div>
                                    <div className="text-xs text-gray-400 font-mono bg-black/20 p-2 rounded">
                                        {req.wallet_address}
                                    </div>
                                    <div className="text-xs text-gray-600">
                                        Requested: {new Date(req.created_at).toLocaleString()}
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <Button
                                        onClick={() => handleReject(req.id)}
                                        disabled={!!processingId}
                                        variant="destructive"
                                        className="bg-red-500/20 text-red-400 hover:bg-red-500/40 border-0"
                                    >
                                        <XCircle className="mr-2 h-4 w-4" />
                                        Reject
                                    </Button>
                                    <Button
                                        onClick={() => handleApprove(req.id)}
                                        disabled={!!processingId}
                                        className="bg-green-500/20 text-green-400 hover:bg-green-500/40 border-0"
                                    >
                                        {processingId === req.id ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <CheckCircle className="mr-2 h-4 w-4" />}
                                        Approve (Pay)
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
