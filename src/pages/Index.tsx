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

      {/* Images Section */}
      <div className="absolute top-24 right-8 flex flex-col gap-4">
        <img
          src="/images/Group 1000005755.png"
          alt="Leaderboard"
          className="w-64 rounded-xl"
        />
        <img
          src="/images/Group 1000005762.png"
          alt="Prediction Card"
          className="w-64 rounded-xl"
        />
      </div>
    </div>
  );
};

export default Index;