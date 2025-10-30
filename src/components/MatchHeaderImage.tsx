"use client";

import React from 'react';
import { Game } from '../types/game';
import { getLogoSrc } from '../utils/teamLogos';

interface MatchHeaderImageProps {
  game: Game;
}

const MatchHeaderImage: React.FC<MatchHeaderImageProps> = ({ game }) => {
  const { team1, team2, date, time, league } = game;

  // Format date and time
  const formattedDateTime = `${date} - ${time}`;

  return (
    <div
      className="relative w-full h-[200px] bg-cover bg-center rounded-[27px] mb-8 flex items-center justify-between px-8"
      style={{ backgroundImage: 'url(/images/Group 1000005769.png)' }}
    >
      {/* Team 1 */}
      <div className="flex flex-col items-center space-y-2">
        <img src={getLogoSrc(team1.name)} alt={team1.name} className="w-16 h-16 object-contain" />
        <span className="text-white text-lg font-bold">{team1.name}</span>
      </div>

      {/* Central Details: League, Date/Time, VS */}
      <div className="flex flex-col items-center justify-center space-y-1">
        <span className="text-vanta-text-light text-sm font-medium">{league}</span>
        <span className="text-vanta-text-light text-xs">{formattedDateTime}</span>
        <span className="text-vanta-neon-blue text-3xl font-bold">VS</span>
      </div>

      {/* Team 2 */}
      <div className="flex flex-col items-center space-y-2">
        <img src={getLogoSrc(team2.name)} alt={team2.name} className="w-16 h-16 object-contain" />
        <span className="text-white text-lg font-bold">{team2.name}</span>
      </div>
    </div>
  );
};

export default MatchHeaderImage;