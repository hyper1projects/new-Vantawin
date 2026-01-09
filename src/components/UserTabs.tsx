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
      "px-3 py-1.5 md:px-6 md:py-3 rounded-[14px] md:rounded-[20px] text-xs md:text-lg font-semibold transition-colors duration-200 whitespace-nowrap flex-shrink-0",
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
          <div className="bg-vanta-blue-medium p-4 md:p-6 rounded-[22px] md:rounded-[27px] shadow-sm text-vanta-text-light w-full">
            <h3 className="text-lg md:text-xl font-semibold mb-3 md:mb-4">Rank History</h3>
            <div className="text-vanta-text-light">
              {historyLoading ? (
                <div className="text-center py-4 text-gray-400 text-xs md:text-base">Loading history...</div>
              ) : history.length === 0 ? (
                <div className="text-center py-4 text-gray-400">No rank history available yet. Complete a pool to see your ranking!</div>
              ) : (
                <>
                  <p className="mb-4 text-gray-400 text-sm">Your performance in past tournaments.</p>
                  {history.map((entry) => (
                    <div key={entry.poolId} className="flex justify-between items-center py-2 md:py-3 border-b border-gray-800 last:border-b-0 hover:bg-vanta-neon-blue/10 px-2 rounded-lg transition-colors text-xs md:text-sm">
                      <span className="font-medium text-vanta-neon-blue">Rank: #{entry.rank}</span>
                      <span className="text-gray-300">{format(new Date(entry.date), 'MMM d, yyyy')}</span>
                      <span className="text-gray-400">XP: {entry.xp.toLocaleString()}</span>
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
    <div className="flex flex-col space-y-4 md:space-y-6">
      <div className="bg-vanta-blue-dark p-1.5 md:p-2 rounded-[20px] md:rounded-[27px] flex space-x-1 md:space-x-2 w-full md:w-fit overflow-x-auto scrollbar-hide no-scrollbar">
        <button
          className={getMainTabButtonClasses('myGames')}
          onClick={() => setActiveMainTab('myGames')}
        >
          My Games
        </button>
        <button
          className={getMainTabButtonClasses('rankHistory')}
          onClick={() => setActiveMainTab('rankHistory')}
        >
          Rank History
        </button>
        <button
          className={getMainTabButtonClasses('transactions')}
          onClick={() => setActiveMainTab('transactions')}
        >
          Transactions
        </button>
      </div>
      {renderTabContent()}
    </div>
  );
};

export default UserTabs;