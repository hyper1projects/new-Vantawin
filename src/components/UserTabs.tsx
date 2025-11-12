"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

const UserTabs: React.FC = () => {
  const [activeMainTab, setActiveMainTab] = useState('gameHistory'); // Changed initial state to 'gameHistory'
  const [activeTransactionFilter, setActiveTransactionFilter] = useState('all');

  const getMainTabButtonClasses = (tabValue: string) => {
    return cn(
      "px-6 py-3 rounded-[20px] text-lg font-semibold transition-colors duration-200",
      activeMainTab === tabValue
        ? "bg-vanta-neon-blue text-white"
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

  return (
    <div className="flex flex-col space-y-6">
      <div className="bg-vanta-blue-dark p-2 rounded-[27px] flex space-x-2 w-full md:w-fit">
        <Button
          className={getMainTabButtonClasses('gameHistory')} // Moved Game History first
          onClick={() => setActiveMainTab('gameHistory')}
        >
          Game History
        </Button>
        <Button
          className={getMainTabButtonClasses('transactions')} // Moved Transactions second
          onClick={() => setActiveMainTab('transactions')}
        >
          Transactions
        </Button>
      </div>

      {activeMainTab === 'transactions' && (
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
            {/* New View Wallet button */}
            <Button variant="ghost" asChild>
              <Link to="/wallet" className="text-lg font-semibold text-vanta-text-light hover:text-vanta-neon-blue">
                View Wallet
              </Link>
            </Button>
          </div>
          {/* Transaction list placeholder */}
          <div className="text-vanta-text-light">
            {/* This is where your transaction list would go */}
            <p>Displaying {activeTransactionFilter} transactions...</p>
            {/* Example transaction item */}
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
      )}

      {activeMainTab === 'gameHistory' && (
        <div className="bg-vanta-blue-medium p-6 rounded-[27px] shadow-sm text-vanta-text-light w-full">
          <h3 className="text-xl font-semibold mb-4">Game History</h3>
          {/* Game history list placeholder */}
          <div className="text-vanta-text-light">
            {/* This is where your game history list would go */}
            <p>Displaying game history...</p>
            {/* Example game item */}
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
      )}
    </div>
  );
};

export default UserTabs;