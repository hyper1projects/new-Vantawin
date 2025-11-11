"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '../lib/utils';
import { ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

interface WinLossRatioCardProps {
  className?: string; // Add className prop
}

const WinLossRatioCard: React.FC<WinLossRatioCardProps> = ({ className }) => {
  // Dummy data for win/loss ratio
  const winRate = 70; // Example win rate
  const lossRate = 30; // Example loss rate
  const formattedRatio = `${winRate}/${lossRate}`;

  return (
    <div className={cn("bg-vanta-blue-medium p-6 shadow-lg text-vanta-text-light w-full rounded-[27px] flex flex-col", className)}> {/* Add flex flex-col and apply className */}
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8">
        <span className="text-lg font-semibold text-gray-400">WIN/LOSS RATIO</span>
      </div>

      {/* Win/Loss Ratio Display Section */}
      <div className="text-left mb-6 flex-grow"> {/* Add flex-grow to push button to bottom */}
        <p className="text-5xl font-bold text-white mb-2">{formattedRatio}</p>
        <p className="text-base text-gray-400">Overall Performance</p>
      </div>

      {/* Get Insights Button */}
      <div className="w-full mt-auto"> {/* Use mt-auto to push button to bottom */}
        <Button asChild className="w-full bg-vanta-neon-blue text-vanta-blue-dark hover:bg-vanta-neon-blue/90 rounded-[14px] py-3 text-lg font-bold">
          <Link to="/users/insights">
            Get Insights <ExternalLink size={20} className="ml-2" />
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default WinLossRatioCard;