"use client";

import React from 'react';
import { Link } from 'react-router-dom'; // Import Link

const MainHeader = () => {
  return (
    <header className="flex items-center justify-between p-4 border-b border-vanta-blue-medium">
      <Link to="/" className="flex items-center"> {/* Wrap with Link */}
        <span className="text-xl font-bold text-vanta-text-light">VANTA</span>
        <span className="text-xl font-bold text-vanta-neon-blue">WIN</span>
      </Link>
      <div className="flex items-center space-x-6">
        {/* Existing header content */}
      </div>
    </header>
  );
};

export default MainHeader;