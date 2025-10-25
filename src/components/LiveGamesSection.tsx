"use client";

import React from 'react';
import Oddscard from './Oddscard';
import { Game } from '../types/game';
import SectionHeader from './SectionHeader';
import { Button } from '@/components/ui/button';
// Removed `cn` import as it's no longer needed without filter buttons

const LiveGamesSection: React.FC = () => {
  // Define an array of game data, using the logo identifiers from logoMap.ts
  const games: Game[] = [
    {
      id: 'game-1',
      time: '7:00 PM',
      date: 'Today',
      team1: { name: 'Crystal Palace', logoIdentifier: 'CRY' },
      team2: { name: 'West Ham United', logoIdentifier: 'WHU' },
      odds: { team1: 1.5, draw: 3.0, team2: 2.5 },
      league: 'Premier League',
      isLive: false, // This game will not be shown
      gameView: 'View Game Details',
    },
    {
      id: 'game-2',
      time: '8:30 PM',
      date: 'Tomorrow',
      team1: { name: 'Manchester United', logoIdentifier: 'MANU' },
      team2: { name: 'Leicester City', logoIdentifier: 'LEIC' },
      odds: { team1: 2.1, draw: 3.2, team2: 1.9 },
      league: 'La Liga',
      isLive: true, // This game will be shown
      gameView: 'View Matchup',
    },
    {
      id: 'game-3',
      time: '9:00 PM',
      date: 'Today',
      team1: { name: 'Arsenal', logoIdentifier: 'ARS' },
      team2: { name: 'Chelsea', logoIdentifier: 'CHE' },
      odds: { team1: 1.8, draw: 3.5, team2: 2.2 },
      league: 'Premier League',
      isLive: true, // This game will be shown
      gameView: 'Match Info',
    },
  ];

  // Filter games to show only live games
  const filteredGames = games.filter(game => game.isLive);

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