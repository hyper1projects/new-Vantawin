"use client";

import React from 'react';
import WalletOverviewCard from '../components/WalletOverviewCard';
import WinLossRatioCard from '../components/WinLossRatioCard';
import WalletTabs from '../components/WalletTabs';

const Wallet = () => {
  return (
    <div className="p-4 max-w-7xl mx-auto"> {/* Added max-w-7xl mx-auto for consistent page width */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Column 1: Wallet Overview Card */}
        <div className="lg:col-span-1">
          <WalletOverviewCard />
        </div>

        {/* Column 2 & 3: Win/Loss Ratio Card and Wallet Tabs */}
        <div className="lg:col-span-2 flex flex-col lg:flex-row gap-6">
          <div className="flex-1"> {/* Container for WinLossRatioCard */}
            <WinLossRatioCard className="h-full" /> {/* Apply h-full to make it stretch */}
          </div>
          <div className="flex-1"> {/* Container for WalletTabs */}
            <WalletTabs className="h-full" /> {/* Apply h-full to make it stretch */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Wallet;