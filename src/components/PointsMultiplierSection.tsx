"use client";

import React from 'react';
import MatchCard from './MatchCard';
import SectionHeader from './SectionHeader';
import { Game } from '../types/game';
import { useMatchesContext } from '../context/MatchesContext'; // Import from context instead of mock
import { allGamesData } from '../data/games'; // Import mock data as fallback

interface PointsMultiplierSectionProps {
  className?: string; // Add className prop
}

const PointsMultiplierSection: React.FC<PointsMultiplierSectionProps> = ({ className }) => { // Destructure className
  const { games, loading } = useMatchesContext();

  // Fallback to mock data if context games are empty (e.g. not seeded yet or fetching error)
  // This ensures the UI isn't wiped out while the backend is being populated.
  const displayGames = (games && games.length > 0) ? games : allGamesData;

  // Function to get the highest odd for a game
  const getMaxOdd = (game: Game) => {
    const winMatchQuestion = game.questions.find(q => q.type === 'win_match');
    if (winMatchQuestion && winMatchQuestion.options) {
      // Map options to get odds values
      const oddsValues = winMatchQuestion.options.map(opt => opt.odds);
      return oddsValues.length > 0 ? Math.max(...oddsValues) : 0;
    }
    return 0; // Return 0 if no win_match question or odds are found
  };

  // Sort games by the highest odd in descending order and take more games for horizontal scroll
  const gamesWithBestOdds = [...displayGames]
    .sort((a, b) => getMaxOdd(b) - getMaxOdd(a))
    .slice(0, 6);

  return (
    <div className={`flex flex-col items-start space-y-6 ${className || ''}`}> {/* Apply className here */}
      <div className="w-full">
        <SectionHeader title="Hot Today" className="w-full" textColor="text-white" />
      </div>
      {/* Container for cards with horizontal scroll */}
      <div className="w-full overflow-x-auto [-webkit-scrollbar:none] [scrollbar-width:none]">
        {/* Cards arranged horizontally with proper spacing */}
        <div className="flex gap-4 pb-2">
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