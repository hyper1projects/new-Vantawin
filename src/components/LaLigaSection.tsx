"use client";

import React from 'react';
import Oddscard from './Oddscard';
import { Game } from '../types/game';
import SectionHeader from './SectionHeader';
import { Button } from '@/components/ui/button';
import { allGamesData } from '../data/games'; // Import centralized game data

const LaLigaSection: React.FC = () => {
  // Filter games to show only La Liga matches (both live and upcoming) from allGamesData
  const filteredGames = allGamesData.filter(game => game.league === 'La Liga');

  return (
    <div className="flex flex-col items-center space-y-6 bg-vanta-blue-medium rounded-[27px] shadow-sm pb-12">
      {/* Header wrapper div now extends full width */}
      <div className="w-full bg-[#0D2C60] rounded-t-[27px]">
        <SectionHeader title="La Liga Matches" className="w-full" textColor="text-white" />
      </div>
      
      {/* Wrapper div for Oddscards - stacking vertically */}
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
          onClick={() => console.log('Show More La Liga clicked')} // Placeholder for future functionality
        >
          Show More
        </Button>
      </div>
    </div>
  );
};

export default LaLigaSection;