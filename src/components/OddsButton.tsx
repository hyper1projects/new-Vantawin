"use client";

import React from 'react';
import { Button } from '@/components/ui/button'; // Changed to absolute import path

interface OddsButtonProps {
  label: string; // Added label prop
  value: number; // Changed from 'odds' to 'value'
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void; // Updated onClick type
  isSelected?: boolean; // Optional prop to indicate if the button is selected
}

const OddsButton: React.FC<OddsButtonProps> = ({ label, value, onClick, isSelected = false }) => {
  return (
    <Button
      onClick={onClick}
      className={`flex flex-col items-center justify-center p-2 rounded-[12px] text-vanta-text-light transition-colors duration-200
        ${isSelected ? 'bg-vanta-neon-blue text-vanta-blue-dark' : 'bg-vanta-blue-dark hover:bg-vanta-accent-dark-blue'}
        w-full h-full min-h-[50px]`} {/* Reduced padding and min-height */}
    >
      <span className="text-lg font-semibold">{label}</span> {/* Reduced font size */}
    </Button>
  );
};

export default OddsButton;