"use client";

import React from 'react';
import { Pool } from '../types/pool';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '../lib/utils';

interface PoolPrizesSectionProps {
  pool: Pool;
  className?: string;
}

const PoolPrizesSection: React.FC<PoolPrizesSectionProps> = ({ pool, className }) => {
  const formatPrizeAmount = (amount: number) => `₦${amount.toLocaleString()}`;

  return (
    <div className={cn("bg-[#011B47] rounded-[18px] p-4 flex flex-col", className)}>
      <Collapsible defaultOpen={true}>
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            className="flex items-center justify-between w-full p-0 h-auto text-white hover:bg-transparent hover:text-vanta-neon-blue cursor-pointer mb-4"
          >
            <h3 className="text-xl font-bold">PRIZES</h3>
            <ChevronDown size={20} className="transition-transform duration-200 data-[state=open]:rotate-180" />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="overflow-hidden transition-all duration-300 data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
          <div className="space-y-3">
            {pool.prizeDistribution && pool.prizeDistribution.length > 0 ? (
              pool.prizeDistribution.map((prize, index) => (
                <div key={index} className="flex items-center justify-between text-lg">
                  <div className="flex items-center space-x-2">
                    <Trophy
                      size={20}
                      className={cn(
                        index === 0 && 'text-yellow-500', // Gold for winner
                        index === 1 && 'text-gray-400',   // Silver for 1st runner up
                        index === 2 && 'text-yellow-700', // Bronze for 2nd runner up
                        index > 2 && 'text-gray-500'      // Default for others
                      )}
                    />
                    <span className="text-gray-300">{prize.rank}</span>
                  </div>
                  <span className="font-semibold text-vanta-neon-blue">{formatPrizeAmount(prize.amount)}</span>
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-sm">Prize distribution details coming soon!</p>
            )}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default PoolPrizesSection;