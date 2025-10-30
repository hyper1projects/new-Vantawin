"use client";

import React from 'react';
import { cn } from '@/lib/utils';

interface OddsButtonProps {
  value: number; // Still needed for logic, but not displayed
  label: string; // Will be "Yes" or "No"
  onClick: (e: React.MouseEvent) => void;
  isSelected: boolean;
  className?: string;
}

const OddsButton: React.FC<OddsButtonProps> = ({ label, onClick, isSelected, className }) => (
    <button
        onClick={onClick}
        className={cn(
            "bg-[#0B295B] text-white border border-gray-600 h-8 px-3 text-sm rounded transition-colors shadow-inner font-semibold", // Changed rounded-md to rounded
            isSelected ? "bg-vanta-neon-blue border-vanta-neon-blue text-vanta-blue-dark" : "hover:bg-vanta-blue-dark hover:border-vanta-accent-dark-blue",
            className
        )}
    >
        {label}
    </button>
);

export default OddsButton;