"use client";

import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, DollarSign, Users, Wallet, Clock } from 'lucide-react'; // Import necessary icons
import { allPoolsData } from '../data/pools'; // Import centralized pool data
import PoolHeader from '../components/PoolHeader'; // New component
import PoolInfoCard from '../components/PoolInfoCard'; // New component
import PoolPrizesSection from '../components/PoolPrizesSection'; // New component
import PoolStatsCard from '../components/PoolStatsCard'; // New component
import { formatDistanceToNowStrict, addDays } from 'date-fns'; // For time left calculation

const PoolDetails: React.FC = () => {
  const { poolId } = useParams<{ poolId: string }>();
  const navigate = useNavigate();

  const pool = allPoolsData.find(p => p.id === poolId);

  if (!pool) {
    return (
      <div className="p-4 text-vanta-text-light text-center">
        <h1 className="text-2xl font-bold mb-4">Pool Not Found</h1>
        <p className="mb-4">The pool you are looking for does not exist.</p>
        <Button onClick={() => navigate('/pools')} className="bg-vanta-neon-blue text-vanta-blue-dark hover:bg-vanta-neon-blue/90 rounded-[12px]">
          Go to Pools
        </Button>
      </div>
    );
  }

  // Calculate time left
  const endTime = new Date(pool.endTime);
  const now = new Date();
  let timeLeftText = '';
  if (pool.status === 'ongoing' || pool.status === 'upcoming') {
    if (endTime > now) {
      timeLeftText = formatDistanceToNowStrict(endTime, { addSuffix: true });
    } else {
      timeLeftText = 'Ended';
    }
  } else {
    timeLeftText = 'Ended';
  }

  const slotsLeft = pool.maxParticipants ? pool.maxParticipants - pool.participants : 0;

  return (
    <div className="p-0 text-vanta-text-light w-full relative">
      {/* Back button */}
      <div className="absolute top-4 left-4 z-20">
        <Button
          onClick={() => navigate(-1)}
          variant="ghost"
          className="text-vanta-neon-blue hover:bg-vanta-accent-dark-blue flex items-center gap-2"
        >
          <ArrowLeft size={20} /> Back to Pools
        </Button>
      </div>

      {/* Pool Header with Image and Title */}
      <PoolHeader pool={pool} />

      <div className="p-8 max-w-7xl mx-auto flex flex-col lg:flex-row lg:space-x-8"> {/* Main content wrapper with flex for desktop */}
        {/* Left Column (for Info and Rules) */}
        <div className="flex-1 lg:w-2/3">
          {/* Info Section */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6">INFO</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6"> {/* Changed to lg:grid-cols-2 for 2x2 layout */}
              <PoolInfoCard
                icon={DollarSign}
                title="PRIZE POOL"
                value={`$${pool.prizePool.toLocaleString()}`}
                tooltipText="Total prize money to be distributed among winners."
              />
              <PoolInfoCard
                icon={Users}
                title="PARTICIPANTS"
                value={`${pool.participants} Joined`}
                tooltipText="Number of players currently participating in this pool."
              />
              <PoolInfoCard
                icon={Wallet}
                title="ENTRY FEE"
                value={`$${pool.entryFee}`}
                tooltipText="Cost to join this prediction pool."
              />
              <PoolInfoCard
                icon={Clock}
                title="TIME LEFT"
                value={timeLeftText}
                tooltipText="Remaining time until the pool closes for new entries or ends."
              />
            </div>
          </div>

          {/* Pool Rules & Regulations */}
          <div className="bg-[#011B47] rounded-[18px] p-6 mb-12 lg:mb-0"> {/* Added mb-12 for mobile, mb-0 for desktop */}
            <h2 className="text-2xl font-bold text-white mb-4">POOL RULES & REGULATIONS</h2>
            <h3 className="text-lg font-semibold text-gray-300 mb-2">Quick Rules:</h3>
            <p className="text-gray-400 leading-relaxed">{pool.rules}</p>
          </div>
        </div>

        {/* Right Column (for Prizes and Pool Stats) */}
        <div className="lg:w-1/3 flex flex-col space-y-6">
          <PoolStatsCard players={pool.participants} slotsLeft={slotsLeft} />
          <PoolPrizesSection pool={pool} />
        </div>
      </div>
    </div>
  );
};

export default PoolDetails;