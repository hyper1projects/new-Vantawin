import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface Currency {
    ticker: string;
    name: string;
    network: string;
    min_amount: number;
    max_amount: number;
    min_amount_usd: number;
    max_amount_usd: number;
}

interface WithdrawalDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (amount: number, address: string, currency: string) => Promise<void>;
    loading?: boolean;
}

const WithdrawalDetailsModal: React.FC<WithdrawalDetailsModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    loading = false
}) => {
    const { balance } = useAuth();
    const [currencies, setCurrencies] = useState<Currency[]>([]);
    const [selectedCurrency, setSelectedCurrency] = useState<Currency | null>(null);
    const [amount, setAmount] = useState<string>('');
    const [address, setAddress] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [isLoadingCurrencies, setIsLoadingCurrencies] = useState(false);

    // Fetch currencies on open
    useEffect(() => {
        if (isOpen) {
            setAmount('');
            setAddress('');
            setError(null);
            fetchCurrencies();
        }
    }, [isOpen]);

    const fetchCurrencies = async () => {
        setIsLoadingCurrencies(true);
        try {
            const { data, error } = await supabase
                .from('currencies')
                .select('*')
                .eq('is_active', true)
                .order('name');

            if (error) throw error;
            setCurrencies(data || []);
        } catch (err) {
            console.error('Failed to fetch currencies', err);
        } finally {
            setIsLoadingCurrencies(false);
        }
    };

    const handleCurrencyChange = (value: string) => {
        const currency = currencies.find(c => c.ticker === value);
        setSelectedCurrency(currency || null);
        setError(null);
    };

    const handleConfirm = async () => {
        setError(null);
        if (!selectedCurrency) {
            setError("Please select a network.");
            return;
        }

        const numAmount = parseFloat(amount);

        if (isNaN(numAmount) || numAmount <= 0) {
            setError("Please enter a valid amount.");
            return;
        }

        // Validate Balance
        // We assume for now that 1 unit of currency ~= 1 USD for checking "Available".
        // However, for crypto withdrawal, the user inputs the CRYPTO amount? 
        // OR does the user input the USD amount and we convert?
        // The user request says "min_amount: 15.07..." which looks like USD or the token amount.
        // For BTC "min_amount: 0.0001141" -> this is definitely Token Amount.
        // But the wallet balance is in USD.
        // Assuming for this iteration the user Inputs USD value to withdraw, and we check against min_amount which SHOULD BE in USD in the DB?
        // Wait, looking at the JSON:
        // usdttrc20 min: 15.07 -> $15 USD.
        // btc min: 0.00011 -> ~$10 USD.
        // So the db min_amounts are likely in TOKEN units? 
        // Or maybe they are USD equivalents? 
        // "15.07" for USDT is exactly 15 tokens.
        // "0.00011" BTC is like $10.
        // Since the wallet balance is USD, we should probably treat the input as USD for now to keep it consistent with the display.
        // BUT strict validation requires checking the exact limit.
        // For simplicity in this step: We will check raw numbers. 
        // If the table values are Token Units, we might have a mismatch if the user inputs USD.
        // Let's assume the user inputs USD for USDT/Stablecoins, but for BTC?
        // The previous design had "Amount (USD)". Let's stick to Amount (USD) for the UI.

        if (numAmount > balance) {
            setError("Insufficient funds.");
            return;
        }

        if (numAmount < selectedCurrency.min_amount_usd) {
            setError(`Minimum withdrawal is $${selectedCurrency.min_amount_usd.toFixed(2)}`);
            return;
        }

        if (numAmount > selectedCurrency.max_amount_usd) {
            setError(`Maximum withdrawal is $${selectedCurrency.max_amount_usd.toLocaleString()}`);
            return;
        }

        if (!address || address.length < 10) {
            setError("Please enter a valid wallet address.");
            return;
        }

        await onConfirm(numAmount, address, selectedCurrency.ticker);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="bg-vanta-blue-dark border-gray-800 text-white sm:max-w-md p-6 rounded-[24px] flex flex-col min-h-[550px]">

                <DialogHeader className="mb-6">
                    <DialogTitle className="text-center text-xl font-bold text-white">Withdrawal Details</DialogTitle>
                </DialogHeader>

                <div className="flex-1 flex flex-col justify-start w-full space-y-6">

                    {/* 1. Network Selection */}
                    <div className="space-y-2">
                        <Label className="text-vanta-neon-blue font-bold text-xs uppercase tracking-wider">Select Network</Label>
                        <Select onValueChange={handleCurrencyChange}>
                            <SelectTrigger className="w-full bg-[#0B2C63]/50 border-white/10 text-white py-6 rounded-xl">
                                <SelectValue placeholder={isLoadingCurrencies ? "Loading..." : "Select withdrawal network"} />
                            </SelectTrigger>
                            <SelectContent className="bg-[#0B2C63] border-gray-700 text-white">
                                {currencies.map((currency) => (
                                    <SelectItem key={currency.ticker} value={currency.ticker} className="focus:bg-vanta-neon-blue/20 focus:text-white cursor-pointer py-3">
                                        <div className="flex flex-col text-left">
                                            <span className="font-bold">{currency.name}</span>
                                            <span className="text-xs text-gray-400 opacity-70">Min: ${currency.min_amount_usd.toFixed(2)} • {currency.network}</span>
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* 2. Address Input */}
                    <div className="w-full space-y-2">
                        <Label htmlFor="address" className="text-vanta-neon-blue font-bold text-xs uppercase tracking-wider">
                            Wallet Address {selectedCurrency && `(${selectedCurrency.network})`}
                        </Label>
                        <Input
                            id="address"
                            placeholder={selectedCurrency ? `Paste ${selectedCurrency.network} address...` : "Select a network first"}
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            disabled={!selectedCurrency}
                            className="bg-[#0B2C63]/50 border-white/10 font-mono text-sm py-6 rounded-xl file:text-white placeholder:text-gray-500 disabled:opacity-50"
                        />
                    </div>

                    {/* 3. Amount Input */}
                    <div className="w-full space-y-2">
                        <Label className="uppercase tracking-wider text-vanta-neon-blue font-bold text-xs">Amount (USD)</Label>
                        <div className={`relative w-full bg-[#0B2C63]/50 border rounded-xl h-[54px] flex items-center justify-between px-4 transition-all duration-300 ${selectedCurrency && parseFloat(amount) > 0 && parseFloat(amount) < selectedCurrency.min_amount_usd
                                ? 'border-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.3)] bg-red-950/10'
                                : 'border-white/10 hover:border-white/20'
                            }`}>
                            <span className="text-gray-400 text-lg font-bold">$</span>
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="0.00"
                                className="bg-transparent border-none text-right text-lg font-bold text-white placeholder:text-gray-600 focus:ring-0 focus:outline-none w-full h-full [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            />
                        </div>
                        <div className="flex justify-between w-full text-xs text-gray-400 px-1">
                            <span>Min: {selectedCurrency ? `$${selectedCurrency.min_amount_usd.toFixed(2)}` : '-'}</span>
                            <span>Available: ${balance.toFixed(2)}</span>
                        </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-red-400 text-sm flex items-center gap-2 w-full justify-center text-center mt-2">
                            <AlertCircle size={16} className="shrink-0" />
                            {error}
                        </div>
                    )}
                </div>

                <DialogFooter className="mt-6 w-full">
                    <Button
                        className="w-full bg-[#00F0FF] hover:bg-[#00F0FF]/90 text-black text-lg font-bold rounded-full py-6"
                        onClick={handleConfirm}
                        disabled={loading || !amount || !address || !selectedCurrency}
                    >
                        {loading ? 'Processing...' : 'Confirm Withdrawal'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default WithdrawalDetailsModal;
