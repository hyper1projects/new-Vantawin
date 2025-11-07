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

interface LoginDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSwitchToSignUp: () => void;
}

const LoginDialog: React.FC<LoginDialogProps> = ({ open, onOpenChange, onSwitchToSignUp }) => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier || !password) {
      toast.error('Please enter your username/phone number and password.');
      return;
    }

    console.log('Logging in with:', { identifier, password });
    toast.success('Login successful!');
    onOpenChange(false);
    setIdentifier('');
    setPassword('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-vanta-blue-medium text-vanta-text-light border-0 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold text-center text-vanta-neon-blue">Login</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleLogin} className="space-y-6 mt-4">
          <div>
            <Label htmlFor="identifier" className="text-vanta-text-light text-base font-semibold mb-2 block">
              Username or Phone Number
            </Label>
            <Input
              id="identifier"
              type="text"
              placeholder="Enter your username or phone number"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
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
