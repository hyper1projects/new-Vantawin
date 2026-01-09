"use client";

import React from 'react';
import SectionHeader from '../components/SectionHeader';
import PoolCard from '../components/PoolCard';
import { PoolCardSkeleton } from '../components/skeletons/PoolCardSkeleton';
import { usePools } from '../hooks/usePools';
const Pools = () => {
  const { pools: fetchedPools, myPoolIds, loading, error } = usePools();

  // if (loading) return ... handled below

  // Filter pools from fetched data
  const myPools = fetchedPools.filter(pool => myPoolIds.includes(pool.id));
  const ongoingPools = fetchedPools.filter(pool => pool.status === 'ongoing');
  const upcomingPools = fetchedPools.filter(pool => pool.status === 'upcoming');
  const endedPools = fetchedPools.filter(pool => pool.status === 'ended');

  const PoolSection = ({ title, pools, isLoading, showEmpty = false }: { title: string, pools: typeof fetchedPools, isLoading: boolean, showEmpty?: boolean }) => {
    if (!isLoading && pools.length === 0 && !showEmpty) return null; // Hide empty sections by default unless forced

    // Sort pools: Joined pools first
    const sortedPools = [...pools].sort((a, b) => {
      const aJoined = myPoolIds.includes(a.id);
      const bJoined = myPoolIds.includes(b.id);
      if (aJoined && !bJoined) return -1;
      if (!aJoined && bJoined) return 1;
      return 0;
    });

    return (
      <div className="mb-12">
        <SectionHeader title={title} className="mb-6" textColor="text-vanta-text-light" />
        <div className="relative w-full">
          {/* Mobile: Horizontal Scroll, Desktop: Grid */}
          <div className="flex overflow-x-auto pb-4 gap-4 snap-x md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:gap-6 md:overflow-visible [-webkit-scrollbar:none] [scrollbar-width:none]">
            {isLoading ? (
              [...Array(3)].map((_, i) => (
                <div key={i} className="min-w-[280px] w-[85vw] flex-shrink-0 snap-center md:w-auto md:min-w-0">
                  <PoolCardSkeleton />
                </div>
              ))
            ) : sortedPools.length > 0 ? (
              sortedPools.map(pool => (
                <div key={pool.id} className="min-w-[280px] w-[85vw] flex-shrink-0 snap-center md:w-auto md:min-w-0 h-full">
                  <PoolCard pool={pool} isJoined={myPoolIds.includes(pool.id)} />
                </div>
              ))
            ) : (
              <p className="text-vanta-text-medium text-center col-span-full w-full">No pools found.</p>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-4 overflow-x-hidden">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <span className="w-1 h-6 bg-vanta-neon-blue rounded-full"></span>
          Pools
        </h1>
      </div>

      {/* Pools Sections */}
      <PoolSection title="Ongoing Pools" pools={ongoingPools} isLoading={loading} showEmpty={true} />
      <PoolSection title="Upcoming Pools" pools={upcomingPools} isLoading={loading} showEmpty={true} />
      <PoolSection title="Ended Pools" pools={endedPools} isLoading={loading} showEmpty={true} />
    </div>
  );
};

export default Pools;