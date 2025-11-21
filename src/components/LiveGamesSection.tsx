  "use client";

  import React from 'react';
  import Oddscard from './Oddscard';
  import { Game } from '../types/game';
  import { Button } from '@/components/ui/button';
  import { allGamesData } from '../data/games'; // Import centralized game data
  import CollapsibleSection from './CollapsibleSection'; // Import the new CollapsibleSection
  import { useNavigate } from 'react-router-dom'; // Import useNavigate

  const LiveGamesSection: React.FC = () => {
    const navigate = useNavigate(); // Initialize useNavigate
    // Filter games to show only live games from allGamesData
    const filteredGames = allGamesData.filter(game => game.isLive);
    const liveGamesCount = filteredGames.length; // Get the count of live games

    const handleShowMoreClick = () => {
      navigate('/games/live-games'); // Navigate to the new AllLiveGames page
    };

    return (
      <div className="flex flex-col items-center space-y-6 bg-vanta-blue-medium rounded-[27px] shadow-sm pb-12">
        {/* Use the new CollapsibleSection here */}
        <CollapsibleSection title="Live Predictions" count={liveGamesCount} defaultOpen={true}>
          {/* Wrapper div for Oddscards - now stacking vertically */}
          <div className="w-full flex flex-col space-y-4 px-4 pt-4"> {/* Added pt-4 for spacing below the header */}
            {filteredGames.length > 0 ? (
              filteredGames.map((game) => (
                <Oddscard
                  key={game.id}
                  game={game} // Pass the full game object
                />
              ))
            ) : (
              <p className="text-vanta-text-light text-center py-8">No live games available at the moment.</p>
            )}
          </div>

          {/* Show More Button positioned to bottom right */}
          <div className="w-full flex justify-end px-4 pt-4">
            <Button 
              className="bg-[#00EEEE] text-[#081028] hover:bg-[#00EEEE] hover:text-[#081028] rounded-[12px] px-6 py-2"
              onClick={handleShowMoreClick} // Updated onClick handler
            >
              Show More
            </Button>
          </div>
        </CollapsibleSection>
      </div>
    );
  };

  export default LiveGamesSection;