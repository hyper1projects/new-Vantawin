"use client";

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Index from './pages/Index';
import Games from './pages/Games';
// import Pools from './pages/Pools'; // Removed Pools import
import Leaderboard from './pages/Leaderboard';
import Wallet from './pages/Wallet';
import Settings from './pages/Settings';
import Terms from './pages/Terms';
import Help from './pages/Help';
import Contact from './pages/Contact';
import Rewards from './pages/Rewards';

function App() {
  return (
    <Router>
      <div className="flex min-h-screen bg-vanta-blue-dark text-vanta-text-light">
        <Sidebar />
        <div className="flex-1 ml-64 p-4">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/games" element={<Games />} />
            {/* <Route path="/pools" element={<Pools />} /> Removed Pools route */}
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/wallet" element={<Wallet />} />
            <Route path="/rewards" element={<Rewards />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/help" element={<Help />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/sports/:category" element={<div>Sport Category Page</div>} />
            <Route path="/how-it-works" element={<div>How It Works Page</div>} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;