"use client";

import React from 'react';
import { cn } from '../lib/utils'; // Import cn for conditional class merging

interface OddsButtonProps {
    value: number | null; // Allow null for cases where odds might not be available
    label: string;
    onClick: (e: React.MouseEvent) => void;
    isSelected: boolean;
    className?: string; // Add className prop for external styling
}

const OddsButton: React.FC<OddsButtonProps> = ({ value, label, onClick, isSelected, className }) => (
    <button
        onClick={onClick}
        className={cn(
            "bg-[#0B295B] text-white border border-gray-600 h-8 px-3 text-sm rounded-md transition-colors shadow-inner font-semibold",
            isSelected ? "bg-vanta-neon-blue text-vanta-blue-dark" : "hover:bg-gray-700",
            className // Apply external className
        )}
    >
        {label} {value !== null ? `(${value.toFixed(2)})` : ''} {/* Display label and formatted value */}
    </button>
);

export default OddsButton;