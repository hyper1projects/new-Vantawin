"use client";

import React from 'react';
import { Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Info, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SportLinkProps {
  label: string;
  isActive?: boolean;
}

const SportLink: React.FC<SportLinkProps> = ({ label, isActive }) => (
  <a
    href="#"
    className={cn(
      "relative px-4 py-2 text-vanta-text-light hover:text-vanta-accent-blue transition-colors",
      isActive && "text-vanta-accent-blue"
    )}
  >
    {label}
    {isActive && (
      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-0.5 bg-vanta-accent-blue rounded-full" />
    )}
  </a>
);

const MainHeader = () => {
  const sportsCategories = [
    { name: 'Football', path: '/sports/football' },
    { name: 'Basketball', path: '/sports/basketball' },
    { name: 'Tennis', path: '/sports/tennis' },
    { name: 'A.Football', path: '/sports/a-football' },
    { name: 'Golf', path: '/sports/golf' },
  ];

  return (
    <div className="w-full h-16 bg-vanta-blue-dark border-b border-vanta-border flex items-center justify-between px-4 mb-6">
      {/* Left Section: Sports Categories */}
      <div className="flex items-center space-x-6">
        {sportsCategories.map((category) => (
          <SportLink key={category.name} label={category.name} isActive={category.name === 'Football'} />
        ))}
      </div>

      {/* Center Section: How it works & Search Bar */}
      <div className="flex items-center space-x-6">
        <Link to="/how-it-works" className="flex items-center gap-1 text-vanta-text-light hover:text-vanta-accent-blue transition-colors text-sm">
          <Info className="h-4 w-4" />
          How it works
        </Link>
        <div className="relative flex items-center">
          <Search className="absolute left-3 h-4 w-4 text-vanta-text-muted" />
          <Input
            type="text"
            placeholder="Search..."
            className="pl-9 pr-3 py-2 rounded-lg bg-vanta-blue-medium border border-vanta-border text-vanta-text-light placeholder:text-vanta-text-muted focus:outline-none focus:ring-1 focus:ring-vanta-accent-blue w-48"
          />
        </div>
      </div>

      {/* Right Section: Login & Register Buttons */}
      <div className="flex items-center space-x-4">
        <Button variant="outline" className="bg-transparent border border-vanta-accent-blue text-vanta-accent-blue hover:bg-vanta-accent-blue hover:text-white rounded-lg px-4 py-2">
          Login
        </Button>
        <Button className="bg-vanta-accent-blue text-white hover:bg-vanta-accent-blue/90 rounded-lg px-4 py-2">
          Register
        </Button>
      </div>
    </div>
  );
};

export default MainHeader;