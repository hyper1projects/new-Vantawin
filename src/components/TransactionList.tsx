
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useTransactions, Transaction } from '@/hooks/useTransactions';
import { format } from 'date-fns';
import { Loader2, ArrowUpRight, ArrowDownLeft, Trophy } from 'lucide-react';

type TransactionFilter = 'all' | 'deposits' | 'withdrawals' | 'payouts' | 'fees';

export default function TransactionList() {
    const [filter, setFilter] = useState<TransactionFilter>('all');
    const { transactions, loading } = useTransactions();

    const getFilterButtonClasses = (f: TransactionFilter) => {
        const isActive = filter === f;
        return cn(
            "relative text-xs md:text-base font-semibold pb-1 md:pb-2 transition-colors whitespace-nowrap",
            isActive
                ? "text-vanta-neon-blue after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-vanta-neon-blue"
                : "text-gray-400 hover:text-white"
        );
    };

    const filteredTransactions = transactions.filter(t => {
        if (filter === 'all') return true;
        if (filter === 'deposits') return t.type === 'deposit';
        if (filter === 'withdrawals') return t.type === 'withdrawal';
        if (filter === 'payouts') return t.type === 'payout'; // Was 'winnings'
        if (filter === 'fees') return t.type === 'entry_fee';
        return true;
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed':
            case 'processed':
                return 'text-emerald-400';
            case 'pending':
                return 'text-yellow-400';
            case 'failed':
                return 'text-red-400';
            default:
                return 'text-gray-400';
        }
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'deposit': return <ArrowDownLeft size={16} className="text-emerald-400" />;
            case 'withdrawal': return <ArrowUpRight size={16} className="text-red-400" />;
            case 'payout': return <Trophy size={16} className="text-yellow-400" />;
            case 'entry_fee': return <ArrowUpRight size={16} className="text-blue-400" />;
            default: return null;
        }
    };

    if (loading) {
        return <div className="flex justify-center py-10"><Loader2 className="animate-spin text-vanta-neon-blue" /></div>;
    }

    return (
        <div className="bg-vanta-blue-medium p-6 rounded-[27px] shadow-sm text-vanta-text-light w-full flex-grow flex flex-col">
            <div className="flex space-x-6 mb-6 border-b border-gray-700 pb-4 overflow-x-auto scrollbar-hide">
                <button className={getFilterButtonClasses('all')} onClick={() => setFilter('all')}>
                    All
                </button>
                <button className={getFilterButtonClasses('deposits')} onClick={() => setFilter('deposits')}>
                    Deposits
                </button>
                <button className={getFilterButtonClasses('withdrawals')} onClick={() => setFilter('withdrawals')}>
                    Withdrawals
                </button>
                <button className={getFilterButtonClasses('payouts')} onClick={() => setFilter('payouts')}>
                    Winnings
                </button>
                <button className={getFilterButtonClasses('fees')} onClick={() => setFilter('fees')}>
                    Entry Fees
                </button>
            </div>

            <div className="grid grid-cols-5 gap-2 md:gap-4 text-xs md:text-sm font-semibold text-gray-500 mb-2 md:mb-4 px-2">
                <span>Time</span>
                <span>Type</span>
                <span>Description</span>
                <span>Amount</span>
                <span className="text-right">Status</span>
            </div>

            <div className="space-y-2">
                {filteredTransactions.length === 0 ? (
                    <div className="text-center text-gray-500 py-10 italic">No transactions found</div>
                ) : (
                    filteredTransactions.map((tx) => (
                        <div key={tx.id} className="grid grid-cols-5 gap-2 md:gap-4 items-center py-2 md:py-3 px-2 hover:bg-vanta-neon-blue/10 rounded-lg transition-colors border-b border-gray-800/50 last:border-0 text-[10px] md:text-sm">
                            <div className="text-gray-300">
                                {format(new Date(tx.created_at), 'MMM d, HH:mm')}
                            </div>
                            <div className="flex items-center gap-1 md:gap-2 capitalize font-medium">
                                {getIcon(tx.type)}
                                <span className="truncate">{tx.type.replace('_', ' ')}</span>
                            </div>
                            <div className="text-gray-400 truncate" title={tx.description}>
                                {tx.description || '-'}
                            </div>
                            <div className={`font-mono font-medium ${['withdrawal', 'entry_fee'].includes(tx.type) ? 'text-red-400' : 'text-emerald-400'}`}>
                                {['withdrawal', 'entry_fee'].includes(tx.type) ? '-' : '+'}$ {Math.abs(tx.amount).toFixed(2)}
                            </div>
                            <div className={`text-right uppercase font-bold tracking-wider ${getStatusColor(tx.status)}`}>
                                {tx.status}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
