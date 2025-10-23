"use client";

import React from 'react';
import Oddscard from '../components/Oddscard';
import { getLogoSrc } from '../utils/logoMap'; // Import getLogoSrc

const Index: React.FC = () => {
  // Dummy data for demonstration
  const oddsData = [
    {
      time: '19:00',
      date: '2024-07-20',
      teams: [
        { name: 'Team A', logo: getLogoSrc('teamA') },
        { name: 'Team B', logo: getLogoSrc('teamB') },
      ],
      gameView: 'Live',
      odds: {
        teamAWin: 1.5,
        draw: 3.2,
        teamBWin: 2.8,
      },
    },
    {
      time: '20:30',
      date: '2024-07-20',
      teams: [
        { name: 'Warriors', logo: getLogoSrc('teamA') }, // Using teamA logo for Warriors
        { name: 'Lakers', logo: getLogoSrc('teamB') },   // Using teamB logo for Lakers
      ],
      gameView: 'Upcoming',
      odds: {
        teamAWin: 2.1,
        draw: 3.0,
        teamBWin: 1.9,
      },
    },
    {
      time: '22:00',
      date: '2024-07-21',
      teams: [
        { name: 'Knicks', logo: getLogoSrc('teamB') },
        { name: 'Bulls', logo: getLogoSrc('teamA') },
      ],
      gameView: 'Finished',
      odds: {
        teamAWin: 1.8,
        draw: 3.5,
        teamBWin: 2.5,
      },
    },
    {
      time: '18:00',
      date: '2024-07-21',
      teams: [
        { name: 'Rockets', logo: getLogoSrc('teamA') },
        { name: 'Celtics', logo: getLogoSrc('teamB') },
      ],
      gameView: 'Live',
      odds: {
        teamAWin: 2.3,
        draw: 3.1,
        teamBWin: 1.7,
      },
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold text-center mb-8">Sports Odds Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {oddsData.map((data, index) => (
          <Oddscard key={index} {...data} />
        ))}
      </div>
    </div>
  );
};

export default Index;