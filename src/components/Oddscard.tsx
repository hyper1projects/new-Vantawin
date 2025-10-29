"use client";

import React from 'react';
import { cn } from '../lib/utils'; // Assuming cn utility for tailwind-merge
import { Game } from '../types/game'; // Ensure Game type is imported
import { getLogoSrc } from '../utils/logoMap'; // Import getLogoSrc
import { useMatchSelection } from '../context/MatchSelectionContext'; // Import the context hook
import { Button } from '@/components/ui/button'; // Import shadcn Button

interface OddscardProps {
  time: string;
  date: string;
  team1: { name: string; logoIdentifier: string; };
  team2: { name: string; logoIdentifier: string; };
  odds: { team1: number; draw: number; team2: number; };
  league: string;
  isLive: boolean;
  gameView: string;
  game: Game; // Pass the full game object
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
  game,
}) => {
  const { selectedGame, selectedOutcome, setSelectedMatch } = useMatchSelection();

  const handleSelectOutcome = (outcome: 'team1' | 'draw' | 'team2') => {
    setSelectedMatch(game, outcome);
  };

  // Defensive checks for odds values
  const team1Odd = odds?.team1 !== undefined ? odds.team1.toFixed(2) : '-';
  const drawOdd = odds?.draw !== undefined ? odds.draw.toFixed(2) : '-';
  const team2Odd = odds?.team2 !== undefined ? odds.team2.toFixed(2) : '-';

  return (
    <div className="relative bg-[#011B47] rounded-[18px] p-2 shadow-sm flex flex-col text-vanta-text-light w-full">
      {/* Top-left: Date and Time */}
      <div className="absolute top-2 left-2 text-gray-400 text-xs font-medium">
        {date} - {time}
      </div>

      {/* Top-right: Live/Upcoming Status */}
      <div className="absolute top-2 right-2">
        <span className={`text-[0.6rem] font-semibold px-1.5 py-0.5 rounded-md ${isLive ? 'bg-red-500 text-white' : 'bg-vanta-accent-dark-blue text-vanta-neon-blue'}`}>
          {isLive ? 'LIVE' : 'Upcoming'}
        </span>
      </div>

      {/* Teams and Logos - Adjusted padding-top to avoid overlap */}
      <div className="flex items-center justify-between mb-2 pt-8">
        <div className="flex items-center space-x-1.5 w-5/12">
          <img src={getLogoSrc(team1.logoIdentifier)} alt={team1.name} className="w-6 h-6 object-contain" />
          <span className="text-sm font-semibold  max-w-[60px]">{team1.name}</span>
        </div>
        <span className="text-base font-bold text-gray-400 w-2/12 text-center">VS</span>
        <div className="flex items-center justify-end space-x-1.5 w-5/12">
          <span className="text-sm font-semibold text-right  max-w-[60px]">{team2.name}</span>
          <img src={getLogoSrc(team2.logoIdentifier)} alt={team2.name} className="w-6 h-6 object-contain" />
        </div>
      </div>

      {/* Odds Buttons */}
      <div className="flex justify-between space-x-1 mb-1">
        <Button
          className={cn(
            "flex-1 py-1 px-2 rounded-md transition-colors duration-300 text-xs font-semibold",
            selectedGame?.id === game.id && selectedOutcome === 'team1'
              ? "bg-vanta-neon-blue text-vanta-blue-dark"
              : "bg-[#01112D] text-gray-300 hover:bg-[#012A5E]"
          )}
          onClick={() => handleSelectOutcome('team1')}
        >
          {team1Odd}
        </Button>
        <Button
          className={cn(
            "flex-1 py-1 px-2 rounded-md transition-colors duration-300 text-xs font-semibold",
            selectedGame?.id === game.id && selectedOutcome === 'draw'
              ? "bg-vanta-neon-blue text-vanta-blue-dark"
              : "bg-[#01112D] text-gray-300 hover:bg-[#012A5E]"
          )}
          onClick={() => handleSelectOutcome('draw')}
        >
          {drawOdd}
        </Button>
        <Button
          className={cn(
            "flex-1 py-1 px-2 rounded-md transition-colors duration-300 text-xs font-semibold",
            selectedGame?.id === game.id && selectedOutcome === 'team2'
              ? "bg-vanta-neon-blue text-vanta-blue-dark"
              : "bg-[#01112D] text-gray-300 hover:bg-[#012A5E]"
          )}
          onClick={() => handleSelectOutcome('team2')}
        >
          {team2Odd}
        </Button>
      </div>

      {/* View Game Button */}
      <Button className="w-full bg-[#0D2C60] text-vanta-neon-blue hover:bg-[#0D2C60]/80 rounded-[8px] py-1 text-xs font-semibold">
        {gameView}
      </Button>

      {/* Bottom-right: League */}
      <div className="absolute bottom-2 right-2 text-gray-400 text-xs font-medium">
        {league}
      </div>
    </div>
  );
};

export default Oddscard;