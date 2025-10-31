"use client";

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const SignUp: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); // New state for confirm password
  const navigate = useNavigate();

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    // Basic validation
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

    // In a real application, you would send this data to a backend for registration.
    console.log('Signing up with:', { phoneNumber, username, password });
    toast.success('Sign up successful! Redirecting to login...');
    navigate('/login'); // Redirect to login after successful sign-up
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-vanta-blue-dark p-4">
      <div className="bg-vanta-blue-medium p-8 rounded-[27px] shadow-lg w-full max-w-md text-vanta-text-light">
        <h1 className="text-3xl font-bold text-center text-vanta-neon-blue mb-6">Sign Up</h1>
        <form onSubmit={handleSignUp} className="space-y-6">
          <div>
            <Label htmlFor="phoneNumber" className="text-vanta-text-light text-base font-semibold mb-2 block">Phone Number</Label>
            <Input
              id="phoneNumber"
              type="tel"
              placeholder="e.g., +2348012345678"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="bg-[#01112D] border-vanta-accent-dark-blue text-white placeholder-gray-500 focus:ring-vanta-neon-blue focus:border-vanta-neon-blue rounded-[14px] h-12"
              required
            />
          </div>
          <div>
            <Label htmlFor="username" className="text-vanta-text-light text-base font-semibold mb-2 block">Username</Label>
            <Input
              id="username"
              type="text"
              placeholder="Choose a username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="bg-[#01112D] border-vanta-accent-dark-blue text-white placeholder-gray-500 focus:ring-vanta-neon-blue focus:border-vanta-neon-blue rounded-[14px] h-12"
              required
            />
          </div>
          <div>
            <Label htmlFor="password" className="text-vanta-text-light text-base font-semibold mb-2 block">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Create your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-[#01112D] border-vanta-accent-dark-blue text-white placeholder-gray-500 focus:ring-vanta-neon-blue focus:border-vanta-neon-blue rounded-[14px] h-12"
              required
            />
          </div>
          {/* New Confirm Password field */}
          <div>
            <Label htmlFor="confirmPassword" className="text-vanta-text-light text-base font-semibold mb-2 block">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="bg-[#01112D] border-vanta-accent-dark-blue text-white placeholder-gray-500 focus:ring-vanta-neon-blue focus:border-vanta-neon-blue rounded-[14px] h-12"
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
        <p className="text-center text-sm text-gray-400 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-vanta-neon-blue hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;