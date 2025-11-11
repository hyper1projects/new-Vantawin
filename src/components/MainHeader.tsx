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

const MainHeader: React.FC = () => {
  const [loginOpen, setLoginOpen] = useState(false);
  const [signUpOpen, setSignUpOpen] = useState(false);
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [verifyPhoneOpen, setVerifyPhoneOpen] = useState(false);
  const [phoneToVerify, setPhoneToVerify] = useState('');
  
  // Removed sportsCategories and isActive function as they are moving to SportsSubNavbar
  // Removed 'How to play' link as it is moving to SportsSubNavbar

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

  return (
    <div className="fixed top-0 left-0 right-0 h-16 flex items-center justify-between px-4 md:px-8 border-b border-gray-700 z-50 font-outfit bg-vanta-blue-dark">
      {/* Leftmost: VantaWin Logo */}
      <Link to="/" className="flex items-center cursor-pointer">
        <span className="text-xl font-bold text-vanta-text-light">VANTA</span>
        <span className="text-xl font-bold text-vanta-neon-blue">WIN</span>
      </Link>

      {/* Right Section: Search Icon, Login, Register */}
      <div className="flex items-center space-x-2 md:space-x-4 ml-auto"> {/* Pushed to the right */}
        {/* Search Icon Button */}
        <Button
          variant="ghost"
          size="icon"
          className="relative w-10 h-10 rounded-full border-2 border-vanta-neon-blue text-vanta-neon-blue hover:bg-vanta-neon-blue/10 transition-colors flex items-center justify-center"
          aria-label="Search"
          onClick={() => console.log('Search clicked')} // Placeholder for search functionality
        >
          <Search size={20} />
        </Button>

        {/* Login Button */}
        <Button 
          onClick={() => setLoginOpen(true)}
          className="bg-transparent text-white border border-[#00EEEE] rounded-[14px] px-3 py-1.5 text-xs md:px-6 md:py-2 md:text-sm font-bold hover:bg-[#00EEEE]/10"
        >
          Login
        </Button>
        {/* Sign up Button */}
        <Button 
          onClick={() => setSignUpOpen(true)}
          className="bg-[#00EEEE] text-[#081028] rounded-[14px] px-3 py-1.5 text-xs md:px-6 md:py-2 md:text-sm font-bold hover:bg-[#00EEEE]/80"
        >
          Sign up
        </Button>
      </div>

      {/* Login, SignUp, ForgotPassword, and VerifyPhone Dialogs */}
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