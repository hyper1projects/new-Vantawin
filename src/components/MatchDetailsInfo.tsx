"use client";

import React from 'react';
import { Game } from '../types/game';
import { Button } from '@/components/ui/button';

interface MatchDetailsInfoProps {
  game: Game;
}

const MatchDetailsInfo: React.FC<MatchDetailsInfoProps> = ({ game }) => {
  return (
    <div className="bg-vanta-blue-medium rounded-[27px] p-8 shadow-lg">
      {/* Removed Game Info section */}
      {/* Removed Odds Section */}

      {/* Call to Action (e.g., Predict Now) */}
      <div className="text-center">
        <Button className="bg-vanta-neon-blue text-vanta-blue-dark hover:bg-vanta-neon-blue/90 rounded-[14px] py-3 px-8 text-lg font-bold">
          Predict Now
        </Button>
      </div>
    </div>
  );
};

export default MatchDetailsInfo;