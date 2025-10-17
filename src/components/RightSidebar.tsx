"use client";

import React, { useState } from 'react';
import { cn } from '@/lib/utils'; // Utility for combining class names

const RightSidebar = () => {
  const [activeTab, setActiveTab] = useState<'predict' | 'redeem'>('predict');
  const [selectedTeam, setSelectedTeam] = useState<string>('Aston Villa'); // State for selected team
  const [amount, setAmount] = useState<number>(0); // State for prediction amount

  const handleAmountClick = (value: number) => {
    setAmount(value);
  };

  return (
    <div className="fixed right-0 top-0 h-screen w-80 bg-vanta-blue-medium text-vanta-text-light flex flex-col z-50 rounded-l-2xl font-outfit p-6">
      {/* Tabs for Predict and Redeem */}
      <div className="flex justify-around mb-6 border-b border-vanta-accent-dark-blue">
        <button
          className={cn(
            "flex-1 py-3 text-center text-lg font-medium transition-colors",
            activeTab === 'predict' ? "text-vanta-neon-blue border-b-2 border-vanta-neon-blue" : "text-vanta-text-light hover:text-vanta-neon-blue"
          )}
          onClick={() => setActiveTab('predict')}
        >
          Predict
        </button>
        <button
          className={cn(
            "flex-1 py-3 text-center text-lg font-medium transition-colors",
            activeTab === 'redeem' ? "text-vanta-neon-blue border-b-2 border-vanta-neon-blue" : "text-vanta-text-light hover:text-vanta-neon-blue"
          )}
          onClick={() => setActiveTab('redeem')}
        >
          Redeem
        </button>
      </div>

      {activeTab === 'predict' && (
        <div className="flex flex-col gap-y-6">
          {/* Match Details */}
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Aston Villa Vs Crystal Palace</h3>
            <div className="flex items-center gap-2">
              {/* Placeholder for team logos using the uploaded image */}
              <img src="/images/Group 1000005762.png" alt="Team Logos" className="h-8 w-auto object-contain" />
            </div>
          </div>

          {/* Prediction Button for Aston Villa */}
          <button
            className="px-4 py-2 rounded-[14px] bg-vanta-neon-blue text-vanta-blue-dark hover:bg-opacity-90 transition-colors text-base font-outfit w-fit"
            onClick={() => setSelectedTeam('Aston Villa')}
          >
            Aston Villa
          </button>

          {/* Amount Section */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <span className="text-base text-vanta-text-light">Amount</span>
              <span className="text-2xl font-bold text-vanta-text-light">₦ {amount}</span>
            </div>
            <div className="flex gap-3">
              <button
                className="flex-1 px-4 py-2 rounded-[14px] border-2 border-vanta-neon-blue text-vanta-text-light hover:bg-vanta-neon-blue hover:text-vanta-blue-dark transition-colors text-base font-outfit"
                onClick={() => handleAmountClick(100)}
              >
                ₦ 100
              </button>
              <button
                className="flex-1 px-4 py-2 rounded-[14px] border-2 border-vanta-neon-blue text-vanta-text-light hover:bg-vanta-neon-blue hover:text-vanta-blue-dark transition-colors text-base font-outfit"
                onClick={() => handleAmountClick(200)}
              >
                ₦ 200
              </button>
              <button
                className="flex-1 px-4 py-2 rounded-[14px] border-2 border-vanta-neon-blue text-vanta-text-light hover:bg-vanta-neon-blue hover:text-vanta-blue-dark transition-colors text-base font-outfit"
                onClick={() => handleAmountClick(500)}
              >
                ₦ 500
              </button>
            </div>
          </div>

          {/* To Win Section */}
          <div className="flex justify-between items-center mt-4">
            <span className="text-base text-vanta-text-light">To win</span>
            <span className="text-2xl font-bold text-vanta-neon-blue">500 XP</span>
          </div>
        </div>
      )}

      {activeTab === 'redeem' && (
        <div className="flex flex-col items-center justify-center h-full text-vanta-text-light">
          <p className="text-lg">Redeem functionality coming soon!</p>
        </div>
      )}
    </div>
  );
};

export default RightSidebar;