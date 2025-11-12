"use client";

import React from 'react';
import { cn } from '../lib/utils';

interface PoolStatsCardProps {
  players: number;
  slotsLeft: number;
  className?: string;
}

const PoolStatsCard: React.FC<PoolStatsCardProps> = ({ players, slotsLeft, className }) => {
  return (
    <div className={cn("bg-[#011B47] rounded-[18px] p-4 flex flex-col justify-between", className)}>
      <h3 className="text-xl font-bold text-white mb-4">POOL STATS</h3>
      <div className="grid grid-cols-2 gap-4 text-center">
        <div>
          <span className="block text-3xl font-bold text-vanta-neon-blue">{players}</span>
          <span className="block text-sm text-gray-400">PLAYERS</span>
        </div>
        <div>
          <span className="block text-3xl font-bold text-vanta-neon-blue">{slotsLeft}</span>
          <span className="block text-sm text-gray-400">SLOTS LEFT</span>
        </div>
      </div>
    </div>
  );
};

export default PoolStatsCard;