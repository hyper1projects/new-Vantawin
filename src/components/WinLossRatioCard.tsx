"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '../lib/utils';
import { ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

const WinLossRatioCard: React.FC = () => {
  // Dummy data for win/loss ratio
  const winRate = 70; // Example win rate
  const lossRate = 30; // Example loss rate
  const formattedRatio = `${winRate}/${lossRate}`;

  return (
    <div className="bg-vanta-blue-medium p-6 shadow-lg text-vanta-text-light w-full rounded-[27px]">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8">
        <span className="text-lg font-semibold text-gray-400">WIN/LOSS RATIO</span>
        {/* Removed time filter buttons */}
      </div>

      {/* Win/Loss Ratio Display Section */}
      <div className="text-left mb-6">
        <p className="text-5xl font-bold text-white mb-2">{formattedRatio}</p>
        <p className="text-base text-gray-400">Overall Performance</p>
      </div>

      {/* Get Insights Button */}
      <div className="w-full">
        <Button asChild className="w-full bg-vanta-neon-blue text-vanta-blue-dark hover:bg-vanta-neon-blue/90 rounded-[14px] py-3 text-lg font-bold">
          <Link to="/users/insights"> {/* Link to the new Insights page */}
            Get Insights <ExternalLink size={20} className="ml-2" />
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default WinLossRatioCard;