"use client";

import React from 'react';
import WalletOverviewCard from '../components/WalletOverviewCard';
import ProfitLossCard from '../components/ProfitLossCard'; // Import the new component

const Wallet = () => {
  return (
    <div className="p-4 space-y-6"> {/* Added space-y-6 for spacing between cards */}
      <WalletOverviewCard />
      <ProfitLossCard /> {/* Render the new ProfitLossCard component */}
    </div>
  );
};

export default Wallet;