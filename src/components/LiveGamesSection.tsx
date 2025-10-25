"use client";

import React from 'react';
import MatchCard from './MatchCard';

interface Game {
  id: string;
  team1: string;
  team2: string;
  time: string;
  date: string;
  odds1: number;
  oddsX: number;
  odds2: number;
}

interface LiveGamesSectionProps {
  games: Game[];
}

const LiveGamesSection: React.FC<LiveGamesSectionProps> = ({ games }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
      {games.map(game => (
        <MatchCard key={game.id} {...game} />
      ))}
    </div>
  );
};

export default LiveGamesSection;