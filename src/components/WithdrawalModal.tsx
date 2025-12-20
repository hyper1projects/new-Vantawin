import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, DollarSign, X } from 'lucide-react';
import { toast } from 'sonner';

interface WithdrawalModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentBalance: number;
    onSuccess: () => void;
}

export default function WithdrawalModal({ isOpen, onClose, currentBalance, onSuccess }: WithdrawalModalProps) {
    const [amount, setAmount] = useState('');
    const [address, setAddress] = useState('');
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const numAmount = parseFloat(amount);

        if (isNaN(numAmount) || numAmount <= 0) {
            toast.error('Please enter a valid amount');
            return;
        }
        if (numAmount > currentBalance) {
            toast.error('Insufficient balance');
            return;
        }
        if (!address) {
            toast.error('Please enter a wallet address');
            return;
        }

        setLoading(true);
        const { data, error } = await supabase.rpc('request_withdrawal', {
            p_amount: numAmount,
            p_wallet_address: address
        });

        if (error) {
            console.error(error);
            toast.error('Failed to request withdrawal');
        } else if (data && !data.success) {
            toast.error(data.message || 'Request failed');
        } else {
            toast.success('Withdrawal requested successfully!');
            onSuccess();
            onClose();
        }
        setLoading(false);
    };

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
            <div className="bg-vanta-grey-dark p-6 rounded-2xl w-full max-w-md border border-white/10 relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 bg-white/5 rounded-full hover:bg-white/10"
                >
                    <X className="w-4 h-4" />
                </button>

                <div className="mb-6 text-center">
                    <div className="w-12 h-12 bg-vanta-neon-blue/10 rounded-full flex items-center justify-center mx-auto mb-3">
                        <DollarSign className="w-6 h-6 text-vanta-neon-blue" />
                    </div>
                    <h2 className="text-xl font-bold">Request Withdrawal</h2>
                    <p className="text-gray-400 text-sm">Transfer generic Real Money to crypto wallet.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs mb-1 text-gray-400">Amount USD</label>
                        <div className="relative">
                            <span className="absolute left-3 top-2.5 text-gray-500">$</span>
                            <input
                                type="number"
                                value={amount}
                                onChange={e => setAmount(e.target.value)}
                                min="10"
                                step="0.01"
                                className="w-full bg-black/30 border border-white/10 rounded-lg py-2 pl-7 pr-4 focus:border-vanta-neon-blue outline-none transition-colors"
                                placeholder="0.00"
                            />
                        </div>
                        <div className="text-right text-xs text-gray-500 mt-1">
                            Max: ${currentBalance.toFixed(2)}
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs mb-1 text-gray-400">Receiving Wallet Address</label>
                        <input
                            type="text"
                            value={address}
                            onChange={e => setAddress(e.target.value)}
                            className="w-full bg-black/30 border border-white/10 rounded-lg p-2 focus:border-vanta-neon-blue outline-none transition-colors font-mono text-sm"
                            placeholder="Enter crypto address..."
                        />
                    </div>

                    <div className="bg-yellow-500/10 p-3 rounded-lg border border-yellow-500/20">
                        <p className="text-xs text-yellow-500">
                            Withdrawals are processed manually. Please allow up to 24 hours for approval.
                        </p>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 rounded-xl bg-vanta-neon-blue text-black font-bold hover:bg-vanta-neon-blue/90 disabled:opacity-50 transition-all active:scale-[0.98]"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Confirm Request'}
                    </button>
                </form>
            </div>
        </div>
    );
}