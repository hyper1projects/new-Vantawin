"use client";

import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, AlertCircle, UserCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import LoginDialog from './LoginDialog';
import SignUpDialog from './SignUpDialog';
import ForgotPasswordDialog from './ForgotPasswordDialog';
import VerifyPhoneDialog from './VerifyPhoneDialog';
import { toast } from 'sonner';
import { cn } from '../lib/utils'; // Import cn for conditional class merging
import { useIsMobile } from '../hooks/use-mobile'; // Import useIsMobile

const MainHeader: React.FC = () => {
  const [loginOpen, setLoginOpen] = useState(false);
  const [signUpOpen, setSignUpOpen] = useState(false);
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [verifyPhoneOpen, setVerifyPhoneOpen] = useState(false);
  const [phoneToVerify, setPhoneToVerify] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Simulate login state
  const isMobile = useIsMobile(); // Get mobile status

  const sportsCategories = ['All', 'Football', 'Basketball', 'Tennis', 'A.Football', 'Golf']; // Added 'All'
  const location = useLocation();
  const currentPath = location.pathname;
  const queryParams = new URLSearchParams(location.search);
  const activeCategoryParam = queryParams.get('category') || 'all'; // Default to 'all'

  const isActive = (category: string) => {
    const categorySlug = category.toLowerCase().replace('.', '');
    // If on the games page, check category param. If on home, 'All' is active.
    if (currentPath === '/games') {
      return activeCategoryParam === categorySlug;
    }
    return categorySlug === 'all' && currentPath === '/'; // 'All' is active on home page
  };

  const handleCategoryClick = (category: string) => {
    const categorySlug = category.toLowerCase().replace('.', '');
    if (categorySlug === 'all') {
      // Navigate to home or games with 'all' category
      if (currentPath !== '/') {
        window.location.href = '/'; // Force full reload to reset state if needed, or navigate to '/'
      }
    } else {
      window.location.href = `/games?category=${categorySlug}`; // Force full reload to update category
    }
  };

  const handleVerificationNeeded = (phoneNumber: string) => {
    setPhoneToVerify(phoneNumber);
    setVerifyPhoneOpen(true);
  };

  const handleVerificationSuccess = () => {
    setVerifyPhoneOpen(false);
    setPhoneToVerify('');
    setLoginOpen(true);
    toast.success('Your account has been successfully verified! Please log in.');
  };

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setLoginOpen(false);
    toast.success('Login successful!');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    toast.info('Logged out successfully.');
  };

  return (
    <div className="fixed top-0 left-0 right-0 h-16 flex items-center justify-between px-4 md:px-8 border-b border-gray-700 z-50 font-outfit bg-vanta-blue-dark">
      {/* Left Section: VantaWin Logo */}
      <Link to="/" className="flex items-center cursor-pointer flex-shrink-0">
        <span className="text-xl font-bold text-vanta-text-light">VANTA</span>
        <span className="text-xl font-bold text-vanta-neon-blue">WIN</span>
      </Link>

      {/* Middle Section: Sports Categories, How it works, Search Bar (Desktop only) */}
      {!isMobile && (
        <div className="flex items-center space-x-6 mx-auto flex-grow justify-center">
          {/* Sports Categories */}
          <div className="flex items-center space-x-4">
            {sportsCategories.map((category) => (
              <Button
                key={category}
                variant="ghost"
                onClick={() => handleCategoryClick(category)}
                className={cn(
                  `relative font-medium text-sm px-0 py-1 h-auto`,
                  isActive(category)
                    ? 'text-vanta-neon-blue after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-vanta-neon-blue'
                    : 'text-[#B4B2C0] hover:bg-transparent hover:text-white'
                )}
              >
                {category}
              </Button>
            ))}
          </div>

          {/* How it works link */}
          <Link to="/how-it-works" className="flex items-center space-x-1 ml-6 flex-shrink-0">
            <AlertCircle size={18} className="text-[#00EEEE]" />
            <Button variant="ghost" className="text-[#02A7B4] font-medium text-sm hover:bg-transparent p-0 h-auto">
              How it works
            </Button>
          </Link>

          {/* Search Input */}
          <div className="relative bg-[#053256] rounded-[14px] h-10 flex items-center w-64 ml-6">
            <Search className="absolute left-3 text-[#00EEEE]" size={18} />
            <Input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 rounded-[14px] bg-transparent border-none text-white placeholder-white/70 focus:ring-0 text-sm"
            />
          </div>
        </div>
      )}

      {/* Right Section: Auth/User UI */}
      <div className="flex items-center space-x-2 md:space-x-4 ml-auto flex-shrink-0">
        {isLoggedIn ? (
          // Logged-in UI
          <div className="flex items-center space-x-2">
            <span className="text-vanta-text-light text-sm hidden md:block">Welcome, User!</span>
            <Button
              variant="ghost"
              size="icon"
              className="relative w-10 h-10 rounded-full border-2 border-gray-500 text-gray-400 hover:bg-gray-700/50 transition-colors flex items-center justify-center"
              aria-label="User Profile"
              onClick={handleLogout}
            >
              <UserCircle size={20} />
            </Button>
          </div>
        ) : (
          // Logged-out UI (Login/Sign up buttons)
          <>
            <Button 
              onClick={() => setLoginOpen(true)}
              className="bg-transparent text-white border border-[#00EEEE] rounded-[14px] px-3 py-1.5 text-xs md:px-6 md:py-2 md:text-sm font-bold hover:bg-[#00EEEE]/10"
            >
              Login
            </Button>
            <Button 
              onClick={() => setSignUpOpen(true)}
              className="bg-[#00EEEE] text-[#081028] rounded-[14px] px-3 py-1.5 text-xs md:px-6 md:py-2 md:text-sm font-bold hover:bg-[#00EEEE]/80"
            >
              Sign up
            </Button>
          </>
        )}
      </div>

      {/* Dialogs */}
      <LoginDialog 
        open={loginOpen} 
        onOpenChange={setLoginOpen}
        onSwitchToSignUp={() => {
          setLoginOpen(false);
          setSignUpOpen(true);
        }}
        onSwitchToForgotPassword={() => {
          setLoginOpen(false);
          setForgotPasswordOpen(true);
        }}
        onLoginSuccess={handleLoginSuccess}
      />
      <SignUpDialog 
        open={signUpOpen} 
        onOpenChange={setSignUpOpen}
        onSwitchToLogin={() => {
          setSignUpOpen(false);
          setLoginOpen(true);
        }}
        onVerificationNeeded={handleVerificationNeeded}
      />
      <ForgotPasswordDialog
        open={forgotPasswordOpen}
        onOpenChange={setForgotPasswordOpen}
        onSwitchToLogin={() => {
          setForgotPasswordOpen(false);
          setLoginOpen(true);
        }}
      />
      <VerifyPhoneDialog
        open={verifyPhoneOpen}
        onOpenChange={setVerifyPhoneOpen}
        phoneNumber={phoneToVerify}
        onVerificationSuccess={handleVerificationSuccess}
      />
    </div>
  );
};

export default MainHeader;