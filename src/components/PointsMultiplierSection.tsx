"use client";

import React from 'react';
import MatchCard from './MatchCard';
import SectionHeader from './SectionHeader';
import { Game } from '../types/game';
import { allGamesData } from '../data/games'; // Import centralized game data
// Removed logoMap import as it's now handled within MatchCard

interface PointsMultiplierSectionProps {
  className?: string; // Add className prop
}

const PointsMultiplierSection: React.FC<PointsMultiplierSectionProps> = ({ className }) => { // Destructure className
  // Function to get the highest odd for a game
  const getMaxOdd = (game: Game) => {
    return Math.max(game.odds.team1, game.odds.draw, game.odds.team2);
  };

  // Sort games by the highest odd in descending order and take only the top 3 from allGamesData
  const gamesWithBestOdds = [...allGamesData]
    .sort((a, b) => getMaxOdd(b) - getMaxOdd(a))
    .slice(0, 3);

  return (
    <div className={`flex flex-col items-center space-y-6 ${className || ''}`}> {/* Apply className here */}
      <div className="w-full"> 
        <SectionHeader title="Points Multiplier" className="w-full" textColor="text-white" />
      </div>
      {/* Container for cards that allows wrapping */}
      <div className="w-full">
        {/* Cards arranged with proper spacing */}
        <div className="flex flex-wrap gap-6 justify-center items-start">
          {gamesWithBestOdds.map((game) => (
            <div key={game.id} className="flex-shrink-0">
              <MatchCard
                game={game} // Pass the full game object
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PointsMultiplierSection;