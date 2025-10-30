"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { LeaderboardPlayer } from '../types/leaderboard';
import { cn } from '../lib/utils';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom'; // Import Link for navigation

interface RightSidebarLeaderboardCardProps {
  players: LeaderboardPlayer[];
}

const RightSidebarLeaderboardCard: React.FC<RightSidebarLeaderboardCardProps> = ({ players }) => {
  return (
    <div className="bg-vanta-blue-medium rounded-[27px] p-4 shadow-sm text-vanta-text-light mb-6">
      {/* Removed the h3 tag for "Leaderboard" */}
      <div className="space-y-3 pt-2"> {/* Added pt-2 to bring content slightly closer to the top */}
        {players.slice(0, 3).map((player) => ( // Display only top 3
          <div key={player.id} className="flex items-center justify-between bg-[#01112D] p-3 rounded-xl">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <img src={player.avatar} alt={player.playerName} className="w-10 h-10 rounded-full object-cover" />
                <span className="absolute -bottom-1 -left-1 bg-vanta-neon-blue text-vanta-blue-dark text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center border-2 border-[#01112D]">
                  {player.rank}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold">{player.playerName}</span>
                <span className="text-xs text-gray-400">Player</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <span className="block text-sm font-semibold text-vanta-neon-blue">{player.winRate}%</span>
                <span className="block text-xs text-gray-400">Winrate</span>
              </div>
              <div className="text-right">
                <span className="block text-sm font-semibold text-vanta-neon-blue">{player.gamesPlayed}</span>
                <span className="block text-xs text-gray-400">Games</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 text-center">
        <Button
          asChild
          variant="ghost"
          className="text-vanta-neon-blue hover:text-vanta-neon-blue/80 text-sm font-semibold p-0 h-auto"
        >
          <Link to="/leaderboard">
            See ranking <ChevronRight size={16} className="inline-block ml-1" />
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default RightSidebarLeaderboardCard;