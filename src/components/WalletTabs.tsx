"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '../lib/utils';
import RewardsHistory from './RewardsHistory'; // Re-import the RewardsHistory component

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
        return (
          <div className="bg-vanta-blue-medium p-6 rounded-[27px] shadow-sm text-vanta-text-light w-full flex-grow flex flex-col">
            <div className="flex space-x-6 mb-6 border-b border-gray-700 pb-4">
              <Button variant="ghost" className={getTransactionFilterButtonClasses('all')} onClick={() => setActiveTransactionFilter('all')}>
                All Transactions
              </Button>
              <Button variant="ghost" className={getTransactionFilterButtonClasses('deposits')} onClick={() => setActiveTransactionFilter('deposits')}>
                Deposits
              </Button>
              <Button variant="ghost" className={getTransactionFilterButtonClasses('withdrawals')} onClick={() => setActiveTransactionFilter('withdrawals')}>
                Withdrawals
              </Button>
              <Button variant="ghost" className={getTransactionFilterButtonClasses('refunds')} onClick={() => setActiveTransactionFilter('refunds')}>
                Refunds
              </Button>
            </div>

            <div className="grid grid-cols-5 gap-4 text-sm font-semibold text-gray-400 mb-4">
              <span>Time</span>
              <span>Type</span>
              <span>Amount</span>
              <span>Status</span>
              <span className="text-right">After Balance</span>
            </div>

            <div className="text-center text-gray-400 text-lg mt-12 flex-grow flex items-center justify-center">
              Nothing to show yet
            </div>
          </div>
        );
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