"use client";

import React, { useState, useEffect, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useAuth } from '../context/AuthContext'; // Import useAuth

interface VerifyPhoneDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  phoneNumber: string; // The phone number to verify
  onVerificationSuccess: () => void; // Callback after successful verification
}

const RESEND_TIMER_SECONDS = 60;

const VerifyPhoneDialog: React.FC<VerifyPhoneDialogProps> = ({
  open,
  onOpenChange,
  phoneNumber,
  onVerificationSuccess,
}) => {
  const [otp, setOtp] = useState('');
  const [resendTimer, setResendTimer] = useState(RESEND_TIMER_SECONDS);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const { verifyOtp, resendOtp } = useAuth(); // Use verifyOtp and resendOtp from AuthContext

  useEffect(() => {
    if (open) {
      // Start timer when dialog opens
      setResendTimer(RESEND_TIMER_SECONDS);
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            if (timerRef.current) clearInterval(timerRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      // Clear timer when dialog closes
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [open]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 5) {
      toast.error('Please enter the full 5-digit code.');
      return;
    }

    const { error } = await verifyOtp(phoneNumber, otp);

    if (!error) {
      toast.success('Phone number verified successfully!');
      onOpenChange(false);
      setOtp('');
      onVerificationSuccess(); // Call success callback
    } else {
      toast.error(error.message || 'Verification failed. Please check the code.');
    }
  };

  const handleResendCode = async () => {
    if (resendTimer === 0) {
      const { error } = await resendOtp(phoneNumber);
      if (!error) {
        toast.info('New verification code sent!');
        setResendTimer(RESEND_TIMER_SECONDS);
        if (timerRef.current) clearInterval(timerRef.current);
        timerRef.current = setInterval(() => {
          setResendTimer((prev) => {
            if (prev <= 1) {
              if (timerRef.current) clearInterval(timerRef.current);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } else {
        toast.error(error.message || 'Failed to resend code.');
      }
    } else {
      toast.info(`Please wait ${resendTimer} seconds before resending.`);
    }
  };

  const handleVoiceVerification = () => {
    console.log(`Requesting voice verification for ${phoneNumber}`);
    toast.info('Voice verification is not yet implemented. Please use SMS.');
    // In a real app, you'd trigger a voice call OTP here.
    // For now, we'll just show a toast.
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-vanta-blue-medium text-vanta-text-light border-0 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold text-center text-vanta-neon-blue">
            Verify Mobile Number
          </DialogTitle>
        </DialogHeader>
        <div className="text-center mt-4 space-y-6">
          <p className="text-gray-400 text-base">
            We've sent a 5-digit code to{' '}
            <span className="font-semibold text-white">{phoneNumber}</span>
          </p>

          <form onSubmit={handleVerify} className="flex flex-col items-center space-y-6">
            <InputOTP
              maxLength={5}
              value={otp}
              onChange={(value) => setOtp(value)}
              render={({ slots }) => (
                <InputOTPGroup className="gap-3">
                  {slots.map((slot, index) => (
                    <InputOTPSlot
                      key={index}
                      {...slot}
                      className="w-14 h-14 text-2xl font-bold bg-[#01112D] border border-vanta-accent-dark-blue text-white focus:border-vanta-neon-blue"
                    />
                  ))}
                </InputOTPGroup>
              )}
            />

            <Button
              type="submit"
              className="w-full bg-vanta-neon-blue text-vanta-blue-dark hover:bg-vanta-neon-blue/90 rounded-[14px] py-3 text-lg font-bold"
            >
              Verify
            </Button>
          </form>

          <div className="flex justify-between items-center text-sm text-gray-400">
            <button
              onClick={handleResendCode}
              disabled={resendTimer > 0}
              className={`hover:underline ${resendTimer > 0 ? 'text-gray-600 cursor-not-allowed' : 'text-vanta-neon-blue'}`}
            >
              Resend in {resendTimer}s
            </button>
            <button
              onClick={handleVoiceVerification}
              className="text-vanta-neon-blue hover:underline"
            >
              Voice Verification
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VerifyPhoneDialog;