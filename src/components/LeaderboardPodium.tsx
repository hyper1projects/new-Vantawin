"use client";

import React from 'react';
import { cn } from '../lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Player {
  rank: number;
  playerName: string;
  avatarUrl?: string | null;
  xp: number;
  prizeNaira: number;
  isCurrentUser?: boolean;
  badge?: string;
}

interface LeaderboardPodiumProps {
  topPlayers: Player[];
  className?: string;
  onUserClick?: (player: any) => void;
}

const LeaderboardPodium: React.FC<LeaderboardPodiumProps> = ({ topPlayers, className, onUserClick }) => {
  // Find players for each position
  // Find players for each position
  // Use array index to handle ties (e.g. Ranks 1, 2, 2 -> 1=Gold, 2=Silver, 2=Bronze visual slot)
  const player1 = topPlayers[0];
  const player2 = topPlayers[1];
  const player3 = topPlayers[2];

  return (
    <div className={cn("relative w-full h-[250px] flex justify-center items-end mb-12", className)}>
      <img
        src="/images/leaderboard/Group 1000005742.png"
        alt="Leaderboard Podium"
        className="absolute inset-0 w-full h-full object-contain"
      />

      {/* Position 3 (Left) */}
      <div
        className="absolute bottom-[30%] left-[16%] w-[25%] h-auto flex flex-col items-center justify-end text-center cursor-pointer hover:scale-105 transition-transform"
        onClick={() => player3 && onUserClick?.(player3)}
      >
        {player3 ? (
          <>
            <div className="relative inline-block mb-2">
              <Avatar className="h-14 w-14 border-2 border-yellow-600 shadow-lg ring-2 ring-black/40">
                <AvatarImage src={player3.avatarUrl || ''} />
                <AvatarFallback className="bg-vanta-dark text-yellow-600 font-bold">{player3.playerName[0]}</AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-[#001233] bg-cyan-400 text-xs font-bold text-[#001233]">
                3
              </div>
            </div>
            <span className="text-lg font-bold text-vanta-neon-blue">{player3.playerName}</span>
            {player3.badge && (
              <span className="inline-flex items-center rounded-md bg-purple-500/10 px-2 py-0.5 text-[10px] font-medium text-purple-400 ring-1 ring-inset ring-purple-500/20 mb-1">
                {player3.badge}
              </span>
            )}
            <span className="text-sm text-gray-400 mb-1">{(player3.xp ?? 0).toLocaleString()} XP</span>
            <span className="text-base font-bold text-yellow-600 font-mono">${(player3.prizeNaira ?? 0).toLocaleString()}</span>
          </>
        ) : (
          <span className="text-sm text-gray-500">#3</span>
        )}
      </div>

      {/* Position 1 (Center) */}
      <div
        className="absolute bottom-[62%] left-[35%] w-[30%] h-auto flex flex-col items-center justify-end text-center cursor-pointer hover:scale-105 transition-transform"
        onClick={() => player1 && onUserClick?.(player1)}
      >
        {player1 ? (
          <>
            <div className="relative inline-block mb-2">
              <Avatar className="h-20 w-20 border-4 border-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.5)] ring-2 ring-black/40">
                <AvatarImage src={player1.avatarUrl || ''} />
                <AvatarFallback className="bg-vanta-dark text-yellow-400 font-bold text-xl">{player1.playerName[0]}</AvatarFallback>
              </Avatar>
              <div className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full border-4 border-[#001233] bg-cyan-400 text-sm font-extrabold text-[#001233] shadow-lg">
                1
              </div>
            </div>
            <span className="text-xl font-extrabold text-vanta-neon-blue">{player1.playerName}</span>
            {player1.badge && (
              <span className="inline-flex items-center rounded-md bg-yellow-500/10 px-2 py-0.5 text-xs font-bold text-yellow-500 ring-1 ring-inset ring-yellow-500/20 mb-1 animate-pulse">
                {player1.badge}
              </span>
            )}
            <span className="text-base text-gray-400 mb-1">{(player1.xp ?? 0).toLocaleString()} XP</span>
            <span className="text-xl font-bold text-yellow-400 font-mono shadow-amber-500/20 drop-shadow-lg glitch-text">
              ${(player1.prizeNaira ?? 0).toLocaleString()}
            </span>
          </>
        ) : (
          <span className="text-base text-gray-500">#1</span>
        )}
      </div>

      {/* Position 2 (Right) */}
      <div
        className="absolute bottom-[42%] right-[16%] w-[25%] h-auto flex flex-col items-center justify-end text-center cursor-pointer hover:scale-105 transition-transform"
        onClick={() => player2 && onUserClick?.(player2)}
      >
        {player2 ? (
          <>
            <div className="relative inline-block mb-2">
              <Avatar className="h-14 w-14 border-2 border-yellow-500 shadow-lg ring-2 ring-black/40">
                <AvatarImage src={player2.avatarUrl || ''} />
                <AvatarFallback className="bg-vanta-dark text-yellow-500 font-bold">{player2.playerName[0]}</AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-[#001233] bg-cyan-400 text-xs font-bold text-[#001233]">
                2
              </div>
            </div>
            <span className="text-lg font-bold text-vanta-neon-blue">{player2.playerName}</span>
            {player2.badge && (
              <span className="inline-flex items-center rounded-md bg-gray-500/10 px-2 py-0.5 text-[10px] font-medium text-gray-400 ring-1 ring-inset ring-gray-500/20 mb-1">
                {player2.badge}
              </span>
            )}
            <span className="text-sm text-gray-400 mb-1">{(player2.xp ?? 0).toLocaleString()} XP</span>
            <span className="text-base font-bold text-yellow-500 font-mono">${(player2.prizeNaira ?? 0).toLocaleString()}</span>
          </>
        ) : (
          <span className="text-sm text-gray-500">#2</span>
        )}
      </div>
    </div>
  );
};

export default LeaderboardPodium;