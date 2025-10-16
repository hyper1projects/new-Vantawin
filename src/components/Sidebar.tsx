import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Gamepad2, Wallet, Trophy, Users, BookText, HelpCircle, Mail } from 'lucide-react';

const Sidebar = () => {
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
    <div className="fixed left-0 top-0 h-screen w-60 bg-vanta-blue-dark text-vanta-text-light flex flex-col z-50 rounded-r-2xl">
      <div className="bg-vanta-blue-medium rounded-r-2xl flex flex-col gap-2 flex-grow">
        <div className="flex items-center justify-center p-4 mb-4">
          <span className="text-xl font-bold text-vanta-text-light">VANTA</span>
          <span className="text-xl font-bold text-vanta-accent-blue">WIN</span>
        </div>

        {/* Primary Navigation Items */}
        <div className="px-4">
          {primaryNavItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className="flex items-center gap-4 py-2 px-3 rounded-md text-vanta-text-light hover:bg-vanta-accent-blue hover:text-white transition-colors" // Changed p-2 to py-2 px-3
            >
              <item.icon size={18} />
              <span className="text-base font-medium">{item.name}</span>
            </Link>
          ))}
        </div>

        {/* Secondary Navigation Items pushed to the bottom */}
        <div className="mt-auto flex flex-col gap-2 px-4 pb-4">
          {secondaryNavItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className="flex items-center gap-3 py-2 px-3 rounded-md text-vanta-text-light hover:bg-vanta-accent-blue hover:text-white transition-colors" // Changed p-2 to py-2 px-3
            >
              <item.icon size={18} />
              <span className="text-base font-medium">{item.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;