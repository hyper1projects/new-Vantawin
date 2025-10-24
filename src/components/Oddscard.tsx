"use client";

import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { logoMap } from '../lib/logoMap';

interface Team {
  name: string;
  logoIdentifier: string;
}

interface Odds {
  team1: number;
  draw: number;
  team2: number;
}

interface OddscardProps {
  time: string;
  date: string;
  team1: Team;
  team2: Team;
  odds: Odds;
  league: string;
  isLive: boolean;
  gameView: string;
}

const Oddscard: React.FC<OddscardProps> = ({
  time,
  date,
  team1,
  team2,
  odds,
  league,
  isLive,
  gameView,
}) => {
  const getLogoPath = (identifier: string) => {
    return logoMap[identifier] || '/path/to/default-logo.png'; // Fallback to a default logo
  };

  return (
    <div className="flex flex-col bg-[#0D2C60] rounded-xl p-4 w-full max-w-sm shadow-xl font-sans transition-all duration-300 hover:shadow-2xl hover:scale-[1.01] border border-transparent hover:border-indigo-600/50">
      <div className="flex justify-between items-center text-white text-sm mb-4">
        <span className="font-medium">{time} - {date}</span>
        {isLive && (
          <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">LIVE</span>
        )}
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Image src={getLogoPath(team1.logoIdentifier)} alt={team1.name} width={32} height={32} className="rounded-full" />
          <span className="text-white font-semibold">{team1.name}</span>
        </div>
        <span className="text-gray-400 text-sm">vs</span>
        <div className="flex items-center space-x-2">
          <span className="text-white font-semibold">{team2.name}</span>
          <Image src={getLogoPath(team2.logoIdentifier)} alt={team2.name} width={32} height={32} className="rounded-full" />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-4">
        <button className="bg-[#0B295B] text-white py-2 rounded-lg text-sm hover:bg-[#00EEEE] hover:text-[#081028] transition-colors">
          {odds.team1}
        </button>
        <button className="bg-[#0B295B] text-white py-2 rounded-lg text-sm hover:bg-[#00EEEE] hover:text-[#081028] transition-colors">
          {odds.draw}
        </button>
        <button className="bg-[#0B295B] text-white py-2 rounded-lg text-sm hover:bg-[#00EEEE] hover:text-[#081028] transition-colors">
          {odds.team2}
        </button>
      </div>

      <div className="flex justify-between items-center text-gray-400 text-xs">
        <span>{league}</span>
        <button className="text-[#00EEEE] hover:underline">{gameView}</button>
      </div>
    </div>
  );
};

export default Oddscard;