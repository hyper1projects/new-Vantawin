"use client";

import React from 'react';
import ImageCarousel from '../components/ImageCarousel';
import PointsMultiplierSection from '../components/PointsMultiplierSection';
import TopGamesSection from '../components/TopGamesSection'; // Import the new component

const Index = () => {
  return (
    <div className="w-full max-w-none px-4 py-2">
      <h1 className="text-2xl font-bold text-vanta-text-light mb-4 text-left">Welcome to VantaWin!</h1>
      <ImageCarousel className="mb-6" />
      <PointsMultiplierSection className="mb-6" />
      {/* Add the new TopGamesSection component here */}
      <TopGamesSection className="mb-6" />
      <div className="mt-4 text-center text-vanta-text-light text-sm">
        <p>Explore the features of your new VantaWin application!</p>
      </div>
    </div>
  );
};

export default Index;