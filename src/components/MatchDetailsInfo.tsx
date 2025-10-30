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
      {/* Game Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-lg mb-8">
        <div className="flex justify-between items-center bg-[#012A5E] p-4 rounded-lg">
          <span className="text-gray-400">Date:</span>
          <span className="font-semibold">{game.date}</span>
        </div>
        <div className="flex justify-between items-center bg-[#012A5E] p-4 rounded-lg">
          <span className="text-gray-400">Time:</span>
          <span className="font-semibold">{game.time}</span>
        </div>
        <div className="flex justify-between items-center bg-[#012A5E] p-4 rounded-lg">
          <span className="text-gray-400">League:</span>
          <span className="font-semibold">{game.league}</span>
        </div>
        <div className="flex justify-between items-center bg-[#012A5E] p-4 rounded-lg">
          <span className="text-gray-400">Status:</span>
          <span className={`font-semibold ${game.isLive ? 'text-red-500' : 'text-green-500'}`}>
            {game.isLive ? 'LIVE' : 'Upcoming'}
          </span>
        </div>
      </div>

      {/* Odds Section */}
      <h2 className="text-2xl font-bold text-vanta-text-light mb-4 text-center">Current Odds</h2>
      <div className="flex flex-col md:flex-row justify-center gap-4 mb-8">
        <div className="bg-[#012A5E] p-4 rounded-lg flex-1 text-center">
          <p className="text-gray-400 text-sm">{game.team1.name} Win</p>
          <p className="text-3xl font-bold text-vanta-neon-blue">{(game.odds?.team1 ?? 0).toFixed(2)}</p>
        </div>
        <div className="bg-[#012A5E] p-4 rounded-lg flex-1 text-center">
          <p className="text-gray-400 text-sm">Draw</p>
          <p className="text-3xl font-bold text-vanta-neon-blue">{(game.odds?.draw ?? 0).toFixed(2)}</p>
        </div>
        <div className="bg-[#012A5E] p-4 rounded-lg flex-1 text-center">
          <p className="text-gray-400 text-sm">{game.team2.name} Win</p>
          <p className="text-3xl font-bold text-vanta-neon-blue">{(game.odds?.team2 ?? 0).toFixed(2)}</p>
        </div>
      </div>

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