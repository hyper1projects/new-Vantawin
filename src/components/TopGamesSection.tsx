"use client";

import React from 'react';
import Oddscard from './Oddscard';
import { Game } from '../types/game';
import SectionHeader from './SectionHeader';
import { Button } from '@/components/ui/button'; // Assuming shadcn/ui Button

const TopGamesSection: React.FC = () => {
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
      date: 'Yesterday',
      team1: { name: 'Aston Villa', logoIdentifier: 'ASTON' },
      team2: { name: 'Crystal Palace', logoIdentifier: 'CRY' },
      odds: { team1: 1.8, draw: 3.5, team2: 2.2 },
      league: 'NBA',
      isLive: false,
      gameView: 'Game Recap',
    },
  ];

  return (
    <div className="p-4 flex flex-col items-center space-y-6 bg-vanta-blue-medium rounded-lg shadow-sm">
      <SectionHeader title="Top Games" bgColor="vanta-blue-medium" className="w-full" /> 
      
      {/* Buttons moved here, below the SectionHeader */}
      <div className="flex space-x-2 w-full justify-center -mt-4 mb-2"> {/* Added negative margin-top to bring it closer */}
        <Button variant="ghost" size="sm" className="text-white hover:bg-vanta-blue-light">All</Button>
        <Button variant="ghost" size="sm" className="text-white hover:bg-vanta-blue-light">Live</Button>
        <Button variant="ghost" size="sm" className="text-white hover:bg-vanta-blue-light">Upcoming</Button>
      </div>

      {games.map((game) => (
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
  );
};

export default TopGamesSection;