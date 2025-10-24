"use client";

import React from 'react';
import Oddscard from '../components/Oddscard';
import { Game } from '../types/game'; // Import the Game interface

const Index: React.FC = () => {
  // Define an array of game data
  const games: Game[] = [
    {
      id: 'game-1',
      time: '7:00 PM',
      date: 'Today',
      team1: { name: 'Chelsea FC', logoIdentifier: 'chelsea' }, // Updated team name and logoIdentifier
      team2: { name: 'Liverpool', logoIdentifier: 'liverpool' }, // Updated team name and logoIdentifier
      odds: { team1: 1.5, draw: 3.0, team2: 2.5 },
      league: 'Premier League',
      isLive: false,
      gameView: 'View Game Details',
    },
    {
      id: 'game-2',
      time: '8:30 PM',
      date: 'Tomorrow',
      team1: { name: 'Liverpool', logoIdentifier: 'liverpool' }, // Updated team name and logoIdentifier
      team2: { name: 'Chelsea FC', logoIdentifier: 'chelsea' }, // Updated team name and logoIdentifier
      odds: { team1: 2.1, draw: 3.2, team2: 1.9 },
      league: 'La Liga',
      isLive: true,
      gameView: 'View Matchup',
    },
    {
      id: 'game-3',
      time: '9:00 PM',
      date: 'Yesterday',
      team1: { name: 'Team E', logoIdentifier: 'teamA' },
      team2: { name: 'Team F', logoIdentifier: 'teamB' },
      odds: { team1: 1.8, draw: 3.5, team2: 2.2 },
      league: 'NBA',
      isLive: false,
      gameView: 'Game Recap',
    },
  ];

  return (
    <div className="p-4 flex flex-col items-center space-y-6">
      <h1 className="text-2xl font-bold mb-2 text-gray-800">Upcoming Games</h1>
      {games.map((game) => (
        <Oddscard
          key={game.id} // Use a unique key for each mapped component
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
  );
};

export default Index;