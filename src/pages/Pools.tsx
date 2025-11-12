"use client";

import React from 'react';
import SectionHeader from '../components/SectionHeader';
import PoolCard from '../components/PoolCard';
import { Pool } from '../types/pool';
import { Button } from '@/components/ui/button'; // Import Button
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const Pools = () => {
  const navigate = useNavigate(); // Initialize useNavigate

  // Dummy data for pools
  const allPools: Pool[] = [
    {
      id: 'pool-1',
      name: 'Bronze Pool I',
      status: 'ongoing',
      prizePool: 50000,
      entryFee: 50,
      participants: 120,
      maxParticipants: 200,
      startTime: '2024-10-20T10:00:00Z',
      endTime: '2024-11-30T23:59:59Z',
      description: 'Predict the outcomes of Premier League matches this month!',
      image: '/images/carousel/NG-1MCasinoTournament2610.jpeg',
      tier: 'Bronze',
    },
    {
      id: 'pool-2',
      name: 'Silver Pool I',
      status: 'ongoing',
      prizePool: 250000,
      entryFee: 250,
      participants: 85,
      maxParticipants: 150,
      startTime: '2024-10-25T19:00:00Z',
      endTime: '2024-12-15T23:59:59Z',
      description: 'Compete in the ultimate Champions League prediction challenge.',
      image: '/images/carousel/NG-VARPAYOUT.jpg',
      tier: 'Silver',
    },
    {
      id: 'pool-3',
      name: 'Gold Pool I',
      status: 'upcoming',
      prizePool: 1000000,
      entryFee: 1000,
      participants: 0,
      maxParticipants: 300,
      startTime: '2024-12-01T09:00:00Z',
      endTime: '2025-01-31T23:59:59Z',
      description: 'Get ready for the next round of World Cup qualifiers!',
      image: '/images/carousel/carousel-image-1.jpg',
      tier: 'Gold',
    },
    {
      id: 'pool-4',
      name: 'Bronze Pool II',
      status: 'upcoming',
      prizePool: 75000,
      entryFee: 75,
      participants: 0,
      maxParticipants: 100,
      startTime: '2025-05-01T12:00:00Z',
      endTime: '2025-06-30T23:59:59Z',
      description: 'Predict the NBA Finals winner and bracket!',
      image: '/images/carousel/carousel-image-2.jpg',
      tier: 'Bronze',
    },
    {
      id: 'pool-5',
      name: 'Silver Pool II',
      status: 'ended',
      prizePool: 500000,
      entryFee: 500,
      participants: 250,
      maxParticipants: 250,
      startTime: '2024-06-14T15:00:00Z',
      endTime: '2024-06-26T23:59:59Z',
      description: 'The group stage predictions are over. Check results!',
      image: '/images/carousel/carousel-image-3.jpg',
      tier: 'Silver',
    },
    {
      id: 'pool-6',
      name: 'Gold Pool II',
      status: 'ended',
      prizePool: 1500000,
      entryFee: 1500,
      participants: 90,
      maxParticipants: 100,
      startTime: '2024-01-15T00:00:00Z',
      endTime: '2024-01-28T23:59:59Z',
      description: 'Australian Open predictions have concluded.',
      image: '/images/carousel/NG-1MCasinoTournament2610.jpeg',
      tier: 'Gold',
    },
    {
      id: 'pool-7',
      name: 'Bronze Pool III',
      status: 'ongoing',
      prizePool: 60000,
      entryFee: 60,
      participants: 80,
      maxParticipants: 150,
      startTime: '2024-10-22T11:00:00Z',
      endTime: '2024-11-25T23:59:59Z',
      description: 'Another exciting bronze pool!',
      image: '/images/carousel/carousel-image-1.jpg',
      tier: 'Bronze',
    },
    {
      id: 'pool-8',
      name: 'Silver Pool III',
      status: 'upcoming',
      prizePool: 300000,
      entryFee: 300,
      participants: 0,
      maxParticipants: 180,
      startTime: '2024-12-05T14:00:00Z',
      endTime: '2025-01-20T23:59:59Z',
      description: 'Prepare for the next silver tier challenge.',
      image: '/images/carousel/carousel-image-2.jpg',
      tier: 'Silver',
    },
  ];

  const ongoingPools = allPools.filter(pool => pool.status === 'ongoing');
  const upcomingPools = allPools.filter(pool => pool.status === 'upcoming');
  const endedPools = allPools.filter(pool => pool.status === 'ended');

  const handleShowMoreClick = () => {
    navigate('/pools/all'); // Navigate to the new AllPools page
  };

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
          <div className="w-full flex justify-end px-4 pt-4">
            <Button 
              className="bg-[#00EEEE] text-[#081028] hover:bg-[#00EEEE] hover:text-[#081028] rounded-[12px] px-6 py-2"
              onClick={handleShowMoreClick}
            >
              Show More
            </Button>
          </div>
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
          <div className="w-full flex justify-end px-4 pt-4">
            <Button 
              className="bg-[#00EEEE] text-[#081028] hover:bg-[#00EEEE] hover:text-[#081028] rounded-[12px] px-6 py-2"
              onClick={handleShowMoreClick}
            >
              Show More
            </Button>
          </div>
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
          <div className="w-full flex justify-end px-4 pt-4">
            <Button 
              className="bg-[#00EEEE] text-[#081028] hover:bg-[#00EEEE] hover:text-[#081028] rounded-[12px] px-6 py-2"
              onClick={handleShowMoreClick}
            >
              Show More
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pools;