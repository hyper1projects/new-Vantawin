"use client";

import React from 'react';
import { Game } from '../types/game';
import { getLogoSrc } from '../utils/logoMap';
import { Button } from '@/components/ui/button'; // Assuming Button is needed for interaction

interface SimpleQuestionCardProps {
  game: Game;
}

const SimpleQuestionCard: React.FC<SimpleQuestionCardProps> = ({ game }) => {
  const { team1, team2 } = game;

  return (
    <div className="bg-vanta-blue-medium rounded-[27px] p-6 shadow-lg text-vanta-text-light w-full flex flex-col items-center justify-center space-y-4">
      <h3 className="text-xl font-bold text-white text-center">
        Will {team1.name} win this game?
      </h3>
      <div className="flex items-center space-x-4">
        <div className="flex flex-col items-center">
          <img src={getLogoSrc(team1.logoIdentifier)} alt={team1.name} className="w-16 h-16 object-contain mb-2" />
          <span className="text-sm font-semibold">{team1.name}</span>
        </div>
        <span className="text-lg font-bold text-gray-400">VS</span>
        <div className="flex flex-col items-center">
          <img src={getLogoSrc(team2.logoIdentifier)} alt={team2.name} className="w-16 h-16 object-contain mb-2" />
          <span className="text-sm font-semibold">{team2.name}</span>
        </div>
      </div>
      <div className="flex space-x-4 mt-4">
        <Button className="bg-vanta-neon-blue text-vanta-blue-dark hover:bg-vanta-neon-blue/90 rounded-[12px] px-6 py-2">
          Yes
        </Button>
        <Button variant="outline" className="bg-transparent border-2 border-vanta-neon-blue text-vanta-text-light hover:bg-vanta-neon-blue hover:text-vanta-blue-dark rounded-[12px] px-6 py-2">
          No
        </Button>
      </div>
    </div>
  );
};

export default SimpleQuestionCard;