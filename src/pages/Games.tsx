"use client";

import React, { useState, useEffect } from 'react';
import SectionHeader from '../components/SectionHeader';
import LiveGamesSection from '../components/LiveGamesSection';
import PremierLeagueSection from '../components/PremierLeagueSection';
import LaLigaSection from '../components/LaLigaSection';
import { useLocation, useNavigate } from 'react-router-dom';
import { Game } from '../types/game';
import ChampionsLeagueSection from '../components/ChampionLeagueSection';

const Games = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const urlCategory = queryParams.get('category') || 'football';

  const formattedSelectedSport = urlCategory.charAt(0).toUpperCase() + urlCategory.slice(1);

  return (
    <div className="p-4">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <span className="w-1 h-6 bg-vanta-neon-blue rounded-full"></span>
          Games
        </h1>
      </div>

      {/* Conditionally render content based on selectedSport */}
      {urlCategory === 'football' ? (
        <>
          <div className="mt-8">
            <LiveGamesSection />
          </div>

          {/* Premier League Section */}
          <div className="mt-8">
            <PremierLeagueSection />
          </div>
          {/* Champion league Section */}
          <div className="mt-8">
            <ChampionsLeagueSection />
          </div>
          {/* New La Liga Section */}
          <div className="mt-8">
            <LaLigaSection />
          </div>
        </>
      ) : (
        <div className="mt-8">
          <SectionHeader title={`${formattedSelectedSport} Games`} className="mb-4" textColor="text-vanta-text-light" />
          <p className="text-vanta-text-medium mt-4">
            Content for the {formattedSelectedSport} category will go here.
          </p>
        </div>
      )}
    </div>
  );
};

export default Games;