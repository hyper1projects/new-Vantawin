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
    const winMatchQuestion = game.questions.find(q => q.type === 'win_match');
    if (winMatchQuestion && winMatchQuestion.odds) {
      const { team1, draw, team2 } = winMatchQuestion.odds;
      // Ensure all odds are numbers before calling Math.max
      const validOdds = [team1, draw, team2].filter(o => typeof o === 'number') as number[];
      return validOdds.length > 0 ? Math.max(...validOdds) : 0;
    }
    return 0; // Return 0 if no win_match question or odds are found
  };

  // Sort games by the highest odd in descending order and take only the top 3 from allGamesData
  const gamesWithBestOdds = [...allGamesData]
    .sort((a, b) => getMaxOdd(b) - getMaxOdd(a))
    .slice(0, 3);

  return (
    <div className={`flex flex-col items-center space-y-6 ${className || ''}`}> {/* Apply className here */}
      <div className="w-full"> 
        <SectionHeader title="Hot Today" className="w-full" textColor="text-white" />
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