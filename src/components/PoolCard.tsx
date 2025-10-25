"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Pool } from '../types/pool';
import { Users, Clock, CalendarDays } from 'lucide-react';

interface PoolCardProps {
  pool: Pool;
}

const PoolCard: React.FC<PoolCardProps> = ({ pool }) => {
  const getStatusClasses = (status: Pool['status']) => {
    switch (status) {
      case 'ongoing':
        return 'bg-green-600 text-white';
      case 'upcoming':
        return 'bg-blue-600 text-white';
      case 'ended':
        return 'bg-gray-600 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const formatDateTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    });
  };

  return (
    <div className="relative bg-vanta-blue-dark rounded-[27px] p-6 shadow-lg flex flex-col justify-between w-full max-w-sm mx-auto border border-vanta-accent-dark-blue hover:border-vanta-neon-blue transition-all duration-200">
      {pool.image && (
        <img src={pool.image} alt={pool.name} className="w-full h-32 object-cover rounded-lg mb-4" />
      )}
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-bold text-vanta-text-light">{pool.name}</h3>
        <span className={cn("px-3 py-1 rounded-full text-xs font-semibold", getStatusClasses(pool.status))}>
          {pool.status.charAt(0).toUpperCase() + pool.status.slice(1)}
        </span>
      </div>

      <p className="text-vanta-text-medium text-sm mb-4 flex-grow">{pool.description}</p>

      <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-sm text-vanta-text-light mb-6">
        <div className="flex items-center">
          <Users size={16} className="mr-2 text-vanta-neon-blue" />
          <span>Participants: {pool.participants}{pool.maxParticipants ? `/${pool.maxParticipants}` : ''}</span>
        </div>
        <div className="flex items-center">
          <span className="font-bold text-vanta-neon-blue mr-2">₦</span>
          <span>Entry Fee: {pool.entryFee.toLocaleString()}</span>
        </div>
        <div className="flex items-center col-span-2">
          <CalendarDays size={16} className="mr-2 text-vanta-neon-blue" />
          <span>Starts: {formatDateTime(pool.startTime)}</span>
        </div>
        <div className="flex items-center col-span-2">
          <Clock size={16} className="mr-2 text-vanta-neon-blue" />
          <span>Ends: {formatDateTime(pool.endTime)}</span>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <span className="text-lg font-bold text-vanta-neon-blue">
          Prize Pool: ₦{pool.prizePool.toLocaleString()}
        </span>
        <Button
          className={cn(
            "px-6 py-2 rounded-[14px] font-bold text-sm",
            pool.status === 'ongoing'
              ? "bg-vanta-neon-blue text-vanta-blue-dark hover:bg-opacity-90"
              : pool.status === 'upcoming'
              ? "bg-blue-500 text-white hover:bg-blue-600"
              : "bg-gray-500 text-white cursor-not-allowed"
          )}
          disabled={pool.status === 'ended'}
        >
          {pool.status === 'ongoing' ? 'Join Pool' : pool.status === 'upcoming' ? 'View Details' : 'Ended'}
        </Button>
      </div>
    </div>
  );
};

export default PoolCard;