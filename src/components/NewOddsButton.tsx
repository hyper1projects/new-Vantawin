"use client";

import React from 'react';
import { cn } from '../lib/utils'; // Import cn for conditional class merging

interface NewOddsButtonProps {
    value: number; // Keep value for internal logic/context, but not displayed
    label: string; // This label will now be treated as a team name to be abbreviated
    onClick: (e: React.MouseEvent) => void; // Add onClick handler
    isSelected: boolean; // Add isSelected prop for styling
}

const NewOddsButton: React.FC<NewOddsButtonProps> = ({ value, label, onClick, isSelected }) => (
    <button
        onClick={onClick}
        className={cn(
            "bg-[#0B295B] text-white border border-gray-600 h-11 min-w-[44px] max-w-[60px] px-2 sm:px-3 text-xs sm:text-sm rounded-md transition-colors shadow-inner font-semibold whitespace-nowrap",
            isSelected ? "bg-vanta-neon-blue text-vanta-blue-dark" : "hover:border-vanta-accent-dark-blue"
        )}
    >
        {label.substring(0, 3).toUpperCase()} {/* Display the first 3 characters of the label in uppercase */}
    </button>
);

export default NewOddsButton;