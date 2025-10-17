"use client";

import React from 'react';
import { Link } from 'react-router-dom';
import { Search, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const MainHeader = () => {
  const sportsCategories = ['Football', 'Basketball', 'Tennis', 'A.Football', 'Golf'];

  return (
    <div className="fixed top-0 left-60 right-0 h-16 flex items-center justify-between px-8 pr-20 border-b border-gray-700 z-50 font-outfit">
      {/* Left Section: Sports Categories and How It Works */}
      <div className="flex items-center space-x-6">
        {sportsCategories.map((category) => (
          <Link key={category} to={`/sports/${category.toLowerCase().replace('.', '')}`}>
            <Button
              variant="ghost"
              className={`font-medium text-base ${category === 'Football' ? 'text-vanta-accent-blue' : 'text-vanta-off-white'} hover:bg-transparent p-0 h-auto`} {/* Changed font-bold to font-medium and text-white to text-vanta-off-white */}
            >
              {category}
            </Button>
          </Link>
        ))}
        {/* How It Works link */}
        <Link to="/how-it-works" className="flex items-center space-x-1 ml-4">
          <AlertCircle size={18} className="text-vanta-accent-blue" />
          <Button variant="ghost" className="text-vanta-accent-blue font-medium text-base hover:bg-transparent p-0 h-auto"> {/* Changed font-bold to font-medium */}
            How it works
          </Button>
        </Link>
      </div>

      {/* Middle Section: Search Bar */}
      <div className="flex-grow max-w-lg mx-8 relative bg-vanta-accent-blue rounded-full h-10 flex items-center">
        <Search className="absolute left-3 text-black" size={18} />
        <Input
          type="text"
          placeholder="Search for matches, teams, or players..."
          className="w-full pl-10 pr-4 py-2 rounded-full bg-transparent border-none text-black placeholder-black/70 focus:ring-0"
        />
      </div>

      {/* Right Section: Login, Register */}
      <div className="flex items-center space-x-4">
        <Link to="/login">
          <Button className="bg-black text-vanta-off-white border border-vanta-accent-blue rounded-full px-6 py-2 font-medium text-sm hover:bg-vanta-blue-medium"> {/* Changed text-white to text-vanta-off-white and font-bold to font-medium */}
            Login
          </Button>
        </Link>
        <Link to="/register">
          <Button className="bg-vanta-accent-blue text-black rounded-full px-6 py-2 font-medium text-sm hover:bg-vanta-accent-blue/80"> {/* Changed font-bold to font-medium */}
            Register
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default MainHeader;