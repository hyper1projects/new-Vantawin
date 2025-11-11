"use client";

import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, AlertCircle, UserCircle } from 'lucide-react'; // Added UserCircle for logged-in state
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input'; // Still needed for dialogs, but not directly in header
import LoginDialog from './LoginDialog';
import SignUpDialog from './SignUpDialog';
import ForgotPasswordDialog from './ForgotPasswordDialog';
import VerifyPhoneDialog from './VerifyPhoneDialog';
import { toast } from 'sonner';
import { useIsMobile } from '../hooks/use-mobile'; // Import useIsMobile

const MainHeader: React.FC = () => {
  const [loginOpen, setLoginOpen] = useState(false);
  const [signUpOpen, setSignUpOpen] = useState(false);
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [verifyPhoneOpen, setVerifyPhoneOpen] = useState(false);
  const [phoneToVerify, setPhoneToVerify] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Simulate login state
  const isMobile = useIsMobile(); // Get mobile status

  const sportsCategories = ['Football', 'Basketball', 'Tennis', 'Esports']; // Re-added
  const location = useLocation();
  const currentPath = location.pathname;
  const queryParams = new URLSearchParams(location.search);
  const activeCategoryParam = queryParams.get('category') || 'football';

  const isActive = (category: string) => {
    const categorySlug = category.toLowerCase().replace('.', '');
    return currentPath === '/games' && activeCategoryParam === categorySlug;
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
      {/* Left Section: Logo */}
      <Link to="/" className="flex items-center cursor-pointer">
        <span className="text-xl font-bold text-vanta-text-light">VANTA</span>
        <span className="text-xl font-bold text-vanta-neon-blue">WIN</span>
      </Link>

      {/* Middle Section: Sports Categories & How to Play (Desktop only) */}
      {!isMobile && (
        <div className="flex items-center space-x-6 mx-auto"> {/* Centered on desktop */}
          {sportsCategories.map((category) => (
            <Link 
              key={category} 
              to={`/games?category=${category.toLowerCase().replace('.', '')}`}
            >
              <Button
                variant="ghost"
                className={`font-medium text-sm ${isActive(category) ? 'text-[#00EEEE]' : 'text-[#B4B2C0]'} hover:bg-transparent p-0 h-auto`}
              >
                {category}
              </Button>
            </Link>
          ))}
          <Link to="/how-it-works" className="flex items-center space-x-1"> {/* Changed to /how-it-works */}
            <AlertCircle size={18} className="text-[#00EEEE]" />
            <Button variant="ghost" className="text-[#02A7B4] font-medium text-sm hover:bg-transparent p-0 h-auto">
              How to play
            </Button>
          </Link>
        </div>
      )}

      {/* Right Section: Search, Auth/User UI */}
      <div className="flex items-center space-x-2 md:space-x-4 ml-auto">
        {/* Search Component */}
        <Button
          variant="ghost"
          size="icon"
          className="relative w-10 h-10 rounded-full border-2 border-vanta-neon-blue text-vanta-neon-blue hover:bg-vanta-neon-blue/10 transition-colors flex items-center justify-center"
          aria-label="Search"
          onClick={() => console.log('Search clicked')}
        >
          <Search size={20} />
        </Button>

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