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

interface SignUpDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSwitchToLogin: () => void;
}

const SignUpDialog: React.FC<SignUpDialogProps> = ({ open, onOpenChange, onSwitchToLogin }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSignUp = (e: React.FormEvent) => {
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

    console.log('Signing up with:', { phoneNumber, username, password });
    toast.success('Sign up successful! You can now log in.');
    onOpenChange(false);
    setPhoneNumber('');
    setUsername('');
    setPassword('');
    setConfirmPassword('');
    onSwitchToLogin();
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
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-vanta-neon-blue text-vanta-blue-dark hover:bg-vanta-neon-blue/90 rounded-[14px] py-3 text-lg font-bold"
          >
            Sign Up
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
          >
            Login
          </button>
        </p>
      </DialogContent>
    </Dialog>
  );
};

export default SignUpDialog;
