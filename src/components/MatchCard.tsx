"use client";

import React from 'react';
import Image from 'next/image';

interface MatchCardProps {
  date: string;
  time: string;
  team1Logo: string;
  team1Name: string;
  team2Logo: string;
  team2Name: string;
  multiplier: string;
}

const MatchCard: React.FC<MatchCardProps> = ({
  date,
  time,
  team1Logo,
  team1Name,
  team2Logo,
  team2Name,
  multiplier,
}) => {
  return (
    <div className="relative p-[2px] rounded-[27px] bg-gradient-to-br from-vanta-neon-blue to-vanta-purple w-[230px] h-[230px] flex-shrink-0">
      <div className="bg-gradient-to-b from-[#00EEEE] to-[#9A3FFE] rounded-[27px] h-full w-full p-4 flex flex-col justify-between text-white">
        <p className="text-base font-semibold text-center mt-2">{date}</p>
        <div className="flex items-center justify-between w-full px-2">
          <div className="flex flex-col items-center w-1/3">
            <Image src={team1Logo} alt={team1Name} width={40} height={40} className="mb-1" />
            <span className="text-sm font-medium text-center">{team1Name}</span>
          </div>
          <span className="text-lg font-bold">VS</span>
          <div className="flex flex-col items-center w-1/3">
            <Image src={team2Logo} alt={team2Name} width={40} height={40} className="mb-1" />
            <span className="text-sm font-medium text-center">{team2Name}</span>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center mt-4">
          <p className="text-sm text-vanta-text-light mb-1">{time}</p>
          <div className="bg-vanta-neon-blue text-vanta-blue-dark text-lg font-bold px-4 py-1 rounded-full">
            {multiplier}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchCard;