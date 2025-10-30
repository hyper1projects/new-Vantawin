"use client";

import React from 'react';
import { Game } from '../data/games'; // Assuming Game type is defined here

interface MatchHeaderImageProps {
  game: Game;
}

const MatchHeaderImage: React.FC<MatchHeaderImageProps> = ({ game }) => {
  return (
    <div className="relative w-full h-64 rounded-[20px] overflow-hidden mb-6">
      <img
        src={game.image}
        alt={`${game.team1.name} vs ${game.team2.name}`}
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-vanta-blue-dark via-transparent to-transparent opacity-90"></div>

      <div className="absolute inset-0 flex items-start justify-between p-6"> {/* Changed items-center to items-start */}
        {/* Team 1 */}
        <div className="flex flex-col items-center text-center w-1/3">
          <img src={game.team1.logo} alt={game.team1.name} className="w-16 h-16 mb-2" />
          <span className="text-xl font-bold text-vanta-text-light">{game.team1.name}</span>
        </div>

        {/* Match Info (Time) */}
        <div className="flex flex-col items-center text-center w-1/3">
          <span className="text-lg font-bold text-vanta-text-light">{game.time}</span> {/* Changed text-2xl to text-lg and removed mb-2 */}
          {/* Removed league logo and name */}
        </div>

        {/* Team 2 */}
        <div className="flex flex-col items-center text-center w-1/3">
          <img src={game.team2.logo} alt={game.team2.name} className="w-16 h-16 mb-2" />
          <span className="text-xl font-bold text-vanta-text-light">{game.team2.name}</span>
        </div>
      </div>
    </div>
  );
};

export default MatchHeaderImage;