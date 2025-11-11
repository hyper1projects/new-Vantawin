"use client";

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';

const ForgotPassword: React.FC = () => {
  const [identifier, setIdentifier] = useState(''); // Can be email or phone number
  const navigate = useNavigate();

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier) {
      toast.error('Please enter your email or phone number.');
      return;
    }

    console.log('Password reset requested for:', { identifier });
    toast.success('If an account exists, a reset link/code has been sent.');
    navigate('/login'); // Redirect to login after request
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-vanta-blue-dark p-4">
      <div className="bg-vanta-blue-medium p-8 rounded-[27px] shadow-lg w-full max-w-md text-vanta-text-light">
        <Button
          onClick={() => navigate(-1)} // Go back to the previous page
          variant="ghost"
          className="mb-6 text-vanta-neon-blue hover:bg-vanta-accent-dark-blue flex items-center gap-2 p-0 h-auto"
        >
          <ArrowLeft size={20} /> Back
        </Button>
        <h1 className="text-3xl font-bold text-center text-vanta-neon-blue mb-6">Forgot Password</h1>
        <p className="text-center text-gray-400 mb-6">
          Enter your registered email address or phone number to receive a password reset link or code.
        </p>
        <form onSubmit={handleResetPassword} className="space-y-6">
          <div>
            <Label htmlFor="identifier" className="text-vanta-text-light text-base font-semibold mb-2 block">
              Email or Phone Number
            </Label>
            <Input
              id="identifier"
              type="text"
              placeholder="Enter your email or phone number"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="bg-[#01112D] border-vanta-accent-dark-blue text-white placeholder-gray-500 focus:ring-vanta-neon-blue focus:border-vanta-neon-blue rounded-[14px] h-12"
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
        <p className="text-center text-sm text-gray-400 mt-6">
          Remember your password?{' '}
          <Link to="/login" className="text-vanta-neon-blue hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;