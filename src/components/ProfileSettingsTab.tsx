"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CalendarIcon, Upload } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../context/AuthContext';
import { cn } from '../lib/utils';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

const ProfileSettingsTab: React.FC = () => {
  const { user, username, firstName, lastName, mobileNumber, dateOfBirth, gender, walletAddress, avatarUrl, fetchUserProfile, updateUserProfile, isLoading } = useAuth();

  const [currentUsername, setCurrentUsername] = useState<string>('');
  const [currentFirstName, setCurrentFirstName] = useState<string>('');
  const [currentLastName, setCurrentLastName] = useState<string>('');
  const [currentMobileNumber, setCurrentMobileNumber] = useState<string>('');
  const [currentDateOfBirth, setCurrentDateOfBirth] = useState<Date | undefined>(undefined);
  const [currentGender, setCurrentGender] = useState<string>('');
  const [currentWalletAddress, setCurrentWalletAddress] = useState<string>('');
  const [currentAvatarUrl, setCurrentAvatarUrl] = useState<string>('/images/profile/Profile.png'); // Default avatar
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user && !isLoading) {
      const loadProfile = async () => {
        const profile = await fetchUserProfile(user.id);
        setCurrentUsername(profile.username || '');
        setCurrentFirstName(profile.firstName || '');
        setCurrentLastName(profile.lastName || '');
        setCurrentMobileNumber(profile.mobileNumber || '');
        setCurrentDateOfBirth(profile.dateOfBirth ? new Date(profile.dateOfBirth) : undefined);
        setCurrentGender(profile.gender || '');
        setCurrentWalletAddress(profile.walletAddress || '');
        setCurrentAvatarUrl(profile.avatarUrl || '/images/profile/Profile.png');
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
      mobile_number: currentMobileNumber,
      date_of_birth: currentDateOfBirth ? format(currentDateOfBirth, 'yyyy-MM-dd') : undefined,
      gender: currentGender,
      wallet_address: currentWalletAddress,
      avatar_url: currentAvatarUrl,
    });
    setIsSaving(false);

    if (!error) {
      toast.success('Profile updated successfully!');
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
        <p>Please log in to view your profile.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-6">
      <div className="flex items-center space-x-6 mb-6">
        <Avatar className="h-24 w-24">
          <AvatarImage src={currentAvatarUrl} alt={currentUsername} />
          <AvatarFallback className="bg-vanta-neon-blue text-vanta-blue-dark text-3xl">
            {currentUsername ? currentUsername.substring(0, 2).toUpperCase() : 'UN'}
          </AvatarFallback>
        </Avatar>
        <Button variant="outline" className="bg-transparent border-2 border-vanta-neon-blue text-vanta-neon-blue hover:bg-vanta-neon-blue/10 rounded-[14px] py-2 px-4 text-sm flex items-center space-x-2">
          <Upload size={18} />
          <span>Upload</span>
        </Button>
      </div>

      <div>
        <Label htmlFor="mobileNumber" className="text-vanta-text-light text-base font-semibold mb-2 block">Mobile Number</Label>
        <Input
          id="mobileNumber"
          type="tel"
          placeholder="Enter your mobile number"
          value={currentMobileNumber}
          onChange={(e) => setCurrentMobileNumber(e.target.value)}
          className="bg-[#01112D] border-vanta-accent-dark-blue text-white placeholder-gray-500 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-vanta-neon-blue rounded-[14px] h-12"
        />
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

      <div>
        <Label htmlFor="walletAddress" className="text-vanta-text-light text-base font-semibold mb-2 block">Wallet Address (ERC-20)</Label>
        <Input
          id="walletAddress"
          type="text"
          placeholder="0x..."
          value={currentWalletAddress}
          onChange={(e) => setCurrentWalletAddress(e.target.value)}
          className="bg-[#01112D] border-vanta-accent-dark-blue text-white placeholder-gray-500 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-vanta-neon-blue rounded-[14px] h-12"
        />
      </div>

      <div>
        <Label htmlFor="dateOfBirth" className="text-vanta-text-light text-base font-semibold mb-2 block">Date of Birth</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal bg-[#01112D] border-vanta-accent-dark-blue text-white placeholder-gray-500 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-vanta-neon-blue rounded-[14px] h-12",
                !currentDateOfBirth && "text-gray-500"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {currentDateOfBirth ? format(currentDateOfBirth, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 bg-vanta-blue-medium border-vanta-accent-dark-blue text-vanta-text-light" align="start">
            <Calendar
              mode="single"
              selected={currentDateOfBirth}
              onSelect={setCurrentDateOfBirth}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <div>
        <Label className="text-vanta-text-light text-base font-semibold mb-2 block">Gender</Label>
        <RadioGroup value={currentGender} onValueChange={setCurrentGender} className="flex space-x-4">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="male" id="gender-male" className="text-vanta-neon-blue border-vanta-accent-dark-blue" />
            <Label htmlFor="gender-male" className="text-vanta-text-light">Male</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="female" id="gender-female" className="text-vanta-neon-blue border-vanta-accent-dark-blue" />
            <Label htmlFor="gender-female" className="text-vanta-text-light">Female</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="rather not say" id="gender-not-say" className="text-vanta-neon-blue border-vanta-accent-dark-blue" />
            <Label htmlFor="gender-not-say" className="text-vanta-text-light">Rather not say</Label>
          </div>
        </RadioGroup>
      </div>

      <div>
        <Label htmlFor="email" className="text-vanta-text-light text-base font-semibold mb-2 block">Email</Label>
        <Input
          id="email"
          type="email"
          value={user.email || ''}
          className="bg-[#01112D] border-vanta-accent-dark-blue text-gray-500 rounded-[14px] h-12 cursor-not-allowed"
          readOnly
          disabled
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
  );
};

export default ProfileSettingsTab;