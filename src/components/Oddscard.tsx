"use client";

import React from 'react';
import { cn } from '../lib/utils'; // Assuming cn utility for tailwind-merge
import { Game } from '../types/game'; // Ensure Game type is imported
import { getLogoSrc } from '../utils/logoMap'; // Import getLogoSrc
import { useMatchSelection } from '../context/MatchSelectionContext'; // Import the context hook
import OddsButton from './OddsButton'; // Import the new OddsButton component

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
    <div className="relative p-[2px] rounded-[27px] bg-gradient-to-t from-[#9A3FFE] to-[#00EEEE] w-full">
      <div className="bg-[#011B47] rounded-[27px] h-full w-full p-4 flex flex-col justify-between text-vanta-text-light">
        {/* Header: Date, Time, Live/League */}
        <div className="flex justify-between items-center mb-4">
          <span className="text-base font-semibold text-gray-400">{date} - {time}</span>
          <span className={`text-[0.6rem] font-semibold px-2 py-1 rounded-md ${isLive ? 'bg-red-500 text-white' : 'bg-vanta-accent-dark-blue text-vanta-neon-blue'}`}>
            {isLive ? 'LIVE' : league}
          </span>
        </div>

        {/* Teams and Logos */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex flex-col items-center w-1/3">
            <img src={getLogoSrc(team1.logoIdentifier)} alt={team1.name} className="w-12 h-12 object-contain mb-1" />
            <span className="text-[10px] font-medium text-center">{team1.name}</span>
          </div>
          <span className="text-lg font-bold text-gray-400 w-1/3 text-center">VS</span>
          <div className="flex flex-col items-center w-1/3">
            <img src={getLogoSrc(team2.logoIdentifier)} alt={team2.name} className="w-12 h-12 object-contain mb-1" />
            <span className="text-[10px] font-medium text-center">{team2.name}</span>
          </div>
        </div>

        {/* Odds Buttons */}
        <div className="flex justify-between space-x-2 mb-4">
          <OddsButton
            isSelected={selectedGame?.id === game.id && selectedOutcome === 'team1'}
            onClick={() => handleSelectOutcome('team1')}
          >
            {team1Odd}
          </OddsButton>
          <OddsButton
            isSelected={selectedGame?.id === game.id && selectedOutcome === 'draw'}
            onClick={() => handleSelectOutcome('draw')}
          >
            {drawOdd}
          </OddsButton>
          <OddsButton
            isSelected={selectedGame?.id === game.id && selectedOutcome === 'team2'}
            onClick={() => handleSelectOutcome('team2')}
          >
            {team2Odd}
          </OddsButton>
        </div>

        {/* View Game Button */}
        <OddsButton
          isViewGameButton
          onClick={() => console.log(`View game details for ${game.id}`)} // Placeholder for navigation
        >
          {gameView}
        </OddsButton>
      </div>
    </div>
  );
};

export default Oddscard;