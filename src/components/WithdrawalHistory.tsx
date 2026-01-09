import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';
import { Loader2, ArrowUpRight, AlertCircle, CheckCircle, Clock } from 'lucide-react';

interface Withdrawal {
    id: string;
    amount: number;
    currency: string;
    wallet_address: string;
    status: 'pending' | 'processing' | 'completed' | 'failed';
    created_at: string;
    nowpayments_payout_id?: string;
}

const WithdrawalHistory = () => {
    const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchHistory();

        // Realtime Subscription
        const channel = supabase
            .channel('withdrawal_changes')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'withdrawal_requests' },
                () => fetchHistory()
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    const fetchHistory = async () => {
        try {
            const { data, error } = await supabase
                .from('withdrawal_requests')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(20);

            if (error) throw error;
            setWithdrawals((data as any) || []);
        } catch (error) {
            console.error('Error fetching withdrawals:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'completed': return <Badge className="bg-green-500/20 text-green-400 border-0 flex items-center gap-1"><CheckCircle size={12} /> Completed</Badge>;
            case 'failed': return <Badge className="bg-red-500/20 text-red-400 border-0 flex items-center gap-1"><AlertCircle size={12} /> Failed</Badge>;
            default: return <Badge className="bg-yellow-500/20 text-yellow-400 border-0 flex items-center gap-1"><Clock size={12} /> Pending</Badge>;
        }
    };

    if (loading) return <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-gray-500" /></div>;

    if (withdrawals.length === 0) {
        return <div className="p-12 text-center text-gray-500">No withdrawal history found.</div>;
    }

    return (
        <div className="space-y-4">
            {withdrawals.map((w) => (
                <div key={w.id} className="bg-white/5 border border-white/5 rounded-xl p-4 flex justify-between items-center group hover:bg-white/10 transition-colors">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold text-white text-lg">${w.amount.toFixed(2)}</span>
                            <span className="text-xs text-gray-500 font-mono bg-black/30 px-1 rounded">{w.currency}</span>
                        </div>
                        <div className="text-xs text-gray-400 font-mono truncate max-w-[200px] md:max-w-md flex items-center gap-1">
                            To: {w.wallet_address.substring(0, 8)}...{w.wallet_address.substring(w.wallet_address.length - 6)}
                        </div>
                        <div className="text-[10px] text-gray-600 mt-1">{new Date(w.created_at).toLocaleString()}</div>
                    </div>
                    <div className="text-right">
                        {getStatusBadge(w.status)}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default WithdrawalHistory;
