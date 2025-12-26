"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '../lib/utils';
import RewardsHistory from './RewardsHistory';
import TransactionList from './TransactionList';

type MainTab = 'transactions' | 'rewards'; // Re-added 'rewards'
type TransactionFilter = 'all' | 'deposits' | 'withdrawals' | 'refunds';

interface WalletTabsProps {
  className?: string;
}

const WalletTabs: React.FC<WalletTabsProps> = ({ className }) => {
  const [activeMainTab, setActiveMainTab] = useState<MainTab>('transactions');
  const [activeTransactionFilter, setActiveTransactionFilter] = useState<TransactionFilter>('all');

  const getMainTabButtonClasses = (tab: MainTab) => {
    const isActive = activeMainTab === tab;
    return cn(
      "flex-1 py-2 px-4 rounded-[14px] text-base font-semibold transition-colors duration-200",
      isActive
        ? "bg-vanta-neon-blue text-vanta-blue-dark hover:bg-vanta-neon-blue/90"
        : "bg-transparent text-gray-400 hover:text-white"
    );
  };

  const getTransactionFilterButtonClasses = (filter: TransactionFilter) => {
    const isActive = activeTransactionFilter === filter;
    return cn(
      "relative text-base font-semibold pb-2",
      isActive
        ? "text-vanta-neon-blue after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-vanta-neon-blue"
        : "text-gray-400 hover:text-white"
    );
  };

  const renderTabContent = () => {
    switch (activeMainTab) {
      case 'transactions':
        return <TransactionList />;
      case 'rewards': // Re-added rewards case
        return (
          <RewardsHistory />
        );
      default:
        return null;
    }
  };

  return (
    <div className={cn("flex flex-col space-y-6", className)}>
      <div className="bg-vanta-blue-dark p-2 rounded-[27px] flex space-x-2 w-full md:w-fit">
        <Button
          className={getMainTabButtonClasses('transactions')}
          onClick={() => setActiveMainTab('transactions')}
        >
          Transactions
        </Button>
        <Button // Re-added Rewards button
          className={getMainTabButtonClasses('rewards')}
          onClick={() => setActiveMainTab('rewards')}
        >
          Rewards
        </Button>
      </div>
      {renderTabContent()}
    </div>
  );
};

export default WalletTabs;