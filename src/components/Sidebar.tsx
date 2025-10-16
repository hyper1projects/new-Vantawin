"use client";

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Wallet, Calendar, Settings, HelpCircle, FileText, Mail, Gamepad2, Award, Bell, ChevronRight, LayoutGrid } from 'lucide-react';
import { cn } from '@/lib/utils';

const Sidebar = () => {
  const location = useLocation();

  const primaryNavItems = [
    { name: 'Home', icon: Home, path: '/' },
    { name: 'Games', icon: Gamepad2, path: '/games' },
    { name: 'Pools', icon: Calendar, path: '/pools' },
    { name: 'Leaderboard', icon: Award, path: '/leaderboard' },
    { name: 'Wallet', icon: Wallet, path: '/wallet' },
  ];

  const rewardsHubItems = [
    { name: 'User Settings', icon: Bell, path: '/settings' },
    { name: 'Terms of Use', icon: Bell, path: '/terms' },
    { name: 'Help & Information', icon: Bell, path: '/help' },
    { name: 'Contact Us', icon: LayoutGrid, path: '/contact' },
  ];

  return (
    <div className="fixed top-0 left-0 h-screen w-64 flex flex-col border-r border-vanta-border bg-vanta-blue-dark p-4 z-50">
      {/* Logo */}
      <div className="flex items-center justify-center h-16 mb-6">
        <h1 className="text-2xl font-bold text-vanta-text-light">
          VANTA<span className="text-vanta-accent-blue">WIN</span>
        </h1>
      </div>

      {/* Primary Navigation */}
      <nav className="mb-8">
        <ul className="space-y-2">
          {primaryNavItems.map((item) => (
            <li key={item.name}>
              <Link
                to={item.path}
                className={cn(
                  "flex items-center space-x-3 p-3 rounded-lg transition-colors relative",
                  location.pathname === item.path
                    ? "bg-vanta-blue-medium text-white"
                    : "text-vanta-text-light hover:bg-vanta-blue-light"
                )}
              >
                {location.pathname === item.path && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-3/4 bg-vanta-accent-blue rounded-r-sm" />
                )}
                <item.icon className="h-5 w-5" />
                <span>{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Separator */}
      <hr className="my-4 border-t border-vanta-border" />

      {/* Rewards Hub Section */}
      <div className="mt-4">
        <h2 className="text-yellow-400 text-xs font-semibold uppercase tracking-wider mb-4 flex items-center gap-2">
          <Award className="h-4 w-4" />
          Rewards Hub
          <ChevronRight className="h-3 w-3 ml-auto" />
        </h2>
        <ul className="space-y-2">
          {rewardsHubItems.map((item) => (
            <li key={item.name}>
              <Link
                to={item.path}
                className="flex items-center justify-between p-3 rounded-lg text-vanta-text-light hover:bg-vanta-blue-light transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <item.icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </div>
                <ChevronRight className="h-4 w-4 text-vanta-text-muted" />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;