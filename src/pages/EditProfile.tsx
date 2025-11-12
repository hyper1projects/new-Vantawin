"use client";

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../context/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProfileSettingsTab from '../components/ProfileSettingsTab';
import SecuritySettingsTab from '../components/SecuritySettingsTab';
import NotificationSettingsTab from '../components/NotificationSettingsTab';
import { cn } from '../lib/utils';

const EditProfile: React.FC = () => {
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');

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
        <p className="mb-4">Please log in to edit your profile.</p>
        <Button onClick={() => navigate('/login')} className="bg-vanta-neon-blue text-vanta-blue-dark hover:bg-vanta-neon-blue/90 rounded-[14px]">
          Go to Login
        </Button>
      </div>
    );
  }

  const getTabTriggerClasses = (tabName: string) => {
    return cn(
      "flex-1 py-2 px-4 rounded-none text-base font-semibold transition-colors duration-200",
      activeTab === tabName
        ? "text-vanta-neon-blue border-b-2 border-vanta-neon-blue"
        : "text-gray-400 hover:text-white"
    );
  };

  return (
    <div className="p-4 max-w-4xl mx-auto text-vanta-text-light">
      <Button
        onClick={() => navigate(-1)}
        variant="ghost"
        className="mb-6 text-vanta-neon-blue hover:bg-vanta-accent-dark-blue flex items-center gap-2"
      >
        <ArrowLeft size={20} /> Back to Profile
      </Button>

      <h1 className="text-3xl font-bold text-vanta-neon-blue mb-6 text-center">Account Settings</h1>

      <Tabs defaultValue="profile" className="w-full bg-vanta-blue-medium rounded-[27px] shadow-lg" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 h-auto bg-vanta-blue-dark rounded-t-[27px] rounded-b-none border-b border-gray-700 p-0">
          <TabsTrigger value="profile" className={getTabTriggerClasses('profile')}>
            Profile
          </TabsTrigger>
          <TabsTrigger value="security" className={getTabTriggerClasses('security')}>
            Security
          </TabsTrigger>
          <TabsTrigger value="notifications" className={getTabTriggerClasses('notifications')}>
            Notifications
          </TabsTrigger>
        </TabsList>
        <TabsContent value="profile">
          <ProfileSettingsTab />
        </TabsContent>
        <TabsContent value="security">
          <SecuritySettingsTab />
        </TabsContent>
        <TabsContent value="notifications">
          <NotificationSettingsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EditProfile;