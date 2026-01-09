import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ArrowDownToLine, ArrowUpToLine, Gift, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { createPayment } from '@/services/paymentService';
import { supabase } from '@/integrations/supabase/client';
import PaymentRedirectModal from './PaymentRedirectModal';
import DepositOptionsModal from './DepositOptionsModal';
import DepositDetailsModal from './DepositDetailsModal';
import WithdrawalOptionsModal from './WithdrawalOptionsModal';
import WithdrawalDetailsModal from './WithdrawalDetailsModal';
import { useAuth } from '@/context/AuthContext';
import { WalletBalanceSkeleton } from './skeletons/WalletBalanceSkeleton';

interface WalletOverviewCardProps {
  showViewWallet?: boolean;
}

const WalletOverviewCard: React.FC<WalletOverviewCardProps> = ({ showViewWallet = false }) => {
  const [showBalance, setShowBalance] = useState(true);
  const [isRedirecting, setIsRedirecting] = useState(false);

  // Deposit State
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Withdrawal State
  const [isWithdrawalOptionsOpen, setIsWithdrawalOptionsOpen] = useState(false);
  const [isWithdrawalDetailsOpen, setIsWithdrawalDetailsOpen] = useState(false);
  const [isWithdrawalLoading, setIsWithdrawalLoading] = useState(false);

  const navigate = useNavigate();
  const { balance, isLoading, refreshBalance } = useAuth();
  const currentBalance = balance;

  const toggleBalanceVisibility = () => {
    setShowBalance(!showBalance);
  };

  const handleDepositClick = () => {
    setIsOptionsOpen(true);
  };

  const handleCryptoSelect = () => {
    setIsOptionsOpen(false);
    setIsDetailsOpen(true);
  };

  const handleWithdrawalClick = () => {
    setIsWithdrawalOptionsOpen(true);
  };

  const handleWithdrawalCryptoSelect = () => {
    setIsWithdrawalOptionsOpen(false);
    setIsWithdrawalDetailsOpen(true);
  };

  const handleWithdrawalConfirm = async (amount: number, address: string, currency: string) => {
    setIsWithdrawalLoading(true);
    try {
      const { error } = await supabase.rpc('request_withdrawal', {
        p_amount: amount,
        p_currency: currency,
        p_wallet_address: address
      });

      if (error) throw error;

      toast.success("Withdrawal Requested Successfully!");
      refreshBalance();
      setIsWithdrawalDetailsOpen(false);
    } catch (err: any) {
      console.error('Withdrawal Error:', err);
      toast.error(err.message || "Withdrawal Failed");
    } finally {
      setIsWithdrawalLoading(false);
    }
  };

  const handlePaymentProceed = async (amount: number) => {
    setIsDetailsOpen(false);
    try {
      setIsRedirecting(true);

      // We pass the entered amount. Asset/Network is handled by NOWPayments.
      console.log(`Initiating payment: ${amount} USD`);

      const response = await createPayment('Wallet Top-Up', amount, '00000000-0000-0000-0000-000000000000');

      if (response && response.invoice_url) {
        window.location.href = response.invoice_url;
      } else {
        throw new Error('No invoice URL received');
      }
    } catch (error) {
      console.error('Deposit error:', error);
      toast.error('Failed to initiate deposit. Please try again.');
      setIsRedirecting(false);
    }
  };

  const formattedBalance = showBalance
    ? `$ ${currentBalance.toFixed(2)}`
    : `$ ****.**`;

  return (
    <div className="bg-vanta-blue-medium p-4 md:p-6 shadow-lg text-vanta-text-light w-full rounded-[16px]">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-4 md:mb-6">
        <div className="flex items-center space-x-2">
          <span className="text-base md:text-lg font-semibold text-gray-400">WALLET</span>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleBalanceVisibility}
            className="text-gray-400 hover:bg-transparent hover:text-vanta-neon-blue h-8 w-8 md:h-10 md:w-10"
            aria-label={showBalance ? "Hide balance" : "Show balance"}
          >
            {showBalance ? <EyeOff size={18} className="md:w-5 md:h-5" /> : <Eye size={18} className="md:w-5 md:h-5" />}
          </Button>
        </div>
        {showViewWallet && (
          <Button
            variant="ghost"
            className="text-vanta-neon-blue hover:text-vanta-neon-blue hover:bg-white/5 px-2 flex items-center gap-1 text-sm md:text-base h-auto py-1"
            onClick={() => navigate('/wallet')}
          >
            View <span className="hidden md:inline">Wallet</span> <ChevronRight size={16} />
          </Button>
        )}
      </div>

      {/* Balance Display Section */}
      <div className="mb-8 md:mb-14 text-left">
        {isLoading ? (
          <WalletBalanceSkeleton />
        ) : (
          <>
            <p className="text-4xl md:text-5xl font-bold text-white mb-1 md:mb-2">{formattedBalance}</p>
            <p className="text-sm md:text-base text-gray-400">Today</p>
          </>
        )}
      </div>

      {/* Action Buttons Section */}
      <div className="flex justify-between space-x-3 md:space-x-4">
        <Button
          className="flex-1 bg-vanta-neon-blue text-vanta-blue-dark hover:bg-vanta-neon-blue/90 rounded-[12px] md:rounded-[14px] py-2 md:py-3 text-base md:text-lg font-bold h-auto"
          onClick={handleDepositClick}
          disabled={isRedirecting}
        >
          Deposit <ArrowDownToLine size={18} className="ml-1 md:ml-2 md:w-5 md:h-5" />
        </Button>
        <Button
          variant="outline"
          className="flex-1 bg-transparent border-2 border-vanta-neon-blue text-vanta-neon-blue hover:bg-vanta-neon-blue/10 hover:text-vanta-neon-blue rounded-[12px] md:rounded-[14px] py-2 md:py-3 text-base md:text-lg font-bold h-auto"
          onClick={handleWithdrawalClick}
        >
          Withdraw <ArrowUpToLine size={18} className="ml-1 md:ml-2 md:w-5 md:h-5" />
        </Button>
      </div>

      <PaymentRedirectModal isOpen={isRedirecting} />

      <DepositOptionsModal
        isOpen={isOptionsOpen}
        onClose={() => setIsOptionsOpen(false)}
        onSelectCrypto={handleCryptoSelect}
        onSelectFiat={() => { }}
      />
      <DepositDetailsModal
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        onConfirm={handlePaymentProceed}
      />

      {/* New Withdrawal Flow */}
      <WithdrawalOptionsModal
        isOpen={isWithdrawalOptionsOpen}
        onClose={() => setIsWithdrawalOptionsOpen(false)}
        onSelectCrypto={handleWithdrawalCryptoSelect}
        onSelectBank={() => { }}
      />
      <WithdrawalDetailsModal
        isOpen={isWithdrawalDetailsOpen}
        onClose={() => setIsWithdrawalDetailsOpen(false)}
        onConfirm={handleWithdrawalConfirm}
        loading={isWithdrawalLoading}
      />
    </div>
  );
};

export default WalletOverviewCard;