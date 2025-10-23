"use client";

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const MainHeader: React.FC = () => {
  const sportsCategories = ['Football', 'Basketball', 'Tennis', 'A.Football', 'Golf'];
  const location = useLocation();
  const currentPath = location.pathname;

  // Function to determine if a category is active
  const isActive = (category: string) => {
    const categorySlug = category.toLowerCase().replace('.', '');
    return currentPath.startsWith(`/sports/${categorySlug}`);
  };

  return (
    <div className="fixed top-0 left-60 right-0 h-16 flex items-center justify-between px-8 pr-20 border-b border-gray-700 z-50 font-outfit bg-vanta-blue-dark">
      {/* Left Section: Sports Categories and How to play */}
      <div className="flex items-center space-x-6">
        {sportsCategories.map((category) => (
          <Link key={category} to={`/sports/${category.toLowerCase().replace('.', '')}`}>
            <Button
              variant="ghost"
              className={`font-medium text-sm ${isActive(category) ? 'text-[#00EEEE]' : 'text-[#B4B2C0]'} hover:bg-transparent p-0 h-auto`}
            >
              {category}
            </Button>
          </Link>
        ))}
        {/* How to play link */}
        <Link to="/how-to-play" className="flex items-center space-x-1 ml-4">
          <AlertCircle size={18} className="text-[#00EEEE]" />
          <Button variant="ghost" className="text-[#02A7B4] font-medium text-sm hover:bg-transparent p-0 h-auto">
            How to play
          </Button>
        </Link>
      </div>

      {/* Middle Section: Search Bar */}
      <div className="flex-grow max-w-lg mx-8 relative bg-[#053256] rounded-[14px] h-10 flex items-center">
        <Search className="absolute left-3 text-[#00EEEE]" size={18} />
        <Input
          type="text"
          placeholder="Search..."
          className="w-full pl-10 pr-4 py-2 rounded-[14px] bg-transparent border-none text-white placeholder-white/70 focus:ring-0"
        />
      </div>

      {/* Right Section: Login, Register */}
      <div className="flex items-center space-x-4">
        <Link to="/login">
          <Button className="bg-transparent text-white border border-[#00EEEE] rounded-[14px] px-6 py-2 font-bold text-sm hover:bg-[#00EEEE]/10">
            Login
          </Button>
        </Link>
        <Link to="/register">
          <Button className="bg-[#00EEEE] text-[#081028] rounded-[14px] px-6 py-2 font-bold text-sm hover:bg-[#00EEEE]/80">
            Sign up
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default MainHeader;