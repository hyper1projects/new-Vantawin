"use client";

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const Insights: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="p-4 text-vanta-text-light">
      <Button
        onClick={() => navigate(-1)}
        variant="ghost"
        className="mb-6 text-vanta-neon-blue hover:bg-vanta-accent-dark-blue flex items-center gap-2"
      >
        <ArrowLeft size={20} /> Back to Profile
      </Button>
      <h1 className="text-2xl font-bold text-vanta-text-light mb-4">Your Betting Insights</h1>
      <p className="text-vanta-text-medium">
        This page will provide detailed analytics and tips to help you improve your prediction performance based on your win/loss ratio and game history.
      </p>
      <p className="text-vanta-text-medium mt-4">
        Stay tuned for more advanced features!
      </p>
    </div>
  );
};

export default Insights;