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
import { useAuth } from '../context/AuthContext'; // Import useAuth

interface SignUpDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSwitchToLogin: () => void;
  // Removed onVerificationNeeded as phone verification is no longer used
}

const SignUpDialog: React.FC<SignUpDialogProps> = ({ open, onOpenChange, onSwitchToLogin }) => {
  const [email, setEmail] = useState(''); // Changed to email
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { signUp } = useAuth(); // Use signUp from AuthContext

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Attempting sign up...'); // Added log
    if (!email || !username || !password || !confirmPassword) {
      toast.error('Please fill in all fields.');
      console.log('Validation failed: Missing fields.'); // Added log
      return;
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters long.');
      console.log('Validation failed: Password too short.'); // Added log
      return;
    }
    if (password !== confirmPassword) {
      toast.error('Passwords do not match.');
      console.log('Validation failed: Passwords do not match.'); // Added log
      return;
    }

    // Call signUp with email instead of phone number
    const { data, error } = await signUp(email, username, password);
    console.log('Supabase signUp response:', { data, error }); // Added log

    if (!error) {
      toast.success('Sign up successful! Please check your email for a verification link.');
      onOpenChange(false); // Close sign-up dialog
      onSwitchToLogin(); // Redirect to login
      setEmail('');
      setUsername('');
      setPassword('');
      setConfirmPassword('');
    } else {
      toast.error(error.message || 'Sign up failed. Please try again.');
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
            <Label htmlFor="email" className="text-vanta-text-light text-base font-semibold mb-2 block">
              Email
            </Label>
            <Input
              id="email"
              type="email" // Changed type to email
              placeholder="e.g., your@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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