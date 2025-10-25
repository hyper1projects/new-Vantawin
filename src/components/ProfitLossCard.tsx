"use client";

import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

const ProfitLossCard = () => {
  // Dummy data for demonstration
  const totalProfitLoss = 1234.56;
  const percentageChange = 5.23;
  const isProfit = totalProfitLoss >= 0;

  const arrowIcon = isProfit ? <ArrowUpRight size={20} /> : <ArrowDownRight size={20} />;
  const textColorClass = isProfit ? 'text-green-400' : 'text-red-400';

  return (
    <div className="bg-vanta-blue-medium p-6 shadow-lg text-vanta-text-light w-full rounded-[16px]">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8">
        <span className="text-lg font-semibold text-gray-400">PROFIT/LOSS</span>
        {/* Placeholder for a potential dropdown or info icon */}
        <div className="text-gray-500">...</div>
      </div>

      {/* Profit/Loss Value */}
      <div className="mb-4">
        <span className="text-4xl font-bold text-vanta-neon-blue">${totalProfitLoss.toLocaleString()}</span> {/* Changed text-white to text-vanta-neon-blue */}
      </div>

      {/* Percentage Change */}
      <div className="flex items-center space-x-2">
        <span className={`text-lg font-semibold ${textColorClass}`}>
          {isProfit ? '+' : ''}{percentageChange.toFixed(2)}%
        </span>
        <span className={`${textColorClass}`}>
          {arrowIcon}
        </span>
      </div>
    </div>
  );
};

export default ProfitLossCard;