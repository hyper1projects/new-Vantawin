"use client";

import React, { useState } from 'react';
import Oddscard from './Oddscard';
import { Game } from '../types/game';
import SectionHeader from './SectionHeader';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type GameFilter = 'All' | 'Live' | 'Upcoming';

const TopGamesSection: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState<GameFilter>('All');

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

  // Filter games based on the selectedFilter
  const filteredGames = games.filter(game => {
    if (selectedFilter === 'All') {
      return true;
    }
    if (selectedFilter === 'Live') {
      return game.isLive;
    }
    if (selectedFilter === 'Upcoming') {
      return !game.isLive; // Assuming 'Upcoming' means not live
    }
    return false;
  });

  const getButtonClasses = (filter: GameFilter) => {
    const isSelected = selectedFilter === filter;
    return cn(
      "size-sm rounded-[12px]",
      isSelected
        ? "bg-[#00EEEE] text-[#081028]"
        : "bg-[#0B295B] text-white hover:text-[#00EEEE] hover:bg-[#0B295B]"
    );
  };

  return (
    <div className="flex flex-col items-center space-y-6 bg-vanta-blue-medium rounded-lg shadow-sm">
      {/* Header wrapper div now extends full width */}
      <div className="w-full bg-[#0D2C60] rounded-t-lg">
        <SectionHeader title="Top Games" className="w-full" textColor="text-white" />
      </div>
      
      <div className="flex space-x-2 w-full justify-start px-4 -mt-4 mb-4 border-b border-gray-700 pb-4">
        <Button 
          onClick={() => setSelectedFilter('All')}
          className={getButtonClasses('All')}
        >
          All
        </Button>
        <Button 
          onClick={() => setSelectedFilter('Live')}
          className={getButtonClasses('Live')}
        >
          Live
        </Button>
        <Button 
          onClick={() => setSelectedFilter('Upcoming')}
          className={getButtonClasses('Upcoming')}
        >
          Upcoming
        </Button>
      </div>

      {/* Wrapper div for Oddscards - now a responsive grid with auto-fit */}
      <div className="w-full grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-6 px-4">
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
    </div>
  );
};

export default TopGamesSection;