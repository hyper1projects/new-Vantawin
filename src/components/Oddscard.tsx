"use client";

import React from 'react';
import { cn } from '../lib/utils'; // Assuming cn utility for tailwind-merge

interface OddsCardProps {
  label: string; // e.g., "1", "X", "2"
  oddValue: number;
  onClick?: () => void;
  isSelected?: boolean;
}

const OddsCard: React.FC<OddsCardProps> = ({ label, oddValue, onClick, isSelected }) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-col items-center justify-center p-2 border rounded-md text-sm font-medium",
        "bg-gray-100 hover:bg-gray-200 transition-colors",
        isSelected ? "border-blue-500 bg-blue-50 text-blue-700" : "border-gray-300 text-gray-800"
      )}
    >
      <span className="text-xs text-gray-500">{label}</span>
      <span className="text-base font-semibold">{oddValue.toFixed(2)}</span>
    </button>
  );
};

export default OddsCard;