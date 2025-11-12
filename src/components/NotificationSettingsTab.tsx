"use client";

import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const NotificationSettingsTab: React.FC = () => {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveNotifications = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    // Simulate API call to save notification settings
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSaving(false);
    toast.success('Notification settings updated!');
  };

  return (
    <div className="p-6 space-y-6">
      <h3 className="text-xl font-bold text-white mb-4">Notification Preferences</h3>
      <form onSubmit={handleSaveNotifications} className="space-y-6">
        <div className="flex items-center justify-between">
          <Label htmlFor="email-notifications" className="text-vanta-text-light text-base font-semibold">Email Notifications</Label>
          <Switch
            id="email-notifications"
            checked={emailNotifications}
            onCheckedChange={setEmailNotifications}
            className="data-[state=checked]:bg-vanta-neon-blue data-[state=unchecked]:bg-gray-600"
          />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="sms-notifications" className="text-vanta-text-light text-base font-semibold">SMS Notifications</Label>
          <Switch
            id="sms-notifications"
            checked={smsNotifications}
            onCheckedChange={setSmsNotifications}
            className="data-[state=checked]:bg-vanta-neon-blue data-[state=unchecked]:bg-gray-600"
          />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="push-notifications" className="text-vanta-text-light text-base font-semibold">Push Notifications</Label>
          <Switch
            id="push-notifications"
            checked={pushNotifications}
            onCheckedChange={setPushNotifications}
            className="data-[state=checked]:bg-vanta-neon-blue data-[state=unchecked]:bg-gray-600"
          />
        </div>
        <Button
          type="submit"
          className="w-full bg-vanta-neon-blue text-vanta-blue-dark hover:bg-vanta-neon-blue/90 rounded-[14px] py-3 text-lg font-bold mt-8"
          disabled={isSaving}
        >
          {isSaving ? 'Saving...' : 'Save Preferences'}
        </Button>
      </form>
    </div>
  );
};

export default NotificationSettingsTab;