"use client";

import React from 'react';
import MatchCard from './MatchCard';
import SectionHeader from './SectionHeader';
import { Game } from '../types/game';
import { useMatchesContext } from '../context/MatchesContext';

interface PointsMultiplierSectionProps {
  className?: string;
}

const PointsMultiplierSection: React.FC<PointsMultiplierSectionProps> = ({ className }) => {
  const { games, loading } = useMatchesContext();

  const getMaxOdd = (game: Game) => {
    const winMatchQuestion = game.questions.find(q => q.type === 'win_match');
    if (winMatchQuestion && winMatchQuestion.options) {
      const oddsValues = winMatchQuestion.options.map(opt => opt.odds);
      return oddsValues.length > 0 ? Math.max(...oddsValues) : 0;
    }
    return 0;
  };

  const gamesWithBestOdds = [...games]
    .sort((a, b) => getMaxOdd(b) - getMaxOdd(a))
    .slice(0, 6);

  return (
    <div className={`flex flex-col items-start space-y-6 ${className || ''}`}>
      <div className="w-full">
        <SectionHeader title="Hot Today" className="w-full" textColor="text-white" />
      </div>
      {loading ? (
        <p className="text-vanta-text-light px-4">Loading hot games...</p>
      ) : (
        <div className="w-full overflow-x-auto [-webkit-scrollbar:none] [scrollbar-width:none]">
          <div className="flex gap-4 pb-2">
            {gamesWithBestOdds.length > 0 ? (
              gamesWithBestOdds.map((game) => (
                <div key={game.id} className="flex-shrink-0">
                  <MatchCard game={game} />
                </div>
              ))
            ) : (
              <p className="text-vanta-text-light px-4">No games available right now.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PointsMultiplierSection;