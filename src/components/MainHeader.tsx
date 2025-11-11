"use client";

import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, AlertCircle, LogOut } from 'lucide-react'; // Import LogOut icon
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import LoginDialog from './LoginDialog';
import SignUpDialog from './SignUpDialog';
import ForgotPasswordDialog from './ForgotPasswordDialog';
// Removed VerifyPhoneDialog import
import { toast } from 'sonner';
import { cn } from '../lib/utils';
import { useIsMobile } from '../hooks/use-mobile';
import { useAuth } from '../context/AuthContext'; // Import useAuth

const sportsCategories = ['Football', 'Basketball', 'Tennis', 'Esports'];

const MainHeader: React.FC = () => {
  const [loginOpen, setLoginOpen] = useState(false);
  const [signUpOpen, setSignUpOpen] = useState(false);
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  // Removed verifyPhoneOpen state
  // Removed phoneToVerify state
  
  const { user, username, signOut, isLoading } = useAuth(); // Use the auth context
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

  // Removed handleVerificationNeeded function
  // Removed handleVerificationSuccess function

  const handleLogout = async () => {
    const { error } = await signOut();
    if (!error) {
      toast.info('Logged out successfully.');
    } else {
      toast.error('Failed to log out.');
    }
  };

  if (isLoading) {
    return null; // Or a loading spinner
  }

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
          <Link to="/how-it-works" className="flex items-center space-x-1 ml-4">
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

        {/* Right Section: Login, Register or User Balance */}
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              {/* Display user balance */}
              <div className="flex items-center justify-center bg-[#01112D] border border-vanta-neon-blue rounded-lg px-4 py-2">
                <span className="text-vanta-text-light text-base font-semibold">₦ 0.00</span> {/* Placeholder balance */}
              </div>
              <Button 
                onClick={handleLogout}
                className="bg-transparent text-white border border-[#00EEEE] rounded-[14px] px-6 py-2 font-bold text-sm hover:bg-[#00EEEE]/10 flex items-center gap-2"
              >
                <LogOut size={18} /> Logout
              </Button>
            </>
          ) : (
            <>
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
      />
      <SignUpDialog 
        open={signUpOpen} 
        onOpenChange={setSignUpOpen}
        onSwitchToLogin={() => {
          setSignUpOpen(false);
          setLoginOpen(true);
        }}
        // Removed onVerificationNeeded prop
      />
      <ForgotPasswordDialog
        open={forgotPasswordOpen}
        onOpenChange={setForgotPasswordOpen}
        onSwitchToLogin={() => {
          setForgotPasswordOpen(false);
          setLoginOpen(true);
        }}
      />
      {/* Removed VerifyPhoneDialog */}
    </>
  );
};

export default MainHeader;