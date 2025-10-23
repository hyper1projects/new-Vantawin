"use client";

import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Oddscard from '@/components/Oddscard';
import { getLogoSrc } from '@/utils/logoMap'; // Import getLogoSrc

const Index: React.FC = () => {
  // Dummy data for games
  const games = [
    {
      id: 'game1',
      time: '7:00 PM',
      date: '2024-07-20',
      teamA: 'Team A',
      teamB: 'Team B',
      teamALogo: 'teamA', // Standardized key
      teamBLogo: 'teamB', // Standardized key
      oddsA: -110,
      oddsB: +100,
      gameView: 'Live',
    },
    {
      id: 'game2',
      time: '8:30 PM',
      date: '2024-07-20',
      teamA: 'Team C',
      teamB: 'Team D',
      teamALogo: 'teamA', // Using 'teamA' as a placeholder for Team C
      teamBLogo: 'teamB', // Using 'teamB' as a placeholder for Team D
      oddsA: +150,
      oddsB: -120,
      gameView: 'Upcoming',
    },
    {
      id: 'game3',
      time: '6:00 PM',
      date: '2024-07-19',
      teamA: 'Team E',
      teamB: 'Team F',
      teamALogo: 'teamA', // Using 'teamA' as a placeholder for Team E
      teamBLogo: 'teamB', // Using 'teamB' as a placeholder for Team F
      oddsA: -200,
      oddsB: +180,
      gameView: 'Finished',
    },
  ];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-8">Welcome to the Sports Betting App</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {games.map((game) => (
          <Oddscard
            key={game.id}
            time={game.time}
            date={game.date}
            teamA={game.teamA}
            teamB={game.teamB}
            teamALogo={getLogoSrc(game.teamALogo)} // Use getLogoSrc
            teamBLogo={getLogoSrc(game.teamBLogo)} // Use getLogoSrc
            oddsA={game.oddsA}
            oddsB={game.oddsB}
            gameView={game.gameView}
          />
        ))}
      </div>

      <div className="mt-10 text-center">
        <Link to="/about">
          <Button variant="outline">Learn More About Us</Button>
        </Link>
      </div>
    </div>
  );
};

export default Index;