"use client";

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import ProfileCard from '../components/ProfileCard'; // Import the new ProfileCard
import ProfitLossCard from '../components/ProfitLossCard'; // Import the updated ProfitLossCard
import UserTabs from '../components/UserTabs'; // Import the new UserTabs
import { format } from 'date-fns'; // For date formatting

const Users: React.FC = () => {
  const { user, username, isLoading } = useAuth();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="p-4 text-vanta-text-light text-center">
        <p>Loading user data...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-4 text-vanta-text-light text-center">
        <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
        <p className="mb-4">Please log in to view your profile.</p>
        <Button onClick={() => navigate('/login')} className="bg-vanta-neon-blue text-vanta-blue-dark hover:bg-vanta-neon-blue/90 rounded-[14px]">
          Go to Login
        </Button>
      </div>
    );
  }

  // Dummy data for profile stats (replace with actual data from backend later)
  const userStats = {
    rank: '#21',
    gamesPlayed: 21,
    winRate: 80,
    wins: 7,
    avatarUrl: '/images/profile/Profile.png', // Using the uploaded image
  };

  // Format joined date
  const joinedDate = user.created_at ? format(new Date(user.created_at), 'MMM yyyy') : 'N/A';

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <ProfileCard
          username={username || 'Guest'}
          joinedDate={joinedDate}
          rank={userStats.rank}
          gamesPlayed={userStats.gamesPlayed}
          winRate={userStats.winRate}
          wins={userStats.wins}
          avatarUrl={userStats.avatarUrl}
        />
        <ProfitLossCard />
      </div>
      <UserTabs />
    </div>
  );
};

export default Users;