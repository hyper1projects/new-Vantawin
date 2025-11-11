"use client";

import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import LoginDialog from './LoginDialog';
import SignUpDialog from './SignUpDialog';
import ForgotPasswordDialog from './ForgotPasswordDialog';
import VerifyPhoneDialog from './VerifyPhoneDialog';
import { toast } from 'sonner';
import { cn } from '../lib/utils';
import { useIsMobile } from '../hooks/use-mobile';

const sportsCategories = ['Football', 'Basketball', 'Tennis', 'Esports'];

const MainHeader: React.FC = () => {
  const [loginOpen, setLoginOpen] = useState(false);
  const [signUpOpen, setSignUpOpen] = useState(false);
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [verifyPhoneOpen, setVerifyPhoneOpen] = useState(false);
  const [phoneToVerify, setPhoneToVerify] = useState('');
  const [pinIdForVerification, setPinIdForVerification] = useState(''); // New state for pinId
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Simulate login state
  const isMobile = useIsMobile();

  const location = useLocation();
  const currentPath = location.pathname;
  const queryParams = new URLSearchParams(location.search);
  const activeCategoryParam = queryParams.get('category') || 'football'; // Default to 'football' if no param

  // Function to determine if a category is active
  const isActive = (category: string) => {
    const categorySlug = category.toLowerCase().replace('.', '');
    return currentPath === '/games' && activeCategoryParam === categorySlug;
  };

  const handleCategoryClick = (category: string) => {
    // Update URL with the new category query parameter
    window.location.href = `/games?category=${category.toLowerCase().replace('.', '')}`;
  };

  const handleVerificationNeeded = (phoneNumber: string, pinId: string) => {
    setPhoneToVerify(phoneNumber);
    setPinIdForVerification(pinId); // Store the pinId
    setVerifyPhoneOpen(true);
  };

  const handleVerificationSuccess = () => {
    setVerifyPhoneOpen(false);
    setPhoneToVerify('');
    setPinIdForVerification(''); // Clear pinId after successful verification
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
      <div className="fixed top-0 left-0 right-0 h-16 flex items-center justify-between px-4 pr-20 border-b border-gray-700 z-50 font-outfit bg-vanta-blue-dark">
        {/* Left Section: Logo, Sports Categories and How to play */}
        <div className="flex items-center space-x-8">
          {/* VantaWin Logo */}
          <div className="flex items-center">
            <span className="text-xl font-bold text-vanta-text-light">VANTA</span>
            <span className="text-xl font-bold text-vanta-neon-blue">WIN</span>
          </div>
          <div className="flex items-center space-x-6">
          {sportsCategories.map((category) => (
            <Link 
              key={category} 
              to={`/games?category=${category.toLowerCase().replace('.', '')}`} // All categories route to /games with a query param
            >
              <Button
                variant="ghost"
                className={`font-medium text-sm ${isActive(category) ? 'text-[#00EEEE]' : 'text-[#B4B2C0]'} hover:bg-transparent p-0 h-auto`}
              >
                {category}
              </Button>
            </Link>
          ))}
          {/* How to play link */}
          <Link to="/how-to-play" className="flex items-center space-x-1 ml-4">
            <AlertCircle size={18} className="text-[#00EEEE]" />
            <Button variant="ghost" className="text-[#02A7B4] font-medium text-sm hover:bg-transparent p-0 h-auto">
              How to play
            </Button>
          </Link>
        </div>
        </div>

        {/* Middle Section: Search Bar */}
        <div className="flex-grow max-w-lg mx-8 relative bg-[#053256] rounded-[14px] h-10 flex items-center">
          <Search className="absolute left-3 text-[#00EEEE]" size={18} />
          <Input
            type="text"
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2 rounded-[14px] bg-transparent border-none text-white placeholder-white/70 focus:ring-0"
          />
        </div>

        {/* Right Section: Login, Register */}
        <div className="flex items-center space-x-4">
          <Button 
            onClick={() => setLoginOpen(true)} // Directly open Login dialog
            className="bg-transparent text-white border border-[#00EEEE] rounded-[14px] px-6 py-2 font-bold text-sm hover:bg-[#00EEEE]/10"
          >
            Login
          </Button>
          <Button 
            onClick={() => setSignUpOpen(true)} // Directly open Sign Up dialog
            className="bg-[#00EEEE] text-[#081028] rounded-[14px] px-6 py-2 font-bold text-sm hover:bg-[#00EEEE]/80"
          >
            Sign up
          </Button>
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
        initialPinId={pinIdForVerification} // Pass the pinId here
        onVerificationSuccess={handleVerificationSuccess}
      />
    </>
  );
};

export default MainHeader;