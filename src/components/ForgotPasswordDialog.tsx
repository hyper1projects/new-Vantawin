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

interface ForgotPasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSwitchToLogin: () => void;
}

const ForgotPasswordDialog: React.FC<ForgotPasswordDialogProps> = ({ open, onOpenChange, onSwitchToLogin }) => {
  const [email, setEmail] = useState(''); // Changed to email for Supabase resetPasswordForEmail
  const { resetPasswordForEmail } = useAuth(); // Use resetPasswordForEmail from AuthContext

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your email address.');
      return;
    }

    const { error } = await resetPasswordForEmail(email);

    if (!error) {
      toast.success('If an account exists, a password reset link has been sent to your email.');
      onOpenChange(false); // Close the dialog after submission
      setEmail(''); // Clear the input
      onSwitchToLogin(); // Optionally switch back to login
    } else {
      toast.error(error.message || 'Failed to send reset link. Please try again.');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-vanta-blue-medium text-vanta-text-light border-0 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold text-center text-vanta-neon-blue">Forgot Password</DialogTitle>
        </DialogHeader>
        <p className="text-center text-gray-400 mb-6">
          Enter your registered email address to receive a password reset link.
        </p>
        <form onSubmit={handleResetPassword} className="space-y-6 mt-4">
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
          <Button
            type="submit"
            className="w-full bg-vanta-neon-blue text-vanta-blue-dark hover:bg-vanta-neon-blue/90 rounded-[14px] py-3 text-lg font-bold"
          >
            Reset Password
          </Button>
        </form>
        <p className="text-center text-sm text-gray-400 mt-4">
          Remember your password?{' '}
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

export default ForgotPasswordDialog;