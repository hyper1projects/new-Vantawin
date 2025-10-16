"use client";

import React from 'react';
import LeaderboardHero from '../components/LeaderboardHero';

const Index: React.FC = () => {
  return (
    <div className="p-4"> {/* Page-level padding */}
      <div className="flex justify-end mb-6"> {/* Container for top-right elements */}
        <LeaderboardHero />
      </div>
      {/* Main content area below the leaderboard */}
      <div className="container mx-auto">
        <h1 className="text-2xl font-bold mb-4">Welcome to VantaWin!</h1>
        <p className="text-vanta-text-medium">Select a game from the sidebar to get started.</p>
      </div>
    </div>
  );
};

export default Index;