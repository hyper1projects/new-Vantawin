"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, DollarSign, Users, Wallet, Clock, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Pool } from '../types/pool';
import PoolHeader from '../components/PoolHeader';
import PoolInfoCard from '../components/PoolInfoCard';
import PoolPrizesSection from '../components/PoolPrizesSection';
import PoolStatsCard from '../components/PoolStatsCard';
import { formatDistanceToNowStrict } from 'date-fns';

const PoolDetails: React.FC = () => {
  const { poolId } = useParams<{ poolId: string }>();
  const navigate = useNavigate();
  const [pool, setPool] = useState<Pool | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPoolDetails = async () => {
      if (!poolId) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('pools')
          .select('*, tournament_entries(count)')
          .eq('id', poolId)
          .single();

        if (error) {
          throw error;
        }

        if (data) {
          const mappedPool: Pool = {
            id: data.id,
            name: data.name,
            description: data.description,
            status: data.status,
            prizePool: data.total_pot,
            entryFee: data.entry_fee,
            participants: data.tournament_entries[0]?.count ?? 0,
            maxParticipants: data.max_participants,
            startTime: data.start_time,
            endTime: data.end_time,
            image: data.image_url,
            tier: data.tier,
            rules: data.rules,
            prizeDistribution: data.prize_distribution || [],
          };
          setPool(mappedPool);
        }
      } catch (error) {
        console.error("Error fetching pool details:", error);
        setPool(null); // Ensure pool is null on error
      } finally {
        setIsLoading(false);
      }
    };

    fetchPoolDetails();
  }, [poolId]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-vanta-dark">
        <Loader2 className="w-10 h-10 text-vanta-neon-blue animate-spin" />
      </div>
    );
  }

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