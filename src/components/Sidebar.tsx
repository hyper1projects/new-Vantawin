"use client";

import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Wallet, Calendar, Settings, HelpCircle, FileText, Mail, Gamepad2, Award } from 'lucide-react';

const Sidebar = () => {
  const primaryNavItems = [
    { name: 'Home', icon: Home, path: '/' },
    { name: 'Games', icon: Gamepad2, path: '/games' },
    { name: 'Pools', icon: Calendar, path: '/pools' },
    { name: 'Leaderboard', icon: Award, path: '/leaderboard' },
    { name: 'Wallet', icon: Wallet, path: '/wallet' },
  ];

  const rewardsHubItems = [ // Renamed from bumbleBHubItems
    { name: 'User Settings', icon: Settings, path: '/settings' },
    { name: 'Terms of Use', icon: FileText, path: '/terms' },
    { name: 'Help & Information', icon: HelpCircle, path: '/help' },
    { name: 'Contact Us', icon: Mail, path: '/contact' },
  ];

  return (
    <div className="fixed top-0 left-0 h-screen w-64 flex flex-col border-r border-vanta-border bg-vanta-blue-dark p-4 z-50">
      {/* Logo */}
      <div className="flex items-center justify-center h-16 mb-6">
        <h1 className="text-2xl font-bold text-vanta-text-light">VANTA WIN</h1>
      </div>

      {/* Primary Navigation */}
      <nav className="mb-8">
        <ul className="space-y-2">
          {primaryNavItems.map((item) => (
            <li key={item.name}>
              <Link
                to={item.path}
                className="flex items-center space-x-3 p-3 rounded-lg text-vanta-text-light hover:bg-vanta-blue-light transition-colors"
              >
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
        <h2 className="text-vanta-text-muted text-xs font-semibold uppercase tracking-wider mb-4">Rewards Hub</h2> {/* Changed title */}
        <ul className="space-y-2">
          {rewardsHubItems.map((item) => (
            <li key={item.name}>
              <Link
                to={item.path}
                className="flex items-center space-x-3 p-3 rounded-lg text-vanta-text-light hover:bg-vanta-blue-light transition-colors"
              >
                <item.icon className="h-5 w-5" />
                <span>{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;