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
import { useAuth } from '../context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const SecuritySettingsTab: React.FC = () => {
  const { user, updatePassword, deactivateAccount, deleteAccount } = useAuth();

  // State for Change Password section
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // State for 2FA Email Verification section
  const [email2FASwitch, setEmail2FASwitch] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);

  // State for Delete/Deactivate Account section
  const [deactivationReason, setDeactivationReason] = useState<string>('');
  const [deletionReason, setDeletionReason] = useState<string>('');
  const [isDeactivating, setIsDeactivating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeactivateDialog, setShowDeactivateDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || !confirmNewPassword) {
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
    try {
      const { error } = await updatePassword(newPassword);
      if (error) {
        toast.error(error.message || 'Failed to update password');
      } else {
        toast.success('Password updated successfully!');
        setNewPassword('');
        setConfirmNewPassword('');
      }
    } catch (err: any) {
      toast.error(err.message || 'An unexpected error occurred');
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleSendOtp = async () => {
    if (!user?.email) {
      toast.error('No email address found for your account.');
      return;
    }

    setIsSendingOtp(true);
    try {
      const { error } = await supabase.auth.updateUser({
        email: user.email,
      });

      if (error) {
        toast.error(error.message || 'Failed to send verification email');
      } else {
        toast.success('Verification email sent! Please check your inbox.');
      }
    } catch (err: any) {
      toast.error(err.message || 'An unexpected error occurred');
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleDeactivateAccount = async () => {
    if (!deactivationReason) {
      toast.error('Please select a reason for deactivation.');
      return;
    }
    setShowDeactivateDialog(true);
  };

  const confirmDeactivation = async () => {
    setIsDeactivating(true);
    setShowDeactivateDialog(false);
    try {
      const { error } = await deactivateAccount(deactivationReason);
      if (error) {
        toast.error(error.message || 'Failed to deactivate account');
      } else {
        toast.success('Account deactivated successfully. You will be signed out.');
        setDeactivationReason('');
      }
    } catch (err: any) {
      toast.error(err.message || 'An unexpected error occurred');
    } finally {
      setIsDeactivating(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!deletionReason) {
      toast.error('Please select a reason for account deletion.');
      return;
    }
    setShowDeleteDialog(true);
  };

  const confirmDeletion = async () => {
    setIsDeleting(true);
    setShowDeleteDialog(false);
    try {
      const { error } = await deleteAccount(deletionReason);
      if (error) {
        toast.error(error.message || 'Failed to delete account');
      } else {
        toast.success('Account deleted successfully. You will be signed out.');
        setDeletionReason('');
      }
    } catch (err: any) {
      toast.error(err.message || 'An unexpected error occurred');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="p-6 space-y-8">
      {/* Change Password Section */}
      <div>
        <h3 className="text-xl font-bold text-white mb-4">Change Password</h3>
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div className="flex items-end space-x-4">
            <div className="flex-grow">
              <Label htmlFor="newPassword" className="text-vanta-text-light text-base font-semibold mb-2 block">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                placeholder="Enter new password (min 6 characters)"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="bg-[#01112D] border-vanta-accent-dark-blue text-white placeholder-gray-500 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-vanta-neon-blue rounded-[14px] h-12"
                required
              />
            </div>
          </div>
          <div className="flex items-end space-x-4">
            <div className="flex-grow">
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
              variant="outline"
              className="bg-transparent border-2 border-vanta-neon-blue text-vanta-neon-blue hover:bg-vanta-neon-blue hover:text-vanta-blue-dark rounded-[14px] px-6 py-2 h-12 font-bold text-base"
              disabled={isChangingPassword}
            >
              {isChangingPassword ? 'Updating...' : 'Update Password'}
            </Button>
          </div>
        </form>
      </div>

      {/* 2FA Authentication Section */}
      <div>
        <h3 className="text-xl font-bold text-white mb-4">2FA Authentication</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between pt-4">
            <div>
              <Label htmlFor="email-2fa-switch" className="text-vanta-text-light text-base font-semibold block">Email 2-Step Verification</Label>
              <p className="text-gray-400 text-sm mt-1">Add an extra layer of security to your account</p>
            </div>
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
            <div className="mt-4 p-4 bg-vanta-blue-medium/30 rounded-[14px] border border-vanta-accent-dark-blue">
              <p className="text-vanta-text-light text-sm mb-3">
                Your email: <span className="font-semibold text-vanta-neon-blue">{user?.email || 'Not available'}</span>
              </p>
              <Button
                variant="outline"
                className="bg-transparent border-2 border-vanta-neon-blue text-vanta-neon-blue hover:bg-vanta-neon-blue hover:text-vanta-blue-dark rounded-[14px] px-6 py-2 h-12 font-bold text-base w-full"
                onClick={handleSendOtp}
                disabled={isSendingOtp || !user?.email}
              >
                {isSendingOtp ? 'Sending...' : 'Send Verification Email'}
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
              className="bg-transparent border-2 border-vanta-neon-blue text-vanta-neon-blue hover:bg-vanta-neon-blue hover:text-vanta-blue-dark rounded-[14px] px-6 py-2 h-12 font-bold text-base"
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
              className="bg-transparent border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white rounded-[14px] px-6 py-2 h-12 font-bold text-base"
              onClick={handleDeleteAccount}
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
          </div>
        </div>
      </div>

      {/* Confirmation Dialogs */}
      <AlertDialog open={showDeactivateDialog} onOpenChange={setShowDeactivateDialog}>
        <AlertDialogContent className="bg-vanta-blue-medium border-vanta-accent-dark-blue">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Deactivate Account?</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              Your account will be temporarily deactivated. You can reactivate it by contacting support. Are you sure you want to continue?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-transparent border-vanta-accent-dark-blue text-white hover:bg-vanta-accent-dark-blue">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeactivation}
              className="bg-vanta-neon-blue text-vanta-blue-dark hover:bg-vanta-neon-blue/80"
            >
              Yes, Deactivate
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="bg-vanta-blue-medium border-vanta-accent-dark-blue">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Delete Account Permanently?</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              This action cannot be undone. Your account data will be permanently deleted and anonymized. Are you absolutely sure?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-transparent border-vanta-accent-dark-blue text-white hover:bg-vanta-accent-dark-blue">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeletion}
              className="bg-red-500 text-white hover:bg-red-600"
            >
              Yes, Delete Permanently
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default SecuritySettingsTab;