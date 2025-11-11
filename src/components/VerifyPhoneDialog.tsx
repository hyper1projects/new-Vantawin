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
import { sendOtpFunction, verifyOtpFunction } from '../integrations/supabase/functions';
import { supabase } from '../integrations/supabase/client'; // Import Supabase client

interface VerifyPhoneDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  phoneNumber: string;
  initialPinId: string;
  username: string; // New prop
  password: string; // New prop
  onVerificationSuccess: () => void;
}

const RESEND_TIMER_SECONDS = 60;

const VerifyPhoneDialog: React.FC<VerifyPhoneDialogProps> = ({
  open,
  onOpenChange,
  phoneNumber,
  initialPinId,
  username,
  password,
  onVerificationSuccess,
}) => {
  const [otp, setOtp] = useState('');
  const [resendTimer, setResendTimer] = useState(RESEND_TIMER_SECONDS);
  const [currentPinId, setCurrentPinId] = useState(initialPinId);
  const [isLoading, setIsLoading] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (open) {
      setResendTimer(RESEND_TIMER_SECONDS);
      setCurrentPinId(initialPinId);
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
      if (timerRef.current) clearInterval(timerRef.current);
      setOtp('');
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [open, initialPinId]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 5) {
      toast.error('Please enter the full 5-digit code.');
      return;
    }
    if (!currentPinId) {
      toast.error('No verification session found. Please resend the code.');
      return;
    }

    setIsLoading(true);
    try {
      console.log(`Verifying phone number ${phoneNumber} with OTP: ${otp} and pinId: ${currentPinId}`);
      const result = await verifyOtpFunction(currentPinId, otp);

      if (result && result.verified) {
        // OTP verified, now register the user with Supabase Auth
        const { data, error } = await supabase.auth.signUp({
          phone: phoneNumber,
          password: password,
          options: {
            data: {
              username: username, // Pass username to user_metadata
            },
          },
        });

        if (error) {
          console.error('Supabase Auth Sign Up Error:', error);
          toast.error(error.message || 'Failed to register user after OTP verification.');
          return;
        }

        if (data.user) {
          toast.success('Phone number verified and account created successfully!');
          onOpenChange(false);
          setOtp('');
          onVerificationSuccess();
        } else {
          toast.error('User registration failed. Please try again.');
        }
      } else {
        toast.error('OTP verification failed. Please check the code and try again.');
      }
    } catch (error: any) {
      console.error('Verification/Registration error:', error);
      toast.error(error.message || 'An unexpected error occurred during verification or registration.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (resendTimer === 0) {
      setIsLoading(true);
      try {
        console.log(`Resending code to ${phoneNumber}`);
        const result = await sendOtpFunction(phoneNumber);
        if (result && result.pinId) {
          toast.info('New verification code sent!');
          setCurrentPinId(result.pinId);
          setResendTimer(RESEND_TIMER_SECONDS);
          setOtp('');
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
          toast.error('Failed to resend verification code. Please try again.');
        }
      } catch (error: any) {
        console.error('Resend OTP error:', error);
        toast.error(error.message || 'An unexpected error occurred while resending.');
      } finally {
        setIsLoading(false);
      }
    } else {
      toast.info(`Please wait ${resendTimer} seconds before resending.`);
    }
  };

  const handleVoiceVerification = () => {
    console.log(`Requesting voice verification for ${phoneNumber}`);
    toast.info('Initiating voice verification call...');
    onOpenChange(false);
    setOtp('');
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
              disabled={isLoading}
            />

            <Button
              type="submit"
              className="w-full bg-vanta-neon-blue text-vanta-blue-dark hover:bg-vanta-neon-blue/90 rounded-[14px] py-3 text-lg font-bold"
              disabled={isLoading}
            >
              {isLoading ? 'Verifying...' : 'Verify'}
            </Button>
          </form>

          <div className="flex justify-between items-center text-sm text-gray-400">
            <button
              onClick={handleResendCode}
              disabled={resendTimer > 0 || isLoading}
              className={`hover:underline ${resendTimer > 0 || isLoading ? 'text-gray-600 cursor-not-allowed' : 'text-vanta-neon-blue'}`}
            >
              Resend in {resendTimer}s
            </button>
            <button
              onClick={handleVoiceVerification}
              className="text-vanta-neon-blue hover:underline"
              disabled={isLoading}
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