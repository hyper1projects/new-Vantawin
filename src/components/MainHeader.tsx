"use client";

import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, AlertCircle, LogOut, ArrowDownToLine, ArrowUpToLine, Gift, User, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import LoginDialog from './LoginDialog';
import SignUpDialog from './SignUpDialog';
import ForgotPasswordDialog from './ForgotPasswordDialog';
import { toast } from 'sonner';
import { cn } from '../lib/utils';
import { useIsMobile } from '../hooks/use-mobile';
import { useAuth } from '../context/AuthContext';

const sportsCategories = ['Football', 'Basketball', 'Tennis', 'Esports'];

const MainHeader: React.FC = () => {
  const [loginOpen, setLoginOpen] = useState(false);
  const [signUpOpen, setSignUp] = useState(false);
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  
  const { user, username, signOut, isLoading } = useAuth();
  const isMobile = useIsMobile();

  const location = useLocation();
  const currentPath = location.pathname;
  const queryParams = new URLSearchParams(location.search);
  const activeCategoryParam = queryParams.get('category') || 'football';

  const isActive = (category: string) => {
    const categorySlug = category.toLowerCase().replace('.', '');
    return currentPath === '/games' && activeCategoryParam === categorySlug;
  };

  const handleCategoryClick = (category: string) => {
    window.location.href = `/games?category=${category.toLowerCase().replace('.', '')}`;
  };

  const handleLogout = async () => {
    const { error } = await signOut();
    if (!error) {
      toast.info('Logged out successfully.');
    } else {
      toast.error('Failed to log out.');
    }
  };

  if (isLoading) {
    return null;
  }

  return (
    <>
      <div className="fixed top-0 left-0 right-0 h-16 flex items-center px-4 border-b border-gray-700 z-50 font-outfit bg-vanta-blue-dark">
        {/* Left Section: Logo, Sports Categories and How to play */}
        <div className="flex items-center space-x-8">
          <Link to="/" className="flex items-center cursor-pointer">
            <span className="text-xl font-bold text-vanta-text-light">VANTA</span>
            <span className="text-xl font-bold text-vanta-neon-blue">WIN</span>
          </Link>
          {/* Hide sports categories and "How to play" on mobile */}
          <div className="hidden md:flex items-center space-x-6">
          {sportsCategories.map((category) => (
            <Link 
              key={category} 
              to={`/games?category=${category.toLowerCase().replace('.', '')}`}
            >
              <Button
                variant="ghost"
                className={cn(
                  `font-medium text-sm p-0 h-auto`,
                  isActive(category) 
                    ? 'bg-vanta-neon-blue text-vanta-blue-dark' // Active state: neon blue background, dark blue text
                    : 'text-[#B4B2C0] hover:bg-vanta-accent-dark-blue hover:text-white' // Inactive hover state: dark accent blue background, white text
                )}
              >
                {category}
              </Button>
            </Link>
          ))}
          <Link to="/how-it-works" className="flex items-center space-x-1 ml-4">
            <AlertCircle size={18} className="text-[#00EEEE]" />
            <Button variant="ghost" className="text-[#02A7B4] font-medium text-sm hover:bg-transparent p-0 h-auto">
              How to play
            </Button>
          </Link>
        </div>
        </div>

        {/* Right-aligned group: Search Bar + Auth/User Section */}
        <div className="flex items-center ml-auto space-x-4">
          {/* Hide Search Bar on mobile */}
          <div className="hidden md:flex relative bg-[#053256] rounded-[14px] h-10 items-center w-64">
            <Search className="absolute left-3 text-[#00EEEE]" size={18} />
            <Input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 rounded-[14px] bg-transparent border-none text-white placeholder-white/70 focus:ring-0"
            />
          </div>

          {/* Auth/User Section - always visible, but adjust spacing for mobile */}
          <div className="flex items-center space-x-2 sm:space-x-4"> {/* Reduced space-x for smaller screens */}
            {user ? (
              <>
                {/* Deposit Button - always visible */}
                <Link to="/wallet">
                  <Button className="bg-vanta-neon-blue text-vanta-blue-dark rounded-[14px] px-4 py-2 font-bold text-sm hover:bg-vanta-neon-blue/80 h-auto"> {/* Adjusted padding for mobile */}
                    Deposit
                  </Button>
                </Link>

                {/* Wallet Balance - always visible */}
                <Link to="/wallet" className="flex items-center justify-center bg-[#01112D] border border-vanta-neon-blue rounded-[14px] px-3 py-2 cursor-pointer hover:bg-[#01112D]/80 transition-colors h-auto"> {/* Adjusted padding for mobile */}
                  <span className="text-vanta-text-light text-sm font-semibold">₦ 0.00</span> {/* Reduced font size for mobile */}
                </Link>

                {/* Avatar and Dropdown Trigger - always visible */}
                <div className="flex items-center space-x-1">
                  <Link to="/users"> {/* Wrap Avatar with Link */}
                    <Avatar className="h-8 w-8"> {/* Reduced size for mobile */}
                      <AvatarImage src="/placeholder.svg" alt={username || "User"} />
                      <AvatarFallback className="bg-vanta-neon-blue text-vanta-blue-dark text-xs"> {/* Reduced font size for mobile */}
                        {username ? username.substring(0, 2).toUpperCase() : 'UN'}
                      </AvatarFallback>
                    </Avatar>
                  </Link>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 rounded-full p-0 flex items-center justify-center text-gray-400 hover:text-white"> {/* Reduced size for mobile */}
                        <ChevronDown size={14} /> {/* Reduced size for mobile */}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56 bg-vanta-blue-medium text-vanta-text-light border-vanta-accent-dark-blue" align="end" forceMount>
                      <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium leading-none">{username || 'Guest'}</p>
                          <p className="text-xs leading-none text-gray-400">
                            {user.email}
                          </p>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator className="bg-vanta-accent-dark-blue" />
                      <DropdownMenuGroup>
                        <DropdownMenuItem asChild className="cursor-pointer hover:bg-vanta-accent-dark-blue">
                          <Link to="/wallet">
                            <ArrowDownToLine className="mr-2 h-4 w-4" />
                            <span>Deposit</span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild className="cursor-pointer hover:bg-vanta-accent-dark-blue">
                          <Link to="/wallet">
                            <ArrowUpToLine className="mr-2 h-4 w-4" />
                            <span>Withdraw</span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild className="cursor-pointer hover:bg-vanta-accent-dark-blue">
                          <Link to="/wallet?tab=rewards">
                            <Gift className="mr-2 h-4 w-4" />
                            <span>Rewards</span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild className="cursor-pointer hover:bg-vanta-accent-dark-blue">
                          <Link to="/users">
                            <User className="mr-2 h-4 w-4" />
                            <span>My Account</span>
                          </Link>
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                      <DropdownMenuSeparator className="bg-vanta-accent-dark-blue" />
                      <DropdownMenuItem onClick={handleLogout} className="cursor-pointer hover:bg-vanta-accent-dark-blue text-red-400">
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Log out</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </>
            ) : (
              <>
                <Button 
                  onClick={() => setLoginOpen(true)}
                  className="bg-transparent text-white border border-[#00EEEE] rounded-[14px] px-4 py-2 font-bold text-xs hover:bg-[#00EEEE]/10 h-auto" // Adjusted padding/font size for mobile
                >
                  Login
                </Button>
                <Button 
                  onClick={() => setSignUpOpen(true)}
                  className="bg-[#00EEEE] text-[#081028] rounded-[14px] px-4 py-2 font-bold text-xs hover:bg-[#00EEEE]/80 h-auto" // Adjusted padding/font size for mobile
                >
                  Sign up
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      <LoginDialog 
        open={loginOpen} 
        onOpenChange={setLoginOpen}
        onSwitchToSignUp={() => {
          setLoginOpen(false);
          setSignUp(true);
        }}
        onSwitchToForgotPassword={() => {
          setLoginOpen(false);
          setForgotPasswordOpen(true);
        }}
      />
      <SignUpDialog 
        open={signUpOpen} 
        onOpenChange={setSignUp}
        onSwitchToLogin={() => {
          setSignUp(false);
          setLoginOpen(true);
        }}
      />
      <ForgotPasswordDialog
        open={forgotPasswordOpen}
        onOpenChange={setForgotPasswordOpen}
        onSwitchToLogin={() => {
          setForgotPasswordOpen(false);
          setLoginOpen(true);
        }}
      />
    </>
  );
};

export default MainHeader;