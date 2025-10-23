"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Star, ChevronRight } from 'lucide-react';

interface GameCardProps {
  status: string; // e.g., "Live" or "9:00 AM AUG 8"
  team1Logo: string;
  team1Name: string;
  team2Logo: string;
  team2Name: string;
  option1: string; // e.g., "CRY"
  option2: string; // e.g., "DRAW"
  option3: string; // e.g., "WHU"
}

const GameCard: React.FC<GameCardProps> = ({
  status,
  team1Logo,
  team1Name,
  team2Logo,
  team2Name,
  option1,
  option2,
  option3,
}) => {
  return (
    <div className="relative p-[2px] rounded-[27px] bg-gradient-to-br from-vanta-neon-blue to-vanta-purple w-full max-w-sm flex-shrink-0">
      <div className="bg-[#011B47] rounded-[27px] h-full w-full p-4 flex flex-col justify-between text-white">
        {/* Status and Game View */}
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center">
            {status === "Live" && <span className="h-2 w-2 rounded-full bg-red-500 mr-2"></span>}
            <p className="text-sm font-medium text-vanta-text-light">{status}</p>
          </div>
          <div className="flex items-center space-x-1 cursor-pointer">
            <span className="text-sm text-vanta-text-light">Game View</span>
            <ChevronRight size={16} className="text-vanta-text-light" />
            <Star size={16} className="text-yellow-400 fill-yellow-400" />
          </div>
        </div>

        {/* Teams */}
        <div className="flex flex-col space-y-3 mb-4">
          <div className="flex items-center">
            <img src={team1Logo} alt={team1Name} className="w-8 h-8 object-contain mr-3" />
            <span className="text-base font-medium">{team1Name}</span>
          </div>
          <div className="flex items-center">
            <img src={team2Logo} alt={team2Name} className="w-8 h-8 object-contain mr-3" />
            <span className="text-base font-medium">{team2Name}</span>
          </div>
        </div>

        {/* Prediction Buttons */}
        <div className="flex justify-between space-x-2 w-full">
          <Button
            className={`flex-1 py-2 px-3 rounded-md transition-colors duration-300 text-sm font-semibold border border-vanta-neon-blue
              bg-[#01112D] text-gray-300 hover:bg-[#012A5E]`}
          >
            {option1}
          </Button>
          <Button
            className={`flex-1 py-2 px-3 rounded-md transition-colors duration-300 text-sm font-semibold border border-vanta-neon-blue
              bg-[#01112D] text-gray-300 hover:bg-[#012A5E]`}
          >
            {option2}
          </Button>
          <Button
            className={`flex-1 py-2 px-3 rounded-md transition-colors duration-300 text-sm font-semibold border border-vanta-neon-blue
              bg-[#01112D] text-gray-300 hover:bg-[#012A5E]`}
          >
            {option3}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GameCard;