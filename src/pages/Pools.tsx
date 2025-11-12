"use client";

import React from 'react';
import SectionHeader from '../components/SectionHeader';
import PoolCard from '../components/PoolCard';
import { allPoolsData } from '../data/pools'; // Import centralized pool data
// Removed Button and useNavigate imports as they are no longer needed here

const Pools = () => {
  // Filter pools from centralized data
  const ongoingPools = allPoolsData.filter(pool => pool.status === 'ongoing');
  const upcomingPools = allPoolsData.filter(pool => pool.status === 'upcoming');
  const endedPools = allPoolsData.filter(pool => pool.status === 'ended');

  return (
    <div className="p-4">
      {/* Ongoing Pools Section */}
      <div className="mb-12">
        <SectionHeader title="Ongoing Pools" className="mb-6" textColor="text-vanta-text-light" />
        <div className="relative w-full">
          {/* Scrollable content */}
          <div className="flex overflow-x-auto space-x-4 px-4 pb-4 [-webkit-scrollbar:none] [scrollbar-width:none]">
            {ongoingPools.length > 0 ? (
              ongoingPools.map(pool => <PoolCard key={pool.id} pool={pool} />)
            ) : (
              <p className="text-vanta-text-medium text-center w-full">No ongoing pools at the moment.</p>
            )}
          </div>
          {/* Removed Show More Button */}
        </div>
      </div>

      {/* Upcoming Pools Section */}
      <div className="mb-12">
        <SectionHeader title="Upcoming Pools" className="mb-6" textColor="text-vanta-text-light" />
        <div className="relative w-full">
          {/* Scrollable content */}
          <div className="flex overflow-x-auto space-x-4 px-4 pb-4 [-webkit-scrollbar:none] [scrollbar-width:none]">
            {upcomingPools.length > 0 ? (
              upcomingPools.map(pool => <PoolCard key={pool.id} pool={pool} />)
            ) : (
              <p className="text-vanta-text-medium text-center w-full">No upcoming pools planned yet.</p>
            )}
          </div>
          {/* Removed Show More Button */}
        </div>
      </div>

      {/* Ended Pools Section */}
      <div className="mb-12">
        <SectionHeader title="Ended Pools" className="mb-6" textColor="text-vanta-text-light" />
        <div className="relative w-full">
          {/* Scrollable content */}
          <div className="flex overflow-x-auto space-x-4 px-4 pb-4 [-webkit-scrollbar:none] [scrollbar-width:none]">
            {endedPools.length > 0 ? (
              endedPools.map(pool => <PoolCard key={pool.id} pool={pool} />)
            ) : (
              <p className="text-vanta-text-medium text-center w-full">No pools have ended recently.</p>
            )}
          </div>
          {/* Removed Show More Button */}
        </div>
      </div>
    </div>
  );
};

export default Pools;