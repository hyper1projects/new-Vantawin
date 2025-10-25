"use client";

import React from 'react';
import ImageCarousel from '../components/ImageCarousel';
import PointsMultiplierSection from '../components/PointsMultiplierSection';
import TopGamesSection from '../components/TopGamesSection';

const Index = () => {
  return (
    <div className="p-16">
      <h1 className="text-xl font-bold text-vanta-text-light mb-4 text-left pl-4">Welcome to VantaWin!</h1>
      <ImageCarousel className="mb-8" />
      <PointsMultiplierSection className="mb-8" />
      <TopGamesSection className="mb-8" /> {/* Added mb-8 here for consistency */}
      <div className="mt-8 text-center text-vanta-text-light">
        <p>Explore the features of your new VantaWin application!</p>
      </div>
    </div>
  );
};

export default Index;