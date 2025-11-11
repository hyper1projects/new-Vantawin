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

interface LoginDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSwitchToSignUp: () => void;
  onSwitchToForgotPassword: () => void;
}

const LoginDialog: React.FC<LoginDialogProps> = ({ open, onOpenChange, onSwitchToSignUp, onSwitchToForgotPassword }) => {
  const [email, setEmail] = useState(''); // Changed to email for Supabase signInWithPassword
  const [password, setPassword] = useState('');
  const { signIn } = useAuth(); // Use signIn from AuthContext

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter your email and password.');
      return;
    }

    const { error } = await signIn(email, password);

    if (!error) {
      toast.success('Login successful!');
      onOpenChange(false); // Close dialog on success
      setEmail('');
      setPassword('');
    } else {
      toast.error(error.message || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-vanta-blue-medium text-vanta-text-light border-0 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold text-center text-vanta-neon-blue">Login</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleLogin} className="space-y-6 mt-4">
          <div>
            <Label htmlFor="email" className="text-vanta-text-light text-base font-semibold mb-2 block">
              Email
            </Label>
            <Input
              id="email"
              type="email" // Changed type to email
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-[#01112D] border-vanta-accent-dark-blue text-white placeholder-gray-500 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-vanta-neon-blue rounded-[14px] h-12"
              required
            />
            <div className="text-right mt-2">
              <button 
                type="button"
                onClick={onSwitchToForgotPassword}
                className="text-vanta-neon-blue text-sm hover:underline"
              >
                Forgot Password?
              </button>
            </div>
          </div>
          <Button
            type="submit"
            className="w-full bg-vanta-neon-blue text-vanta-blue-dark hover:bg-vanta-neon-blue/90 rounded-[14px] py-3 text-lg font-bold"
          >
            Login
          </Button>
        </form>
        <p className="text-center text-sm text-gray-400 mt-4">
          Don't have an account?{' '}
          <button
            onClick={() => {
              onOpenChange(false);
              onSwitchToSignUp();
            }}
            className="text-vanta-neon-blue hover:underline"
          >
            Sign Up
          </button>
        </p>
      </DialogContent>
    </Dialog>
  );
};

export default LoginDialog;