"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

// Placeholder images - using an existing image from public/images to resolve the error
const MultiplierImagePlaceholder = '/public/images/8.png'; 

const PointsMultiplierSection: React.FC = () => {
  const multipliers = [
    {
      image: MultiplierImagePlaceholder,
      title: '2X Points Multiplier',
      description: 'On all NBA games',
      buttonText: 'Bet Now',
    },
    {
      image: MultiplierImagePlaceholder,
      title: '3X Points Multiplier',
      description: 'On all Premier League games',
      buttonText: 'Bet Now',
    },
    {
      image: MultiplierImagePlaceholder,
      title: '2X Points Multiplier',
      description: 'On all Tennis games',
      buttonText: 'Bet Now',
    },
  ];

  return (
    <div className="w-full py-8 bg-[#011B47] rounded-[27px] mt-8">
      <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 text-left tracking-tight px-4">Points Multiplier</h2>
      <div className="flex flex-col md:flex-row justify-around items-center gap-6 px-4">
        {multipliers.map((multiplier, index) => (
          <div key={index} className="relative w-full md:w-1/3 bg-vanta-blue-medium rounded-xl overflow-hidden shadow-lg">
            <img src={multiplier.image} alt={multiplier.title} className="w-full h-40 object-cover" />
            <div className="p-4">
              <h3 className="text-xl font-bold text-white mb-1">{multiplier.title}</h3>
              <p className="text-vanta-text-light text-sm mb-4">{multiplier.description}</p>
              <Button className="bg-vanta-neon-blue text-vanta-blue-dark hover:bg-opacity-90 px-6 py-2 rounded-[14px] text-sm font-semibold flex items-center">
                {multiplier.buttonText} <ArrowRight size={16} className="ml-2" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PointsMultiplierSection;