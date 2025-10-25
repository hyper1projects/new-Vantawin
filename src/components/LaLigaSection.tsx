"use client";

import React from 'react';
import Oddscard from './Oddscard';
import { Game } from '../types/game';
import SectionHeader from './SectionHeader';
import { Button } from '@/components/ui/button';

const LaLigaSection: React.FC = () => {
  // Define an array of game data, including both live and upcoming matches
  const allGames: Game[] = [
    {
      id: 'game-1',
      time: '7:00 PM',
      date: 'Today',
      team1: { name: 'Crystal Palace', logoIdentifier: 'CRY' },
      team2: { name: 'West Ham United', logoIdentifier: 'WHU' },
      odds: { team1: 1.5, draw: 3.0, team2: 2.5 },
      league: 'Premier League', // This game will be filtered out
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
      league: 'Premier League', // This game will be filtered out
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
      league: 'Premier League', // This game will be filtered out
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
      league: 'Premier League', // This game will be filtered out
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
      league: 'La Liga', // This game will be shown
      isLive: true,
      gameView: 'El Clásico',
    },
    {
      id: 'game-6',
      time: '5:00 PM',
      date: 'Today',
      team1: { name: 'Atletico Madrid', logoIdentifier: 'ATM' }, // Assuming ATM is a valid logoIdentifier
      team2: { name: 'Sevilla', logoIdentifier: 'SEV' }, // Assuming SEV is a valid logoIdentifier
      odds: { team1: 2.3, draw: 3.0, team2: 3.1 },
      league: 'La Liga', // This game will be shown
      isLive: false,
      gameView: 'Match Details',
    },
  ];

  // Filter games to show only La Liga matches (both live and upcoming)
  const filteredGames = allGames.filter(game => game.league === 'La Liga');

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