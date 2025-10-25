"use client";

import React from 'react';
import ImageCarousel from '../components/ImageCarousel';
import PointsMultiplierSection from '../components/PointsMultiplierSection';
import SectionHeader from '../components/SectionHeader';
import MatchCard from '../components/MatchCard';
import { Game } from '../types/game';
import { logoMap } from '../utils/logoMap';

const Index: React.FC = () => {
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

  return (
    <div className="min-h-screen bg-vanta-blue text-white p-4">
      <div className="max-w-md mx-auto">
        <div className="mb-6"> {/* Added mb-6 here */}
          <ImageCarousel />
        </div>
        <PointsMultiplierSection />

        {/* Live Games Section */}
        <div className="mt-8 bg-vanta-blue-medium rounded-lg shadow-sm pb-12">
          <div className="w-full bg-[#0D2C60] rounded-t-lg">
            <SectionHeader title="Live Games" className="w-full" textColor="text-white" />
          </div>
          <div className="grid grid-cols-1 gap-4 p-4">
            {allGames.filter(game => game.isLive).map((game) => (
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
                isLive={game.isLive}
                gameView={game.gameView}
              />
            ))}
          </div>
        </div>

        {/* Upcoming Games Section */}
        <div className="mt-8 bg-vanta-blue-medium rounded-lg shadow-sm pb-12">
          <div className="w-full bg-[#0D2C60] rounded-t-lg">
            <SectionHeader title="Upcoming Games" className="w-full" textColor="text-white" />
          </div>
          <div className="grid grid-cols-1 gap-4 p-4">
            {allGames.filter(game => !game.isLive).map((game) => (
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
                isLive={game.isLive}
                gameView={game.gameView}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;