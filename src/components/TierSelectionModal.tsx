"use client";

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { createPayment } from '@/services/paymentService';
import { Loader2 } from 'lucide-react';

interface TierSelectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    userId?: string;
}

const TIERS = [
    { name: 'Bronze', fee: 5, vanta: 1000, color: 'bg-orange-700' },
    { name: 'Silver', fee: 25, vanta: 5000, color: 'bg-gray-400' },
    { name: 'Gold', fee: 50, vanta: 12500, color: 'bg-yellow-500' },
    { name: 'Platinum', fee: 100, vanta: 25000, color: 'bg-cyan-300' },
];

const TierSelectionModal: React.FC<TierSelectionModalProps> = ({ isOpen, onClose, userId }) => {
    const [loadingTier, setLoadingTier] = useState<string | null>(null);

    const handleSelectTier = async (tier: typeof TIERS[0]) => {
        setLoadingTier(tier.name);
        try {
            // TODO: Retrieve activePoolId from context or props if needed. 
            // For now, passing a placeholder or checking if it's available in parent.
            // Assuming 'activePoolId' is not yet passed, we might need to update the prop interface later.
            // Passing 'demo-pool' if not available for this wiring phase.
            const activePoolId = 'demo-pool-id';

            const data = await createPayment(tier.name, tier.fee, activePoolId);

            // Redirect to Payment URL (NOWPayments provides invoice_url)
            if (data.invoice_url) {
                window.location.href = data.invoice_url;
            } else {
                console.error("No invoice URL returned", data);
            }
        } catch (err: any) {
            console.error('Payment Error:', err);
            // Show error toast
            alert("Payment Failed: " + (err.message || "Unknown error"));
        } finally {
            setLoadingTier(null);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="bg-vanta-blue-dark border-vanta-neon-blue text-vanta-text-light sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-center text-vanta-neon-blue">Select Your Tier</DialogTitle>
                    <DialogDescription className="text-center text-gray-400">
                        You need an active entry to place bets. Choose your buy-in level.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                    {TIERS.map((tier) => (
                        <div
                            key={tier.name}
                            className={`p-4 rounded-xl border border-gray-700 flex flex-col items-center justify-between hover:border-vanta-neon-blue transition-colors cursor-pointer ${tier.color} bg-opacity-10`}
                        >
                            <div className="text-center">
                                <h3 className={`text-xl font-bold ${tier.name === 'Platinum' ? 'text-cyan-300' : 'text-white'}`}>{tier.name}</h3>
                                <p className="text-3xl font-bold mt-2">${tier.fee}</p>
                                <p className="text-sm text-gray-300 mt-1">Get {tier.vanta.toLocaleString()} Vanta</p>
                            </div>

                            <Button
                                onClick={() => handleSelectTier(tier)}
                                disabled={!!loadingTier}
                                className="mt-4 w-full bg-vanta-neon-blue text-vanta-blue-dark hover:bg-white"
                            >
                                {loadingTier === tier.name ? <Loader2 className="animate-spin" /> : 'Select'}
                            </Button>
                        </div>
                    ))}
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default TierSelectionModal;
