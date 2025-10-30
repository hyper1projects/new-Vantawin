"use client";

import React from 'react';
import { Game } from '../types/game';
import { getLogoSrc } from '../utils/logoMap';

interface MatchHeaderImageProps {
  game: Game;
}

const MatchHeaderImage: React.FC<MatchHeaderImageProps> = ({ game }) => {
  return (
    <div 
      className="relative w-full h-[200px] bg-cover bg-center rounded-[27px] mb-8 flex items-center justify-between px-8"
      style={{ backgroundImage: 'url(/images/Group 1000005769.png)' }}
    >
      {/* Team 1 Info */}
      <div className="flex flex-col items-center text-center w-1/3">
        <img src={getLogoSrc(game.team1.logoIdentifier)} alt={game.team1.name} className="w-20 h-20 object-contain mb-2" />
        <span className="text-xl font-bold text-vanta-text-light">{game.team1.name}</span>
      </div>

      {/* Center Info (Time/Live) */}
      <div className="flex flex-col items-center text-center w-1/3">
        {game.isLive ? (
          <span className="flex items-center text-red-400 font-bold tracking-wider text-lg"> {/* Adjusted font size to text-lg */}
            <span className="relative flex h-3 w-3 mr-2"> {/* Slightly larger dot for header */}
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
            LIVE
          </span>
        ) : (
          <span className="text-lg font-bold text-vanta-text-light mb-2">{game.time}</span> {/* Adjusted font size to text-lg */}
        )}
        {/* Removed league logo and name */}
      </div>

      {/* Team 2 Info */}
      <div className="flex flex-col items-center text-center w-1/3">
        <img src={getLogoSrc(game.team2.logoIdentifier)} alt={game.team2.name} className="w-20 h-20 object-contain mb-2" />
        <span className="text-xl font-bold text-vanta-text-light">{game.team2.name}</span>
      </div>
    </div>
  );
};

export default MatchHeaderImage;