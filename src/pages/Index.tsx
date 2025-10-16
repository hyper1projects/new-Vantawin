import React from 'react';
// MainHeader is now rendered in App.tsx, so no need to import here
// Removed imports for BottomBanner, PointsMultiplierSection, TopGamesSection, Card, CardContent

const Index: React.FC = () => {
  return (
    <div className="min-h-screen bg-vanta-blue-dark text-vanta-text-light">
      <div className="container mx-auto py-6">
        {/* Content for the Index page will go here */}
        <h1 className="text-2xl font-bold mb-4">Welcome to VantaWin!</h1>
        <p className="text-vanta-text-medium">Select a game from the sidebar to get started.</p>
      </div>
    </div>
  );
};

export default Index;