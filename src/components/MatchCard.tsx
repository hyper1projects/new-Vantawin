"use client";

import React from 'react';
import { Button } from '@/components/ui/button'; 
import { cn } from '../lib/utils'; // Assuming cn utility for tailwind-merge
import { Game } from '../types/game'; // Import Game type
import { getLogoSrc } from '../utils/logoMap'; // Import getLogoSrc
import { useMatchSelection } from '../context/MatchSelectionContext'; // Import the context hook

interface MatchCardProps {
  game: Game; // Pass the full game object
}

const MatchCard: React.FC<MatchCardProps> = ({ game }) => {
  const { selectedGame, selectedOutcome, setSelectedMatch } = useMatchSelection();

  const handleSelectOutcome = (outcome: 'team1' | 'draw' | 'team2') => {
    setSelectedMatch(game, outcome);
  };

  // Defensive checks for odds values, ensuring they are numbers before calling toFixed
  const team1Odd = (game.odds?.team1 !== undefined && game.odds.team1 !== null) ? game.odds.team1.toFixed(2) : '-';
  const drawOdd = (game.odds?.draw !== undefined && game.odds.draw !== null) ? game.odds.draw.toFixed(2) : '-';
  const team2Odd = (game.odds?.team2 !== undefined && game.odds.team2 !== null) ? game.odds.team2.toFixed(2) : '-';

  return (
    <div className="relative p-[2px] rounded-[27px] bg-gradient-to-t from-[#9A3FFE] to-[#00EEEE] w-[230px] h-[230px] flex-shrink-0">
      <div className="bg-[#011B47] rounded-[27px] h-full w-full p-4 flex flex-col justify-between text-white">
        
        {/* Date/Time Row */}
        <p className="text-base font-semibold text-center mt-2">{game.date} - {game.time}</p> 
        
        {/* Team Logos and Names Row */}
        <div className="flex items-center justify-between w-full px-2"> 
          <div className="flex flex-col items-center w-1/3"> 
            <img src={getLogoSrc(game.team1.logoIdentifier)} alt={game.team1.name} className="w-12 h-12 object-contain mb-1" /> 
            <span className="text-[10px] font-medium text-center">{game.team1.name}</span>
          </div>
          <span className="text-lg font-bold text-gray-400">VS</span>
          <div className="flex flex-col items-center w-1/3"> 
            <img src={getLogoSrc(game.team2.logoIdentifier)} alt={game.team2.name} className="w-12 h-12 object-contain mb-1" /> 
            <span className="text-[10px] font-medium text-center">{game.team2.name}</span>
          </div>
        </div>
        
        {/* Prediction Buttons Row */}
        <div className="flex justify-center space-x-2 w-full mb-2">
          <Button
            className={cn(
              `flex-1 py-1.5 px-3 rounded-md transition-colors duration-300 text-xs font-semibold`,
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
              `flex-1 py-1.5 px-3 rounded-md transition-colors duration-300 text-xs font-semibold`,
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
              `flex-1 py-1.5 px-3 rounded-md transition-colors duration-300 text-xs font-semibold`,
              selectedGame?.id === game.id && selectedOutcome === 'team2'
                ? "bg-vanta-neon-blue text-vanta-blue-dark"
                : "bg-[#01112D] text-gray-300 hover:bg-[#012A5E]"
            )}
            onClick={() => handleSelectOutcome('team2')}
          >
            {team2Odd}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MatchCard;