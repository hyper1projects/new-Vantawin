"use client";

import React from 'react';
import OddsButton from './OddsButton'; // Assuming OddsButton is in the same directory

interface OddscardProps {
    question: string;
    options: { label: string; value: number }[];
    onSelect: (value: number) => void;
    selectedOption?: number;
}

const Oddscard: React.FC<OddscardProps> = ({ question, options, onSelect, selectedOption }) => {
    return (
        <div
            className="flex flex-col bg-[#0D2C60] rounded-xl p-4 w-full shadow-xl font-sans transition-all duration-300 hover:shadow-2xl hover:scale-[1.01] border border-transparent hover:border-indigo-600/50"
        >
            <h3 className="text-vanta-text-light text-lg font-semibold mb-4">
                {question}
            </h3>
            <div className="grid grid-cols-2 gap-2">
                {options.map((option) => (
                    <OddsButton
                        key={option.label}
                        label={option.label}
                        value={option.value}
                        onClick={() => onSelect(option.value)}
                        isSelected={selectedOption === option.value}
                    />
                ))}
            </div>
        </div>
    );
};

export default Oddscard;