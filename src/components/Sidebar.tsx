"use client";

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, BarChart2, Users, Settings, LogOut, Trophy, DollarSign, Shield, MessageSquare, HelpCircle } from 'lucide-react';

const sidebarItems = [
  { name: 'Home', icon: Home, path: '/' },
  { name: 'Leaderboard', icon: BarChart2, path: '/leaderboard' },
  { name: 'My Teams', icon: Users, path: '/my-teams' },
  { name: 'Contests', icon: Trophy, path: '/contests' },
  { name: 'Wallet', icon: DollarSign, path: '/wallet' },
  { name: 'Refer & Earn', icon: Shield, path: '/refer-earn' },
  { name: 'Chat', icon: MessageSquare, path: '/chat' },
  { name: 'Help & Support', icon: HelpCircle, path: '/help-support' },
  { name: 'Settings', icon: Settings, path: '/settings' },
];

const Sidebar: React.FC = () => {
  const location = useLocation();

  return (
    <div className="w-64 bg-vanta-blue-dark text-white h-full flex flex-col p-4 shadow-lg">
      <div className="text-2xl font-bold mb-8 text-vanta-neon-blue">Vanta</div>
      <nav className="flex-grow">
        <ul>
          {sidebarItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`relative flex items-center gap-4 py-2 pr-3 rounded-lg text-vanta-text-light transition-colors overflow-hidden
                  ${isActive ? 'bg-vanta-accent-dark-blue text-white' : 'hover:bg-vanta-blue-medium'}
                `}
              >
                {isActive && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-vanta-neon-blue"></div>
                )}
                <item.icon size={20} className={`ml-3 ${isActive ? 'text-vanta-neon-blue' : ''}`} />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </ul>
      </nav>
      <div className="mt-auto">
        <Link
          to="/logout"
          className="flex items-center gap-4 py-2 pr-3 rounded-lg text-vanta-text-light hover:bg-vanta-blue-medium transition-colors"
        >
          <LogOut size={20} className="ml-3" />
          <span className="font-medium">Logout</span>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;