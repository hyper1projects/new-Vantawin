"use client";

import React, { useEffect, useState } from 'react';
import Oddscard from './Oddscard';
import { Button } from '@/components/ui/button';
import CollapsibleSection from './CollapsibleSection';
import { useNavigate } from 'react-router-dom';

import { fetchChampionsLeagueGames } from '../lib/fetchOdds';

const ChampionsLeagueSection: React.FC = () => {
  const navigate = useNavigate();
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getGames() {
      setLoading(true);
      try {
        const fetchedGames = await fetchChampionsLeagueGames();
        setGames(fetchedGames);
      } catch (error) {
        console.error("Error fetching Champions League games:", error);
      } finally {
        setLoading(false);
      }
    }

    getGames();
  }, []);

  const handleShowMoreClick = () => {
    navigate('/games/champions-league');
  };

  return (
    <div className="flex flex-col items-center space-y-6 bg-vanta-blue-medium rounded-[27px] shadow-sm pb-12">
      <CollapsibleSection title="Champions League Matches" count={games.length} defaultOpen={true}>
        <div className="w-full flex flex-col space-y-4 px-4 pt-4">
          {loading ? (
            <p className="text-vanta-text-light text-center py-8">Loading games...</p>
          ) : games.length > 0 ? (
            games.map((game) => (
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
  