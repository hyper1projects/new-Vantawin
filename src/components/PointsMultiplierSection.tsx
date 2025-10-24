"use client";

import React from 'react';
import Oddscard from './Oddscard';
import SectionHeader from './SectionHeader';
import { Game } from '../types/game';

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
      id: 'game-6', // Added another game to demonstrate scrolling
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

  // Sort games by the highest odd in descending order (no slice limit)
  const gamesWithBestOdds = [...allGames]
    .sort((a, b) => getMaxOdd(b) - getMaxOdd(a));

  return (
    <div className="flex flex-col items-center space-y-6 bg-vanta-blue-medium rounded-lg shadow-sm pb-12">
      <div className="w-full bg-[#0D2C60] rounded-t-lg">
        <SectionHeader title="Points Multiplier" className="w-full" textColor="text-white" />
      </div>
      {/* Horizontal scroll container */}
      <div className="w-full flex overflow-x-auto space-x-4 px-4 pb-4 scrollbar-hide"> {/* Added scrollbar-hide for cleaner look */}
        {gamesWithBestOdds.map((game) => (
          <div key={game.id} className="flex-shrink-0 w-[300px]"> {/* Fixed width for each card */}
            <Oddscard
              time={game.time}
              date={game.date}
              team1={game.team1}
              team2={game.team2}
              odds={game.odds}
              league={game.league}
              isLive={game.isLive}
              gameView={game.gameView}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PointsMultiplierSection;