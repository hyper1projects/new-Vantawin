"use client";

import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface OddscardProps {
  matchTime: string;
  matchDate: string;
  isLive: boolean;
  team1Logo: string;
  team1Name: string;
  team2Logo: string;
  team2Name: string;
  option1Label: string;
  option1Value: string;
  option2Label: string;
  option2Value: string;
  option3Label: string;
  option3Value: string;
}

const Oddscard: React.FC<OddscardProps> = ({
  matchTime,
  matchDate,
  isLive,
  team1Logo,
  team1Name,
  team2Logo,
  team2Name,
  option1Label,
  option1Value,
  option2Label,
  option2Value,
  option3Label,
  option3Value,
}) => {
  const [isFavorited, setIsFavorited] = useState(false);

  const handleFavoriteToggle = () => {
    setIsFavorited(!isFavorited);
  };

  const OddButton: React.FC<{ label: string; value: string }> = ({ label, value }) => (
    <button className="bg-[#0D2C60] hover:bg-[#1a4280] text-white font-semibold py-2 px-4 rounded-md w-[80px] h-[40px] flex flex-col items-center justify-center text-sm">
      <span className="text-xs text-gray-300">{label}</span>
      <span className="text-base">{value}</span>
    </button>
  );

  return (
    <div className="w-[723px] h-[126px] bg-[#0B295B] rounded-xl p-4 flex justify-between text-white shadow-lg">
      {/* Left Content: Live/Time & Teams */}
      <div className="flex flex-col justify-between h-full">
        {/* Live/Time */}
        {isLive ? (
          <div className="flex items-center text-red-500 font-semibold text-sm">
            <span className="relative flex h-2 w-2 mr-1">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
            Live
          </div>
        ) : (
          <div className="text-gray-300 text-xs">
            {matchDate} {matchTime}
          </div>
        )}

        {/* Team Information */}
        <div className="flex flex-col space-y-2">
          <div className="flex items-center">
            <img src={team1Logo} alt={team1Name} className="w-6 h-6 mr-2" />
            <span className="text-base font-medium">{team1Name}</span>
          </div>
          <div className="flex items-center">
            <img src={team2Logo} alt={team2Name} className="w-6 h-6 mr-2" />
            <span className="text-base font-medium">{team2Name}</span>
          </div>
        </div>
      </div>

      {/* Right Content: Game View & Odds Buttons */}
      <div className="flex flex-col justify-between h-full items-end">
        {/* Game View */}
        <div className="flex items-center space-x-2">
          <a href="#" className="text-gray-300 text-sm hover:underline">Game View &gt;</a>
          <button
            onClick={handleFavoriteToggle}
            className={cn(
              "relative w-6 h-6 flex items-center justify-center rounded-full transition-colors duration-200",
              isFavorited ? "bg-gray-700" : "border border-yellow-400" // Corrected container styling
            )}
          >
            <Star
              className="w-4 h-4 text-yellow-400"
              fill={isFavorited ? "currentColor" : "none"} // Corrected fill logic
              stroke={isFavorited ? "none" : "currentColor"} // Corrected stroke logic
              strokeWidth={isFavorited ? 0 : 2} // Corrected strokeWidth logic
            />
          </button>
        </div>
        {/* Odds Buttons */}
        <div className="flex space-x-4">
          <OddButton label={option1Label} value={option1Value} />
          <OddButton label={option2Label} value={option2Value} />
          <OddButton label={option3Label} value={option3Value} />
        </div>
      </div>
    </div>
  );
};

export default Oddscard;