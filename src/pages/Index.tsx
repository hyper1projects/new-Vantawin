"use client";

import React from 'react';
import TopGamesSection from '../components/TopGamesSection';
import PointsMultiplierSection from '../components/PointsMultiplierSection';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Search } from 'lucide-react';

const Index: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#06002E] text-white">
      {/* Header */}
      <header className="p-4 flex items-center justify-between">
        <div className="text-2xl font-bold">BETTER</div>
        <div className="flex items-center space-x-4">
          <Button variant="ghost" className="text-white">Login</Button>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">Sign Up</Button>
        </div>
      </header>

      {/* Search Bar */}
      <div className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <Input
            type="text"
            placeholder="Search for games, teams, leagues..."
            className="w-full pl-10 pr-4 py-2 rounded-full bg-[#1A1A40] border-none text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <main className="p-4 space-y-8">
        <TopGamesSection />
        <PointsMultiplierSection className="mt-8" /> {/* Added margin-top here */}
      </main>
    </div>
  );
};

export default Index;