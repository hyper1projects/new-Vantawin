"use client";

import React from 'react';
import SectionHeader from '../components/SectionHeader';
import PoolCard from '../components/PoolCard';
import { PoolCardSkeleton } from '../components/skeletons/PoolCardSkeleton';
import { usePools } from '../hooks/usePools';
const Pools = () => {
  const { pools: fetchedPools, loading, error } = usePools();

  // if (loading) return ... handled below

  // Filter pools from fetched data
  const ongoingPools = fetchedPools.filter(pool => pool.status === 'ongoing');
  const upcomingPools = fetchedPools.filter(pool => pool.status === 'upcoming');
  const endedPools = fetchedPools.filter(pool => pool.status === 'ended');

  const PoolSection = ({ title, pools, isLoading }: { title: string, pools: typeof fetchedPools, isLoading: boolean }) => (
    <div className="mb-12">
      <SectionHeader title={title} className="mb-6" textColor="text-vanta-text-light" />
      <div className="relative w-full">
        <div className="flex overflow-x-auto space-x-4 px-4 pb-4 [-webkit-scrollbar:none] [scrollbar-width:none]">
          {isLoading ? (
            [...Array(3)].map((_, i) => <PoolCardSkeleton key={i} />)
          ) : pools.length > 0 ? (
            pools.map(pool => <PoolCard key={pool.id} pool={pool} />)
          ) : (
            <p className="text-vanta-text-medium text-center w-full">No pools available in this section.</p>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-4">
      <PoolSection title="Ongoing Pools" pools={ongoingPools} isLoading={loading} />
      <PoolSection title="Upcoming Pools" pools={upcomingPools} isLoading={loading} />
      <PoolSection title="Ended Pools" pools={endedPools} isLoading={loading} />
    </div>
  );
};

export default Pools;