"use client";

import React from 'react';
import { Button } from './ui/button';

interface Team {
  name: string;
  logo: string; // Assuming logo is a path to an image
}

interface Odds {
  team1: number;
  draw: number;
  team2: number;
}

interface OddscardProps {
  team1: Team;
  team2: Team;
  odds: Odds;
  time: string;
  date: string;
  league: string;
}

const Oddscard: React.FC<OddscardProps> = ({ team1, team2, odds, time, date, league }) => {
  return (
    <div className="bg-[#0B295B] rounded-xl p-4 flex items-center justify-between w-full max-w-md shadow-lg">
      {/* Left Content: Teams, League, Time/Date */}
      <div className="flex items-center space-x-4">
        {/* Team Logos and Names */}
        <div className="flex flex-col items-center space-y-2">
          <img src={team1.logo} alt={team1.name} className="w-10 h-10 object-contain" />
          <span className="text-white text-sm font-medium">{team1.name}</span>
        </div>
        <div className="flex flex-col items-center space-y-2">
          <span className="text-white text-lg font-bold">VS</span>
        </div>
        <div className="flex flex-col items-center space-y-2">
          <img src={team2.logo} alt={team2.name} className="w-10 h-10 object-contain" />
          <span className="text-white text-sm font-medium">{team2.name}</span>
        </div>

        {/* Match Info */}
        <div className="flex flex-col items-start space-y-1 ml-4">
          <span className="text-gray-300 text-xs">{league}</span>
          <span className="text-white text-sm font-semibold">{time} - {date}</span>
        </div>
      </div>

      {/* Right Content: Game View & Odds Buttons */}
      <div className="flex flex-col justify-between h-full items-end">
        {/* Game View */}
        <div className="flex items-center space-x-2">
          <a href="#" className="text-gray-300 text-sm hover:underline">Game View &gt;</a>
        </div>

        {/* Odds Buttons */}
        <div className="flex space-x-2 mt-4">
          <Button className="bg-[#00EEEE] text-[#081028] hover:bg-[#00EEEE]/90 px-4 py-2 rounded-md text-sm font-bold">
            {odds.team1.toFixed(2)}
          </Button>
          <Button className="bg-[#00EEEE] text-[#081028] hover:bg-[#00EEEE]/90 px-4 py-2 rounded-md text-sm font-bold">
            {odds.draw.toFixed(2)}
          </Button>
          <Button className="bg-[#00EEEE] text-[#081028] hover:bg-[#00EEEE]/90 px-4 py-2 rounded-md text-sm font-bold">
            {odds.team2.toFixed(2)}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Oddscard;