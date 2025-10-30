"use client";

import React from 'react';
import Oddscard from './Oddscard';
import { Game } from '../types/game'; // Ensure Game type is imported
import SectionHeader from './SectionHeader';
import { Button } from '@/components/ui/button';
import { allGamesData } from '../data/games'; // Import centralized game data
// Removed `cn` import as it's no longer needed without filter buttons

const LiveGamesSection: React.FC = () => {
  // Filter games to show only live games from allGamesData
  const filteredGames = allGamesData.filter(game => game.isLive);

  return (
    <div className="flex flex-col items-center space-y-6 bg-vanta-blue-medium rounded-[27px] shadow-sm pb-12">
      {/* Header wrapper div now extends full width */}
      <div className="w-full bg-[#0D2C60] rounded-t-[27px]">
        <SectionHeader title="Live Games" className="w-full" textColor="text-white" />
      </div>
      
      {/* Removed filter buttons section */}
      {/* <div className="flex space-x-2 w-full justify-start px-4 -mt-4 mb-4 border-b border-gray-700 pb-4">
        ... filter buttons ...
      </div> */}

      {/* Wrapper div for Oddscards - now stacking vertically */}
      <div className="w-full flex flex-col space-y-4 px-4">
        {filteredGames.map((game) => (
          <Oddscard
            key={game.id}
            time={game.time}
            date={game.date}
            team1={game.team1}
            team2={game.team2}
            odds={game.odds}
            league={game.league}
            isLive={game.isLive}
            gameView={game.gameView}
            game={game} // Pass the full game object
          />
        ))}
      </div>

      {/* Show More Button positioned to bottom right */}
      <div className="w-full flex justify-end px-4 pt-4">
        <Button 
          className="bg-[#00EEEE] text-[#081028] hover:bg-[#00EEEE] hover:text-[#081028] rounded-[12px] px-6 py-2"
          onClick={() => console.log('Show More clicked')} // Placeholder for future functionality
        >
          Show More
        </Button>
      </div>
    </div>
  );
};

export default LiveGamesSection;