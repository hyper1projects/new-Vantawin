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
  const grossPot = pool.prizePool; // This is the GUARANTEED or COLLECTED max found in parent
  const rakeAmount = grossPot * (rakePercent / 100);
  const netPot = grossPot - rakeAmount;

  return (
    <div className={cn("bg-[#011B47] rounded-[18px] p-4 flex flex-col", className)}>
      <Collapsible defaultOpen={true}>
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            className="flex items-center justify-between w-full p-0 h-auto text-white hover:bg-transparent hover:text-vanta-neon-blue cursor-pointer mb-4"
          >
            <h3 className="text-xl font-bold">PRIZE DISTRIBUTION</h3>
            <ChevronDown size={20} className="transition-transform duration-200 data-[state=open]:rotate-180" />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="overflow-hidden transition-all duration-300 data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">

          {/* Pot Breakdown */}
          <div className="bg-black/20 rounded-lg p-3 mb-4 space-y-1 text-sm">
            <div className="flex justify-between text-gray-400">
              <span>Gross Pot:</span>
              <span>{formatPrizeAmount(grossPot)}</span>
            </div>
            <div className="flex justify-between text-gray-500">
              <span>Vanta Fee ({rakePercent}%):</span>
              <span>-{formatPrizeAmount(rakeAmount)}</span>
            </div>
            <div className="flex justify-between text-white font-bold border-t border-white/10 pt-1 mt-1">
              <span>Net Prize Pool:</span>
              <span className="text-yellow-400 font-extrabold">{formatPrizeAmount(netPot)}</span>
            </div>
          </div>

          <div className="space-y-3">
            {/* Hybrid Payout Logic */}
            {(() => {
              const totalParticipants = pool.participants || 0;
              const top25Count = Math.ceil(totalParticipants * 0.25);
              const top10Count = Math.ceil(totalParticipants * 0.10);

              // Calculate Prizes
              const p1 = netPot * 0.22;
              const p2 = netPot * 0.13;
              const p3 = netPot * 0.095;

              // Shared Pot (55.5%)
              const sharedPot = netPot * 0.555;
              const sharedWinnersCount = Math.max(0, top25Count - 3);
              const sharedPrize = sharedWinnersCount > 0 ? sharedPot / sharedWinnersCount : 0;

              // Define Rows
              const rows = [
                { rank: '1st', amount: p1, badge: '🏆 Champion', color: 'text-yellow-400', glow: true },
                { rank: '2nd', amount: p2, badge: '🥈 Runner Up', color: 'text-gray-300', glow: false },
                { rank: '3rd', amount: p3, badge: '🥉 Podium', color: 'text-amber-600', glow: false },
              ];

              // Add Shared Tiers if applicable
              if (sharedWinnersCount > 0) {
                // Elite Tier (4th to Top 10%)
                const eliteStart = 4;
                const eliteEnd = Math.max(4, top10Count);

                if (eliteEnd >= eliteStart) {
                  rows.push({
                    rank: `${eliteStart}th - ${eliteEnd}th`,
                    amount: sharedPrize,
                    badge: '🎖️ Elite',
                    color: 'text-blue-400',
                    glow: false
                  });
                }

                // Pro Tier (Next after Elite to Top 25%)
                const proStart = eliteEnd + 1;
                const proEnd = top25Count;

                if (proEnd >= proStart) {
                  rows.push({
                    rank: `${proStart}th - ${proEnd}th`,
                    amount: sharedPrize,
                    badge: '🏅 Pro',
                    color: 'text-green-400',
                    glow: false
                  });
                }
              }

              return rows.map((item, index) => (
                <div key={index} className="flex items-center justify-between text-lg py-2 border-b border-white/5 last:border-0">
                  <div className="flex flex-col">
                    <div className="flex items-center space-x-2">
                      <span className={cn("font-bold text-base", item.color)}>{item.rank}</span>
                      {item.badge && <span className="text-xs bg-white/10 px-2 py-0.5 rounded text-gray-300">{item.badge}</span>}
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