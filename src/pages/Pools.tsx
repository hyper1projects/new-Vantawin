"use client";

import React from 'react';
import SectionHeader from '../components/SectionHeader';
import PoolCard from '../components/PoolCard';
import { Pool } from '../types/pool';

const Pools = () => {
  // Dummy data for pools
  const allPools: Pool[] = [
    {
      id: 'pool-1',
      name: 'Premier League Predictor',
      status: 'ongoing',
      prizePool: 500000,
      entryFee: 500,
      participants: 120,
      maxParticipants: 200,
      startTime: '2024-10-20T10:00:00Z',
      endTime: '2024-11-30T23:59:59Z',
      description: 'Predict the outcomes of Premier League matches this month!',
      image: '/images/carousel/NG-1MCasinoTournament2610.jpeg',
    },
    {
      id: 'pool-2',
      name: 'Champions League Knockout',
      status: 'ongoing',
      prizePool: 1000000,
      entryFee: 1000,
      participants: 85,
      maxParticipants: 150,
      startTime: '2024-10-25T19:00:00Z',
      endTime: '2024-12-15T23:59:59Z',
      description: 'Compete in the ultimate Champions League prediction challenge.',
      image: '/images/carousel/NG-VARPAYOUT.jpg',
    },
    {
      id: 'pool-3',
      name: 'World Cup Qualifiers',
      status: 'upcoming',
      prizePool: 750000,
      entryFee: 750,
      participants: 0,
      maxParticipants: 300,
      startTime: '2024-12-01T09:00:00Z',
      endTime: '2025-01-31T23:59:59Z',
      description: 'Get ready for the next round of World Cup qualifiers!',
      image: '/images/carousel/carousel-image-1.jpg',
    },
    {
      id: 'pool-4',
      name: 'NBA Finals Bracket',
      status: 'upcoming',
      prizePool: 600000,
      entryFee: 600,
      participants: 0,
      maxParticipants: 100,
      startTime: '2025-05-01T12:00:00Z',
      endTime: '2025-06-30T23:59:59Z',
      description: 'Predict the NBA Finals winner and bracket!',
      image: '/images/carousel/carousel-image-2.jpg',
    },
    {
      id: 'pool-5',
      name: 'Euro 2024 Group Stage',
      status: 'ended',
      prizePool: 1200000,
      entryFee: 1200,
      participants: 250,
      maxParticipants: 250,
      startTime: '2024-06-14T15:00:00Z',
      endTime: '2024-06-26T23:59:59Z',
      description: 'The group stage predictions are over. Check results!',
      image: '/images/carousel/carousel-image-3.jpg',
    },
    {
      id: 'pool-6',
      name: 'Tennis Grand Slam',
      status: 'ended',
      prizePool: 300000,
      entryFee: 300,
      participants: 90,
      maxParticipants: 100,
      startTime: '2024-01-15T00:00:00Z',
      endTime: '2024-01-28T23:59:59Z',
      description: 'Australian Open predictions have concluded.',
      image: '/images/carousel/NG-1MCasinoTournament2610.jpeg',
    },
  ];

  const ongoingPools = allPools.filter(pool => pool.status === 'ongoing');
  const upcomingPools = allPools.filter(pool => pool.status === 'upcoming');
  const endedPools = allPools.filter(pool => pool.status === 'ended');

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold text-vanta-text-light mb-8 text-left">Pools</h1>

      {/* Ongoing Pools Section */}
      <div className="mb-12">
        <SectionHeader title="Ongoing Pools" className="mb-6" textColor="text-vanta-text-light" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ongoingPools.length > 0 ? (
            ongoingPools.map(pool => <PoolCard key={pool.id} pool={pool} />)
          ) : (
            <p className="text-vanta-text-medium col-span-full text-center">No ongoing pools at the moment.</p>
          )}
        </div>
      </div>

      {/* Upcoming Pools Section */}
      <div className="mb-12">
        <SectionHeader title="Upcoming Pools" className="mb-6" textColor="text-vanta-text-light" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {upcomingPools.length > 0 ? (
            upcomingPools.map(pool => <PoolCard key={pool.id} pool={pool} />)
          ) : (
            <p className="text-vanta-text-medium col-span-full text-center">No upcoming pools planned yet.</p>
          )}
        </div>
      </div>

      {/* Ended Pools Section */}
      <div className="mb-12">
        <SectionHeader title="Ended Pools" className="mb-6" textColor="text-vanta-text-light" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {endedPools.length > 0 ? (
            endedPools.map(pool => <PoolCard key={pool.id} pool={pool} />)
          ) : (
            <p className="text-vanta-text-medium col-span-full text-center">No pools have ended recently.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Pools;