"use client";

import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const Index = () => {
  return (
    <div className="relative h-full bg-gradient-to-br from-gray-900 to-black text-white rounded-xl p-8">
      {/* Features Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        <Card className="bg-gray-800 border-gray-700 text-white">
          <CardHeader>
            <CardTitle className="text-blue-400">Real-time Predictions</CardTitle>
            <CardDescription className="text-gray-400">Engage with live events.</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Make predictions on various events and see results instantly.</p>
          </CardContent>
          <CardFooter>
            <Button variant="link" className="text-blue-400">Learn More</Button>
          </CardFooter>
        </Card>

        <Card className="bg-gray-800 border-gray-700 text-white">
          <CardHeader>
            <CardTitle className="text-blue-400">Community Leaderboards</CardTitle>
            <CardDescription className="text-gray-400">Compete with friends.</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Climb the ranks and show off your prediction skills.</p>
          </CardContent>
          <CardFooter>
            <Button variant="link" className="text-blue-400">Explore Leaderboards</Button>
          </CardFooter>
        </Card>

        <Card className="bg-gray-800 border-gray-700 text-white">
          <CardHeader>
            <CardTitle className="text-blue-400">Customizable Dashboards</CardTitle>
            <CardDescription className="text-gray-400">Personalize your experience.</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Track your performance and favorite events with ease.</p>
          </CardContent>
          <CardFooter>
            <Button variant="link" className="text-blue-400">Customize Now</Button>
          </CardFooter>
        </Card>
      </section>

      {/* Call to Action */}
      <section className="text-center bg-gray-800 p-10 rounded-lg shadow-xl">
        <h3 className="text-4xl font-bold mb-4 text-blue-400">Ready to Start Predicting?</h3>
        <p className="text-lg text-gray-300 mb-6">Join Dyad today and become part of a thriving community.</p>
        <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-white text-lg px-8 py-4 rounded-full shadow-lg">
          Sign Up Free
        </Button>
      </section>

      {/* Images Section */}
      <div className="absolute top-1/2 right-8 transform -translate-y-1/2 flex flex-col gap-4">
        <img
          src="/images/Group 1000005755.png"
          alt="Leaderboard"
          className="w-full max-w-xs rounded-xl"
        />
        <img
          src="/images/Group 1000005762.png"
          alt="Prediction Card"
          className="w-full max-w-xs rounded-xl"
        />
      </div>
    </div>
  );
};

export default Index;