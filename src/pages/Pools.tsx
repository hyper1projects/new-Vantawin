"use client";

import React from 'react';
import SectionHeader from '../components/SectionHeader';
import PoolCard from '../components/PoolCard';
import { usePools } from '../hooks/usePools';
const Pools = () => {
  const { pools: fetchedPools, loading, error } = usePools();

  if (loading) {
    return <div className="p-8 text-center text-vanta-text-light">Loading pools...</div>;
  }

  if (error) {
    return <div className="p-8 text-center text-red-500">Error loading pools: {error}</div>;
  }

  // Filter pools from fetched data
  const ongoingPools = fetchedPools.filter(pool => pool.status === 'ongoing');
  const upcomingPools = fetchedPools.filter(pool => pool.status === 'upcoming');
  const endedPools = fetchedPools.filter(pool => pool.status === 'ended');

  const PoolSection = ({ title, pools }: { title: string, pools: typeof fetchedPools }) => (
    <div className="mb-12">
      <SectionHeader title={title} className="mb-6" textColor="text-vanta-text-light" />
      <div className="relative w-full">
        <div className="flex overflow-x-auto space-x-4 px-4 pb-4 [-webkit-scrollbar:none] [scrollbar-width:none]">
          {pools.length > 0 ? (
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
      <PoolSection title="Ongoing Pools" pools={ongoingPools} />
      <PoolSection title="Upcoming Pools" pools={upcomingPools} />
      <PoolSection title="Ended Pools" pools={endedPools} />
    </div>
  );
};

export default Pools;