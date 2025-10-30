"use client";

import React from 'react';
import OddsButton from './OddsButton'; // Changed to default import
import { cn } from '@/lib/utils';

interface FullTimeCardProps {
  homeTeam: string;
  awayTeam: string;
  homeOdds: number;
  awayOdds: number;
  drawOdds: number;
  onSelectOutcome: (outcome: 'home' | 'away' | 'draw') => void;
  selectedOutcome: 'home' | 'away' | 'draw' | null;
  className?: string;
}

const FullTimeCard: React.FC<FullTimeCardProps> = ({
  homeTeam,
  awayTeam,
  homeOdds,
  awayOdds,
  drawOdds,
  onSelectOutcome,
  selectedOutcome,
  className,
}) => {
  return (
    <div className={cn("bg-transparent rounded-[27px] p-6 shadow-lg text-vanta-text-light w-full flex flex-col items-center justify-center space-y-4", className)}>
      {/* Fixed Header for FullTime */}
      <div className="w-full text-center mb-2">
        <span className="bg-vanta-blue-dark text-vanta-text-dark text-xs px-2 py-1 rounded-md font-semibold">FullTime</span>
      </div>

      {/* Teams and Odds */}
      <div className="w-full flex justify-between items-center">
        {/* Home Team */}
        <div className="flex flex-col items-center w-1/3">
          <span className="text-lg font-bold text-vanta-text-dark">{homeTeam}</span>
          <OddsButton
            label={`${homeOdds}`}
            value={homeOdds}
            onClick={() => onSelectOutcome('home')}
            isSelected={selectedOutcome === 'home'}
            className="mt-2 w-full max-w-[80px]"
          />
        </div>

        {/* Draw */}
        <div className="flex flex-col items-center w-1/3">
          <span className="text-lg font-bold text-vanta-text-dark">Draw</span>
          <OddsButton
            label={`${drawOdds}`}
            value={drawOdds}
            onClick={() => onSelectOutcome('draw')}
            isSelected={selectedOutcome === 'draw'}
            className="mt-2 w-full max-w-[80px]"
          />
        </div>

        {/* Away Team */}
        <div className="flex flex-col items-center w-1/3">
          <span className="text-lg font-bold text-vanta-text-dark">{awayTeam}</span>
          <OddsButton
            label={`${awayOdds}`}
            value={awayOdds}
            onClick={() => onSelectOutcome('away')}
            isSelected={selectedOutcome === 'away'}
            className="mt-2 w-full max-w-[80px]"
          />
        </div>
      </div>
    </div>
  );
};

export default FullTimeCard;