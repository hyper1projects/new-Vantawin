"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '../lib/utils';

type WalletTab = 'transactions' | 'rewards';

const WalletTabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState<WalletTab>('transactions');

  const getTabButtonClasses = (tab: WalletTab) => {
    const isActive = activeTab === tab;
    return cn(
      "flex-1 py-3 px-6 rounded-[27px] text-lg font-bold transition-colors duration-200",
      isActive
        ? "bg-vanta-neon-blue text-vanta-blue-dark hover:bg-vanta-neon-blue/90"
        : "bg-transparent text-gray-400 hover:text-white"
    );
  };

  return (
    <div className="bg-vanta-blue-dark p-2 rounded-[27px] flex space-x-2 w-full">
      <Button
        className={getTabButtonClasses('transactions')}
        onClick={() => setActiveTab('transactions')}
      >
        Transactions
      </Button>
      <Button
        className={getTabButtonClasses('rewards')}
        onClick={() => setActiveTab('rewards')}
      >
        Rewards
      </Button>
    </div>
  );
};

export default WalletTabs;