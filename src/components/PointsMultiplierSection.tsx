"use client";

import React from 'react';
import { cn } from '../lib/utils'; // Assuming cn utility is available

interface PointsMultiplierSectionProps {
  className?: string; // Added className prop
}

const PointsMultiplierSection: React.FC<PointsMultiplierSectionProps> = ({ className }) => {
  return (
    <div className={cn("bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6 rounded-lg shadow-lg text-center", className)}>
      <h3 className="text-3xl font-bold mb-2">2x Points Multiplier!</h3>
      <p className="text-lg mb-4">Play selected games and earn double the loyalty points.</p>
      <button className="bg-white text-purple-700 font-semibold py-2 px-6 rounded-full hover:bg-gray-100 transition-colors">
        Explore Games
      </button>
    </div>
  );
};

export default PointsMultiplierSection;