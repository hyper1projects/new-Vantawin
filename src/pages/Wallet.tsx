"use client";

import React from 'react';
import WalletOverviewCard from '../components/WalletOverviewCard';
import WinLossRatioCard from '../components/WinLossRatioCard';
import WalletTabs from '../components/WalletTabs';

const Wallet = () => {
  return (
    <div className="p-4 max-w-7xl mx-auto">
      {/* Main content wrapper for the Wallet page with a distinct background */}
      <div className="bg-vanta-blue-medium rounded-[27px] p-6 shadow-lg">
        {/* Top section: Wallet Overview Card and Win/Loss Ratio Card */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <WalletOverviewCard />
          <WinLossRatioCard className="h-full" />
        </div>

        {/* Bottom section: Wallet Tabs (full width) */}
        <div>
          <WalletTabs className="h-full" />
        </div>
      </div>
    </div>
  );
};

export default Wallet;