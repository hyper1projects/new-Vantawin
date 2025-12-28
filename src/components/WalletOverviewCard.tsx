import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ArrowDownToLine, ArrowUpToLine, Gift, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { createPayment } from '@/services/paymentService';
import PaymentRedirectModal from './PaymentRedirectModal';
import DepositOptionsModal from './DepositOptionsModal';
import DepositDetailsModal from './DepositDetailsModal';
import { useAuth } from '@/context/AuthContext';
import { WalletBalanceSkeleton } from './skeletons/WalletBalanceSkeleton';

interface WalletOverviewCardProps {
  showViewWallet?: boolean;
}

const WalletOverviewCard: React.FC<WalletOverviewCardProps> = ({ showViewWallet = false }) => {
  const [showBalance, setShowBalance] = useState(true);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const navigate = useNavigate();
  const { balance, isLoading } = useAuth();
  console.log('WalletOverviewCard balance:', balance); // DEBUG LOG
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
    <div className="bg-vanta-blue-medium p-6 shadow-lg text-vanta-text-light w-full rounded-[16px]">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center space-x-2">
          <span className="text-lg font-semibold text-gray-400">WALLET</span>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleBalanceVisibility}
            className="text-gray-400 hover:bg-transparent hover:text-vanta-neon-blue"
            aria-label={showBalance ? "Hide balance" : "Show balance"}
          >
            {showBalance ? <EyeOff size={20} /> : <Eye size={20} />}
          </Button>
        </div>
        {showViewWallet && (
          <Button
            variant="ghost"
            className="text-vanta-neon-blue hover:text-vanta-neon-blue hover:bg-white/5 px-2 flex items-center gap-1"
            onClick={() => navigate('/wallet')}
          >
            View Wallet <ChevronRight size={16} />
          </Button>
        )}
      </div>

      {/* Balance Display Section */}
      <div className="mb-12 text-left">
        {isLoading ? (
          <WalletBalanceSkeleton />
        ) : (
          <>
            <p className="text-5xl font-bold text-white mb-2">{formattedBalance}</p>
            <p className="text-base text-gray-400">Today</p>
          </>
        )}
      </div>

      {/* Action Buttons Section */}
      <div className="flex justify-between space-x-4">
        <Button
          className="flex-1 bg-vanta-neon-blue text-vanta-blue-dark hover:bg-vanta-neon-blue/90 rounded-[14px] py-3 text-lg font-bold"
          onClick={handleDepositClick}
          disabled={isRedirecting}
        >
          Deposit <ArrowDownToLine size={20} className="ml-2" />
        </Button>
        <Button
          variant="outline"
          className="flex-1 bg-transparent border-2 border-vanta-neon-blue text-vanta-neon-blue hover:bg-vanta-neon-blue/10 rounded-[14px] py-3 text-lg font-bold"
          onClick={() => toast.info('Withdrawals are processed manually. Please contact support.')}
        >
          Withdraw <ArrowUpToLine size={20} className="ml-2" />
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
    </div>
  );
};

export default WalletOverviewCard;