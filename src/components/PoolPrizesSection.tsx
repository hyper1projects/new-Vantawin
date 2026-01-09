"use client";

import React from 'react';
import { Pool } from '../types/pool';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '../lib/utils';
import { calculatePoolPrizes } from '../utils/prizeCalculator';

interface PoolPrizesSectionProps {
  pool: Pool;
  className?: string;
}

const RAKE_STRUCTURE: Record<string, number> = {
  'Bronze': 10.0,
  'Silver': 8.5,
  'Gold': 7.0,
  'Platinum': 5.0,
};

const PAYOUT_DISTRIBUTION = [
  { rank: '1st', percentage: 22.00 },
  { rank: '2nd', percentage: 13.00 },
  { rank: '3rd', percentage: 9.50 },
  { rank: '4th', percentage: 7.00 },
  { rank: '5th', percentage: 5.75 },
  { rank: '6th', percentage: 4.75 },
  { rank: '7th', percentage: 4.00 },
  { rank: '8th', percentage: 3.50 },
  { rank: '9th', percentage: 3.00 },
  { rank: '10th', percentage: 2.75 },
  { rank: '11th-15th', percentage: 2.00 }, // Each
  { rank: '16th-20th', percentage: 1.60 }, // Each
  { rank: '21st-25th', percentage: 1.35 }, // Each
];

const PoolPrizesSection: React.FC<PoolPrizesSectionProps> = ({ pool, className }) => {
  // Use Vanta as currency symbol for now, user requested logic check primarily. 
  // Wait, user code used "₦". I will stick to "$". Or "V".
  // Actually, let's check what currency is used.
  // PoolInfoCard used "$". I'll use "$".
  const formatPrizeAmount = (amount: number) => `$${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const rakePercent = RAKE_STRUCTURE[pool.tier] || 10.0;

  // Calculate Potential Pot based on Max Participants if available, otherwise fallback to current
  const maxParticipants = pool.maxParticipants || pool.participants || 0;
  // If maxParticipants is set, use it to calculate potential gross. Else use current.
  // Note: If pool has guaranteed pot, logic might differ, but assuming entry fee * max is the "Potential" target.
  const potentialGrossPot = pool.maxParticipants
    ? (pool.entryFee * pool.maxParticipants)
    : (pool.prizePool || 0);

  const rakeAmount = potentialGrossPot * (rakePercent / 100);
  const netPot = potentialGrossPot - rakeAmount;

  return (
    <div className={cn("bg-[#011B47] rounded-[18px] p-4 flex flex-col", className)}>
      <Collapsible defaultOpen={true}>
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            className="flex items-center justify-between w-full p-0 h-auto text-white hover:bg-transparent hover:text-vanta-neon-blue cursor-pointer mb-4"
          >
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold">PRIZE DISTRIBUTION</h3>
              {pool.prizeDistribution && (pool.prizeDistribution as any[]).length > 0 && (
                <span className="text-[10px] bg-yellow-500/20 text-yellow-500 px-2 py-0.5 rounded border border-yellow-500/30">
                  Top Rank Fixed
                </span>
              )}
            </div>
            <ChevronDown size={20} className="transition-transform duration-200 data-[state=open]:rotate-180" />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="overflow-hidden transition-all duration-300 data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">

          {/* Pot Breakdown */}
          <div className="bg-black/20 rounded-lg p-3 mb-4 space-y-1 text-sm">
            <div className="flex justify-between text-gray-400">
              <span>Potential Pot:</span>
              <span>{formatPrizeAmount(potentialGrossPot)}</span>
            </div>
            <div className="flex justify-between text-gray-500">
              <span>Vanta Fee ({rakePercent}%):</span>
              <span>-{formatPrizeAmount(rakeAmount)}</span>
            </div>
            <div className="flex justify-between text-white font-bold border-t border-white/10 pt-1 mt-1">
              <span>Net Prize Pool:</span>
              <span className="text-yellow-400 font-extrabold">{formatPrizeAmount(netPot)}</span>
            </div>
            <p className="text-[10px] text-gray-500 italic mt-2 text-center">
              * Prizes shown assume pool reaches max capacity ({maxParticipants} players). Actual prizes vary by participant count.
            </p>
          </div>

          <div className="space-y-3">
            {(() => {
              // Priority: Utility handles Manual DB vs Dynamic
              // PASS maxParticipants to calculate the POTENTIAL structure
              const rows = calculatePoolPrizes(netPot, maxParticipants, pool.prizeDistribution as any[]);

              return rows.map((item, index) => (
                <div key={index} className="flex items-center justify-between text-lg py-2 border-b border-white/5 last:border-0">
                  <div className="flex flex-col">
                    <div className="flex items-center space-x-2">
                      {/* Badges HIDDEN here as requested */}
                      <span className={cn("font-bold text-base", item.color || "text-gray-300")}>{item.rank}</span>
                    </div>
                  </div>
                  <span className={cn(
                    "font-medium",
                    item.glow ? "text-yellow-300 drop-shadow-[0_0_8px_rgba(250,204,21,0.6)]" : "text-yellow-500/90"
                  )}>
                    {formatPrizeAmount(item.amount)}
                  </span>
                </div>
              ));
            })()}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default PoolPrizesSection;