import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Bell, Settings, UserCircle } from 'lucide-react'; // Assuming these icons are used

const MainHeader = () => {
  const location = useLocation();

  const sportsCategories = [
    { name: "All Sports", path: "/sports/all" },
    { name: "Football", path: "/sports/football" },
    { name: "Basketball", path: "/sports/basketball" },
    { name: "Tennis", path: "/sports/tennis" },
    { name: "Esports", path: "/sports/esports" },
  ];

  return (
    <div className="w-full h-16 bg-vanta-blue-dark border-b border-vanta-border flex items-center justify-between px-4 mb-6">
      {/* Left Section: Sports Categories */}
      <div className="flex items-center space-x-6">
        {sportsCategories.map((category) => (
          <Link
            key={category.name}
            to={category.path}
            className={`relative pb-2 transition-colors font-outfit text-sm
              ${location.pathname === category.path ? 'text-vanta-neon-blue border-b-2 border-vanta-neon-blue' : 'text-vanta-text-light hover:text-vanta-neon-blue'}
            `}
          >
            {category.name}
          </Link>
        ))}
      </div>

      {/* Right Section: User Actions */}
      <div className="flex items-center space-x-4">
        <button className="text-vanta-text-light hover:text-vanta-neon-blue transition-colors">
          <Bell size={20} />
        </button>
        <button className="text-vanta-text-light hover:text-vanta-neon-blue transition-colors">
          <Settings size={20} />
        </button>
        <button className="flex items-center gap-2 text-vanta-text-light hover:text-vanta-neon-blue transition-colors">
          <UserCircle size={24} />
          <span className="text-sm font-outfit">Username</span> {/* Apply font to username too */}
        </button>
      </div>
    </div>
  );
};

export default MainHeader;