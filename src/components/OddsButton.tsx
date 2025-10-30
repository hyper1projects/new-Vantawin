"use client";

import React from 'react';
import { Button } from '@/components/ui/button'; // Assuming shadcn/ui Button

interface OddsButtonProps {
  label: string;
  odds: number;
  onClick?: () => void;
  isSelected?: boolean; // Optional prop to indicate if the button is selected
}

const OddsButton: React.FC<OddsButtonProps> = ({ label, odds, onClick, isSelected = false }) => {
  return (
    <Button
      onClick={onClick}
      className={`flex flex-col items-center justify-center p-4 rounded-[12px] text-vanta-text-light transition-colors duration-200
        ${isSelected ? 'bg-vanta-neon-blue text-vanta-blue-dark' : 'bg-vanta-blue-dark hover:bg-vanta-accent-dark-blue'}
        w-full h-full min-h-[80px]`}
    >
      <span className="text-lg font-semibold">{label}</span>
      <span className="text-xl font-bold mt-1">{odds.toFixed(2)}</span>
    </Button>
  );
};

export default OddsButton;