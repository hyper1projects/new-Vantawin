"use client";

import React from 'react';
import ImageCarousel from '@/components/ImageCarousel';
import PointsMultiplierSection from '@/components/PointsMultiplierSection';
import TopGamesSection from '@/components/TopGamesSection';
import SecondaryImageCarousel from '@/components/SecondaryImageCarousel';
import FooterSection from '@/components/FooterSection';
import { useAuth } from '../context/AuthContext'; // Corrected import path
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const { user, username } = useAuth();

  const { toast } = useToast();

  // Determine the welcome message
  let welcomeMessage = 'Welcome to VantaWin!';
  if (user && username) { // Check if user and username exist
    welcomeMessage = `Welcome, ${username}!`;
  }



  return (
    <div className="w-full max-w-none px-4 py-2">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-lg md:text-2xl font-bold text-vanta-text-light text-left">{welcomeMessage}</h1>
      </div>

      <ImageCarousel className="mb-6" />
      <PointsMultiplierSection className="mb-6" />
      <TopGamesSection className="mb-6" />
      <SecondaryImageCarousel className="mb-6" />
      <FooterSection />
    </div>
  );
};

export default Index;