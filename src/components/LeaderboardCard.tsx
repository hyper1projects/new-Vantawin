"use client";

import React from 'react';
import { Link } from 'react-router-dom';

const LeaderboardCard: React.FC = () => {
  return (
    <Link
      to="/leaderboard"
      className="block w-[300px] h-[180px] bg-vanta-blue-medium rounded-2xl p-6 flex flex-col items-center justify-center text-center transition-transform duration-200 hover:scale-105"
    >
      <h2 className="text-2xl font-bold text-vanta-text-light mb-4">Leaderboard</h2>
      <p className="text-lg text-vanta-text-light opacity-80">Login to view leaderboard</p>
    </Link>
  );
};

export default LeaderboardCard;