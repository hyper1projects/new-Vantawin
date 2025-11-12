"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom'; // Import Link for navigation

const UserTabs: React.FC = () => {
  const [activeTransactionFilter, setActiveTransactionFilter] = useState('all');

  const getTransactionFilterButtonClasses = (filterValue: string) => {
    return cn(
      "text-lg font-semibold",
      activeTransactionFilter === filterValue
        ? "text-vanta-neon-blue border-b-2 border-vanta-neon-blue"
        : "text-vanta-text-light hover:text-vanta-neon-blue"
    );
  };

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
        {/* New View Wallet button */}
        <Button variant="ghost" asChild>
          <Link to="/wallet" className="text-lg font-semibold text-vanta-text-light hover:text-vanta-neon-blue">
            View Wallet
          </Link>
        </Button>
      </div>
      {/* The rest of your UserTabs component content */}
    </div>
  );
};

export default UserTabs;