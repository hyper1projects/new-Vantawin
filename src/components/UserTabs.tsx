"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

type MainTab = 'gameHistory' | 'rankHistory' | 'transactions';
type TransactionFilter = 'all' | 'deposits' | 'withdrawals' | 'refunds';

const UserTabs: React.FC = () => {
  const [activeMainTab, setActiveMainTab] = useState<MainTab>('gameHistory');
  const [activeTransactionFilter, setActiveTransactionFilter] = useState<TransactionFilter>('all');

  const getMainTabButtonClasses = (tabValue: MainTab) => {
    return cn(
      "px-6 py-3 rounded-[20px] text-lg font-semibold transition-colors duration-200",
      activeMainTab === tabValue
        ? "bg-vanta-neon-blue text-vanta-text-light" // Changed text-white to text-vanta-text-light
        : "bg-transparent text-vanta-text-light hover:bg-vanta-blue-light"
    );
  };

  const getTransactionFilterButtonClasses = (filterValue: string) => {
    return cn(
      "text-lg font-semibold",
      activeTransactionFilter === filterValue
        ? "text-vanta-neon-blue border-b-2 border-vanta-neon-blue"
        : "text-vanta-text-light hover:text-vanta-neon-blue"
    );
  };

  const renderTabContent = () => {
    switch (activeMainTab) {
      case 'transactions':
        return (
          <div className="bg-vanta-blue-medium p-6 rounded-[27px] shadow-sm text-vanta-text-light w-full">
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
              <Button variant="ghost" asChild>
                <Link to="/wallet" className="text-lg font-semibold text-vanta-text-light hover:text-vanta-neon-blue">
                  View Wallet
                </Link>
              </Button>
            </div>
            <div className="text-vanta-text-light">
              <p>Displaying {activeTransactionFilter} transactions...</p>
              <div className="flex justify-between items-center py-2 border-b border-gray-800 last:border-b-0">
                <span>Deposit from Bank</span>
                <span>+ $50.00</span>
                <span className="text-sm text-gray-400">2023-10-26</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-800 last:border-b-0">
                <span>Withdrawal to Card</span>
                <span>- $20.00</span>
                <span className="text-sm text-gray-400">2023-10-25</span>
              </div>
            </div>
          </div>
        );
      case 'gameHistory':
        return (
          <div className="bg-vanta-blue-medium p-6 rounded-[27px] shadow-sm text-vanta-text-light w-full">
            <h3 className="text-xl font-semibold mb-4">Game History</h3>
            <div className="text-vanta-text-light">
              <p>Displaying game history...</p>
              <div className="flex justify-between items-center py-2 border-b border-gray-800 last:border-b-0">
                <span>Game: Lucky Spin</span>
                <span>Result: Win</span>
                <span className="text-sm text-gray-400">2023-10-26</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-800 last:border-b-0">
                <span>Game: Dice Roll</span>
                <span>Result: Loss</span>
                <span className="text-sm text-gray-400">2023-10-25</span>
              </div>
            </div>
          </div>
        );
      case 'rankHistory':
        return (
          <div className="bg-vanta-blue-medium p-6 rounded-[27px] shadow-sm text-vanta-text-light w-full">
            <h3 className="text-xl font-semibold mb-4">Rank History</h3>
            <div className="text-vanta-text-light">
              <p>Displaying your rank history over time...</p>
              <div className="flex justify-between items-center py-2 border-b border-gray-800 last:border-b-0">
                <span>Rank: #15</span>
                <span>Date: 2024-07-20</span>
                <span className="text-sm text-gray-400">XP: 125,000</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-800 last:border-b-0">
                <span>Rank: #18</span>
                <span>Date: 2024-07-13</span>
                <span className="text-sm text-gray-400">XP: 110,000</span>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col space-y-6">
      <div className="bg-vanta-blue-dark p-2 rounded-[27px] flex space-x-2 w-full md:w-fit">
        <Button
          className={getMainTabButtonClasses('gameHistory')}
          onClick={() => setActiveMainTab('gameHistory')}
        >
          Game History
        </Button>
        <Button
          className={getMainTabButtonClasses('rankHistory')}
          onClick={() => setActiveMainTab('rankHistory')}
        >
          Rank History
        </Button>
        <Button
          className={getMainTabButtonClasses('transactions')}
          onClick={() => setActiveMainTab('transactions')}
        >
          Transactions
        </Button>
      </div>
      {renderTabContent()}
    </div>
  );
};

export default UserTabs;