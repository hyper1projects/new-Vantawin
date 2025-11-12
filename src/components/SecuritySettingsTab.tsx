"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAuth } from '../context/AuthContext'; // Assuming useAuth might be needed for password change

const SecuritySettingsTab: React.FC = () => {
  const { user } = useAuth(); // To potentially integrate with Supabase auth for password changes
  
  // State for Change Password section
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // State for 2FA Authentication section
  const [newPin, setNewPin] = useState('');
  const [requirePinFor, setRequirePinFor] = useState<string>('card_withdrawals');
  const [isCreatingPin, setIsCreatingPin] = useState(false);
  const [email2FASwitch, setEmail2FASwitch] = useState(false);
  const [verify2FAEmail, setVerify2FAEmail] = useState('');
  const [isSendingOtp, setIsSendingOtp] = useState(false);

  // State for Delete/Deactivate Account section
  const [deactivationReason, setDeactivationReason] = useState<string>('');
  const [deletionReason, setDeletionReason] = useState<string>('');
  const [isDeactivating, setIsDeactivating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!oldPassword || !newPassword || !confirmNewPassword) {
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

    setIsChangingPassword(true);
    // In a real application, you would call a Supabase function here to update the password
    // e.g., const { error } = await supabase.auth.updateUser({ password: newPassword });
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
    setIsChangingPassword(false);

    toast.success('Password updated successfully!');
    setOldPassword('');
    setNewPassword('');
    setConfirmNewPassword('');
  };

  const handleCreatePin = async () => {
    if (!newPin || newPin.length !== 4 || !/^\d+$/.test(newPin)) {
      toast.error('Please enter a valid 4-digit PIN.');
      return;
    }
    setIsCreatingPin(true);
    // Simulate API call to create/confirm PIN
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsCreatingPin(false);
    toast.success('PIN created/confirmed successfully!');
    setNewPin('');
  };

  const handleSendOtp = async () => {
    if (!verify2FAEmail || !/\S+@\S+\.\S+/.test(verify2FAEmail)) {
      toast.error('Please enter a valid email address for 2FA verification.');
      return;
    }
    setIsSendingOtp(true);
    // Simulate API call to send OTP
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSendingOtp(false);
    toast.success('OTP sent to your email!');
  };

  const handleDeactivateAccount = async () => {
    if (!deactivationReason) {
      toast.error('Please select a reason for deactivation.');
      return;
    }
    setIsDeactivating(true);
    // Simulate API call to deactivate account
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsDeactivating(false);
    toast.success('Account deactivation request submitted.');
    setDeactivationReason('');
  };

  const handleDeleteAccount = async () => {
    if (!deletionReason) {
      toast.error('Please select a reason for account deletion.');
      return;
    }
    setIsDeleting(true);
    // Simulate API call to delete account
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsDeleting(false);
    toast.success('Account deletion request submitted.');
    setDeletionReason('');
  };

  return (
    <div className="p-6 space-y-8">
      {/* Change Password Section */}
      <div>
        <h3 className="text-xl font-bold text-white mb-4">Change Password</h3>
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div>
            <Label htmlFor="oldPassword" className="text-vanta-text-light text-base font-semibold mb-2 block">Old Password</Label>
            <Input
              id="oldPassword"
              type="password"
              placeholder="Enter old password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="bg-[#01112D] border-vanta-accent-dark-blue text-white placeholder-gray-500 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-vanta-neon-blue rounded-[14px] h-12"
              required
            />
          </div>
          <div className="flex items-end space-x-4">
            <div className="flex-grow">
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
            <Button
              type="submit"
              variant="outline"
              className="border-2 border-vanta-neon-blue text-vanta-neon-blue hover:bg-vanta-neon-blue hover:text-vanta-blue-dark rounded-[14px] px-6 py-2 h-12 font-bold text-base"
              disabled={isChangingPassword}
            >
              {isChangingPassword ? 'Confirming...' : 'Confirm'}
            </Button>
          </div>
        </form>
      </div>

      {/* 2FA Authentication Section */}
      <div>
        <h3 className="text-xl font-bold text-white mb-4">2FA Authentication</h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="newPin" className="text-vanta-text-light text-base font-semibold mb-2 block">Create New PIN</Label>
            <Input
              id="newPin"
              type="password" // Use password type for PIN for masking
              maxLength={4}
              placeholder="Enter 4-digit PIN"
              value={newPin}
              onChange={(e) => setNewPin(e.target.value)}
              className="bg-[#01112D] border-vanta-accent-dark-blue text-white placeholder-gray-500 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-vanta-neon-blue rounded-[14px] h-12"
            />
          </div>
          <div className="flex items-end space-x-4">
            <div className="flex-grow">
              <Label htmlFor="requirePinFor" className="text-vanta-text-light text-base font-semibold mb-2 block">Require Pin for</Label>
              <Select value={requirePinFor} onValueChange={setRequirePinFor}>
                <SelectTrigger id="requirePinFor" className="w-full bg-[#01112D] border-vanta-accent-dark-blue text-white placeholder-gray-500 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-vanta-neon-blue rounded-[14px] h-12">
                  <SelectValue placeholder="Select an option" />
                </SelectTrigger>
                <SelectContent className="bg-vanta-blue-medium border-vanta-accent-dark-blue text-vanta-text-light">
                  <SelectItem value="card_withdrawals">Card Deposits / New Withdrawals</SelectItem>
                  <SelectItem value="all_transactions">All Transactions</SelectItem>
                  <SelectItem value="never">Never</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button
              variant="outline"
              className="border-2 border-vanta-neon-blue text-vanta-neon-blue hover:bg-vanta-neon-blue hover:text-vanta-blue-dark rounded-[14px] px-6 py-2 h-12 font-bold text-base"
              onClick={handleCreatePin}
              disabled={isCreatingPin}
            >
              {isCreatingPin ? 'Confirming...' : 'Confirm'}
            </Button>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-gray-700/50">
            <Label htmlFor="email-2fa-switch" className="text-vanta-text-light text-base font-semibold">Email 2 Step Verification</Label>
            <div className="flex items-center space-x-2">
              <span className="text-gray-400 text-sm">{email2FASwitch ? 'ON' : 'OFF'}</span>
              <Switch
                id="email-2fa-switch"
                checked={email2FASwitch}
                onCheckedChange={setEmail2FASwitch}
                className="data-[state=checked]:bg-vanta-neon-blue data-[state=unchecked]:bg-gray-600"
              />
            </div>
          </div>

          {email2FASwitch && (
            <div className="flex items-end space-x-4 mt-4">
              <div className="flex-grow">
                <Label htmlFor="verify2FAEmail" className="text-vanta-text-light text-base font-semibold mb-2 block">Verify 2FA Email</Label>
                <Input
                  id="verify2FAEmail"
                  type="email"
                  placeholder="Enter email for 2FA"
                  value={verify2FAEmail}
                  onChange={(e) => setVerify2FAEmail(e.target.value)}
                  className="bg-[#01112D] border-vanta-accent-dark-blue text-white placeholder-gray-500 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-vanta-neon-blue rounded-[14px] h-12"
                />
              </div>
              <Button
                variant="outline"
                className="border-2 border-vanta-neon-blue text-vanta-neon-blue hover:bg-vanta-neon-blue hover:text-vanta-blue-dark rounded-[14px] px-6 py-2 h-12 font-bold text-base"
                onClick={handleSendOtp}
                disabled={isSendingOtp}
              >
                {isSendingOtp ? 'Sending...' : 'Send OTP'}
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Delete/Deactivate Account Section */}
      <div>
        <h3 className="text-xl font-bold text-white mb-4">Delete/Deactivate Account</h3>
        <div className="space-y-4">
          <div className="flex items-end space-x-4">
            <div className="flex-grow">
              <Label htmlFor="deactivationReason" className="text-vanta-text-light text-base font-semibold mb-2 block">Deactivation Reason</Label>
              <Select value={deactivationReason} onValueChange={setDeactivationReason}>
                <SelectTrigger id="deactivationReason" className="w-full bg-[#01112D] border-vanta-accent-dark-blue text-white placeholder-gray-500 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-vanta-neon-blue rounded-[14px] h-12">
                  <SelectValue placeholder="Select reason" />
                </SelectTrigger>
                <SelectContent className="bg-vanta-blue-medium border-vanta-accent-dark-blue text-vanta-text-light">
                  <SelectItem value="taking_break">Taking a break</SelectItem>
                  <SelectItem value="too_much_time">Spending too much time</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button
              variant="outline"
              className="border-2 border-vanta-neon-blue text-vanta-neon-blue hover:bg-vanta-neon-blue hover:text-vanta-blue-dark rounded-[14px] px-6 py-2 h-12 font-bold text-base"
              onClick={handleDeactivateAccount}
              disabled={isDeactivating}
            >
              {isDeactivating ? 'Deactivating...' : 'Deactivate'}
            </Button>
          </div>

          <div className="flex items-end space-x-4">
            <div className="flex-grow">
              <Label htmlFor="deletionReason" className="text-vanta-text-light text-base font-semibold mb-2 block">Account Deletion Reason</Label>
              <Select value={deletionReason} onValueChange={setDeletionReason}>
                <SelectTrigger id="deletionReason" className="w-full bg-[#01112D] border-vanta-accent-dark-blue text-white placeholder-gray-500 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-vanta-neon-blue rounded-[14px] h-12">
                  <SelectValue placeholder="Select reason" />
                </SelectTrigger>
                <SelectContent className="bg-vanta-blue-medium border-vanta-accent-dark-blue text-vanta-text-light">
                  <SelectItem value="privacy_concerns">Privacy concerns</SelectItem>
                  <SelectItem value="not_using_anymore">Not using the service anymore</SelectItem>
                  <SelectItem value="data_security">Data security issues</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button
              variant="outline"
              className="border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white rounded-[14px] px-6 py-2 h-12 font-bold text-base"
              onClick={handleDeleteAccount}
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecuritySettingsTab;