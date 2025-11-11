"use client";

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Gamepad2, Wallet, Trophy, Users } from 'lucide-react';
import { cn } from '../lib/utils'; // For conditional class merging

const navItems = [
  { name: "Home", icon: Home, path: "/" },
  { name: "Games", icon: Gamepad2, path: "/games" },
  { name: "Pools", icon: Trophy, path: "/pools" },
  { name: "Leaderboard", icon: Users, path: "/leaderboard" },
  { name: "Wallet", icon: Wallet, path: "/wallet" },
];

const BottomNavbar: React.FC = () => {
  const location = useLocation();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-vanta-blue-dark border-t border-gray-700 h-16 flex items-center justify-around md:hidden z-50">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <Link 
            key={item.name} 
            to={item.path} 
            className={cn(
              "flex flex-col items-center justify-center flex-1 h-full text-xs font-medium transition-colors duration-200",
              isActive ? "text-vanta-neon-blue" : "text-gray-400 hover:text-white"
            )}
          >
            <item.icon size={20} className="mb-1" />
            <span>{item.name}</span>
          </Link>
        );
      })}
    </div>
  );
};

export default BottomNavbar;