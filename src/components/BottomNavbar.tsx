"use client";

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Gamepad2, Trophy, Users, User } from 'lucide-react'; // Import User icon
import { useAdmin } from '../hooks/useAdmin';
import { cn } from '@/lib/utils';

const BottomNavbar: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { name: "Home", icon: Home, path: "/" },
    { name: "Games", icon: Gamepad2, path: "/games" },
    { name: "Pools", icon: Trophy, path: "/pools" },
    { name: "Leaderboard", icon: Users, path: "/leaderboard" },
    { name: "Profile", icon: User, path: "/users" }, // Changed from Wallet to Profile, and path to /users
  ];

  const { isAdmin } = useAdmin();

  if (isAdmin) {
    navItems.push({ name: "Admin", icon: Trophy, path: "/admin" });
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[#011B47] border-t border-vanta-blue-medium p-2 z-50 lg:hidden">
      <div className="flex justify-around items-center h-full">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={cn(
                "flex flex-col items-center justify-center p-2 min-w-[44px] min-h-[44px] rounded-md transition-colors duration-200",
                isActive ? "text-vanta-neon-blue" : "text-vanta-text-light hover:text-vanta-neon-blue"
              )}
            >
              <item.icon size={24} />
              <span className="text-xs mt-1">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNavbar;