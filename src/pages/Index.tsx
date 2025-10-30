"use client";

import React from 'react';
import ImageCarousel from '../components/ImageCarousel';
import PointsMultiplierSection from '../components/PointsMultiplierSection';
import TopGamesSection from '../components/TopGamesSection'; // Import the new component
import RightSidebarLeaderboardCard from '../components/RightSidebarLeaderboardCard'; // Import the new component
import { LeaderboardPlayer } from '../types/leaderboard'; // Import the type

const Index = () => {
  // Dummy data for leaderboard players
  const dummyLeaderboardPlayers: LeaderboardPlayer[] = [
    { id: 'p1', rank: 1, playerName: 'VantaMaster', avatar: '/images/8.png', winRate: 75, gamesPlayed: 120 },
    { id: 'p2', rank: 2, playerName: 'ProPredictor', avatar: '/images/Group 1000005755.png', winRate: 70, gamesPlayed: 110 },
    { id: 'p3', rank: 3, playerName: 'GoalGetter', avatar: '/images/Group 1000005762.png', winRate: 68, gamesPlayed: 105 },
  ];

  return (
    <div className="w-full max-w-none px-4 py-2">
      <h1 className="text-2xl font-bold text-vanta-text-light mb-4 text-left">Welcome to VantaWin!</h1>
      <ImageCarousel className="mb-6" />
      <PointsMultiplierSection className="mb-6" />
      {/* Add the new TopGamesSection component here */}
      <TopGamesSection className="mb-6" />
      {/* Add the new RightSidebarLeaderboardCard component here */}
      <RightSidebarLeaderboardCard players={dummyLeaderboardPlayers} />
      <div className="mt-4 text-center text-vanta-text-light text-sm">
        <p>Explore the features of your new VantaWin application!</p>
      </div>
    </div>
  );
};

export default Index;