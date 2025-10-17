"use client";

import React from 'react';
import PredictionSlipCard from '../components/PredictionSlipCard';
import GameCard from '../components/GameCard';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const Index = () => {
  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-vanta-text-light">Dashboard</h1>
        <Button variant="ghost" className="text-vanta-text-light hover:bg-vanta-blue-medium">
          View All <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Example Game Cards */}
        <GameCard
          title="Football Predictor"
          description="Predict scores for upcoming matches."
          icon="⚽"
          link="/games/football"
        />
        <GameCard
          title="Basketball Challenge"
          description="Test your knowledge of basketball games."
          icon="🏀"
          link="/games/basketball"
        />
        <GameCard
          title="Tennis Open"
          description="Place bets on grand slam tournaments."
          icon="🎾"
          link="/games/tennis"
        />
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1">
          <h2 className="text-2xl font-semibold text-vanta-text-light mb-4">Your Prediction Slip</h2>
          <PredictionSlipCard />
        </div>

        <div className="flex-1">
          <h2 className="text-2xl font-semibold text-vanta-text-light mb-4">Recent Activity</h2>
          <div className="bg-vanta-blue-medium p-6 rounded-xl shadow-lg">
            <ul className="space-y-4">
              <li className="flex justify-between items-center text-vanta-text-light">
                <span>Won ₦500 on Football Predictor</span>
                <span className="text-sm text-gray-400">2 hours ago</span>
              </li>
              <li className="flex justify-between items-center text-vanta-text-light">
                <span>Placed ₦100 bet on Basketball</span>
                <span className="text-sm text-gray-400">5 hours ago</span>
              </li>
              <li className="flex justify-between items-center text-vanta-text-light">
                <span>Joined "Weekend Pool"</span>
                <span className="text-sm text-gray-400">1 day ago</span>
              </li>
            </ul>
            <Button variant="link" className="mt-4 text-vanta-primary hover:underline">
              View All Activity
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;