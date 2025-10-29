"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '../lib/utils';
import RewardsHistory from './RewardsHistory'; // Import the new RewardsHistory component

type WalletTab = 'transactions' | 'rewards';
type TransactionFilter = 'all' | 'deposits' | 'withdrawals' | 'refunds'; // New type for sub-tabs

const WalletTabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState<WalletTab>('transactions');
  const [activeTransactionFilter, setActiveTransactionFilter] = useState<TransactionFilter>('all'); // New state for sub-tabs

  const getTabButtonClasses = (tab: WalletTab) => {
    const isActive = activeTab === tab;
    return cn(
      "flex-1 py-2 px-4 rounded-[27px] text-sm font-semibold transition-colors duration-200", // Reduced text size and padding
      isActive
        ? "bg-vanta-neon-blue text-vanta-blue-dark hover:bg-vanta-neon-blue/90"
        : "bg-transparent text-gray-400 hover:text-white"
    );
  };

  const getTransactionFilterButtonClasses = (filter: TransactionFilter) => {
    const isActive = activeTransactionFilter === filter;
    return cn(
      "relative text-base font-semibold pb-2", // Base styles for sub-tab buttons
      isActive
        ? "text-vanta-neon-blue after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-vanta-neon-blue" // Active state with underline
        : "text-gray-400 hover:text-white" // Inactive state
    );
  };

  return (
    <div className="flex flex-col space-y-6"> {/* Wrapper for tabs and content */}
      {/* Main Tabs */}
      <div className="bg-vanta-blue-dark p-2 rounded-[27px] flex space-x-2 w-fit">
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

      {/* Content based on activeTab */}
      {activeTab === 'transactions' && (
        <div className="bg-vanta-blue-medium p-6 rounded-[27px] shadow-sm text-vanta-text-light w-full">
          {/* Transaction Filter Buttons */}
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

          {/* Transaction History Table Header */}
          <div className="grid grid-cols-5 gap-4 text-sm font-semibold text-gray-400 mb-4">
            <span>Time</span>
            <span>Type</span>
            <span>Amount</span>
            <span>Status</span>
            <span className="text-right">After Balance</span>
          </div>

          {/* Placeholder for transactions */}
          <div className="text-center text-gray-400 text-lg mt-12">
            Nothing to show yet
          </div>
        </div>
      )}

      {activeTab === 'rewards' && (
        <RewardsHistory /> // Render the new RewardsHistory component here
      )}
    </div>
  );
};

export default WalletTabs;