"use client";

import React from 'react';
import { Search, Bell, Settings, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';

const MainHeader = () => {
  const sportsCategories = ['Football', 'Basketball', 'Esports', 'Tennis', 'Cricket'];

  return (
    <div className="w-full h-16 flex items-center justify-between pl-0 pr-8 border-b border-gray-700">
      {/* Left Section: Sports Categories */}
      <div className="flex items-center space-x-8">
        {sportsCategories.map((category) => (
          <Button key={category} variant="ghost" className="text-vanta-text-light hover:bg-vanta-blue-medium">
            {category}
          </Button>
        ))}
      </div>

      {/* Middle Section: Search Bar */}
      <div className="flex-grow max-w-md mx-8 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <Input
          type="text"
          placeholder="Search for matches, teams, or players..."
          className="w-full pl-10 pr-4 py-2 rounded-full bg-vanta-blue-medium border-none text-vanta-text-light placeholder-gray-400 focus:ring-2 focus:ring-vanta-accent-blue"
        />
      </div>

      {/* Right Section: User Actions */}
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" className="text-vanta-text-light hover:bg-vanta-blue-medium">
          <Bell size={20} />
        </Button>
        <Button variant="ghost" size="icon" className="text-vanta-text-light hover:bg-vanta-blue-medium">
          <Settings size={20} />
        </Button>
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
};

export default MainHeader;