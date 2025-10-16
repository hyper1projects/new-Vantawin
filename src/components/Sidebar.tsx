"use client";

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Gamepad2, BarChart3, Wallet, FileText, HelpCircle, Mail, CalendarDays, ChevronRight } from 'lucide-react'; // Added CalendarDays and ChevronRight
import { cn } from '@/lib/utils';

const Sidebar = () => {
  const location = useLocation();

  const navItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Games', path: '/games', icon: Gamepad2 },
    { name: 'Pools', path: '/pools', icon: CalendarDays }, // Icon changed to CalendarDays
    { name: 'Leaderboard', path: '/leaderboard', icon: BarChart3 }, // Icon changed to BarChart3
    { name: 'Wallet', path: '/wallet', icon: Wallet }, // Icon changed to Wallet
  ];

  const bottomItems = [
    { name: 'Terms of use', path: '/terms-of-use', icon: FileText },
    { name: 'Help & Information', path: '/help', icon: HelpCircle },
    { name: 'Contact Us', path: '/contact', icon: Mail },
  ];

  return (
    <div className="fixed left-0 top-0 h-screen w-72 bg-vanta-blue-dark text-vanta-text-light p-6 flex flex-col rounded-xl z-50 m-4">
      <div className="flex items-center mb-10">
        <span className="text-2xl font-bold text-vanta-text-light">VANTA</span>
        <span className="text-2xl font-bold text-vanta-accent-blue">WIN</span>
      </div>

      <nav className="flex-grow">
        <ul>
          {navItems.map((item) => (
            <li key={item.name} className="mb-2">
              <Link
                to={item.path}
                className={cn(
                  "relative flex items-center py-3 transition-colors duration-200",
                  location.pathname === item.path
                    ? "bg-vanta-active-bg text-vanta-text-light font-semibold pl-5 rounded-lg" // Active state styling
                    : "text-vanta-text-light hover:bg-vanta-blue-medium pl-3 rounded-lg" // Inactive state styling
                )}
              >
                {location.pathname === item.path && (
                  <div className="absolute left-0 top-0 h-full w-1 bg-vanta-accent-blue rounded-full" /> // Accent bar
                )}
                <item.icon className={cn("h-5 w-5 mr-3", location.pathname === item.path ? "ml-0" : "ml-2")} />
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mt-auto">
        <ul>
          {bottomItems.map((item) => (
            <li key={item.name} className="mb-2">
              <Link
                to={item.path}
                className="flex items-center p-3 text-vanta-text-light hover:bg-vanta-blue-medium rounded-lg transition-colors duration-200"
              >
                <item.icon className="h-5 w-5 mr-3" />
                {item.name}
                <ChevronRight className="h-4 w-4 ml-auto text-vanta-text-muted" /> {/* Re-added ChevronRight */}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;