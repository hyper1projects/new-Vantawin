import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Info } from 'lucide-react';
import SearchInput from './SearchInput';
import Button from './Button';

const MainHeader = () => {
  const location = useLocation();

  const sportsCategories = [
    { name: "Football", path: "/sports/football" },
    { name: "Basketball", path: "/sports/basketball" },
    { name: "Tennis", path: "/sports/tennis" },
    { name: "A.Football", path: "/sports/afootball" },
    { name: "Golf", path: "/sports/golf" },
  ];

  return (
    <div className="w-full h-16 flex items-center justify-between px-8 border-b border-gray-700">
      {/* Left Section: Sports Categories */}
      <div className="flex items-center space-x-8">
        {sportsCategories.map((category) => (
          <Link
            key={category.name}
            to={category.path}
            className={`relative transition-colors font-outfit text-base
              ${location.pathname === category.path ? 'text-vanta-neon-blue' : 'text-vanta-text-light hover:text-vanta-neon-blue'}
            `}
          >
            {category.name}
          </Link>
        ))}
      </div>

      {/* Right Section: How it works, Search, Login, Register */}
      <div className="flex items-center space-x-4">
        <Link to="/how-it-works" className="flex items-center gap-1 text-vanta-neon-blue hover:text-vanta-text-light transition-colors font-outfit text-base">
          <Info size={18} />
          How it works
        </Link>
        <SearchInput />
        <Button variant="outline">Login</Button>
        <Button variant="primary">Register</Button>
      </div>
    </div>
  );
};

export default MainHeader;