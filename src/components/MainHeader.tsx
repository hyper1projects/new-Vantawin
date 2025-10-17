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
              className={`font-bold text-base ${category === 'Football' ? 'text-vanta-cyan' : 'text-vanta-grey-text'} hover:bg-transparent p-0 h-auto`} {/* Updated colors */}
            >
              {category}
            </Button>
          </Link>
        ))}
        {/* How It Works link */}
        <Link to="/how-it-works" className="flex items-center space-x-1 ml-4">
          <AlertCircle size={18} className="text-vanta-cyan" /> {/* Updated color */}
          <Button variant="ghost" className="text-vanta-cyan font-bold text-base hover:bg-transparent p-0 h-auto"> {/* Updated color */}
            How it works
          </Button>
        </Link>
      </div>

      {/* Middle Section: Search Bar */}
      <div className="flex-grow max-w-lg mx-8 relative bg-vanta-cyan rounded-full h-10 flex items-center"> {/* Updated background color */}
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
          <Button className="bg-black text-white border border-vanta-cyan rounded-full px-6 py-2 font-bold text-sm hover:bg-vanta-blue-medium"> {/* Updated border color */}
            Login
          </Button>
        </Link>
        <Link to="/register">
          <Button className="bg-vanta-cyan text-black rounded-full px-6 py-2 font-bold text-sm hover:bg-vanta-cyan/80"> {/* Updated background and hover colors */}
            Register
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default MainHeader;