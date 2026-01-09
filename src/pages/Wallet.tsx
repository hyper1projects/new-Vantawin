"use client";

import React from 'react';
import WalletOverviewCard from '../components/WalletOverviewCard';
import RewardsHubCard from '../components/RewardsHubCard';
import WalletTabs from '../components/WalletTabs';

const Wallet = () => {
  return (
    <div className="p-4 max-w-7xl mx-auto">
      {/* Top section: Wallet Overview Card and Rewards Hub Card */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6 items-start">
        <WalletOverviewCard />
        <RewardsHubCard />
      </div>

      {/* Bottom section: Wallet Tabs (full width) */}
      <div>
        <WalletTabs className="h-full" />
      </div>
    </div>
  );
};

export default Wallet;