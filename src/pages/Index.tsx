import React from 'react';

const Index: React.FC = () => {
  return (
    <div className="relative w-full h-full">
      {/* Prediction Card image centered vertically on the right */}
      <div className="absolute top-1/2 right-0 px-4 transform -translate-y-1/2">
        <img 
          src="/images/Group 1000005762.png" 
          alt="Prediction Card" 
          className="w-full max-w-xs rounded-xl" 
        />
      </div>

      {/* Existing content, pushed down to avoid overlap with the header */}
      <div className="pt-24 pb-6">
        <h1 className="text-2xl font-bold mb-4">Welcome to VantaWin!</h1>
        <p className="text-vanta-text-medium">Select a game from the sidebar to get started.</p>
      </div>
    </div>
  );
};

export default Index;