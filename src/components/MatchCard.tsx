"use client";

import React from 'react';
import { Button } from '@/components/ui/button';

interface MatchCardProps {
  date: string;
  time: string;
  homeTeamName: string;
  awayTeamName: string;
  homeTeamLogo: string;
  awayTeamLogo: string;
  multiplier: number;
  onPredict: () => void;
}

const MatchCard: React.FC<MatchCardProps> = ({
  date,
  time,
  homeTeamName,
  awayTeamName,
  homeTeamLogo,
  awayTeamLogo,
  multiplier,
  onPredict,
}) => {
  return (
    <div className="bg-vanta-blue-dark rounded-[27px] p-6 flex flex-col items-center text-vanta-text-light shadow-lg">
      <div className="text-sm text-gray-400 mb-2">{date} - {time}</div>
      <div className="flex items-center justify-center gap-4 mb-4 w-full">
        <div className="flex flex-col items-center flex-1">
          <img src={homeTeamLogo} alt={`${homeTeamName} Logo`} className="w-16 h-16 object-contain mb-2" />
          <span className="text-base font-semibold text-center">{homeTeamName}</span>
        </div>
        <span className="text-xl font-bold text-vanta-accent-dark-blue">VS</span>
        <div className="flex flex-col items-center flex-1">
          <img src={awayTeamLogo} alt={`${awayTeamName} Logo`} className="w-16 h-16 object-contain mb-2" />
          <span className="text-base font-semibold text-center">{awayTeamName}</span>
        </div>
      </div>
      <div className="bg-vanta-blue-medium rounded-full px-4 py-2 mb-4">
        <span className="text-lg font-bold text-vanta-accent-dark-blue">{multiplier}x Multiplier</span>
      </div>
      <Button
        className="w-full py-3 text-lg font-bold bg-[#00EEEE] hover:bg-[#00CCCC] text-[#081028] rounded-[12px]"
        onClick={onPredict}
      >
        Predict Now
      </Button>
    </div>
  );
};

export default MatchCard;