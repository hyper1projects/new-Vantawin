"use client";

import React from 'react';
import WalletOverviewCard from '../components/WalletOverviewCard';
import ProfitLossCard from '../components/ProfitLossCard';

const Wallet = () => {
  return (
    <div className="p-4">
      <div className="flex space-x-6"> {/* Flex container for side-by-side layout */}
        <div className="flex-1"> {/* WalletOverviewCard takes half width */}
          <WalletOverviewCard />
        </div>
        <div className="flex-1"> {/* ProfitLossCard takes half width */}
          <ProfitLossCard />
        </div>
      </div>
    </div>
  );
};

export default Wallet;