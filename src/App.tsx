"use client";

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import Sidebar from './components/Sidebar';
import MainHeader from './components/MainHeader'; // Corrected import
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Wallet from './pages/Wallet';
import Game from './pages/Game';
import PredictionSlip from './pages/PredictionSlip';
import { Toaster } from '@/components/ui/toaster';

function App() {
  return (
    <Router>
      <div className="flex min-h-screen bg-vanta-blue-dark text-vanta-text-light">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <MainHeader /> {/* Using MainHeader component */}
          <main className="flex-1 p-6">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/wallet" element={<Wallet />} />
              <Route path="/game/:gameId" element={<Game />} />
              <Route path="/prediction-slip" element={<PredictionSlip />} />
            </Routes>
          </main>
        </div>
      </div>
      <Toaster />
    </Router>
  );
}

export default App;