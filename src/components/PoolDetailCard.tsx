"use client";

import React from 'react';
import { Pool } from '../types/pool';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '../lib/utils';
import { format } from 'date-fns';

interface PoolDetailCardProps {
  pool: Pool;
}

const PoolDetailCard: React.FC<PoolDetailCardProps> = ({ pool }) => {
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
      case 'Gold': // Gold also uses yellow, but a brighter one
        return 'bg-yellow-500 text-gray-800';
      default:
        return 'bg-gray-300 text-gray-800';
    }
  };

  const formatPrizePool = (amount: number) => {
    if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(1)}M`;
    }
    return `${(amount / 1000).toFixed(0)}K`;
  };

  return (
    <div className="relative bg-[#011B47] rounded-[27px] p-6 shadow-lg flex flex-col text-vanta-text-light w-full">
      <div className="relative w-full h-48 mb-4 rounded-t-[27px] overflow-hidden">
        <img
          src={pool.image}
          alt={pool.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-4 right-4">
          <span className={cn("text-xs font-semibold px-3 py-1 rounded-md", getStatusClasses(pool.status))}>
            {pool.status.toUpperCase()}
          </span>
        </div>
      </div>

      <h3 className="text-2xl font-bold text-vanta-neon-blue mb-2">{pool.name}</h3>
      <p className="text-gray-400 text-sm mb-4 flex-grow">{pool.description}</p>

      <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-sm text-vanta-text-light mb-6">
        <div className="flex items-center">
          <span className="font-medium text-gray-400 mr-2">Prize Pool:</span>
          <span className="font-semibold text-vanta-neon-blue">${formatPrizePool(pool.prizePool)}</span>
        </div>
        <div className="flex items-center">
          <span className="font-medium text-gray-400 mr-2">Entry Fee:</span>
          <span className="font-semibold text-vanta-neon-blue">${pool.entryFee}</span>
        </div>
        <div className="flex items-center">
          <span className="font-medium text-gray-400 mr-2">Participants:</span>
          <span className="font-semibold">{pool.participants}/{pool.maxParticipants || 'N/A'}</span>
        </div>
        <div className="flex items-center">
          <span className="font-medium text-gray-400 mr-2">Tier:</span>
          <span className={cn("text-xs font-semibold px-3 py-1 rounded-md", getTierClasses(pool.tier))}>
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

      {pool.status === 'ongoing' && (
        <div className="mb-6">
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>Progress</span>
            <span>{progress.toFixed(0)}% Full</span>
          </div>
          <Progress value={progress} className="h-2 bg-gray-700 [&>*]:bg-vanta-neon-blue" />
        </div>
      )}

      {/* New section for Rules and Regulations */}
      <div className="mb-6">
        <h4 className="text-lg font-bold text-white mb-2">Rules & Regulations</h4>
        <p className="text-gray-300 text-sm leading-relaxed">{pool.rules}</p>
      </div>

      <Button className="w-full bg-vanta-neon-blue text-vanta-blue-dark hover:bg-vanta-neon-blue/90 rounded-[14px] py-3 text-lg font-bold mt-auto">
        {pool.status === 'ongoing' ? 'Join Pool' : pool.status === 'upcoming' ? 'View Details' : 'View Results'}
      </Button>
    </div>
  );
};

export default PoolDetailCard;