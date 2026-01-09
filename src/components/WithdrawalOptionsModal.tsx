
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Bitcoin, Landmark } from 'lucide-react';

interface WithdrawalOptionsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelectCrypto: () => void;
    onSelectBank: () => void;
}

const WithdrawalOptionsModal: React.FC<WithdrawalOptionsModalProps> = ({
    isOpen,
    onClose,
    onSelectCrypto,
    onSelectBank
}) => {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="bg-vanta-blue-dark border-gray-800 text-vanta-text-light sm:max-w-md p-6 rounded-[24px]">
                <DialogHeader className="mb-6">
                    <DialogTitle className="text-center text-xl font-bold text-white">Withdraw Funds</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    {/* Crypto Option */}
                    <button
                        onClick={onSelectCrypto}
                        className="w-full bg-[#0B2C63] border border-blue-900/30 hover:border-vanta-neon-blue/50 rounded-xl p-4 flex items-center justify-between transition-all group"
                    >
                        <div className="flex items-center space-x-4">
                            <div className="bg-[#2A3040] p-3 rounded-lg text-vanta-neon-blue">
                                <Bitcoin size={28} />
                            </div>
                            <div className="text-left">
                                <h3 className="font-bold text-white group-hover:text-vanta-neon-blue transition-colors">Crypto Withdrawal</h3>
                                <p className="text-sm text-gray-400">BTC, ETH, USDT & More</p>
                            </div>
                        </div>
                    </button>

                    {/* Bank Option */}
                    <button
                        onClick={onSelectBank}
                        className="w-full bg-[#0B2C63] border border-blue-900/30 rounded-xl p-4 flex items-center justify-between opacity-75 cursor-not-allowed"
                        disabled
                    >
                        <div className="flex items-center space-x-4">
                            <div className="bg-[#2A3040] p-3 rounded-lg text-gray-400">
                                <Landmark size={28} />
                            </div>
                            <div className="text-left">
                                <h3 className="font-bold text-gray-300">Fiat Withdrawal</h3>
                                <p className="text-sm text-gray-500">Coming Soon</p>
                            </div>
                        </div>
                    </button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default WithdrawalOptionsModal;
