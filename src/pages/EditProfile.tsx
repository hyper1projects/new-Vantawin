"use client";

import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import ProfileSettingsTab from '@/components/ProfileSettingsTab';
import SecuritySettingsTab from '@/components/SecuritySettingsTab';
import NotificationSettingsTab from '@/components/NotificationSettingsTab';

const EditProfile: React.FC = () => {
  const [activeTab, setActiveTab] = useState('profile');

  const getTabTriggerClasses = (tabValue: string) => {
    return cn(
      "relative px-4 py-2 text-lg font-semibold transition-colors duration-200",
      "bg-transparent text-vanta-text-light hover:text-vanta-neon-blue", // Added bg-transparent here
      "data-[state=active]:text-vanta-neon-blue data-[state=active]:bg-transparent",
      "data-[state=active]:after:absolute data-[state=active]:after:bottom-0 data-[state=active]:after:left-1/2 data-[state=active]:after:-translate-x-1/2",
      "data-[state=active]:after:h-[3px] data-[state=active]:after:w-full data-[state=active]:after:bg-vanta-neon-blue data-[state=active]:after:rounded-full"
    );
  };

  return (
    <div className="bg-vanta-blue-dark text-white p-8 flex-1 overflow-y-auto [-webkit-scrollbar:none] [scrollbar-width:none] max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-8 text-center">Edit Profile</h1>

      <Tabs defaultValue="profile" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 p-0 pb-4 mb-8 border-b border-gray-700/50">
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
        <TabsContent 
          value="profile" 
          className="bg-vanta-blue-medium rounded-xl p-0"
        >
          <ProfileSettingsTab />
        </TabsContent>
        <TabsContent 
          value="security" 
          className="bg-vanta-blue-medium rounded-xl p-0"
        >
          <SecuritySettingsTab />
        </TabsContent>
        <TabsContent 
          value="notifications" 
          className="bg-vanta-blue-medium rounded-xl p-0"
        >
          <NotificationSettingsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EditProfile;