"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const SecuritySettingsTab: React.FC = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      toast.error('Please fill in all password fields.');
      return;
    }
    if (newPassword.length < 6) {
      toast.error('New password must be at least 6 characters long.');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      toast.error('New passwords do not match.');
      return;
    }

    setIsSaving(true);
    // In a real application, you would call a Supabase function here to update the password
    // For now, we'll simulate a successful update.
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
    setIsSaving(false);

    toast.success('Password updated successfully!');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmNewPassword('');
  };

  return (
    <div className="p-6 space-y-6">
      <h3 className="text-xl font-bold text-white mb-4">Change Password</h3>
      <form onSubmit={handleChangePassword} className="space-y-6">
        <div>
          <Label htmlFor="currentPassword" className="text-vanta-text-light text-base font-semibold mb-2 block">Current Password</Label>
          <Input
            id="currentPassword"
            type="password"
            placeholder="Enter current password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="bg-[#01112D] border-vanta-accent-dark-blue text-white placeholder-gray-500 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-vanta-neon-blue rounded-[14px] h-12"
            required
          />
        </div>
        <div>
          <Label htmlFor="newPassword" className="text-vanta-text-light text-base font-semibold mb-2 block">New Password</Label>
          <Input
            id="newPassword"
            type="password"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="bg-[#01112D] border-vanta-accent-dark-blue text-white placeholder-gray-500 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-vanta-neon-blue rounded-[14px] h-12"
            required
          />
        </div>
        <div>
          <Label htmlFor="confirmNewPassword" className="text-vanta-text-light text-base font-semibold mb-2 block">Confirm New Password</Label>
          <Input
            id="confirmNewPassword"
            type="password"
            placeholder="Confirm new password"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            className="bg-[#01112D] border-vanta-accent-dark-blue text-white placeholder-gray-500 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-vanta-neon-blue rounded-[14px] h-12"
            required
          />
        </div>
        <Button
          type="submit"
          className="w-full bg-vanta-neon-blue text-vanta-blue-dark hover:bg-vanta-neon-blue/90 rounded-[14px] py-3 text-lg font-bold"
          disabled={isSaving}
        >
          {isSaving ? 'Saving...' : 'Change Password'}
        </Button>
      </form>
    </div>
  );
};

export default SecuritySettingsTab;