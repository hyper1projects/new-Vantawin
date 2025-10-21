"use client";

import React from 'react';
import ImageCarousel from '@/components/ImageCarousel';
import PointsMultiplierSection from '@/components/PointsMultiplierSection';
import TopGamesSection from '@/components/TopGamesSection';

const Index: React.FC = () => {
  return (
    <div className="px-4 py-4">
      <h1 className="text-xl font-bold text-vanta-text-light mb-4 text-left">Welcome to VantaWin!</h1>
      <ImageCarousel />
      <PointsMultiplierSection />
      <TopGamesSection />
    </div>
  );
};

export default Index;