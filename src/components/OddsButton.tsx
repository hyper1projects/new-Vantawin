"use client";

import React from 'react';
import { cn } from '../lib/utils'; // Import cn for conditional class merging

interface OddsButtonProps {
    value: number;
    onClick: () => void; // Add onClick handler
    isSelected: boolean; // Add isSelected prop for styling
}

const OddsButton: React.FC<OddsButtonProps> = ({ value, onClick, isSelected }) => (
    <button
        onClick={onClick}
        className={cn(
            "bg-[#0B295B] text-white border border-gray-600 h-8 px-3 text-sm rounded-md transition-colors shadow-inner font-semibold",
            isSelected ? "bg-vanta-neon-blue text-vanta-blue-dark" : "hover:bg-gray-700"
        )}
    >
        {value.toFixed(2)}
    </button>
);

export default OddsButton;