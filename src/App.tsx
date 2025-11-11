"use client";

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Index from './pages/Index';
import Games from './pages/Games';
import Pools from './pages/Pools';
import Leaderboard from './pages/Leaderboard';
import Wallet from './pages/Wallet';
import NotFound from './pages/NotFound';
import Terms from './pages/Terms';
import Help from './pages/Help';
import Contact from './pages/Contact';
import Users from './pages/Users';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Support from './pages/Support';
import GameDetails from './pages/GameDetails';
import AllTopGames from './pages/AllTopGames';
// Removed Login and SignUp page imports as they are now dialogs
import { MatchSelectionProvider } from './context/MatchSelectionContext';

function App() {
  return (
    <Router>
      <MatchSelectionProvider>
        <Routes>
          {/* Routes with the main layout */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Index />} />
            <Route path="games" element={<Games />} />
            <Route path="games/:gameId" element={<GameDetails />} />
            <Route path="games/top-games" element={<AllTopGames />} />
            <Route path="pools" element={<Pools />} />
            <Route path="leaderboard" element={<Leaderboard />} />
            <Route path="wallet" element={<Wallet />} />
            <Route path="users" element={<Users />} />
            <Route path="terms-of-use" element={<Terms />} />
            <Route path="privacy-policy" element={<PrivacyPolicy />} />
            <Route path="help" element={<Help />} />
            <Route path="contact" element={<Contact />} />
            <Route path="support" element={<Support />} />
            <Route path="how-it-works" element={<div>How It Works Page</div>} />
            <Route path="*" element={<NotFound />} />
          </Route>
          {/* Full-page routes without the main layout (Login, SignUp, ForgotPassword are now dialogs) */}
          {/* <Route path="/login" element={<Login />} /> */}
          {/* <Route path="/register" element={<SignUp />} /> */}
          {/* <Route path="/forgot-password" element={<ForgotPassword />} /> */}
        </Routes>
      </MatchSelectionProvider>
    </Router>
  );
}

export default App;