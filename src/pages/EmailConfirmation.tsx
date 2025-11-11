"use client";

import React from 'react';
import { Link } from 'react-router-dom';
import { MailCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';

const EmailConfirmation: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-vanta-blue-dark p-4">
      <div className="bg-vanta-blue-medium p-8 rounded-[27px] shadow-lg w-full max-w-md text-vanta-text-light text-center">
        <MailCheck size={64} className="text-vanta-neon-blue mx-auto mb-6" />
        <h1 className="text-3xl font-bold text-vanta-neon-blue mb-4">Confirm Your Email</h1>
        <p className="text-lg text-gray-300 mb-6">
          A verification link has been sent to your email address. Please check your inbox (and spam folder) to activate your account.
        </p>
        <p className="text-sm text-gray-400 mb-8">
          You will need to verify your email before you can log in.
        </p>
        <Link to="/login">
          <Button className="w-full bg-vanta-neon-blue text-vanta-blue-dark hover:bg-vanta-neon-blue/90 rounded-[14px] py-3 text-lg font-bold">
            Go to Login
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default EmailConfirmation;