"use client";

import React, { useState } from 'react';
import { Eye, EyeOff, ArrowDownToLine, ArrowUpToLine, Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';

const WalletOverviewCard: React.FC = () => {
  const [showBalance, setShowBalance] = useState(true);
  const currentBalance = 0.00; // Placeholder for actual balance

  const toggleBalanceVisibility = () => {
    setShowBalance(!showBalance);
  };

  const formattedBalance = showBalance
    ? `₦ ${currentBalance.toFixed(2)}`
    : `₦ ****.**`;

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
        <div className="bg-[#3A3A3A] p-2 rounded-full">
          <Gift size={20} className="text-yellow-400" />
        </div>
      </div>

      {/* Balance Display Section */}
      <div className="mb-12 text-left">
        <p className="text-5xl font-bold text-white mb-2">{formattedBalance}</p>
        <p className="text-base text-gray-400">Today</p>
      </div>

      {/* Action Buttons Section */}
      <div className="flex justify-between space-x-4">
        <Button className="flex-1 bg-vanta-neon-blue text-vanta-blue-dark hover:bg-vanta-neon-blue/90 rounded-[14px] py-3 text-lg font-bold">
          Deposit <ArrowDownToLine size={20} className="ml-2" />
        </Button>
        <Button variant="outline" className="flex-1 bg-transparent border-2 border-vanta-neon-blue text-vanta-neon-blue hover:bg-vanta-neon-blue/10 rounded-[14px] py-3 text-lg font-bold">
          Withdraw <ArrowUpToLine size={20} className="ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default WalletOverviewCard;