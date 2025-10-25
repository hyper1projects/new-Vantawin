"use client";

import React from 'react';
import MatchCard from './MatchCard';
import SectionHeader from './SectionHeader';
import { Game } from '../types/game';
import { logoMap } from '../utils/logoMap';

const PointsMultiplierSection: React.FC = () => {
  // Define an array of game data, using the logo identifiers from logoMap.ts
  const allGames: Game[] = [
    {
      id: 'game-1',
      time: '7:00 PM',
      date: 'Today',
      team1: { name: 'Crystal Palace', logoIdentifier: 'CRY' },
      team2: { name: 'West Ham United', logoIdentifier: 'WHU' },
      odds: { team1: 1.5, draw: 3.0, team2: 2.5 },
      league: 'Premier League',
      isLive: false,
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
      isLive: true,
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
      isLive: false,
      gameView: 'Match Info',
    },
    {
      id: 'game-4',
      time: '6:00 PM',
      date: 'Today',
      team1: { name: 'Liverpool', logoIdentifier: 'LIV' },
      team2: { name: 'Everton', logoIdentifier: 'EVE' },
      odds: { team1: 1.2, draw: 4.0, team2: 6.0 },
      league: 'Premier League',
      isLive: false,
      gameView: 'Derby Details',
    },
    {
      id: 'game-5',
      time: '10:00 PM',
      date: 'Tomorrow',
      team1: { name: 'Real Madrid', logoIdentifier: 'RMA' },
      team2: { name: 'Barcelona', logoIdentifier: 'BAR' },
      odds: { team1: 2.0, draw: 3.1, team2: 2.0 },
      league: 'La Liga',
      isLive: true,
      gameView: 'El Clásico',
    },
    {
      id: 'game-6',
      time: '5:00 PM',
      date: 'Yesterday',
      team1: { name: 'Bayern Munich', logoIdentifier: 'BAY' },
      team2: { name: 'Borussia Dortmund', logoIdentifier: 'DOR' },
      odds: { team1: 1.6, draw: 3.8, team2: 4.5 },
      league: 'Bundesliga',
      isLive: false,
      gameView: 'German Derby',
    },
  ];

  // Function to get the highest odd for a game
  const getMaxOdd = (game: Game) => {
    return Math.max(game.odds.team1, game.odds.draw, game.odds.team2);
  };

  // Sort games by the highest odd in descending order
  const gamesWithBestOdds = [...allGames]
    .sort((a, b) => getMaxOdd(b) - getMaxOdd(a));

  return (
    <div className="flex flex-col items-center space-y-6"> 
      <div className="w-full"> 
        <SectionHeader title="Points Multiplier" className="w-full" textColor="text-white" />
      </div>
      {/* Horizontal scroll container with blur edges */}
      <div className="relative w-full">
        {/* Left blur overlay */}
        <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-[#06002E] to-transparent z-10 pointer-events-none"></div>
        
        {/* Scrollable content */}
        <div className="w-full flex overflow-x-auto space-x-4 px-4 pb-4 scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-blue-500 scrollbar-track-blue-100">
          {gamesWithBestOdds.map((game) => (
            <MatchCard
              key={game.id}
              date={`${game.date} - ${game.time}`}
              team1Logo={logoMap[game.team1.logoIdentifier] || '/path/to/default-logo.png'}
              team1Name={game.team1.name}
              team2Logo={logoMap[game.team2.logoIdentifier] || '/path/to/default-logo.png'}
              team2Name={game.team2.name}
              option1={game.odds.team1.toString()}
              option2={game.odds.draw.toString()}
              option3={game.odds.team2.toString()}
            />
          ))}
        </div>

        {/* Right blur overlay */}
        <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-[#06002E] to-transparent z-10 pointer-events-none"></div>
      </div>
    </div>
  );
};

export default PointsMultiplierSection;