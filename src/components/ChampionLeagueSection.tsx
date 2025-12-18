"use client";

import React from 'react';
import Oddscard from './Oddscard';
import { Button } from '@/components/ui/button';
import CollapsibleSection from './CollapsibleSection';
import { useNavigate } from 'react-router-dom';
import { useMatchesContext } from '../context/MatchesContext'; // Import useMatchesContext

const ChampionsLeagueSection: React.FC = () => {
  const navigate = useNavigate();
  const { games, loading } = useMatchesContext(); // Get games and loading state from context

  // Filter games for Champions League
  const championsLeagueGames = games.filter(game => game.league === 'Champions League');

  const handleShowMoreClick = () => {
    navigate('/games/champions-league');
  };

  return (
    <div className="flex flex-col items-center space-y-6 bg-vanta-blue-medium rounded-[27px] shadow-sm pb-12">
      <CollapsibleSection title="Champions League Matches" count={championsLeagueGames.length} defaultOpen={true}>
        <div className="w-full flex flex-col space-y-4 px-4 pt-4">
          {loading ? (
            <p className="text-vanta-text-light text-center py-8">Loading games...</p>
          ) : championsLeagueGames.length > 0 ? (
            championsLeagueGames.map((game) => (
              <Oddscard
                key={game.id}
                game={game}
              />
            ))
          ) : (
            <p className="text-vanta-text-light text-center py-8">No Champions League games available at the moment.</p>
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

export default ChampionsLeagueSection;