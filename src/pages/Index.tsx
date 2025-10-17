"use client";

import React from 'react';
import LeaderboardCard from '../components/LeaderboardCard'; // Import the new component

const Index = () => {
  return (
    <div className="relative w-full h-full min-h-[calc(100vh-10rem)]"> {/* Ensure enough height for positioning */}
      <div className="absolute top-4 right-4"> {/* Position the card */}
        <LeaderboardCard />
      </div>
      {/* The rest of your homepage content will go here, below the header and to the left of the card */}
      <div className="flex flex-col items-center justify-center gap-4 pt-28"> {/* Placeholder for other content */}
        <p className="text-lg text-gray-500">Welcome to the homepage!</p>
        <p className="text-sm text-gray-400">Content will be added here.</p>
      </div>
    </div>
  );
};

export default Index;