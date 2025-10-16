"use client";

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Gamepad2, BarChart3, Wallet, FileText, HelpCircle, Mail, CalendarDays } from 'lucide-react';
import { cn } from '@/lib/utils'; // Import cn for conditional class names

const Sidebar = () => {
  const location = useLocation();

  const navItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Games', path: '/games', icon: Gamepad2 },
    { name: 'Pools', path: '/pools', icon: CalendarDays },
    { name: 'Leaderboard', path: '/leaderboard', icon: BarChart3 },
    { name: 'Wallet', path: '/wallet', icon: Wallet },
  ];

  const legalItems = [
    { name: 'Terms of use', path: '/terms-of-use', icon: FileText },
    { name: 'Help & Information', path: '/help', icon: HelpCircle },
    { name: 'Contact Us', path: '/contact', icon: Mail },
  ];

  return (
    <div className="fixed left-0 top-0 h-screen w-72 bg-vanta-blue-dark text-vanta-text-light p-6 flex flex-col rounded-br-xl rounded-tr-xl z-50">
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
                  "flex items-center p-3 rounded-lg transition-colors duration-200",
                  location.pathname === item.path
                    ? "bg-vanta-accent-blue text-vanta-blue-dark font-semibold"
                    : "text-vanta-text-light hover:bg-vanta-blue-medium"
                )}
              >
                <item.icon className="h-5 w-5 mr-3" />
                {item.name}
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-8">
          <h3 className="text-vanta-text-muted text-xs font-semibold uppercase tracking-wider mb-4">Legal</h3>
          <ul>
            {legalItems.map((item) => (
              <li key={item.name} className="mb-2">
                <Link
                  to={item.path}
                  className="flex items-center p-3 text-vanta-text-light hover:bg-vanta-blue-medium rounded-lg transition-colors duration-200"
                >
                  <item.icon className="h-5 w-5 mr-3" />
                  {item.name}
                  <ChevronRight className="h-4 w-4 ml-auto text-vanta-text-muted" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;