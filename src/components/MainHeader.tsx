"use client";

import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom'; // Import useNavigate
import { Search, AlertCircle, LogOut, ArrowDownToLine, ArrowUpToLine, Gift, User, ChevronDown, Bell } from 'lucide-react';
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
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle } from '@/components/ui/dialog';
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

  console.log("MainHeader Render. Loading:", isLoading, "User:", user ? "Present" : "Null");

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
          <div className="hidden lg:flex items-center space-x-6">
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
                      ? 'bg-transparent text-[#00EEEE] hover:bg-transparent hover:text-[#00EEEE]/70 transition-colors'
                      : 'text-[#B4B2C0] hover:bg-transparent hover:text-[#03B3C2] transition-colors'
                  )}
                >
                  {category}
                </Button>
              </Link>
            ))}
            <Link to="/how-it-works" className="flex items-center space-x-1 ml-4 group">
              <AlertCircle size={18} className={cn("transition-colors", currentPath === '/how-it-works' ? "text-[#00EEEE] group-hover:text-[#00EEEE]/70" : "text-[#B4B2C0] group-hover:text-[#03B3C2]")} />
              <Button
                variant="ghost"
                className={cn(
                  "font-medium text-sm p-0 h-auto transition-colors",
                  currentPath === '/how-it-works'
                    ? "bg-transparent text-[#00EEEE] hover:bg-transparent group-hover:text-[#00EEEE]/70"
                    : "text-[#B4B2C0] hover:bg-transparent group-hover:text-[#03B3C2]"
                )}
              >
                How to play
              </Button>
            </Link>
          </div>
        </div>

        {/* Right-aligned group: Search Bar + Auth/User Section */}
        <div className="flex items-center ml-auto space-x-4">
          {/* Hide Search Bar on mobile */}
          <div className="hidden lg:flex">
            <GameSearch />
          </div>


          {/* Auth/User Section - always visible, but adjust spacing for mobile */}
          <div className="flex items-center space-x-2 sm:space-x-4 ml-auto"> {/* Added ml-auto here just in case, though parent has it */}
            {/* Search & Notification Group - Close together and aligned right */}
            <div className="flex items-center justify-end space-x-0 md:space-x-2">
              {/* Search Icon - Mobile Only */}
              <div className="md:hidden">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-vanta-text-light hover:bg-transparent hover:text-[#00EEEE] hover:drop-shadow-[0_0_5px_#00EEEE] transition-all duration-300 px-0 mr-1"
                    >
                      <Search size={20} />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-vanta-blue-dark border-vanta-neon-blue/20 w-[90%] rounded-xl p-4 top-[20%] translate-y-0">
                    <DialogHeader>
                      <DialogTitle className="text-vanta-text-light font-semibold mb-2">Search Games</DialogTitle>
                    </DialogHeader>
                    <div className="flex flex-col space-y-2">
                      <GameSearch className="w-full" />
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              {/* Notification Icon */}
              {user && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-vanta-text-light hover:bg-transparent hover:text-[#00EEEE] hover:drop-shadow-[0_0_5px_#00EEEE] transition-all duration-300 px-0"
                >
                  <Bell size={20} />
                </Button>
              )}
            </div>

            {user ? (
              <>
                {/* Deposit Button - Desktop Only */}
                <Link to="#" onClick={handleDepositClick}>
                  <Button className="hidden md:flex bg-vanta-neon-blue text-vanta-blue-dark rounded-[14px] px-4 py-2 font-bold text-sm hover:bg-vanta-neon-blue/80 h-auto">
                    Deposit
                  </Button>
                </Link>

                {/* Wallet Balance - Responsive resizing */}
                <Link to="/wallet" className="flex items-center justify-center bg-[#01112D] border border-vanta-neon-blue rounded-[14px] px-2 py-1 md:px-3 md:py-2 cursor-pointer hover:bg-[#01112D]/80 transition-colors h-auto">
                  <span className="text-vanta-text-light text-xs md:text-sm font-semibold whitespace-nowrap">$ {balance.toFixed(2)}</span>
                </Link>

                {/* Avatar and Dropdown Trigger */}
                <div className="flex items-center space-x-1">
                  <Link to="/users">
                    <div className="h-8 w-8 rounded-full overflow-hidden bg-[#016F8A] flex items-center justify-center border border-vanta-neon-blue/20">
                      {userAvatar ? (
                        <img src={userAvatar} alt={displayName || 'User'} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-[#00EEEE] font-bold text-xs">
                          {displayName ? displayName.substring(0, 2).toUpperCase() : 'U'}
                        </span>
                      )}
                    </div>
                  </Link>
                  <div className="hidden md:block">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 rounded-full p-0 flex items-center justify-center text-gray-400 hover:text-[#016F8A] hover:bg-transparent transition-colors">
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
                          <DropdownMenuItem onClick={handleDepositClick} className="cursor-pointer focus:bg-[#00EEEE]/10 focus:text-[#00EEEE] hover:bg-[#00EEEE]/10 hover:text-[#00EEEE]">
                            <div className="flex items-center">
                              <ArrowDownToLine className="mr-2 h-4 w-4" />
                              <span>Deposit</span>
                            </div>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild className="cursor-pointer focus:bg-[#00EEEE]/10 focus:text-[#00EEEE] hover:bg-[#00EEEE]/10 hover:text-[#00EEEE]">
                            <Link to="/wallet">
                              <ArrowUpToLine className="mr-2 h-4 w-4" />
                              <span>Withdraw</span>
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild className="cursor-pointer focus:bg-[#00EEEE]/10 focus:text-[#00EEEE] hover:bg-[#00EEEE]/10 hover:text-[#00EEEE]">
                            <Link to="/wallet?tab=rewards">
                              <Gift className="mr-2 h-4 w-4" />
                              <span>Rewards</span>
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild className="cursor-pointer focus:bg-[#00EEEE]/10 focus:text-[#00EEEE] hover:bg-[#00EEEE]/10 hover:text-[#00EEEE]">
                            <Link to="/users">
                              <User className="mr-2 h-4 w-4" />
                              <span>My Account</span>
                            </Link>
                          </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator className="bg-vanta-accent-dark-blue" />
                        <DropdownMenuItem onClick={handleLogout} className="cursor-pointer focus:bg-red-500/10 focus:text-red-400 hover:bg-red-500/10 hover:text-red-400 text-red-400">
                          <LogOut className="mr-2 h-4 w-4" />
                          <span>Log out</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
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