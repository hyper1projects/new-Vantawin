"use client";

import React, { useState } from 'react';
import ImageCarousel from '@/components/ImageCarousel';
import PointsMultiplierSection from '@/components/PointsMultiplierSection';
import TopGamesSection from '@/components/TopGamesSection';
import SecondaryImageCarousel from '@/components/SecondaryImageCarousel';
import FooterSection from '@/components/FooterSection';
import { useAuth } from '../context/AuthContext'; // Corrected import path
import { useMatchesContext } from '@/context/MatchesContext';
import { triggerOddsFetch } from '@/utils/triggerFetch';
import { Button } from '@/components/ui/button';
import { RefreshCcw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const { user, username } = useAuth(); // Only need user and username
  const { refetch } = useMatchesContext();
  const [isSyncing, setIsSyncing] = useState(false);
  const { toast } = useToast();

  // Determine the welcome message
  let welcomeMessage = 'Welcome to VantaWin!';
  if (user && username) { // Check if user and username exist
    welcomeMessage = `Welcome, ${username}!`;
  }

  const handleSync = async () => {
    setIsSyncing(true);
    toast({ title: "Syncing Odds...", description: "Fetching latest data from the API." });

    // 1. Trigger the server-side fetch
    const result = await triggerOddsFetch();

    // 2. Refresh the local data
    if (result) {
      await refetch();
      toast({ title: "Sync Complete", description: "Latest odds have been updated." });
    } else {
      toast({ title: "Sync Failed", description: "Could not fetch data from the server.", variant: "destructive" });
    }
    setIsSyncing(false);
  };

  return (
    <div className="w-full max-w-none px-4 py-2">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-vanta-text-light text-left">{welcomeMessage}</h1>
        <Button
          onClick={handleSync}
          disabled={isSyncing}
          size="sm"
          className="bg-vanta-neon-blue/20 text-vanta-neon-blue hover:bg-vanta-neon-blue/40 border border-vanta-neon-blue/50"
        >
          <RefreshCcw className={`mr-2 h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
          {isSyncing ? 'Syncing...' : 'Sync Odds'}
        </Button>
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