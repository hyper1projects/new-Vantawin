import React from 'react';
import { Link } from 'react-router-dom';
import SearchInput from './SearchInput';
import Button from './Button';

const sportsCategories = [
  { name: 'Football', icon: '⚽' },
  { name: 'Basketball', icon: '🏀' },
  { name: 'Tennis', icon: '🎾' },
  { name: 'Esports', icon: '🎮' },
];

const MainHeader: React.FC = () => {
  return (
    <div className="w-full h-16 flex items-center justify-between pl-0 pr-8 border-b border-gray-700">
      {/* Left Section: Sports Categories */}
      <div className="flex items-center space-x-8">
        <div className="flex items-center h-16 px-8 bg-vanta-blue-light text-vanta-neon-blue font-outfit text-lg font-semibold">
          VANTA
        </div>
        {sportsCategories.map((category) => (
          <Link key={category.name} to={`/sports/${category.name.toLowerCase()}`} className="flex items-center space-x-2 text-vanta-text-light hover:text-vanta-neon-blue transition-colors duration-200">
            <span className="text-xl">{category.icon}</span>
            <span className="text-base font-outfit">{category.name}</span>
          </Link>
        ))}
      </div>

      {/* Right Section: Search, How it works, Login/Register */}
      <div className="flex items-center space-x-4">
        <SearchInput />
        <Link to="/how-it-works" className="text-vanta-text-light hover:text-vanta-neon-blue cursor-pointer text-base font-outfit transition-colors duration-200">
          How it works
        </Link>
        <Button variant="outline">Login</Button>
        <Button>Register</Button>
      </div>
    </div>
  );
};

export default MainHeader;