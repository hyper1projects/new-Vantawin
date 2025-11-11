"use client";

import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '../context/AuthContext'; // Import useAuth

const Index: React.FC = () => {
  const { user, username } = useAuth(); // Use the auth context

  return (
    <div className="min-h-screen bg-vanta-blue-dark text-vanta-text-light">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center text-center p-4">
        <div className="absolute inset-0 bg-hero-pattern bg-cover bg-center opacity-20"></div>
        <div className="relative z-10">
          <h1 className="text-5xl md:text-7xl font-extrabold text-vanta-neon-blue leading-tight mb-4 animate-fade-in-up">
            {user ? `Welcome, ${username || user.email}!` : 'Welcome to Vantawin'}
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 animate-fade-in-up delay-200">
            Your ultimate destination for competitive gaming and thrilling pools.
          </p>
          <div className="space-x-4 animate-fade-in-up delay-400">
            <Link to="/games">
              <Button className="bg-vanta-neon-blue text-vanta-blue-dark hover:bg-vanta-neon-blue/90 rounded-[14px] px-8 py-3 text-lg font-bold shadow-lg">
                Explore Games
              </Button>
            </Link>
            <Link to="/how-it-works">
              <Button variant="outline" className="border-vanta-neon-blue text-vanta-neon-blue hover:bg-vanta-neon-blue hover:text-vanta-blue-dark rounded-[14px] px-8 py-3 text-lg font-bold shadow-lg">
                How It Works
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-vanta-blue-medium">
        <h2 className="text-4xl font-bold text-center text-vanta-neon-blue mb-12">Why Choose Vantawin?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Card className="bg-vanta-blue-dark border-vanta-accent-dark-blue rounded-[27px] p-6 text-center shadow-xl hover:shadow-vanta-neon-blue/30 transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-vanta-neon-blue mb-4">Compete & Win</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300">
                Join exciting tournaments and pools across various games. Showcase your skills and win big!
              </p>
            </CardContent>
          </Card>
          <Card className="bg-vanta-blue-dark border-vanta-accent-dark-blue rounded-[27px] p-6 text-center shadow-xl hover:shadow-vanta-neon-blue/30 transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-vanta-neon-blue mb-4">Fair Play</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300">
                Our platform ensures a transparent and fair environment for all competitors.
              </p>
            </CardContent>
          </Card>
          <Card className="bg-vanta-blue-dark border-vanta-accent-dark-blue rounded-[27px] p-6 text-center shadow-xl hover:shadow-vanta-neon-blue/30 transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-vanta-neon-blue mb-4">Community Driven</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300">
                Connect with fellow gamers, form teams, and climb the global leaderboard together.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 px-4 text-center bg-vanta-blue-dark">
        <h2 className="text-4xl font-bold text-vanta-neon-blue mb-6">Ready to Play?</h2>
        <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
          Join Vantawin today and transform your gaming passion into rewarding experiences.
        </p>
        <Link to="/signup">
          <Button className="bg-vanta-neon-blue text-vanta-blue-dark hover:bg-vanta-neon-blue/90 rounded-[14px] px-10 py-4 text-xl font-bold shadow-lg">
            Get Started
          </Button>
        </Link>
      </section>
    </div>
  );
};

export default Index;