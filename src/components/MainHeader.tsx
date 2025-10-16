"use client";

import React from 'react';
import { Link } from 'react-router-dom';
import { Info } from 'lucide-react';
import SearchInput from './SearchInput'; // Assuming SearchInput is a component

const MainHeader = () => {
  const sportsCategories = [
    { name: 'Football', path: '/football' },
    { name: 'Basketball', path: '/basketball' },
    { name: 'Tennis', 'path': '/tennis' },
    { name: 'Esports', path: '/esports' },
  ];

  return (
    <div className="w-full h-16 flex items-center justify-between pl-0 pr-8 border-b border-gray-700">
      {/* Left Section: Sports Categories */}
      <div className="flex items-center space-x-8">
        {sportsCategories.map((category) => (
          <Link
            key={category.name}
            to={category.path}
            className="text-vanta-text-light hover:text-vanta-neon-blue transition-colors font-outfit text-base"
          >
            {category.name}
          </Link>
        ))}
      </div>

      {/* Right Section: How to Play, Search, Login, and Register */}
      <div className="flex items-center space-x-4">
        <Link to="/how-to-play" className="flex items-center gap-1 text-vanta-neon-blue hover:text-vanta-text-light transition-colors font-outfit text-base">
          <Info size={18} />
          How to Play
        </Link>
        <SearchInput />
        <Link
          to="/login"
          className="px-4 py-2 rounded-[14px] border border-[#00eeee] text-white hover:bg-[#00eeee] hover:text-[#081028] transition-colors font-outfit text-base"
        >
          Login
        </Link>
        <Link
          to="/register"
          className="px-4 py-2 rounded-[14px] bg-[#00eeee] text-[#081028] hover:opacity-90 transition-opacity font-outfit text-base"
        >
          Register
        </Link>
      </div>
    </div>
  );
};

export default MainHeader;