"use client";

import React from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import { Button } from './ui/button'; // Assuming Button component is available

const Navbar = () => {
  const sportsCategories = [
    'Football',
    'Basketball',
    'Tennis',
    'A.Football',
    'Golf',
  ];

  return (
    <div className="fixed top-0 left-0 w-full h-16 bg-vanta-blue-dark border-b border-vanta-border flex items-center justify-between px-4 z-40">
      {/* Left Section: Sports Categories and How it Works */}
      <div className="flex items-center space-x-6">
        {sportsCategories.map((category) => (
          <Link key={category} to={`/sports/${category.toLowerCase().replace('.', '')}`} className="text-vanta-text-light hover:text-vanta-green transition-colors text-sm font-medium">
            {category}
          </Link>
        ))}
        <Link to="/how-it-works" className="text-vanta-text-light hover:text-vanta-green transition-colors text-sm font-medium">
          How it Works
        </Link>
      </div>

      {/* Right Section: Search, Login, Register */}
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" className="text-vanta-text-light hover:bg-vanta-blue-light">
          <Search className="h-5 w-5" />
        </Button>
        <Button variant="outline" className="bg-transparent border-vanta-green text-vanta-green hover:bg-vanta-green hover:text-vanta-blue-dark">
          Login
        </Button>
        <Button className="bg-vanta-green text-vanta-blue-dark hover:bg-vanta-green/90">
          Register
        </Button>
      </div>
    </div>
  );
};

export default Navbar;