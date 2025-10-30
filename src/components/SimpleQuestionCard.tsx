"use client";

import React from 'react';
import { Game } from '../types/game';
// Removed getLogoSrc and Button imports as they are now handled by Oddscard
import Oddscard from './Oddscard'; // Import the Oddscard component

interface SimpleQuestionCardProps {
  game: Game;
}

const SimpleQuestionCard: React.FC<SimpleQuestionCardProps> = ({ game }) => {
  // The game prop is now passed directly to Oddscard
  return (
    <div className="bg-vanta-blue-medium rounded-[27px] p-6 shadow-lg text-vanta-text-light w-full flex flex-col items-center justify-center space-y-4">
      {/* The Oddscard component will now handle displaying the game details, question, and odds */}
      <Oddscard game={game} />
    </div>
  );
};

export default SimpleQuestionCard;