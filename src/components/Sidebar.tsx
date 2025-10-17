"use client";

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Home,
  Gamepad2,
  Users,
  Wallet,
  HelpCircle,
  Mail,
  Shield,
  FileText,
  LifeBuoy,
  Trophy, // Keep Trophy icon for now, might be used elsewhere or removed later
} from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', icon: Home, path: '/' },
    { name: 'Games', icon: Gamepad2, path: '/games' },
    { name: 'Pools', icon: Users, path: '/pools' },
    // { name: 'Leaderboard', icon: Trophy, path: '/leaderboard' }, // Removed Leaderboard
    { name: 'Wallet', icon: Wallet, path: '/wallet' },
  ];

  const legalItems = [
    { name: 'Terms of Use', icon: FileText, path: '/terms-of-use' },
    { name: 'Privacy Policy', icon: Shield, path: '/privacy-policy' },
    { name: 'Help', icon: HelpCircle, path: '/help' },
    { name: 'Contact', icon: Mail, path: '/contact' },
    { name: 'Support', icon: LifeBuoy, path: '/support' },
  ];

  return (
    <div className="fixed left-0 top-0 h-full w-[18rem] bg-vanta-blue-medium p-6 flex flex-col shadow-lg rounded-r-xl z-50">
      <div className="text-2xl font-bold text-vanta-primary mb-8">Vantawin</div>

      <nav className="flex-1">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.name}>
              <Link
                to={item.path}
                className={`flex items-center p-3 rounded-lg transition-colors duration-200 ${
                  location.pathname === item.path
                    ? 'bg-vanta-primary text-vanta-blue-dark font-semibold'
                    : 'text-vanta-text-light hover:bg-vanta-blue-light'
                }`}
              >
                <item.icon className="h-5 w-5 mr-3" />
                <span>{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-8 pt-8 border-t border-vanta-blue-light">
          <h3 className="text-sm font-semibold text-gray-400 uppercase mb-4">Legal & Support</h3>
          <ul className="space-y-2">
            {legalItems.map((item) => (
              <li key={item.name}>
                <Link
                  to={item.path}
                  className={`flex items-center p-3 rounded-lg transition-colors duration-200 ${
                    location.pathname === item.path
                      ? 'bg-vanta-primary text-vanta-blue-dark font-semibold'
                      : 'text-vanta-text-light hover:bg-vanta-blue-light'
                  }`}
                >
                  <item.icon className="h-5 w-5 mr-3" />
                  <span>{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      <div className="mt-auto text-center text-xs text-gray-500">
        &copy; {new Date().getFullYear()} Vantawin. All rights reserved.
      </div>
    </div>
  );
};

export default Sidebar;