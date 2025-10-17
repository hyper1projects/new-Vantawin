"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Bell, Settings, ChevronDown } from 'lucide-react';

const MainHeader = () => {
  const sportsCategories = ['All Sports', 'Football', 'Basketball', 'Esports', 'Tennis', 'Baseball'];
  const [activeCategory, setActiveCategory] = useState('All Sports');

  return (
    <div className="fixed top-0 left-0 w-full h-16 flex items-center justify-between pl-0 pr-8 border-b border-gray-700 bg-vanta-blue-dark z-50">
      {/* Left Section: Sports Categories */}
      <div className="flex items-center space-x-8">
        {sportsCategories.map((category) => (
          <Button
            key={category}
            variant="ghost"
            className={`text-vanta-text-light hover:text-vanta-accent-blue ${activeCategory === category ? 'text-vanta-accent-blue border-b-2 border-vanta-accent-blue rounded-none' : ''}`}
            onClick={() => setActiveCategory(category)}
          >
            {category}
          </Button>
        ))}
      </div>

      {/* Right Section: Search, Notifications, Settings, Profile */}
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" className="text-vanta-text-light hover:text-vanta-accent-blue">
          <Search className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" className="text-vanta-text-light hover:text-vanta-accent-blue">
          <Bell className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" className="text-vanta-text-light hover:text-vanta-accent-blue">
          <Settings className="h-5 w-5" />
        </Button>
        <div className="flex items-center space-x-2 cursor-pointer">
          <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-sm font-semibold text-white">
            JD
          </div>
          <span className="text-vanta-text-light">John Doe</span>
          <ChevronDown className="h-4 w-4 text-vanta-text-light" />
        </div>
      </div>
    </div>
  );
};

export default MainHeader;