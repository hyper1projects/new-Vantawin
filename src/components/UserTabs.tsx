"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Link, useNavigate } from 'react-router-dom';
import MyGamesTab from './MyGamesTab';
import TransactionList from './TransactionList';
import { useRankHistory } from '@/hooks/useRankHistory';
import { format } from 'date-fns';

type MainTab = 'myGames' | 'rankHistory' | 'transactions';

const UserTabs: React.FC = () => {
  const [activeMainTab, setActiveMainTab] = useState<MainTab>('myGames');
  const navigate = useNavigate();
  const { history, loading: historyLoading } = useRankHistory();

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
              {historyLoading ? (
                <div className="text-center py-4 text-gray-400">Loading history...</div>
              ) : history.length === 0 ? (
                <div className="text-center py-4 text-gray-400">No rank history available yet. Complete a pool to see your ranking!</div>
              ) : (
                <>
                  <p className="mb-4 text-gray-400 text-sm">Your performance in past tournaments.</p>
                  {history.map((entry) => (
                    <div key={entry.poolId} className="flex justify-between items-center py-3 border-b border-gray-800 last:border-b-0 hover:bg-white/5 px-2 rounded-lg transition-colors">
                      <span className="font-medium text-vanta-neon-blue">Rank: #{entry.rank}</span>
                      <span className="text-sm">{format(new Date(entry.date), 'MMM d, yyyy')}</span>
                      <span className="text-sm text-gray-400">XP: {entry.xp.toLocaleString()}</span>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        );
      case 'transactions':
        return <TransactionList />;
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
          className={getMainTabButtonClasses('transactions')}
          onClick={() => setActiveMainTab('transactions')}
        >
          Transactions
        </Button>
      </div>
      {renderTabContent()}
    </div>
  );
};

export default UserTabs;