"use client";

import React from 'react';
import WalletOverviewCard from '../components/WalletOverviewCard';
import ProfitLossCard from '../components/ProfitLossCard';
import WalletTabs from '../components/WalletTabs'; // Import the new component

const Wallet = () => {
  return (
    <div className="p-4">
      <div className="flex space-x-6 mb-6"> {/* Added mb-6 for spacing below the cards */}
        <div className="flex-1">
          <WalletOverviewCard />
        </div>
        <div className="flex-1">
          <ProfitLossCard />
        </div>
      </div>
      {/* Render the new WalletTabs component below the cards */}
      <WalletTabs />
    </div>
  );
};

export default Wallet;