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
    <div className={cn("bg-vanta-blue-medium rounded-[27px] p-6 shadow-lg text-vanta-text-light flex flex-col", className)}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={avatarUrl || "/images/profile/Profile.png"} alt={username} /> {/* Use provided avatarUrl or default */}
            <AvatarFallback className="bg-vanta-neon-blue text-vanta-blue-dark text-2xl">
              {username.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <h2 className="text-2xl font-bold text-white">{username}</h2>
            <p className="text-sm text-gray-400">Joined {joinedDate}</p>
          </div>
        </div>
        <Button asChild variant="ghost" className="text-vanta-neon-blue hover:text-vanta-neon-blue/80 text-sm font-semibold p-0 h-auto">
          <Link to="/users/edit-profile">
            Edit Profile <ExternalLink size={16} className="inline-block ml-1" />
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-4 gap-4 text-center border-t border-gray-700/50 pt-6">
        <div>
          <p className="text-sm text-gray-400">Rank</p>
          <p className="text-xl font-bold text-vanta-neon-blue">{rank}</p>
        </div>
        <div>
          <p className="text-sm text-gray-400">Games</p>
          <p className="text-xl font-bold text-white">{gamesPlayed}</p>
        </div>
        <div>
          <p className="text-sm text-gray-400">Winrate</p>
          <p className="text-xl font-bold text-white">{winRate}%</p>
        </div>
        <div>
          <p className="text-sm text-gray-400">Wins</p>
          <p className="text-xl font-bold text-white">{wins}</p>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;