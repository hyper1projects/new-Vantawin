"use client";

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'; // Import Avatar components

const Users: React.FC = () => {
  const { user, username, firstName, lastName, isLoading, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const { error } = await signOut();
    if (!error) {
      toast.info('Logged out successfully.');
      navigate('/'); // Redirect to home after logout
    } else {
      toast.error('Failed to log out.');
    }
  };

  if (isLoading) {
    return (
      <div className="p-4 text-vanta-text-light text-center">
        <p>Loading user data...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-4 text-vanta-text-light text-center">
        <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
        <p className="mb-4">Please log in to view your profile.</p>
        <Button onClick={() => navigate('/login')} className="bg-vanta-neon-blue text-vanta-blue-dark hover:bg-vanta-neon-blue/90 rounded-[14px]">
          Go to Login
        </Button>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <Card className="bg-vanta-blue-medium border-vanta-accent-dark-blue text-vanta-text-light rounded-[27px] shadow-lg">
        <CardHeader className="text-center">
          <Avatar className="h-24 w-24 mx-auto mb-4">
            <AvatarImage src="/placeholder.svg" alt={username || "User"} />
            <AvatarFallback className="bg-vanta-neon-blue text-vanta-blue-dark text-4xl">
              {username ? username.substring(0, 2).toUpperCase() : 'UN'}
            </AvatarFallback>
          </Avatar>
          <CardTitle className="text-3xl font-bold text-vanta-neon-blue">My Account</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="email" className="text-vanta-text-light text-base font-semibold mb-2 block">Email</Label>
              <Input
                id="email"
                type="email"
                value={user.email || ''}
                readOnly
                className="bg-[#01112D] border-vanta-accent-dark-blue text-white placeholder-gray-500 focus-visible:ring-0 focus-visible:ring-offset-0 rounded-[14px] h-12"
              />
            </div>
            <div>
              <Label htmlFor="username" className="text-vanta-text-light text-base font-semibold mb-2 block">Username</Label>
              <Input
                id="username"
                type="text"
                value={username || ''}
                readOnly
                className="bg-[#01112D] border-vanta-accent-dark-blue text-white placeholder-gray-500 focus-visible:ring-0 focus-visible:ring-offset-0 rounded-[14px] h-12"
              />
            </div>
            <div>
              <Label htmlFor="firstName" className="text-vanta-text-light text-base font-semibold mb-2 block">First Name</Label>
              <Input
                id="firstName"
                type="text"
                value={firstName || ''}
                readOnly
                className="bg-[#01112D] border-vanta-accent-dark-blue text-white placeholder-gray-500 focus-visible:ring-0 focus-visible:ring-offset-0 rounded-[14px] h-12"
              />
            </div>
            <div>
              <Label htmlFor="lastName" className="text-vanta-text-light text-base font-semibold mb-2 block">Last Name</Label>
              <Input
                id="lastName"
                type="text"
                value={lastName || ''}
                readOnly
                className="bg-[#01112D] border-vanta-accent-dark-blue text-white placeholder-gray-500 focus-visible:ring-0 focus-visible:ring-offset-0 rounded-[14px] h-12"
              />
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-4 mt-8">
            <Button
              onClick={() => toast.info('Edit Profile functionality coming soon!')}
              className="flex-1 bg-vanta-neon-blue text-vanta-blue-dark hover:bg-vanta-neon-blue/90 rounded-[14px] py-3 text-lg font-bold"
            >
              Edit Profile
            </Button>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="flex-1 bg-transparent border-2 border-red-500 text-red-400 hover:bg-red-500/10 rounded-[14px] py-3 text-lg font-bold"
            >
              Logout
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Users;