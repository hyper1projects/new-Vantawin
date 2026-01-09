"use client";

import React, { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useAuth } from '../context/AuthContext';

const NotificationSettingsTab: React.FC = () => {
  const { user, emailNotifications: contextEmail, smsNotifications: contextSms, pushNotifications: contextPush, updateUserProfile } = useAuth();

  const [emailNotifications, setEmailNotifications] = useState(contextEmail);
  const [smsNotifications, setSmsNotifications] = useState(contextSms);
  const [pushNotifications, setPushNotifications] = useState(contextPush);
  const [isSaving, setIsSaving] = useState(false);

  // Sync with AuthContext when it updates
  useEffect(() => {
    setEmailNotifications(contextEmail);
    setSmsNotifications(contextSms);
    setPushNotifications(contextPush);
  }, [contextEmail, contextSms, contextPush]);

  const handleSaveNotifications = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error('You must be logged in to update notification preferences');
      return;
    }

    setIsSaving(true);

    try {
      const { error } = await updateUserProfile(user.id, {
        email_notifications: emailNotifications,
        sms_notifications: smsNotifications,
        push_notifications: pushNotifications,
      });

      if (error) {
        toast.error(error.message || 'Failed to update notification preferences');
      } else {
        toast.success('Notification preferences updated successfully!');
      }
    } catch (err: any) {
      toast.error(err.message || 'An unexpected error occurred');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h3 className="text-xl font-bold text-white mb-2">Notification Preferences</h3>
        <p className="text-gray-400 text-sm mb-4">Manage how you receive updates and alerts</p>
      </div>

      <form onSubmit={handleSaveNotifications} className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-vanta-blue-medium/30 rounded-[14px] border border-vanta-accent-dark-blue">
            <div className="flex-1">
              <Label htmlFor="email-notifications" className="text-vanta-text-light text-base font-semibold block mb-1">
                Email Notifications
              </Label>
              <p className="text-gray-400 text-sm">Receive updates via email</p>
            </div>
            <Switch
              id="email-notifications"
              checked={emailNotifications}
              onCheckedChange={setEmailNotifications}
              className="data-[state=checked]:bg-vanta-neon-blue data-[state=unchecked]:bg-gray-600"
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-vanta-blue-medium/30 rounded-[14px] border border-vanta-accent-dark-blue">
            <div className="flex-1">
              <Label htmlFor="sms-notifications" className="text-vanta-text-light text-base font-semibold block mb-1">
                SMS Notifications
              </Label>
              <p className="text-gray-400 text-sm">Receive alerts via text message</p>
            </div>
            <Switch
              id="sms-notifications"
              checked={smsNotifications}
              onCheckedChange={setSmsNotifications}
              className="data-[state=checked]:bg-vanta-neon-blue data-[state=unchecked]:bg-gray-600"
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-vanta-blue-medium/30 rounded-[14px] border border-vanta-accent-dark-blue">
            <div className="flex-1">
              <Label htmlFor="push-notifications" className="text-vanta-text-light text-base font-semibold block mb-1">
                Push Notifications
              </Label>
              <p className="text-gray-400 text-sm">Receive browser push notifications</p>
            </div>
            <Switch
              id="push-notifications"
              checked={pushNotifications}
              onCheckedChange={setPushNotifications}
              className="data-[state=checked]:bg-vanta-neon-blue data-[state=unchecked]:bg-gray-600"
            />
          </div>
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