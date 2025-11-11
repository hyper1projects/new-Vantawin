"use client";

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { sendOtpFunction } from '../integrations/supabase/functions'; // Import the new function

interface SignUpDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSwitchToLogin: () => void;
  onVerificationNeeded: (phoneNumber: string, pinId: string) => void; // Updated prop to include pinId
}

const SignUpDialog: React.FC<SignUpDialogProps> = ({ open, onOpenChange, onSwitchToLogin, onVerificationNeeded }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false); // New loading state

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber || !username || !password || !confirmPassword) {
      toast.error('Please fill in all fields.');
      return;
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    setIsLoading(true); // Start loading
    try {
      // In a real application, you would first create the user in your auth system (e.g., Supabase auth)
      // For now, we'll simulate user creation and then send OTP.
      console.log('Simulating user creation with:', { phoneNumber, username, password });

      // Call the send-otp Edge Function
      const result = await sendOtpFunction(phoneNumber);
      
      if (result && result.pinId) {
        toast.success('Sign up successful! Please verify your phone number.');
        onOpenChange(false); // Close sign-up dialog
        onVerificationNeeded(phoneNumber, result.pinId); // Open verification dialog with pinId
        setPhoneNumber('');
        setUsername('');
        setPassword('');
        setConfirmPassword('');
      } else {
        toast.error('Failed to send verification code. Please try again.');
      }
    } catch (error: any) {
      console.error('Sign up error:', error);
      toast.error(error.message || 'An unexpected error occurred during sign up.');
    } finally {
      setIsLoading(false); // End loading
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-vanta-blue-medium text-vanta-text-light border-0 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold text-center text-vanta-neon-blue">Sign Up</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSignUp} className="space-y-6 mt-4">
          <div>
            <Label htmlFor="phoneNumber" className="text-vanta-text-light text-base font-semibold mb-2 block">
              Phone Number
            </Label>
            <Input
              id="phoneNumber"
              type="tel"
              placeholder="e.g., +2348012345678"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="bg-[#01112D] border-vanta-accent-dark-blue text-white placeholder-gray-500 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-vanta-neon-blue rounded-[14px] h-12"
              required
              disabled={isLoading}
            />
          </div>
          <div>
            <Label htmlFor="username" className="text-vanta-text-light text-base font-semibold mb-2 block">
              Username
            </Label>
            <Input
              id="username"
              type="text"
              placeholder="Choose a username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="bg-[#01112D] border-vanta-accent-dark-blue text-white placeholder-gray-500 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-vanta-neon-blue rounded-[14px] h-12"
              required
              disabled={isLoading}
            />
          </div>
          <div>
            <Label htmlFor="password" className="text-vanta-text-light text-base font-semibold mb-2 block">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="Create your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-[#01112D] border-vanta-accent-dark-blue text-white placeholder-gray-500 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-vanta-neon-blue rounded-[14px] h-12"
              required
              disabled={isLoading}
            />
          </div>
          <div>
            <Label htmlFor="confirmPassword" className="text-vanta-text-light text-base font-semibold mb-2 block">
              Confirm Password
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="bg-[#01112D] border-vanta-accent-dark-blue text-white placeholder-gray-500 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-vanta-neon-blue rounded-[14px] h-12"
              required
              disabled={isLoading}
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-vanta-neon-blue text-vanta-blue-dark hover:bg-vanta-neon-blue/90 rounded-[14px] py-3 text-lg font-bold"
            disabled={isLoading}
          >
            {isLoading ? 'Signing Up...' : 'Sign Up'}
          </Button>
        </form>
        <p className="text-center text-sm text-gray-400 mt-4">
          Already have an account?{' '}
          <button
            onClick={() => {
              onOpenChange(false);
              onSwitchToLogin();
            }}
            className="text-vanta-neon-blue hover:underline"
            disabled={isLoading}
          >
            Login
          </button>
        </p>
      </DialogContent>
    </Dialog>
  );
};

export default SignUpDialog;