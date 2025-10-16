import React from 'react';
import { Link } from 'react-router-dom';
import SearchInput from './SearchInput';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

const MainHeader: React.FC = () => {
  const sportsCategories = [
    { name: 'Football', path: '/football' },
    { name: 'Basketball', path: '/basketball' },
    { name: 'Tennis', path: '/tennis' },
    { name: 'Esports', path: '/esports' },
  ];

  return (
    <div className="w-full h-16 flex items-center justify-between pl-0 pr-8 border-b border-gray-700">
      {/* Left Section: Sports Categories */}
      <div className="flex items-center space-x-4"> {/* Changed space-x-8 to space-x-4 */}
        {sportsCategories.map((category) => (
          <Link key={category.name} to={category.path} className="text-white text-base font-outfit hover:text-vanta-neon-blue transition-colors">
            {category.name}
          </Link>
        ))}
        <Link to="/how-to-play" className="text-white text-base font-outfit hover:text-vanta-neon-blue transition-colors">
          How to Play
        </Link>
      </div>

      {/* Right Section: Search, Login/Signup, Avatar */}
      <div className="flex items-center space-x-4">
        <SearchInput />
        <Button variant="ghost" className="text-white text-base font-outfit hover:text-vanta-neon-blue">
          Login
        </Button>
        <Button className="bg-vanta-neon-blue text-white text-base font-outfit hover:bg-vanta-neon-blue/90">
          Sign Up
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="cursor-pointer">
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default MainHeader;