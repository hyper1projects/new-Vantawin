"use client";

import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, AlertCircle, UserCircle, Bell, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import LoginDialog from './LoginDialog';
import SignUpDialog from './SignUpDialog';
import ForgotPasswordDialog from './ForgotPasswordDialog';
import VerifyPhoneDialog from './VerifyPhoneDialog';
import { toast } from 'sonner';
import { cn } from '../lib/utils';
import { useIsMobile } from '../hooks/use-mobile';

const sportsCategories = ['All', 'Football', 'Basketball', 'Tennis', 'A.Football', 'Golf'];

const MainHeader: React.FC = () => {
  const [loginOpen, setLoginOpen] = useState(false);
  const [signUpOpen, setSignUpOpen] = useState(false);
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [verifyPhoneOpen, setVerifyPhoneOpen] = useState(false);
  const [phoneToVerify, setPhoneToVerify] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Simulate login state
  const isMobile = useIsMobile();

  const location = useLocation();
  const currentPath = location.pathname;
  const queryParams = new URLSearchParams(location.search);
  const activeCategoryParam = queryParams.get('category') || 'all';

  const isActive = (category: string) => {
    const categorySlug = category.toLowerCase().replace('.', '');
    if (currentPath === '/games') {
      return activeCategoryParam === categorySlug;
    }
    return categorySlug === 'all' && currentPath === '/';
  };

  const handleCategoryClick = (category: string) => {
    const categorySlug = category.toLowerCase().replace('.', '');
    if (categorySlug === 'all') {
      window.location.href = '/';
    } else {
      window.location.href = `/games?category=${categorySlug}`;
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
    <>
      {/* Main Header Row */}
      <div className="fixed top-0 left-0 right-0 h-16 flex items-center justify-between px-4 md:px-8 border-b border-gray-700 z-50 font-outfit bg-vanta-blue-dark">
        {/* Left Section: VantaWin Logo */}
        <Link to="/" className="flex items-center cursor-pointer flex-shrink-0">
          <span className="text-xl font-bold text-vanta-text-light">VANTA</span>
          <span className="text-xl font-bold text-vanta-neon-blue">WIN</span>
        </Link>

        {/* Middle Section (Desktop Only): Sports Categories & How to Play */}
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
          </div>
        )}

        {/* Search Component (Conditional Rendering) */}
        {!isMobile ? (
          // Desktop Search Input
          <div className="relative bg-[#053256] rounded-[14px] h-10 flex items-center w-64 mx-6">
            <Search className="absolute left-3 text-[#00EEEE]" size={18} />
            <Input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 rounded-[14px] bg-transparent border-none text-white placeholder-white/70 focus:ring-0 text-sm"
            />
          </div>
        ) : (
          // Mobile Search Icon Button
          <Button
            variant="ghost"
            size="icon"
            className="relative w-10 h-10 rounded-full border-2 border-vanta-neon-blue text-vanta-neon-blue hover:bg-vanta-neon-blue/10 transition-colors flex items-center justify-center"
            aria-label="Search"
            onClick={() => console.log('Search clicked')}
          >
            <Search size={20} />
          </Button>
        )}

        {/* Right Section: Auth/User UI */}
        <div className="flex items-center space-x-2 md:space-x-4 ml-auto flex-shrink-0">
          {isLoggedIn ? (
            // Logged-in UI
            <>
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white" aria-label="Notifications">
                <Bell size={20} />
              </Button>
              <Button className="bg-[#00EEEE] text-[#081028] rounded-[14px] px-3 py-1.5 text-xs md:px-6 md:py-2 md:text-sm font-bold hover:bg-[#00EEEE]/80">
                Deposit
              </Button>
              <Button variant="outline" className="bg-transparent border-2 border-vanta-neon-blue text-vanta-neon-blue rounded-[14px] px-3 py-1.5 text-xs md:px-6 md:py-2 md:text-sm font-bold hover:bg-vanta-neon-blue/10">
                ₦ 0.00
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="relative w-10 h-10 rounded-full bg-white text-gray-800 hover:bg-gray-200 transition-colors flex items-center justify-center"
                aria-label="User Profile"
                onClick={handleLogout}
              >
                <UserCircle size={20} />
                <ChevronDown size={16} className="absolute bottom-0 right-0 bg-vanta-blue-dark rounded-full text-white" />
              </Button>
            </>
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
    </>
  );
};

export default MainHeader;