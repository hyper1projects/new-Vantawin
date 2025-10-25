"use client";

import React from 'react';
import { Pool } from '../types/pool';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '../lib/utils';
import { format } from 'date-fns';

interface PoolCardProps {
  pool: Pool;
}

const PoolCard: React.FC<PoolCardProps> = ({ pool }) => {
  const progress = (pool.participants / pool.maxParticipants) * 100;

  const getStatusClasses = (status: string) => {
    switch (status) {
      case 'ongoing':
        return 'bg-green-500 text-white';
      case 'upcoming':
        return 'bg-blue-500 text-white';
      case 'ended':
        return 'bg-gray-500 text-white';
      default:
        return 'bg-gray-300 text-gray-800';
    }
  };

  const getTierClasses = (tier: string) => {
    switch (tier) {
      case 'Bronze':
        return 'bg-yellow-700 text-white';
      case 'Silver':
        return 'bg-gray-400 text-gray-800';
      case 'Gold':
        return 'bg-yellow-500 text-gray-800';
      default:
        return 'bg-gray-300 text-gray-800';
    }
  };

  return (
    <div className="relative bg-[#011B47] rounded-[27px] p-4 shadow-sm flex flex-col text-vanta-text-light w-full h-full">
      <img
        src={pool.image}
        alt={pool.name}
        className="w-full h-32 object-cover rounded-t-[20px] mb-4"
      />
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-xl font-bold text-vanta-neon-blue">{pool.name}</h3>
        <span className={cn("text-xs font-semibold px-2 py-1 rounded-md", getStatusClasses(pool.status))}>
          {pool.status.toUpperCase()}
        </span>
      </div>

      {/* Removed the description paragraph */}

      <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-sm text-vanta-text-light mb-6">
        <div className="flex items-center">
          <span className="font-medium text-gray-400 mr-2">Prize Pool:</span>
          <span className="font-semibold text-vanta-neon-blue">${pool.prizePool.toLocaleString()}</span>
        </div>
        <div className="flex items-center">
          <span className="font-medium text-gray-400 mr-2">Entry Fee:</span>
          <span className="font-semibold text-vanta-neon-blue">${pool.entryFee}</span>
        </div>
        <div className="flex items-center">
          <span className="font-medium text-gray-400 mr-2">Participants:</span>
          <span className="font-semibold">{pool.participants}/{pool.maxParticipants}</span>
        </div>
        <div className="flex items-center">
          <span className="font-medium text-gray-400 mr-2">Tier:</span>
          <span className={cn("text-xs font-semibold px-2 py-1 rounded-md", getTierClasses(pool.tier))}>
            {pool.tier}
          </span>
        </div>
        <div className="flex items-center col-span-2">
          <span className="font-medium text-gray-400 mr-2">Starts:</span>
          <span className="font-semibold">{format(new Date(pool.startTime), 'MMM dd, yyyy HH:mm')}</span>
        </div>
        <div className="flex items-center col-span-2">
          <span className="font-medium text-gray-400 mr-2">Ends:</span>
          <span className="font-semibold">{format(new Date(pool.endTime), 'MMM dd, yyyy HH:mm')}</span>
        </div>
      </div>

      <div className="mb-4">
        <Progress value={progress} className="w-full h-2 bg-[#01112D]" indicatorClassName="bg-vanta-neon-blue" />
        <p className="text-right text-xs text-gray-400 mt-1">{progress.toFixed(0)}% Full</p>
      </div>

      <Button className="w-full bg-vanta-neon-blue text-vanta-blue-dark hover:bg-vanta-neon-blue/90 rounded-[12px] py-2 text-sm font-semibold mt-auto">
        {pool.status === 'ongoing' ? 'Join Pool' : pool.status === 'upcoming' ? 'View Details' : 'View Results'}
      </Button>
    </div>
  );
};

export default PoolCard;