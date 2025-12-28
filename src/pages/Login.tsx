"use client";

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useAuth } from '../context/AuthContext'; // Import useAuth

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState(false);
  const navigate = useNavigate();
  const { signIn } = useAuth(); // Use signIn from AuthContext

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    // Basic validation
    if (!email || !password) {
      toast.error('Please enter your email and password.');
      return;
    }

    // Email format validation
    if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError(true);
      return;
    }

    const { error } = await signIn(email, password);

    if (!error) {
      toast.success('Login successful! Redirecting to home...');
      navigate('/');
    } else {
      console.error("Login error:", error);
      // Determine error message
      if (error.message.includes("Invalid login credentials")) {
        toast.error("Wrong password or user doesn't exist. Please sign up.");
      } else {
        toast.error(error.message || 'Login failed. Please check your credentials.');
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-vanta-blue-dark p-4">
      <div className="bg-vanta-blue-medium p-8 rounded-[27px] shadow-lg w-full max-w-md text-vanta-text-light">
        <h1 className="text-3xl font-bold text-center text-vanta-neon-blue mb-6">Login</h1>
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <Label htmlFor="email" className="text-vanta-text-light text-base font-semibold mb-2 block">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (emailError) setEmailError(false);
              }}
              className={`bg-[#01112D] border-vanta-accent-dark-blue text-white placeholder-gray-500 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-vanta-neon-blue rounded-[14px] h-12 ${emailError ? "border-red-500" : ""}`}
              required
            />
            {emailError && <p className="text-red-500 text-sm mt-1">Invalid email format</p>}
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
              <Link to="/forgot-password" className="text-vanta-neon-blue text-sm hover:underline"> {/* Link to new ForgotPassword page */}
                Forgot Password?
              </Link>
            </div>
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