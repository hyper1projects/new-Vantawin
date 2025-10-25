"use client";

import React from 'react';
import LiveGamesSection from '../components/LiveGamesSection'; // Import LiveGamesSection

const Games: React.FC = () => {
  return (
    <div className="container mx-auto p-4 bg-vanta-base min-h-screen">
      <h1 className="text-2xl font-bold text-vanta-text-light mb-4">Games</h1>
      <p className="text-vanta-text-medium mb-6">Explore various games here!</p>
      
      {/* Add the LiveGamesSection here */}
      <LiveGamesSection className="mb-8" />
      
      {/* You can add other game sections or content below */}
    </div>
  );
};

export default Games;