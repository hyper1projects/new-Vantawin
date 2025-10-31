"use client";

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const Login: React.FC = () => {
  const [identifier, setIdentifier] = useState(''); // Can be username or phone number
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Basic validation
    if (!identifier || !password) {
      toast.error('Please enter your username/phone number and password.');
      return;
    }

    // In a real application, you would send this data to a backend for authentication.
    console.log('Logging in with:', { identifier, password });
    toast.success('Login successful! Redirecting to home...');
    navigate('/'); // Redirect to home after successful login
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-vanta-blue-dark p-4">
      <div className="bg-vanta-blue-medium p-8 rounded-[27px] shadow-lg w-full max-w-md text-vanta-text-light">
        <h1 className="text-3xl font-bold text-center text-vanta-neon-blue mb-6">Login</h1>
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <Label htmlFor="identifier" className="text-vanta-text-light text-base font-semibold mb-2 block">Username or Phone Number</Label>
            <Input
              id="identifier"
              type="text"
              placeholder="Enter your username or phone number"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="bg-[#01112D] border-vanta-accent-dark-blue text-white placeholder-gray-500 focus:ring-vanta-neon-blue focus:border-vanta-neon-blue rounded-[14px] h-12"
              required
            />
          </div>
          <div>
            <Label htmlFor="password" className="text-vanta-text-light text-base font-semibold mb-2 block">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-[#01112D] border-vanta-accent-dark-blue text-white placeholder-gray-500 focus:ring-vanta-neon-blue focus:border-vanta-neon-blue rounded-[14px] h-12"
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
        <p className="text-center text-sm text-gray-400 mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-vanta-neon-blue hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;