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
    <div className="fixed left-0 top-0 h-screen w-72 bg-vanta-blue-dark text-vanta-text-light flex flex-col z-50">
      <div className="bg-vanta-blue-medium flex flex-col flex-grow"> {/* Removed gap-2 */}

        {/* Primary Navigation Items */}
        <div className="px-4 pt-4 flex flex-col gap-2"> {/* Added pt-4 and flex-col gap-2 for spacing */}
          {primaryNavItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className="flex items-center gap-3 p-2 rounded-md text-vanta-text-light hover:bg-vanta-accent-blue hover:text-white transition-colors"
            >
              <item.icon size={20} />
              <span className="text-lg font-medium">{item.name}</span>
            </Link>
          ))}
        </div>

        {/* Spacer to push logo down */}
        <div className="flex-grow"></div>

        {/* Logo Section - Centered */}
        <div className="flex items-center justify-center p-4"> {/* Removed mb-4, added justify-center */}
          <span className="text-2xl font-bold text-vanta-text-light">VANTA</span>
          <span className="text-2xl font-bold text-vanta-accent-blue">WIN</span>
        </div>

        {/* Spacer to push logo up */}
        <div className="flex-grow"></div>

        {/* Secondary Navigation Items pushed to the bottom */}
        <div className="flex flex-col gap-2 px-4 pb-4">
          {secondaryNavItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className="flex items-center gap-3 p-2 rounded-md text-vanta-text-light hover:bg-vanta-accent-blue hover:text-white transition-colors"
            >
              <item.icon size={20} />
              <span className="text-lg font-medium">{item.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;