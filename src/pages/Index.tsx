"use client";

import React from 'react';
import ImageCarousel from '../components/ImageCarousel';
import PointsMultiplierSection from '../components/PointsMultiplierSection';
import SectionHeader from '../components/SectionHeader';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '../components/ui/carousel';

const Index: React.FC = () => {
  return (
    <div className="min-h-screen bg-vanta-blue-dark text-white">
      {/* Header */}
      <header className="p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Vantawin</h1>
        <nav>
          <ul className="flex space-x-4">
            <li><a href="#" className="hover:text-gray-300">Home</a></li>
            <li><a href="#" className="hover:text-gray-300">Sports</a></li>
            <li><a href="#" className="hover:text-gray-300">Live</a></li>
            <li><a href="#" className="hover:text-gray-300">Casino</a></li>
          </ul>
        </nav>
        <Button variant="secondary">Login</Button>
      </header>

      <main className="p-4">
        {/* Image Carousel Section */}
        <ImageCarousel />

        {/* Points Multiplier Section */}
        <div className="mt-6"> {/* Added mt-6 for a gap */}
          <PointsMultiplierSection />
        </div>

        {/* Trending Bets Section */}
        <section className="mt-8">
          <SectionHeader title="Trending Bets" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Placeholder for trending bets cards */}
            <Card className="bg-vanta-blue-medium border-none">
              <CardContent className="p-4">
                <h3 className="font-semibold">Team A vs Team B</h3>
                <p className="text-sm text-gray-400">Football - Premier League</p>
                <div className="flex justify-between items-center mt-2">
                  <span>Odds: 1.85</span>
                  <Button size="sm">Bet Now</Button>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-vanta-blue-medium border-none">
              <CardContent className="p-4">
                <h3 className="font-semibold">Player X vs Player Y</h3>
                <p className="text-sm text-gray-400">Tennis - ATP Tour</p>
                <div className="flex justify-between items-center mt-2">
                  <span>Odds: 2.10</span>
                  <Button size="sm">Bet Now</Button>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-vanta-blue-medium border-none">
              <CardContent className="p-4">
                <h3 className="font-semibold">Team C vs Team D</h3>
                <p className="text-sm text-gray-400">Basketball - NBA</p>
                <div className="flex justify-between items-center mt-2">
                  <span>Odds: 1.60</span>
                  <Button size="sm">Bet Now</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="p-4 text-center text-gray-500 text-sm">
        © 2023 Vantawin. All rights reserved.
      </footer>
    </div>
  );
};

export default Index;