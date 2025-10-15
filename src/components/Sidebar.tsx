"use client";

import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Trophy, Wallet, Settings, HelpCircle, FileText, Mail, Gift, Calendar } from 'lucide-react';

const Sidebar = () => {
  const navItems = [
    { name: 'Home', icon: Home, path: '/' },
    { name: 'My Bets', icon: Trophy, path: '/my-bets' },
    { name: 'Wallet', icon: Wallet, path: '/wallet' },
    { name: 'Pools', icon: Calendar, path: '/pools' }, // Added Pools section
  ];

  const legalItems = [
    { name: 'Terms', icon: FileText, path: '/terms' },
    { name: 'Help', icon: HelpCircle, path: '/help' },
    { name: 'Contact', icon: Mail, path: '/contact' },
  ];

  const bottomItems = [
    { name: 'Rewards', icon: Gift, path: '/rewards' },
    { name: 'Settings', icon: Settings, path: '/settings' },
  ];

  return (
    <div className="fixed top-0 left-0 h-screen w-64 flex-col border-r border-vanta-border bg-vanta-blue-dark p-4 z-50">
      <div className="flex items-center justify-center h-16 mb-6">
        <h1 className="text-2xl font-bold text-vanta-text-light">VANTA WIN</h1>
      </div>

      <nav className="flex-grow">
        <ul className="space-y-2">
          {navItems.map((item) => (
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

        <div className="mt-8 pt-8 border-t border-vanta-border">
          <h2 className="text-vanta-text-muted text-xs font-semibold uppercase tracking-wider mb-4">Legal</h2>
          <ul className="space-y-2">
            {legalItems.map((item) => (
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
      </nav>

      <div className="mt-auto pt-8 border-t border-vanta-border">
        <ul className="space-y-2">
          {bottomItems.map((item) => (
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