"use client";

import React from 'react';

interface OddsButtonProps {
    value: number;
}

const OddsButton: React.FC<OddsButtonProps> = ({ value }) => (
    <button className="bg-[#0B295B] text-white border border-gray-600 hover:bg-gray-700 h-8 px-3 text-sm rounded-md transition-colors shadow-inner font-semibold">
        {value.toFixed(2)}
    </button>
);

export default OddsButton;