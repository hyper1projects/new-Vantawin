"use client";

import React from 'react';
import { cn } from '../lib/utils'; // Import cn for conditional class merging

interface NewOddsButtonProps { // Renamed interface
    value: number; // Keep value for internal logic/context, but not displayed
    label: string; // New prop for the button's display text
    onClick: (e: React.MouseEvent) => void; // Add onClick handler
    isSelected: boolean; // Add isSelected prop for styling
}

const NewOddsButton: React.FC<NewOddsButtonProps> = ({ value, label, onClick, isSelected }) => ( // Renamed component
    <button
        onClick={onClick}
        className={cn(
            "bg-[#0B295B] text-white border border-gray-600 h-8 px-3 text-sm rounded-md transition-colors shadow-inner font-semibold",
            isSelected ? "bg-vanta-neon-blue text-vanta-blue-dark" : "hover:bg-gray-700"
        )}
    >
        {label}
    </button>
);

export default NewOddsButton;