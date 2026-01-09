"use client";

import React from 'react';
import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';
import { cn } from '../lib/utils';

interface ProfileCardProps {
  username: string;
  joinedDate: string;
  rank: string;
  gamesPlayed: number;
  winRate: number;
  wins: number;
  avatarUrl?: string;
  className?: string;
}

const ProfileCard: React.FC<ProfileCardProps> = ({
  username,
  joinedDate,
  rank,
  gamesPlayed,
  winRate,
  wins,
  avatarUrl,
  className,
}) => {
  return (
    <div className={cn("bg-vanta-blue-medium rounded-[22px] md:rounded-[27px] p-4 md:p-6 shadow-lg text-vanta-text-light flex flex-col", className)}>
      <div className="flex items-center justify-between mb-4 md:mb-6">
        <div className="flex items-center space-x-3 md:space-x-4">
          <div className="h-16 w-16 md:h-20 md:w-20 rounded-full overflow-hidden bg-vanta-neon-blue flex items-center justify-center flex-shrink-0 border-2 border-vanta-neon-blue">
            {avatarUrl ? (
              <img src={avatarUrl} alt={username} className="w-full h-full object-cover" />
            ) : (
              <span className="text-vanta-blue-dark font-bold text-xl md:text-2xl">
                {username.substring(0, 2).toUpperCase()}
              </span>
            )}
          </div>
          <div className="flex flex-col">
            <h2 className="text-xl md:text-2xl font-bold text-white">{username}</h2>
            <p className="text-xs md:text-sm text-gray-400">Joined {joinedDate}</p>
          </div>
        </div>
        <Button asChild variant="ghost" className="text-vanta-neon-blue hover:text-vanta-neon-blue hover:bg-transparent text-xs md:text-sm font-semibold p-0 h-auto">
          <Link to="/users/edit-profile">
            Edit <span className="hidden md:inline ml-1">Profile</span> <ExternalLink size={14} className="inline-block ml-1" />
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-4 gap-2 md:gap-4 text-center border-t border-gray-700/50 pt-4 md:pt-6">
        <div>
          <p className="text-xs md:text-sm text-gray-400">Rank</p>
          <p className="text-lg md:text-xl font-bold text-vanta-neon-blue">{rank}</p>
        </div>
        <div>
          <p className="text-xs md:text-sm text-gray-400">Games</p>
          <p className="text-lg md:text-xl font-bold text-white">{gamesPlayed}</p>
        </div>
        <div>
          <p className="text-xs md:text-sm text-gray-400">Winrate</p>
          <p className="text-lg md:text-xl font-bold text-white">{winRate}%</p>
        </div>
        <div>
          <p className="text-xs md:text-sm text-gray-400">Wins</p>
          <p className="text-lg md:text-xl font-bold text-white">{wins}</p>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;