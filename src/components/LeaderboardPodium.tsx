"use client";

import React from 'react';
import { cn } from '../lib/utils';

interface Player {
  rank: number;
  playerName: string;
  xp: number; 
  isCurrentUser?: boolean;
}

interface LeaderboardPodiumProps {
  topPlayers: Player[];
  className?: string;
}

const LeaderboardPodium: React.FC<LeaderboardPodiumProps> = ({ topPlayers, className }) => {
  // Find players for each position
  const player1 = topPlayers.find(p => p.rank === 1);
  const player2 = topPlayers.find(p => p.rank === 2);
  const player3 = topPlayers.find(p => p.rank === 3);

  return (
    <div className={cn("relative w-full h-[250px] flex justify-center items-end mb-12", className)}>
      <img
        src="/images/leaderboard/Group 1000005742.png"
        alt="Leaderboard Podium"
        className="absolute inset-0 w-full h-full object-contain"
      />

      {/* Position 2 */}
      <div className="absolute bottom-0 left-[10%] w-[25%] h-[60%] flex flex-col items-center justify-center text-center">
        {player2 ? (
          <>
            <span className="text-lg font-bold text-vanta-neon-blue">{player2.playerName}</span>
            <span className="text-sm text-gray-400">{(player2.xp ?? 0).toLocaleString()}</span> {/* Added nullish coalescing for safety */}
          </>
        ) : (
          <span className="text-sm text-gray-500">#2</span>
        )}
      </div>

      {/* Position 1 */}
      <div className="absolute bottom-0 w-[30%] h-[80%] flex flex-col items-center justify-center text-center">
        {player1 ? (
          <>
            <span className="text-xl font-extrabold text-vanta-neon-blue">{player1.playerName}</span>
            <span className="text-base text-gray-400">{(player1.xp ?? 0).toLocaleString()}</span> {/* Added nullish coalescing for safety */}
          </>
        ) : (
          <span className="text-base text-gray-500">#1</span>
        )}
      </div>

      {/* Position 3 */}
      <div className="absolute bottom-0 right-[10%] w-[25%] h-[50%] flex flex-col items-center justify-center text-center">
        {player3 ? (
          <>
            <span className="text-lg font-bold text-vanta-neon-blue">{player3.playerName}</span>
            <span className="text-sm text-gray-400">{(player3.xp ?? 0).toLocaleString()}</span> {/* Added nullish coalescing for safety */}
          </>
        ) : (
          <span className="text-sm text-gray-500">#3</span>
        )}
      </div>
    </div>
  );
};

export default LeaderboardPodium;