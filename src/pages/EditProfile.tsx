"use client";

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../context/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const EditProfile: React.FC = () => {
  const navigate = useNavigate();
  const { user, username, firstName, lastName, fetchUserProfile, updateUserProfile, isLoading } = useAuth();

  const [currentUsername, setCurrentUsername] = useState<string>('');
  const [currentFirstName, setCurrentFirstName] = useState<string>('');
  const [currentLastName, setCurrentLastName] = useState<string>('');
  const [currentAvatarUrl, setCurrentAvatarUrl] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user && !isLoading) {
      // Fetch the latest profile data when the component mounts or user changes
      const loadProfile = async () => {
        const profile = await fetchUserProfile(user.id);
        setCurrentUsername(profile.username || '');
        setCurrentFirstName(profile.firstName || '');
        setCurrentLastName(profile.lastName || '');
        // Assuming avatar_url is also part of the profile, if not, default
        // For now, using a placeholder as avatar_url is not explicitly in fetchUserProfile return type
        setCurrentAvatarUrl('/images/profile/Profile.png'); 
      };
      loadProfile();
    }
  }, [user, isLoading, fetchUserProfile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('You must be logged in to edit your profile.');
      return;
    }

    setIsSaving(true);
    const { error } = await updateUserProfile(user.id, {
      username: currentUsername,
      first_name: currentFirstName,
      last_name: currentLastName,
      avatar_url: currentAvatarUrl, // Include avatar_url in update
    });
    setIsSaving(false);

    if (!error) {
      toast.success('Profile updated successfully!');
      navigate('/users'); // Go back to the profile page
    } else {
      toast.error(error.message || 'Failed to update profile.');
    }
  };

  if (isLoading) {
    return (
      <div className="p-4 text-vanta-text-light text-center">
        <p>Loading profile data...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-4 text-vanta-text-light text-center">
        <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
        <p className="mb-4">Please log in to edit your profile.</p>
        <Button onClick={() => navigate('/login')} className="bg-vanta-neon-blue text-vanta-blue-dark hover:bg-vanta-neon-blue/90 rounded-[14px]">
          Go to Login
        </Button>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-3xl mx-auto text-vanta-text-light">
      <Button
        onClick={() => navigate(-1)}
        variant="ghost"
        className="mb-6 text-vanta-neon-blue hover:bg-vanta-accent-dark-blue flex items-center gap-2"
      >
        <ArrowLeft size={20} /> Back to Profile
      </Button>

      <h1 className="text-3xl font-bold text-vanta-neon-blue mb-6 text-center">Edit Profile</h1>

      <div className="bg-vanta-blue-medium p-8 rounded-[27px] shadow-lg">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col items-center mb-6">
            <Avatar className="h-24 w-24 mb-4">
              <AvatarImage src={currentAvatarUrl || "/placeholder.svg"} alt={currentUsername} />
              <AvatarFallback className="bg-vanta-neon-blue text-vanta-blue-dark text-3xl">
                {currentUsername ? currentUsername.substring(0, 2).toUpperCase() : 'UN'}
              </AvatarFallback>
            </Avatar>
            {/* Future: Add functionality to upload/change avatar */}
            <Button variant="outline" className="bg-transparent border-2 border-vanta-neon-blue text-vanta-neon-blue hover:bg-vanta-neon-blue/10 rounded-[14px] py-2 px-4 text-sm">
              Change Avatar
            </Button>
          </div>

          <div>
            <Label htmlFor="username" className="text-vanta-text-light text-base font-semibold mb-2 block">Username</Label>
            <Input
              id="username"
              type="text"
              placeholder="Enter your username"
              value={currentUsername}
              onChange={(e) => setCurrentUsername(e.target.value)}
              className="bg-[#01112D] border-vanta-accent-dark-blue text-white placeholder-gray-500 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-vanta-neon-blue rounded-[14px] h-12"
              required
            />
          </div>
          <div>
            <Label htmlFor="firstName" className="text-vanta-text-light text-base font-semibold mb-2 block">First Name</Label>
            <Input
              id="firstName"
              type="text"
              placeholder="Enter your first name"
              value={currentFirstName}
              onChange={(e) => setCurrentFirstName(e.target.value)}
              className="bg-[#01112D] border-vanta-accent-dark-blue text-white placeholder-gray-500 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-vanta-neon-blue rounded-[14px] h-12"
            />
          </div>
          <div>
            <Label htmlFor="lastName" className="text-vanta-text-light text-base font-semibold mb-2 block">Last Name</Label>
            <Input
              id="lastName"
              type="text"
              placeholder="Enter your last name"
              value={currentLastName}
              onChange={(e) => setCurrentLastName(e.target.value)}
              className="bg-[#01112D] border-vanta-accent-dark-blue text-white placeholder-gray-500 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-vanta-neon-blue rounded-[14px] h-12"
            />
          </div>
          
          <Button
            type="submit"
            className="w-full bg-vanta-neon-blue text-vanta-blue-dark hover:bg-vanta-neon-blue/90 rounded-[14px] py-3 text-lg font-bold"
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;