"use client";

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '../context/AuthContext';
import LoginDialog from './LoginDialog';
import SignUpDialog from './SignUpDialog';
import ForgotPasswordDialog from './ForgotPasswordDialog';
import { toast } from 'sonner';

const MainHeader: React.FC = () => {
  const { user, username, signOut } = useAuth();
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false);
  const [isSignUpDialogOpen, setIsSignUpDialogOpen] = useState(false);
  const [isForgotPasswordDialogOpen, setIsForgotPasswordDialogOpen] = useState(false);

  const handleLogout = async () => {
    const { error } = await signOut();
    if (!error) {
      toast.success('Logged out successfully!');
    } else {
      toast.error('Failed to log out.');
    }
  };

  const handleSwitchToLogin = () => {
    setIsSignUpDialogOpen(false);
    setIsForgotPasswordDialogOpen(false);
    setIsLoginDialogOpen(true);
  };

  const handleSwitchToSignUp = () => {
    setIsLoginDialogOpen(false);
    setIsForgotPasswordDialogOpen(false);
    setIsSignUpDialogOpen(true);
  };

  const handleSwitchToForgotPassword = () => {
    setIsLoginDialogOpen(false);
    setIsSignUpDialogOpen(false);
    setIsForgotPasswordDialogOpen(true);
  };

  return (
    <header className="bg-vanta-blue-dark text-vanta-text-light p-4 flex justify-between items-center shadow-md">
      <div className="flex items-center space-x-4">
        <Link to="/" className="text-2xl font-bold text-vanta-neon-blue">
          Vantawin
        </Link>
        <nav className="hidden md:flex space-x-6">
          <Link to="/games" className="hover:text-vanta-neon-blue transition-colors">
            Games
          </Link>
          <Link to="/pools" className="hover:text-vanta-neon-blue transition-colors">
            Pools
          </Link>
          <Link to="/leaderboard" className="hover:text-vanta-neon-blue transition-colors">
            Leaderboard
          </Link>
        </nav>
      </div>

      <div className="flex items-center space-x-4">
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user.user_metadata?.avatar_url || "https://github.com/shadcn.png"} alt="@username" />
                  <AvatarFallback>{username ? username.charAt(0).toUpperCase() : 'U'}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-vanta-blue-medium text-vanta-text-light border-vanta-accent-dark-blue" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{username || user.email}</p>
                  <p className="text-xs leading-none text-gray-400">
                    {user.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-vanta-accent-dark-blue" />
              <DropdownMenuItem className="focus:bg-vanta-accent-dark-blue focus:text-vanta-neon-blue">
                <Link to="/wallet" className="w-full">Wallet</Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="focus:bg-vanta-accent-dark-blue focus:text-vanta-neon-blue">
                <Link to="/profile" className="w-full">Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-vanta-accent-dark-blue" />
              <DropdownMenuItem onClick={handleLogout} className="focus:bg-vanta-accent-dark-blue focus:text-vanta-neon-blue cursor-pointer">
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <>
            <Button
              onClick={() => setIsLoginDialogOpen(true)}
              className="bg-vanta-neon-blue text-vanta-blue-dark hover:bg-vanta-neon-blue/90 rounded-[14px] px-6 py-2 font-bold"
            >
              Login
            </Button>
            <Button
              onClick={() => setIsSignUpDialogOpen(true)}
              className="bg-transparent border border-vanta-neon-blue text-vanta-neon-blue hover:bg-vanta-neon-blue hover:text-vanta-blue-dark rounded-[14px] px-6 py-2 font-bold"
            >
              Sign Up
            </Button>
          </>
        )}
      </div>

      <LoginDialog
        open={isLoginDialogOpen}
        onOpenChange={setIsLoginDialogOpen}
        onSwitchToSignUp={handleSwitchToSignUp}
        onSwitchToForgotPassword={handleSwitchToForgotPassword}
      />
      <SignUpDialog
        open={isSignUpDialogOpen}
        onOpenChange={setIsSignUpDialogOpen}
        onSwitchToLogin={handleSwitchToLogin}
      />
      <ForgotPasswordDialog
        open={isForgotPasswordDialogOpen}
        onOpenChange={setIsForgotPasswordDialogOpen}
        onSwitchToLogin={handleSwitchToLogin}
      />
    </header>
  );
};

export default MainHeader;