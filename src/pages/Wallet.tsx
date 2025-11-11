"use client";

import React from 'react';
import WalletOverviewCard from '../components/WalletOverviewCard';
import WinLossRatioCard from '../components/WinLossRatioCard'; // Import the new WinLossRatioCard
import WalletTabs from '../components/WalletTabs';

const Wallet = () => {
  return (
    <div className="p-4">
      <div className="flex space-x-6 mb-6">
        <div className="flex-1">
          <WalletOverviewCard />
        </div>
        <div className="flex-1">
          <WinLossRatioCard /> {/* Use the new WinLossRatioCard */}
        </div>
      </div>
      <WalletTabs />
    </div>
  );
};

export default Wallet;