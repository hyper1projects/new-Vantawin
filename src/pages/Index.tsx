"use client";

import React from 'react';
import ImageCarousel from '../components/ImageCarousel';
import PointsMultiplierSection from '../components/PointsMultiplierSection';
import TopGamesSection from '../components/TopGamesSection'; // Import the new component

const Index = () => {
  return (
    <div className="p-4">
      <h1 className="text-xl font-bold text-vanta-text-light mb-4 text-left pl-4">Welcome to VantaWin!</h1>
      <ImageCarousel />
      <PointsMultiplierSection />
      {/* Add the new TopGamesSection component here */}
      <TopGamesSection />
      <div className="mt-8 text-center text-vanta-text-light">
        <p>Explore the features of your new VantaWin application!</p>
      </div>
    </div>
  );
};

export default Index;