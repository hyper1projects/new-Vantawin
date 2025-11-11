"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '../lib/utils';
import { ExternalLink } from 'lucide-react'; // Import ExternalLink icon
import { Link } from 'react-router-dom'; // Import Link for navigation

type TimeFilter = '1D' | '1W' | '1M' | 'ALL';

const ProfitLossCard: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState<TimeFilter>('ALL');
  const [profitLoss, setProfitLoss] = useState(0.00); // Placeholder for actual profit/loss

  const formattedProfitLoss = `₦ ${profitLoss.toFixed(2)}`;

  const handleFilterChange = (filter: TimeFilter) => {
    setSelectedFilter(filter);
    // In a real application, you would fetch data based on the selected filter
    // For now, we'll just keep the placeholder value.
  };

  const getFilterButtonClasses = (filter: TimeFilter) => {
    const isSelected = selectedFilter === filter;
    return cn(
      "px-3 py-1 text-sm font-semibold rounded-md transition-colors duration-200",
      isSelected
        ? "text-vanta-neon-blue bg-transparent hover:text-vanta-neon-blue" // Active state
        : "text-gray-400 bg-transparent hover:text-white" // Inactive state
    );
  };

  return (
    <div className="bg-vanta-blue-medium p-6 shadow-lg text-vanta-text-light w-full rounded-[27px]"> {/* Changed rounded-[16px] to rounded-[27px] */}
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8">
        <span className="text-lg font-semibold text-gray-400">PROFIT/LOSS</span>
        <div className="flex space-x-2">
          <Button variant="ghost" className={getFilterButtonClasses('1D')} onClick={() => handleFilterChange('1D')}>1D</Button>
          <Button variant="ghost" className={getFilterButtonClasses('1W')} onClick={() => handleFilterChange('1W')}>1W</Button>
          <Button variant="ghost" className={getFilterButtonClasses('1M')} onClick={() => handleFilterChange('1M')}>1M</Button>
          <Button variant="ghost" className={getFilterButtonClasses('ALL')} onClick={() => handleFilterChange('ALL')}>ALL</Button>
        </div>
      </div>

      {/* Profit/Loss Display Section */}
      <div className="text-left mb-6"> {/* Added mb-6 for spacing */}
        <p className="text-5xl font-bold text-white mb-2">{formattedProfitLoss}</p>
        <p className="text-base text-gray-400">All - Time</p>
      </div>

      {/* View Wallet Button */}
      <div className="w-full">
        <Button asChild className="w-full bg-vanta-neon-blue text-vanta-blue-dark hover:bg-vanta-neon-blue/90 rounded-[14px] py-3 text-lg font-bold">
          <Link to="/wallet">
            View Wallet <ExternalLink size={20} className="ml-2" />
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default ProfitLossCard;