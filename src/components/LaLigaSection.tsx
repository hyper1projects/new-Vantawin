"use client";

import React from 'react';
import Oddscard from './Oddscard';
import { Button } from '@/components/ui/button';
import CollapsibleSection from './CollapsibleSection';
import { useNavigate } from 'react-router-dom';
import { useMatchesContext } from '../context/MatchesContext'; // Import useMatchesContext

const LaLigaSection: React.FC = () => {
  const navigate = useNavigate();
  const { games, loading } = useMatchesContext(); // Get games and loading state from context

  // Filter games for La Liga
  const laLigaGames = games.filter(game => game.league === 'La Liga');

  const handleShowMoreClick = () => {
    navigate('/games/la-liga');
  };

  return (
    <div className="flex flex-col items-center space-y-6 bg-vanta-blue-medium rounded-[27px] shadow-sm pb-12">
      <CollapsibleSection title="La Liga Matches" count={laLigaGames.length} defaultOpen={true}>
        <div className="w-full flex flex-col space-y-4 px-4 pt-4">
          {loading ? (
            <p className="text-vanta-text-light text-center py-8">Loading La Liga games...</p>
          ) : laLigaGames.length > 0 ? (
            laLigaGames.map((game) => (
              <Oddscard key={game.id} game={game} />
            ))
          ) : (
            <p className="text-vanta-text-light text-center py-8">No La Liga games available at the moment.</p>
          )}
        </div>

        <div className="w-full flex justify-end px-4 pt-4">
          <Button
            className="bg-[#00EEEE] text-[#081028] hover:bg-[#00EEEE] hover:text-[#081028] rounded-[12px] px-6 py-2"
            onClick={handleShowMoreClick}
          >
            Show More
          </Button>
        </div>
      </CollapsibleSection>
    </div>
  );
};

export default LaLigaSection;