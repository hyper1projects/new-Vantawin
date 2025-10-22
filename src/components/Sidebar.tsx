"use client";

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Gamepad2, Wallet, Trophy, Users, BookText, HelpCircle, Mail, ChevronRight } from 'lucide-react'; // Import ChevronRight

const Sidebar = () => {
  const location = useLocation();

  const primaryNavItems = [
    { name: "Home", icon: Home, path: "/" },
    { name: "Games", icon: Gamepad2, path: "/games" },
    { name: "Pools", icon: Trophy, path: "/pools" },
    { name: "Leaderboard", icon: Users, path: "/leaderboard" },
    { name: "Wallet", icon: Wallet, path: "/wallet" },
  ];

  const secondaryNavItems = [
    { name: "Terms of Use", icon: BookText, path: "/terms" },
    { name: "Help and Information", icon: HelpCircle, path: "/help" },
    { name: "Contact Us", icon: Mail, path: "/contact" },
  ];

  return (
    <div className="fixed left-0 top-0 h-screen w-60 bg-vanta-blue-dark text-vanta-text-light flex flex-col z-50 rounded-r-2xl font-outfit">
      <div className="bg-vanta-blue-medium rounded-r-2xl flex flex-col gap-2 flex-grow">
        <div className="flex items-center justify-center p-4 mb-4">
          <span className="text-xl font-bold text-vanta-text-light">VANTA</span>
          <span className="text-xl font-bold text-vanta-neon-blue">WIN</span>
        </div>

        {/* Primary Navigation Items */}
        <div className="px-4 flex flex-col gap-y-3">
          {primaryNavItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`relative flex items-center gap-4 py-2 pr-3 rounded-md text-vanta-text-light transition-colors overflow-hidden
                  ${isActive ? 'bg-vanta-accent-dark-blue pl-4' : 'hover:bg-vanta-accent-dark-blue pl-3'}
                `}
              >
                {isActive && (
                  // FIX APPLIED: Made bar 2px wide (w-[2px]) and used explicit 8px rounding
                  <div className="absolute left-0 top-1 bottom-1 w-[2px] bg-vanta-neon-blue rounded-[8px]"></div>
                )}
                <item.icon size={18} />
                <span className="text-base font-medium">{item.name}</span>
              </Link>
            );
          })}
        </div>

        {/* Secondary Navigation Items pushed to the bottom */}
        <div className="mt-auto flex flex-col gap-y-3 px-4 pb-4">
          {secondaryNavItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`relative flex items-center justify-between py-2 pr-3 rounded-md text-vanta-text-light transition-colors overflow-hidden
                  ${isActive ? 'bg-vanta-accent-dark-blue pl-4' : 'hover:bg-vanta-accent-dark-blue pl-3'}
                `}
              >
                {isActive && (
                  // FIX APPLIED: Made bar 2px wide (w-[2px]) and used explicit 8px rounding
                  <div className="absolute left-0 top-1 bottom-1 w-[2px] bg-vanta-neon-blue rounded-[8px]"></div>
                )}
                <div className="flex items-center gap-3"> {/* Group icon and text */}
                  <item.icon size={18} />
                  <span className="text-sm font-normal">{item.name}</span> {/* Smaller font */}
                </div>
                <ChevronRight size={16} className="text-vanta-text-light" /> {/* Forward arrow */}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;