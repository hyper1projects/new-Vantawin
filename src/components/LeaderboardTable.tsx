"use client";

import React from 'react';
import { Trophy } from 'lucide-react';
import { cn } from '../lib/utils'; // For conditional class merging

interface LeaderboardEntry {
  rank: number;
  playerName: string;
  score: number;
  isCurrentUser?: boolean; // Optional: to highlight the current user
}

interface LeaderboardTableProps {
  entries: LeaderboardEntry[];
  className?: string;
}

const LeaderboardTable: React.FC<LeaderboardTableProps> = ({ entries, className }) => {
  return (
    <div className={cn("bg-vanta-blue-medium rounded-[27px] p-6 shadow-sm text-vanta-text-light", className)}>
      {/* Table Header */}
      <div className="grid grid-cols-3 gap-4 pb-4 mb-4 border-b border-vanta-accent-dark-blue">
        <span className="text-sm font-semibold text-gray-400">Rank</span>
        <span className="text-sm font-semibold text-gray-400">Player</span>
        <span className="text-sm font-semibold text-gray-400 text-right">Score</span>
      </div>

      {/* Leaderboard Entries */}
      <div className="space-y-4">
        {entries.map((entry) => (
          <div
            key={entry.rank}
            className={cn(
              "grid grid-cols-3 gap-4 items-center py-2 px-3 rounded-lg",
              entry.isCurrentUser ? "bg-vanta-accent-dark-blue border border-vanta-neon-blue" : "hover:bg-[#012A5E]",
              entry.rank <= 3 && "font-bold" // Highlight top 3 ranks
            )}
          >
            <div className="flex items-center">
              {entry.rank === 1 && <Trophy size={18} className="text-yellow-400 mr-2" />}
              {entry.rank === 2 && <Trophy size={18} className="text-gray-400 mr-2" />}
              {entry.rank === 3 && <Trophy size={18} className="text-amber-700 mr-2" />}
              <span className={cn(
                "text-base",
                entry.rank === 1 && "text-yellow-400",
                entry.rank === 2 && "text-gray-400",
                entry.rank === 3 && "text-amber-700"
              )}>
                {entry.rank}
              </span>
            </div>
            <span className="text-base">{entry.playerName}</span>
            <span className="text-base text-right text-vanta-neon-blue">{entry.score.toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LeaderboardTable;