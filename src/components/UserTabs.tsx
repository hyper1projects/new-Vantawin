"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Link, useNavigate } from 'react-router-dom';
import MyGamesTab from './MyGamesTab';

type MainTab = 'myGames' | 'rankHistory';

const UserTabs: React.FC = () => {
  const [activeMainTab, setActiveMainTab] = useState<MainTab>('myGames');
  const navigate = useNavigate();

  const getMainTabButtonClasses = (tabValue: MainTab) => {
    return cn(
      "px-6 py-3 rounded-[20px] text-lg font-semibold transition-colors duration-200",
      activeMainTab === tabValue
        ? "bg-vanta-blue-medium text-vanta-neon-blue"
        : "bg-transparent text-vanta-text-light hover:bg-vanta-blue-light"
    );
  };

  const renderTabContent = () => {
    switch (activeMainTab) {
      case 'myGames':
        return <MyGamesTab />;
      case 'rankHistory':
        return (
          <div className="bg-vanta-blue-medium p-6 rounded-[27px] shadow-sm text-vanta-text-light w-full">
            <h3 className="text-xl font-semibold mb-4">Rank History</h3>
            <div className="text-vanta-text-light">
              <p>Displaying your rank history over time...</p>
              <div className="flex justify-between items-center py-2 border-b border-gray-800 last:border-b-0">
                <span>Rank: #15</span>
                <span>Date: 2024-07-20</span>
                <span className="text-sm text-gray-400">XP: 125,000</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-800 last:border-b-0">
                <span>Rank: #18</span>
                <span>Date: 2024-07-13</span>
                <span className="text-sm text-gray-400">XP: 110,000</span>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col space-y-6">
      <div className="bg-vanta-blue-dark p-2 rounded-[27px] flex space-x-2 w-full md:w-fit">
        <Button
          className={getMainTabButtonClasses('myGames')}
          onClick={() => setActiveMainTab('myGames')}
        >
          My Games
        </Button>
        <Button
          className={getMainTabButtonClasses('rankHistory')}
          onClick={() => setActiveMainTab('rankHistory')}
        >
          Rank History
        </Button>
        <Button
          className="px-6 py-3 rounded-[20px] text-lg font-semibold transition-colors duration-200 bg-transparent text-vanta-text-light hover:bg-vanta-blue-light"
          onClick={() => navigate('/wallet')}
        >
          Transactions
        </Button>
      </div>
      {renderTabContent()}
    </div>
  );
};

export default UserTabs;