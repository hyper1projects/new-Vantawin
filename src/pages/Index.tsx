"use client";

import React from 'react';
// Link is no longer needed as there's no clickable content
// import { Link } from 'react-router-dom'; 

const Index = () => {
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center gap-4 p-4">
      {/* All previous content (leaderboard link and prediction card) has been removed */}
      <p className="text-lg text-gray-500">Welcome to the homepage!</p>
      <p className="text-sm text-gray-400">Content will be added here.</p>
    </div>
  );
};

export default Index;