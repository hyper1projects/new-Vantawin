"use client";

import React from 'react';
import { Pool } from '../types/pool';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '../lib/utils';
import { format } from 'date-fns';
import { Link } from 'react-router-dom'; // Import Link

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
      case 'Platinum':
        return 'bg-blue-100 text-blue-900 border border-blue-300 shadow-[0_0_10px_rgba(255,255,255,0.5)]'; // Distinctive shiny look
      default:
        return 'bg-gray-300 text-gray-800';
    }
  };

  // Function to format prize pool
  const formatPrizePool = (amount: number) => {
    if (!amount) return '0';
    if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(1)}M`;
    }
    if (amount >= 1000) {
      return `${(amount / 1000).toFixed(1)}K`; // Changed to 1 decimal for better precision
    }
    return amount.toString();
  };

  return (
    <Link to={`/pools/${pool.id}`} className="relative bg-[#011B47] rounded-[27px] p-4 shadow-sm flex flex-col text-vanta-text-light w-[300px] h-full flex-shrink-0 cursor-pointer hover:scale-[1.02] transition-transform duration-200">
      <img
        src={pool.image}
        alt={pool.name}
        className="w-full h-32 object-cover rounded-t-[27px] absolute top-0 left-0 right-0"
      />
      <div className="pt-36 flex justify-between items-center mb-2">
        <h3 className="text-xl font-bold text-vanta-neon-blue">{pool.name}</h3>
        <span className={cn("text-xs font-semibold px-2 py-1 rounded-md", getStatusClasses(pool.status))}>
          {pool.status.toUpperCase()}
        </span>
      </div>

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
          <span className="font-semibold">{pool.participants}/{pool.maxParticipants}</span>
        </div>
        <div className="flex items-center">
          <span className="font-medium text-gray-400 mr-2">Tier:</span>
          <span className={cn("text-xs font-semibold px-2 py-1 rounded-md", getTierClasses(pool.tier))}>
            {pool.tier}
          </span>
        </div>
      </div>

      <Button
        className="w-full mt-auto bg-vanta-neon-blue text-vanta-blue-dark hover:bg-vanta-neon-blue/90 font-bold z-10 relative"
        onClick={async (e) => {
          e.preventDefault();
          e.stopPropagation();

          try {
            const { data: { user } } = await import('@/integrations/supabase/client').then(m => m.supabase.auth.getUser());
            if (!user) {
              alert("Please login to join");
              return;
            }

            // Call join_pool RPC
            const { error: joinError } = await import('@/integrations/supabase/client').then(m => m.supabase.rpc('join_pool', {
              p_pool_id: pool.id,
              p_user_id: user.id
            }));

            if (joinError) {
              throw joinError;
            }

            alert("Successfully joined the pool!");
            window.location.reload(); // Refresh to update UI counts
          } catch (err: any) {
            console.error("Join Error:", err);
            alert(`Failed to join: ${err.message}`);
          }
        }}
      >
        Join Now
      </Button>
    </Link>
  );
};

export default PoolCard;