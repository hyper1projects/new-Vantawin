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
import EmailConfirmation from './pages/EmailConfirmation';
import Insights from './pages/Insights';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import EditProfile from './pages/EditProfile'; // Import the new EditProfile page
import ProtectedRoute from './components/ProtectedRoute';
import { MatchSelectionProvider } from './context/MatchSelectionContext';
import { AuthContextProvider } from './context/AuthContext';

function App() {
  return (
    <Router>
      <AuthContextProvider>
        <MatchSelectionProvider>
          <Routes>
            {/* Standalone routes (no layout) */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<SignUp />} />
            <Route path="/email-confirmation" element={<EmailConfirmation />} />
            <Route path="/update-password" element={<div>Update Password Page</div>} />

            {/* Routes with the main layout */}
            <Route path="/" element={<Layout />}>
              <Route index element={<Index />} />
              <Route path="games" element={<Games />} />
              <Route path="games/:gameId" element={<GameDetails />} />
              <Route path="games/top-games" element={<AllTopGames />} />
              <Route path="pools" element={<Pools />} />
              <Route path="terms-of-use" element={<Terms />} />
              <Route path="privacy-policy" element={<PrivacyPolicy />} />
              <Route path="help" element={<Help />} />
              <Route path="contact" element={<Contact />} />
              <Route path="support" element={<Support />} />
              <Route path="how-it-works" element={<div>How It Works Page</div>} />
              
              {/* Protected routes, now nested within the Layout route */}
              <Route element={<ProtectedRoute />}>
                <Route path="wallet" element={<Wallet />} />
                <Route path="leaderboard" element={<Leaderboard />} />
                <Route path="users" element={<Users />} />
                <Route path="users/insights" element={<Insights />} />
                <Route path="users/edit-profile" element={<EditProfile />} /> {/* New protected route */}
              </Route>

              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </MatchSelectionProvider>
      </AuthContextProvider>
    </Router>
  );
}

export default App;