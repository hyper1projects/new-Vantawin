"use client";

import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom'; // Import useNavigate
import { Search, AlertCircle, LogOut, ArrowDownToLine, ArrowUpToLine, Gift, User, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import GameSearch from './GameSearch';
import { createPayment } from '@/services/paymentService';
import PaymentRedirectModal from './PaymentRedirectModal';
import DepositOptionsModal from './DepositOptionsModal';
import DepositDetailsModal from './DepositDetailsModal';
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
import { toast } from 'sonner';
import { cn } from '../lib/utils';
import { useIsMobile } from '../hooks/use-mobile';
import { useAuth } from '../context/AuthContext';

const sportsCategories = ['Football', 'Basketball', 'Tennis', 'Esports'];

const MainHeader: React.FC = () => {
  const { user, signOut, isLoading, isTelegram, telegramUser, displayName, avatarUrl, balance } = useAuth();
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  const [isRedirecting, setIsRedirecting] = React.useState(false);
  const [isOptionsOpen, setIsOptionsOpen] = React.useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = React.useState(false);

  const handleDepositClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsOptionsOpen(true);
  };

  const handleCryptoSelect = () => {
    setIsOptionsOpen(false);
    setIsDetailsOpen(true);
  };

  const handlePaymentProceed = async (amount: number) => {
    setIsDetailsOpen(false);
    try {
      setIsRedirecting(true);
      console.log(`Initiating payment: ${amount} USD`);
      const response = await createPayment('Wallet Top-Up', amount, '00000000-0000-0000-0000-000000000000');
      if (response && response.invoice_url) {
        window.location.href = response.invoice_url;
      } else {
        throw new Error('No invoice URL received');
      }
    } catch (error) {
      console.error('Deposit error:', error);
      toast.error('Failed to initiate deposit. Please try again.');
      setIsRedirecting(false);
    }
  };

  const location = useLocation();
  const currentPath = location.pathname;
  const queryParams = new URLSearchParams(location.search);
  const activeCategoryParam = queryParams.get('category') || 'football';

  const isActive = (category: string) => {
    const categorySlug = category.toLowerCase().replace('.', '');
    return currentPath === '/games' && activeCategoryParam === categorySlug;
  };

  const handleCategoryClick = (category: string) => {
    navigate(`/games?category=${category.toLowerCase().replace('.', '')}`); // Use navigate
  };

  const handleLogout = async () => {
    const { error } = await signOut();
    if (!error) {
      toast.info('Logged out successfully.');
    } else {
      toast.error('Failed to log out.');
    }
  };

  const displayEmail = isTelegram && telegramUser
    ? telegramUser.username ? `@${telegramUser.username}` : `User ID: ${telegramUser.id}`
    : user?.email || '';

  const userAvatar = isTelegram && telegramUser?.photoUrl
    ? telegramUser.photoUrl
    : avatarUrl;

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
          {/* Hide Search Bar on mobile */}
          <div className="hidden md:flex">
            <GameSearch />
          </div>

          {/* Auth/User Section - always visible, but adjust spacing for mobile */}
          <div className="flex items-center space-x-2 sm:space-x-4"> {/* Reduced space-x for smaller screens */}
            {user ? (
              <>
                {/* Deposit Button - always visible */}
                <Link to="#" onClick={handleDepositClick}>
                  <Button className="bg-vanta-neon-blue text-vanta-blue-dark rounded-[14px] px-4 py-2 font-bold text-sm hover:bg-vanta-neon-blue/80 h-auto"> {/* Adjusted padding for mobile */}
                    Deposit
                  </Button>
                </Link>

                {/* Wallet Balance - always visible */}
                <Link to="/wallet" className="flex items-center justify-center bg-[#01112D] border border-vanta-neon-blue rounded-[14px] px-3 py-2 cursor-pointer hover:bg-[#01112D]/80 transition-colors h-auto"> {/* Adjusted padding for mobile */}
                  <span className="text-vanta-text-light text-sm font-semibold">$ {balance.toFixed(2)}</span> {/* Reduced font size for mobile */}
                </Link>

                {/* Avatar and Dropdown Trigger - always visible */}
                <div className="flex items-center space-x-1">
                  <Link to="/users">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={userAvatar} alt={displayName} />
                      <AvatarFallback className="bg-[#016F8A] text-[#00EEEE] text-xs">
                        {displayName ? displayName.substring(0, 2).toUpperCase() : 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </Link>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 rounded-full p-0 flex items-center justify-center text-gray-400 hover:text-white">
                        <ChevronDown size={14} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56 bg-vanta-blue-medium text-vanta-text-light border-vanta-accent-dark-blue" align="end" forceMount>
                      <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium leading-none">{displayName}</p>
                          <p className="text-xs leading-none text-gray-400">
                            {displayEmail}
                          </p>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator className="bg-vanta-accent-dark-blue" />
                      <DropdownMenuGroup>
                        <DropdownMenuItem onClick={handleDepositClick} className="cursor-pointer hover:bg-vanta-accent-dark-blue">
                          <div className="flex items-center">
                            <ArrowDownToLine className="mr-2 h-4 w-4" />
                            <span>Deposit</span>
                          </div>
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
                  onClick={() => navigate('/login')} // Navigate to login page
                  className="bg-transparent text-white border border-[#00EEEE] rounded-[14px] px-4 py-2 font-bold text-xs hover:bg-[#00EEEE]/10 h-auto"
                >
                  Login
                </Button>
                <Button
                  onClick={() => navigate('/register')} // Navigate to register page
                  className="bg-[#00EEEE] text-[#081028] rounded-[14px] px-4 py-2 font-bold text-xs hover:bg-[#00EEEE]/80 h-auto"
                >
                  Sign up
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
      <PaymentRedirectModal isOpen={isRedirecting} />
      <DepositOptionsModal
        isOpen={isOptionsOpen}
        onClose={() => setIsOptionsOpen(false)}
        onSelectCrypto={handleCryptoSelect}
        onSelectFiat={() => { }}
      />
      <DepositDetailsModal
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        onConfirm={handlePaymentProceed}
      />
    </>
  );
};

export default MainHeader;