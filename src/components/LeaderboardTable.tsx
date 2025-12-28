"use client";

import React from 'react';
import { cn } from '../lib/utils'; // For conditional class merging
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LeaderboardRowSkeleton } from './skeletons/LeaderboardRowSkeleton';

interface LeaderboardEntry {
  rank: number;
  playerName: string;
  avatarUrl?: string | null;
  xp?: number;
  winRate?: number;
  prizeNaira?: number;
  isCurrentUser?: boolean;
  badge?: string;
  payoutPercentage?: number;
}

interface LeaderboardTableProps {
  entries: LeaderboardEntry[];
  className?: string;
  onUserClick?: (entry: any) => void;
  showPaymentStatus?: boolean;
  isLoading?: boolean;
}

const LeaderboardTable: React.FC<LeaderboardTableProps> = ({ entries, className, onUserClick, showPaymentStatus, isLoading }) => {
  return (
    <div className={cn("bg-vanta-blue-medium rounded-[27px] p-6 shadow-sm text-vanta-text-light", className)}>
      {/* Table Header */}
      <div className="grid grid-cols-[1.5fr_0.8fr_0.8fr_1fr] gap-2 pb-4 mb-4 border-b border-vanta-accent-dark-blue">
        <span className="text-sm font-semibold text-gray-400 pl-2">Player</span>
        <span className="text-sm font-semibold text-gray-400 text-right">XP</span>
        <span className="text-sm font-semibold text-gray-400 text-right">
          {showPaymentStatus ? "Status" : "Winrate"}
        </span>
        <span className="text-sm font-semibold text-gray-400 text-right">Prize / %</span>
      </div>

      {/* Leaderboard Entries */}
      <div className="space-y-4">
        {isLoading ? (
          [...Array(5)].map((_, i) => (
            <LeaderboardRowSkeleton key={i} />
          ))
        ) : (
          entries.map((entry) => (
            <div
              key={`${entry.rank}-${entry.playerName}`}
              onClick={() => onUserClick?.(entry)}
              className={cn(
                "grid grid-cols-[1.5fr_0.8fr_0.8fr_1fr] gap-2 items-center py-2 px-3 rounded-lg cursor-pointer transition-colors",
                entry.isCurrentUser ? "bg-vanta-accent-dark-blue border border-vanta-neon-blue" : "hover:bg-[#012A5E]"
              )}
            >

              {/* Player Name & Avatar */}
              <div className="flex items-center space-x-3 overflow-hidden">
                <div className="relative inline-block flex-shrink-0">
                  <Avatar className="h-10 w-10 border border-white/10">
                    <AvatarImage src={entry.avatarUrl || ''} alt={entry.playerName} />
                    <AvatarFallback className="bg-[#011B47] text-xs text-vanta-neon-blue">
                      {entry.playerName.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border border-[#001233] bg-cyan-400 text-[10px] font-bold text-[#001233]">
                    {entry.rank}
                  </div>
                </div>
                <span className="text-base truncate font-medium">{entry.playerName}</span>
              </div>

              {/* XP */}
              <span className="text-base text-right text-vanta-neon-blue">
                {(entry.xp ?? 0).toLocaleString()}
              </span>

              {/* Winrate / Status */}
              <span className="text-base text-right">
                {showPaymentStatus ? (
                  <div className="flex justify-end">
                    <span className="inline-flex items-center rounded-full bg-yellow-500/10 px-2.5 py-0.5 text-xs font-medium text-yellow-500 ring-1 ring-inset ring-yellow-500/20">
                      Pending
                    </span>
                  </div>
                ) : (
                  `${(entry.winRate ?? 0).toFixed(1)}%`
                )}
              </span>

              {/* Prize & Payout Combined */}
              <div className="text-right flex flex-col justify-center">
                <span className="text-base text-yellow-500 font-bold font-mono">
                  ${(entry.prizeNaira ?? 0).toLocaleString()}
                </span>
                {entry.payoutPercentage !== undefined && entry.payoutPercentage > 0 && (
                  <span className="text-xs text-gray-500">
                    ({entry.payoutPercentage}%)
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default LeaderboardTable;