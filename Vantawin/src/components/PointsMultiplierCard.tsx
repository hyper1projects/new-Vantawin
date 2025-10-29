import React from 'react';
import { Button } from '@/components/ui/button';

const PointsMultiplierCard = () => {
  return (
    <div className="relative bg-gradient-to-br from-vanta-dark-blue to-vanta-purple p-6 md:p-8 rounded-xl shadow-lg text-center max-w-md mx-auto mt-8 overflow-hidden">
      {/* Background gradient overlay for visual effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-vanta-dark-blue via-vanta-purple to-vanta-neon-blue opacity-20 rounded-xl"></div>
      
      <div className="relative z-10">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Points Multiplier</h2>
        <p className="text-6xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-vanta-neon-blue to-vanta-purple mb-4 leading-none">
          x2
        <Button className="bg-vanta-neon-blue hover:bg-vanta-purple text-white font-semibold py-2 px-6 rounded-full transition-colors duration-300">
          Learn More
        </Button>
      </div>
    </div>
  );
};

export default PointsMultiplierCard;