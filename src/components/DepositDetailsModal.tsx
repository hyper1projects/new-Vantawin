
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface DepositDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (amount: number) => void;
    loading?: boolean;
}

const DepositDetailsModal: React.FC<DepositDetailsModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    loading = false
}) => {
    const [amount, setAmount] = useState<string>('');

    const handleConfirm = () => {
        const numAmount = parseFloat(amount);
        if (!isNaN(numAmount) && numAmount > 0) {
            onConfirm(numAmount);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="bg-vanta-blue-dark border-gray-800 text-white sm:max-w-md p-6 rounded-[24px] flex flex-col items-center justify-center min-h-[400px]">
                <DialogHeader className="mb-8 w-full relative">
                    <DialogTitle className="text-center text-xl font-bold text-white">Deposit</DialogTitle>
                </DialogHeader>

                <div className="flex-1 flex flex-col items-center justify-center w-full space-y-4">
                    <span className="text-gray-400 font-bold text-xl">USD</span>
                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0"
                        className="bg-transparent border-none text-center text-7xl font-bold text-white placeholder:text-white/50 focus:ring-0 focus:outline-none w-full [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        autoFocus
                    />
                </div>

                <DialogFooter className="mt-8 w-full">
                    <Button
                        className="w-full bg-[#00F0FF] hover:bg-[#00F0FF]/90 text-black text-lg font-bold rounded-full py-6"
                        onClick={handleConfirm}
                        disabled={loading || !amount}
                    >
                        {loading ? 'Processing...' : 'Continue'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default DepositDetailsModal;
