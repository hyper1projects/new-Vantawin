"use client";

import React from 'react';
import { Game } from '../data/games'; // Assuming Game type is defined here or in a shared type file
import { Button } from '@/components/ui/button'; // Assuming shadcn button

interface SimpleQuestionCardProps {
  game: Game;
}

const SimpleQuestionCard: React.FC<SimpleQuestionCardProps> = ({ game }) => {
  const { team1, team2 } = game;

  return (
    <div className="bg-vanta-blue-medium rounded-[27px] p-6 shadow-lg text-vanta-text-light w-full flex flex-col items-center justify-center space-y-4">
      {/* Team Logos/Names */}
      <div className="flex items-center justify-center space-x-6 w-full">
        <div className="flex flex-col items-center">
          <img src={team1.logo} alt={team1.name} className="w-16 h-16 object-contain mb-2" />
          <span className="text-lg font-semibold">{team1.name}</span>
        </div>
        <span className="text-2xl font-bold text-vanta-neon-blue">VS</span>
        <div className="flex flex-col items-center">
          <img src={team2.logo} alt={team2.name} className="w-16 h-16 object-contain mb-2" />
          <span className="text-lg font-semibold">{team2.name}</span>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex space-x-4 mt-4">
        <Button className="bg-vanta-neon-blue text-vanta-blue-dark hover:bg-vanta-neon-blue/90 rounded-[12px] px-6 py-2">
          Yes
        </Button>
        <Button className="bg-vanta-accent-dark-blue text-white hover:bg-vanta-accent-dark-blue/90 rounded-[12px] px-6 py-2">
          No
        </Button>
      </div>

      {/* Question */}
      <h3 className="text-xl font-bold text-white text-center">
        Will {team1.name} win this game?
      </h3>
    </div>
  );
};

export default SimpleQuestionCard;