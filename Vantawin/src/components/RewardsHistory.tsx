"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '../lib/utils';
import { Reward } from '../types/reward'; // Import the new Reward type

type RewardFilter = 'all' | 'bonuses' | 'referrals' | 'promotions';

const dummyRewards: Reward[] = [
  {
    id: 'rwd-1',
    date: '2024-07-25 14:30',
    type: 'bonus',
    amount: 500,
    status: 'claimed',
    description: 'Welcome Bonus',
  },
  {
    id: 'rwd-2',
    date: '2024-07-24 10:00',
    type: 'referral',
    amount: 200,
    status: 'claimed',
    description: 'Friend Referral Bonus',
  },
  {
    id: 'rwd-3',
    date: '2024-07-23 18:00',
    type: 'promotion',
    amount: 1000,
    status: 'pending',
    description: 'Weekend Promo Win',
  },
  {
    id: 'rwd-4',
    date: '2024-07-22 09:00',
    type: 'bonus',
    amount: 150,
    status: 'expired',
    description: 'Daily Login Bonus',
  },
];

const RewardsHistory: React.FC = () => {
  const [activeRewardFilter, setActiveRewardFilter] = useState<RewardFilter>('all');

  const getRewardFilterButtonClasses = (filter: RewardFilter) => {
    const isActive = activeRewardFilter === filter;
    return cn(
      "relative text-base font-semibold pb-2",
      isActive
        ? "text-vanta-neon-blue after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-vanta-neon-blue"
        : "text-gray-400 hover:text-white"
    );
  };

  const filteredRewards = dummyRewards.filter(reward => {
    if (activeRewardFilter === 'all') return true;
    if (activeRewardFilter === 'bonuses' && reward.type === 'bonus') return true;
    if (activeRewardFilter === 'referrals' && reward.type === 'referral') return true;
    if (activeRewardFilter === 'promotions' && reward.type === 'promotion') return true;
    return false;
  });

  return (
    <div className="bg-vanta-blue-medium p-6 rounded-[27px] shadow-sm text-vanta-text-light w-full">
      {/* Reward Filter Buttons */}
      <div className="flex space-x-6 mb-6 border-b border-gray-700 pb-4">
        <Button variant="ghost" className={getRewardFilterButtonClasses('all')} onClick={() => setActiveRewardFilter('all')}>
          All Rewards
        </Button>
        <Button variant="ghost" className={getRewardFilterButtonClasses('bonuses')} onClick={() => setActiveRewardFilter('bonuses')}>
          Bonuses
        </Button>
        <Button variant="ghost" className={getRewardFilterButtonClasses('referrals')} onClick={() => setActiveRewardFilter('referrals')}>
          Referrals
        </Button>
        <Button variant="ghost" className={getRewardFilterButtonClasses('promotions')} onClick={() => setActiveRewardFilter('promotions')}>
          Promotions
        </Button>
      </div>

      {/* Reward History Table Header */}
      <div className="grid grid-cols-5 gap-4 text-sm font-semibold text-gray-400 mb-4">
        <span>Date</span>
        <span>Type</span>
        <span>Amount</span>
        <span>Status</span>
        <span className="text-right">Description</span>
      </div>

      {/* Reward Entries */}
      {filteredRewards.length > 0 ? (
        <div className="space-y-3">
          {filteredRewards.map((reward) => (
            <div key={reward.id} className="grid grid-cols-5 gap-4 items-center text-sm py-2 px-3 rounded-lg hover:bg-[#012A5E]">
              <span>{reward.date.split(' ')[0]}</span> {/* Display only date */}
              <span className="capitalize">{reward.type}</span>
              <span className="text-vanta-neon-blue">₦{reward.amount.toLocaleString()}</span>
              <span className={cn(
                "capitalize",
                reward.status === 'claimed' && 'text-green-400',
                reward.status === 'pending' && 'text-yellow-400',
                reward.status === 'expired' && 'text-red-400'
              )}>
                {reward.status}
              </span>
              <span className="text-right text-gray-400">{reward.description}</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-400 text-lg mt-12">
          No rewards to show yet
        </div>
      )}
    </div>
  );
};

export default RewardsHistory;