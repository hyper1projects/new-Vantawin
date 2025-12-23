import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { placeBet } from '@/services/bettingService';
import { Loader2 } from 'lucide-react';
import { Game } from '@/types/game';

interface BetSlipProps {
    isOpen: boolean;
    onClose: () => void;
    match: Game | null;
    selectedOutcomeId: string | null;
    activePoolId: string;
}

const BetSlip: React.FC<BetSlipProps> = ({ isOpen, onClose, match, selectedOutcomeId, activePoolId }) => {
    const [stake, setStake] = useState<number>(50);
    const [loading, setLoading] = useState(false);

    if (!match || !selectedOutcomeId) return null;

    // Parse outcome ID: questionId_outcomeId_odds
    const parts = selectedOutcomeId.split('_');
    const outcomeId = parts[1]; // e.g., 'home', 'away', or team name
    const odds = parseFloat(parts[2]);
    const outcomeLabel = outcomeId.includes('home') ? match.team1.name : (outcomeId.includes('away') ? match.team2.name : outcomeId);

    const handleConfirmBet = async () => {
        if (stake < 50 || stake > 200) return alert("Stake must be 50-200");

        setLoading(true);
        try {
            const result = await placeBet(
                match.id,
                activePoolId,
                outcomeLabel,
                stake,
                odds,
                match // Pass full match data for lazy create
            );

            // Success Feedback
            alert(`Bet Placed! New Balance: ${result.new_balance} Vanta`);
            onClose();
            // OPTIONAL: Trigger a refresh of the User Balance in your app context
        } catch (err: any) {
            alert("Bet Error: " + (err.message || "Unknown error"));
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="bg-vanta-blue-dark border-vanta-neon-blue text-vanta-text-light sm:max-w-[400px]">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-vanta-neon-blue">Place Your Bet</DialogTitle>
                    <DialogDescription className="text-gray-400">
                        {match.team1.name} vs {match.team2.name}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="flex justify-between items-center text-sm">
                        <span>Outcome:</span>
                        <span className="font-bold text-white">{outcomeLabel}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                        <span>Odds:</span>
                        <span className="font-bold text-vanta-neon-green">{odds.toFixed(2)}</span>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm text-gray-400">Stake (50 - 200 Vanta)</label>
                        <input
                            type="number"
                            min={50}
                            max={200}
                            value={stake}
                            onChange={(e) => setStake(Number(e.target.value))}
                            className="w-full bg-vanta-blue-medium border border-gray-700 rounded-md p-2 text-white focus:border-vanta-neon-blue focus:outline-none"
                        />
                    </div>
                    <div className="flex justify-between items-center text-sm font-bold pt-2 border-t border-gray-700">
                        <span>Potential Return:</span>
                        <span className="text-vanta-neon-green">{(stake * odds).toFixed(0)} Vanta</span>
                    </div>
                </div>

                <div className="flex justify-end space-x-2">
                    <Button variant="ghost" onClick={onClose} className="text-gray-400 hover:text-white">Cancel</Button>
                    <Button
                        onClick={handleConfirmBet}
                        disabled={loading}
                        className="bg-vanta-neon-blue text-vanta-blue-dark hover:bg-white"
                    >
                        {loading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : null}
                        Confirm Bet
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default BetSlip;
